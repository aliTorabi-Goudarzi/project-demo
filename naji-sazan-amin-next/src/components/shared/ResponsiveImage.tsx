type ResponsiveImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  widths: number[];
  sizes: string;
  className?: string;
  id?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'async' | 'sync' | 'auto';
  fetchPriority?: 'high' | 'low' | 'auto';
};

export function imageVariant(src: string, width: number, format: 'avif' | 'webp') {
  const match = /^(.*\/)([^/]+)(\.[^.]+)$/.exec(src);
  if (!match || !match[1].startsWith('/assets/')) return src;
  const baseName = match[2].replace(/-[a-f0-9]{8}$/, '');
  return `${match[1].replace('/assets/', '/assets/generated/')}${baseName}-${width}.${format}`;
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  widths,
  sizes,
  className,
  id,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
}: ResponsiveImageProps) {
  const availableWidths = [...new Set(widths)].sort((a, b) => a - b);
  const fallbackWidth = availableWidths[availableWidths.length - 1];
  const srcSet = (format: 'avif' | 'webp') =>
    availableWidths.map((size) => `${imageVariant(src, size, format)} ${size}w`).join(', ');

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        src={imageVariant(src, fallbackWidth, 'webp')}
        alt={alt}
        width={width}
        height={height}
        className={className}
        id={id}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}
