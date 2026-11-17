import { useState, type ImgHTMLAttributes } from 'react';

export const HERO_IMAGE_FALLBACK = '/lovable-uploads/lsf-paralegal-servicing.jpeg';

// Storage references must be resolved by the backend, never used as page paths.
export function heroImageSource(value?: string | null) {
  const source = value?.trim();
  return source && (/^\/(?!\/)/.test(source) || /^https?:\/\//i.test(source)) ? source : HERO_IMAGE_FALLBACK;
}

export default function HeroImage({ src, onError, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const source = heroImageSource(typeof src === 'string' ? src : undefined);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return <img {...props} src={failedSource === source ? HERO_IMAGE_FALLBACK : source} onError={event => {
    if (source !== HERO_IMAGE_FALLBACK && failedSource !== source) setFailedSource(source);
    onError?.(event);
  }} />;
}
