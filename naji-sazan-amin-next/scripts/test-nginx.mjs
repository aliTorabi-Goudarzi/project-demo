import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(appRoot, 'out');
const sourceConf = path.join(appRoot, 'deploy', 'nginx.conf');
const image = 'nginx:1.27.5-alpine';
const opensslImage = 'alpine/openssl:3.5.9';
const containerName = `naji-nginx-smoke-${process.pid}-${Date.now()}`;

// Git for Windows ships OpenSSL but does not put it on PATH.
const windowsOpenSSL = 'C:\\Program Files\\Git\\usr\\bin\\openssl.exe';

// Holds the self-signed certificate and the substituted config for this run.
let tempDir = null;

const replacements = [
  ['server_name example.com www.example.com;', 'server_name localhost;'],
  ['/etc/letsencrypt/live/example.com/fullchain.pem', '/etc/nginx/certs/fullchain.pem'],
  ['/etc/letsencrypt/live/example.com/privkey.pem', '/etc/nginx/certs/privkey.pem'],
  ['root /var/www/naji-sazan-amin-next/out;', 'root /usr/share/nginx/html;'],
];

const childEnv = { ...process.env, MSYS_NO_PATHCONV: '1' };

function die(message) {
  console.error(message);
  process.exit(1);
}

function docker(args, options = {}) {
  return spawnSync('docker', args, { encoding: 'utf8', env: childEnv, ...options });
}

function toDockerPath(absolutePath) {
  return absolutePath.split(path.sep).join('/');
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function send(secure, port, requestPath, headers = {}) {
  return new Promise((resolve, reject) => {
    const requestFn = secure ? httpsRequest : httpRequest;
    const request = requestFn(
      {
        host: '127.0.0.1',
        port,
        path: requestPath,
        method: 'GET',
        headers,
        servername: secure ? 'localhost' : undefined,
        rejectUnauthorized: false,
        timeout: 5000,
      },
      (response) => {
        response.resume();
        response.on('end', () => resolve({ status: response.statusCode, headers: response.headers }));
      },
    );
    request.on('timeout', () => request.destroy(new Error('request timed out')));
    request.on('error', reject);
    request.end();
  });
}

async function waitForHttps(port) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      await send(true, port, '/', { Host: 'localhost' });
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error('nginx did not accept HTTPS requests within 30s');
}

function findAsset(dir, predicate) {
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findAsset(absolutePath, predicate);
      if (found) return found;
    } else if (entry.isFile() && predicate(entry.name)) {
      return absolutePath;
    }
  }
  return null;
}

function curlTls(version, extraArgs = []) {
  const result = docker([
    'exec',
    containerName,
    'curl',
    '-sk',
    `--tlsv${version}`,
    '--tls-max',
    version,
    ...extraArgs,
    '-o',
    '/dev/null',
    '-w',
    '%{http_code}',
    'https://localhost/',
  ]);
  const stderrDetail = (result.stderr || '')
    .trim()
    .replace(/\s*\n\s*/g, ' | ');
  return { exitCode: result.status, httpCode: (result.stdout || '').trim(), stderrDetail };
}

function validateOpenSSL(candidate) {
  const result = spawnSync(candidate, ['version'], { encoding: 'utf8', env: childEnv });
  return !result.error && result.status === 0;
}

function ensureImage(name) {
  if (docker(['image', 'inspect', name]).status === 0) return;
  console.log(`Pulling ${name}...`);
  const pull = docker(['pull', name], { stdio: 'inherit' });
  if (pull.status !== 0) die(`could not pull ${name}.`);
}

// OPENSSL_BIN, then a local openssl, then Git for Windows, then a container.
function resolveOpenSSL() {
  if (process.env.OPENSSL_BIN) {
    if (validateOpenSSL(process.env.OPENSSL_BIN)) {
      return { label: process.env.OPENSSL_BIN, command: process.env.OPENSSL_BIN };
    }
    die(`OPENSSL_BIN points at ${process.env.OPENSSL_BIN}, but \`version\` failed.`);
  }

  if (validateOpenSSL('openssl')) return { label: 'openssl', command: 'openssl' };

  if (process.platform === 'win32' && existsSync(windowsOpenSSL) && validateOpenSSL(windowsOpenSSL)) {
    return { label: windowsOpenSSL, command: windowsOpenSSL };
  }

  ensureImage(opensslImage);
  return { label: `${opensslImage} container`, command: null };
}

function writeOpenSSLConfig(dir) {
  const configPath = path.join(dir, 'openssl.cnf');
  writeFileSync(
    configPath,
    [
      '[req]',
      'distinguished_name = subject',
      'x509_extensions = extensions',
      'prompt = no',
      '',
      '[subject]',
      'CN = localhost',
      '',
      '[extensions]',
      'subjectAltName = DNS:localhost,IP:127.0.0.1',
      '',
    ].join('\n'),
  );
  return configPath;
}

function generateCertificate(dir, openssl) {
  const configHost = writeOpenSSLConfig(dir);
  const common = [
    'req',
    '-x509',
    '-nodes',
    '-newkey',
    'rsa:2048',
    '-days',
    '1',
    '-keyout',
    'privkey.pem',
    '-out',
    'fullchain.pem',
    '-config',
    'openssl.cnf',
  ];

  const result = openssl.command
    ? spawnSync(openssl.command, common, { cwd: dir, encoding: 'utf8', env: childEnv })
    : docker([
        'run',
        '--rm',
        ...(typeof process.getuid === 'function' ? ['--user', `${process.getuid()}:${process.getgid()}`] : []),
        '-v',
        `${toDockerPath(dir)}:/certs`,
        '-w',
        '/certs',
        opensslImage,
        ...common,
      ]);

  if (result.error || result.status !== 0) {
    throw new Error(
      `could not generate a self-signed certificate with ${openssl.label}:\n${(result.stderr || result.error?.message || '').trim()}`,
    );
  }

  const fullchain = path.join(dir, 'fullchain.pem');
  const privkey = path.join(dir, 'privkey.pem');
  if (!existsSync(fullchain) || !existsSync(privkey)) {
    throw new Error(`${openssl.label} did not write fullchain.pem and privkey.pem (config ${configHost}).`);
  }
}

const dockerVersion = docker(['version', '--format', '{{.Server.Version}}']);
if (dockerVersion.error || dockerVersion.status !== 0) {
  die(
    `nginx smoke test requires Docker: \`docker version\` failed.\n${(dockerVersion.stderr || '').trim() || dockerVersion.error?.message || ''}`,
  );
}

if (!existsSync(path.join(outDir, 'index.html'))) {
  die('nginx smoke test requires out/index.html: run `npm run build` first.');
}

const openssl = resolveOpenSSL();

ensureImage(image);

let config = readFileSync(sourceConf, 'utf8');
for (const [from, to] of replacements) {
  if (!config.includes(from)) {
    die(`deploy/nginx.conf is missing the expected text: ${from}`);
  }
  config = config.split(from).join(to);
}

const httpPort = await freePort();
const httpsPort = await freePort();

let failures = 0;

function check(passed, label, detail) {
  console.log(`${passed ? 'PASS' : 'FAIL'} ${label}${detail ? ` (${detail})` : ''}`);
  if (!passed) failures += 1;
}

try {
  tempDir = mkdtempSync(path.join(os.tmpdir(), 'naji-nginx-smoke-'));
  try {
    generateCertificate(tempDir, openssl);
  } catch (error) {
    throw new Error(`${error instanceof Error ? error.message : String(error)} (${openssl.label})`);
  }
  console.log(`Generated a self-signed certificate with ${openssl.label}.`);

  const tempConf = path.join(tempDir, 'default.conf');
  writeFileSync(tempConf, config);

  const mounts = [
    '-v',
    `${toDockerPath(outDir)}:/usr/share/nginx/html:ro`,
    '-v',
    `${toDockerPath(tempConf)}:/etc/nginx/conf.d/default.conf:ro`,
    '-v',
    `${toDockerPath(tempDir)}:/etc/nginx/certs:ro`,
  ];

  const configTest = docker(['run', '--rm', ...mounts, image, 'nginx', '-t']);
  if (configTest.status !== 0) {
    console.error(configTest.stdout.trim());
    console.error(configTest.stderr.trim());
    throw new Error('nginx -t rejected the substituted deploy/nginx.conf.');
  }
  console.log('PASS nginx -t accepts the substituted deploy/nginx.conf');

  const started = docker([
    'run',
    '-d',
    '--name',
    containerName,
    '-p',
    `127.0.0.1:${httpPort}:80`,
    '-p',
    `127.0.0.1:${httpsPort}:443`,
    ...mounts,
    image,
  ]);
  if (started.status !== 0) {
    throw new Error(`could not start nginx: ${started.stderr.trim()}`);
  }

  try {
    await waitForHttps(httpsPort);
  } catch (error) {
    const logs = docker(['logs', containerName]);
    console.error((logs.stdout || '').trim());
    console.error((logs.stderr || '').trim());
    throw error;
  }

  const root = await send(true, httpsPort, '/', { Host: 'localhost' });
  check(root.status === 200, 'GET / over HTTPS returns 200 (no index redirect loop)', `status ${root.status}`);
  check(
    root.headers['cross-origin-opener-policy'] === 'same-origin' &&
      root.headers['cross-origin-resource-policy'] === 'same-origin',
    'GET / returns COOP and CORP same-origin',
    `COOP ${root.headers['cross-origin-opener-policy'] ?? '-'}, CORP ${root.headers['cross-origin-resource-policy'] ?? '-'}`,
  );

  const indexHtml = await send(true, httpsPort, '/index.html', { Host: 'localhost' });
  check(
    indexHtml.status === 301 && indexHtml.headers.location === '/',
    'GET /index.html redirects to /',
    `status ${indexHtml.status}, location ${indexHtml.headers.location ?? '-'}`,
  );

  const aboutHtml = await send(true, httpsPort, '/about.html', { Host: 'localhost' });
  check(
    aboutHtml.status === 301 && aboutHtml.headers.location === '/about/',
    'GET /about.html redirects to /about/',
    `status ${aboutHtml.status}, location ${aboutHtml.headers.location ?? '-'}`,
  );

  const dotenv = await send(true, httpsPort, '/.env', { Host: 'localhost' });
  check(dotenv.status === 403 || dotenv.status === 404, 'GET /.env is denied', `status ${dotenv.status}`);

  const staticDir = path.join(outDir, '_next', 'static');
  const asset = findAsset(staticDir, (name) => name.endsWith('.js')) ?? findAsset(staticDir, () => true);
  if (!asset) {
    check(false, 'fingerprinted asset returned immutable cache headers', `no files under ${path.relative(appRoot, staticDir)}`);
  } else {
    const assetUrl = `/${path.relative(outDir, asset).split(path.sep).join('/')}`;
    const assetResponse = await send(true, httpsPort, assetUrl, { Host: 'localhost' });
    const cacheControl = assetResponse.headers['cache-control'] ?? '';
    check(
      assetResponse.status === 200 && cacheControl.includes('max-age=31536000') && cacheControl.includes('immutable'),
      'fingerprinted asset returns immutable cache headers',
      `${assetUrl} status ${assetResponse.status}, cache-control ${cacheControl || '-'}`,
    );
    check(
      assetResponse.headers['cross-origin-opener-policy'] === 'same-origin' &&
        assetResponse.headers['cross-origin-resource-policy'] === 'same-origin',
      'fingerprinted asset returns COOP and CORP same-origin',
      `${assetUrl} COOP ${assetResponse.headers['cross-origin-opener-policy'] ?? '-'}, CORP ${assetResponse.headers['cross-origin-resource-policy'] ?? '-'}`,
    );
  }

  const injected = await send(false, httpPort, '/', { Host: 'evil.example' });
  const injectedLocation = injected.headers.location ?? '';
  check(
    injected.status === 301 && injectedLocation.startsWith('https://localhost/') && !injectedLocation.includes('evil.example'),
    'HTTP redirect uses the canonical $server_name',
    `status ${injected.status}, location ${injectedLocation || '-'}`,
  );

  for (const version of ['1.2', '1.3']) {
    const result = curlTls(version);
    check(
      result.exitCode === 0 && result.httpCode === '200',
      `TLS ${version} is accepted`,
      `curl exit ${result.exitCode}, HTTP ${result.httpCode || '-'}, ${result.stderrDetail || 'no stderr'}`,
    );
  }

  // Positive control: an AEAD-only cipher is negotiated over TLS 1.2.
  const aead = curlTls('1.2', ['--ciphers', 'ECDHE-RSA-AES256-GCM-SHA384']);
  check(
    aead.exitCode === 0 && aead.httpCode === '200',
    'TLS 1.2 AEAD cipher ECDHE-RSA-AES256-GCM-SHA384 is accepted',
    `curl exit ${aead.exitCode}, HTTP ${aead.httpCode || '-'}, ${aead.stderrDetail || 'no stderr'}`,
  );

  // Negative control: the AEAD-only policy rejects a CBC-only TLS 1.2 client.
  const cbc = curlTls('1.2', ['--ciphers', 'AES128-SHA']);
  check(
    cbc.exitCode !== 0 || cbc.httpCode !== '200',
    'TLS 1.2 CBC cipher AES128-SHA is rejected by the AEAD-only policy',
    `curl exit ${cbc.exitCode}, HTTP ${cbc.httpCode || '-'}, ${cbc.stderrDetail || 'no stderr'}`,
  );

  for (const version of ['1.0', '1.1']) {
    const result = curlTls(version, ['--ciphers', 'DEFAULT@SECLEVEL=0']);
    check(
      result.exitCode !== 0 || result.httpCode !== '200',
      `TLS ${version} is rejected`,
      `curl exit ${result.exitCode}, HTTP ${result.httpCode || '-'}, ${result.stderrDetail || 'no stderr'}`,
    );
  }

  if (failures > 0) {
    console.error(`\n${failures} nginx smoke check(s) failed.`);
    process.exitCode = 1;
  } else {
    console.log('\nAll nginx smoke checks passed.');
  }
} catch (error) {
  console.error(`nginx smoke test failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  docker(['rm', '-f', containerName]);
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
}
