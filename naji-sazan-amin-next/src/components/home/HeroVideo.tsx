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
    <video
      ref={videoRef}
      id="heroBgVideo"
      className="hero__bg-video"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster="/assets/hero-poster.webp"
    >
      <source src="/assets/hero-building-loop.webm" type="video/webm" />
      <source src="/assets/hero-building-loop.mp4" type="video/mp4" />
    </video>
  );
}
