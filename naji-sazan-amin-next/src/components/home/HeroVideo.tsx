'use client';

import { useEffect, useRef } from 'react';

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const hero = video.closest('.hero');
    if (!hero || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: '80px' },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* The poster is the LCP element until the video's first frame paints. */}
      <link rel="preload" href="/assets/hero-poster.webp" as="image" fetchPriority="high" />
      <video
      ref={videoRef}
      id="heroBgVideo"
      className="hero__bg-video"
      autoPlay
      loop
      muted
      playsInline
      // metadata is enough: the loop re-encodes at ~2.3 MB and autoplay starts
      // buffering immediately, no need to also force preload of the full file.
      preload="metadata"
      poster="/assets/hero-poster.webp"
    >
      <source src="/assets/hero-building-loop.webm" type="video/webm" />
      <source src="/assets/hero-building-loop.mp4" type="video/mp4" />
      </video>
    </>
  );
}
