# nginx with the ngx_brotli modules compiled in, so brotli_static can serve
# the .br files produced by scripts/postbuild.mjs. The nginx version here must
# match the base image below (dynamic modules are version-locked).
FROM alpine:3.20 AS build
RUN apk add --no-cache build-base linux-headers pcre2-dev zlib-dev cmake git wget tar
# ngx_brotli links against the bundled brotli submodule, which must be built
# first with position-independent code so it can link into a shared module.
RUN git clone --depth 1 --recurse-submodules -j2 https://github.com/google/ngx_brotli.git /tmp/ngx_brotli \
    && mkdir -p /tmp/ngx_brotli/deps/brotli/out \
    && cd /tmp/ngx_brotli/deps/brotli/out \
    && cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_POSITION_INDEPENDENT_CODE=ON .. \
    && make -j4 brotlienc brotlicommon brotlidec
RUN wget -q https://nginx.org/download/nginx-1.27.5.tar.gz -O /tmp/nginx.tar.gz \
    && tar -xzf /tmp/nginx.tar.gz -C /tmp \
    && cd /tmp/nginx-1.27.5 \
    && ./configure --with-compat --add-dynamic-module=/tmp/ngx_brotli \
    && make modules

FROM nginx:1.27.5-alpine
COPY --from=build /tmp/nginx-1.27.5/objs/ngx_http_brotli_filter_module.so /usr/lib/nginx/modules/
COPY --from=build /tmp/nginx-1.27.5/objs/ngx_http_brotli_static_module.so /usr/lib/nginx/modules/
COPY modules/brotli.conf /etc/nginx/modules/50-brotli.conf
# The stock main nginx.conf has no include for /etc/nginx/modules/*.conf;
# add one in the main context so the load_module lines above are picked up.
RUN sed -i '1i include /etc/nginx/modules/*.conf;' /etc/nginx/nginx.conf
