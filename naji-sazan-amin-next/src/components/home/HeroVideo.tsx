'use client';

import { useEffect, useRef } from 'react';

// WebKit — Safari on macOS, plus EVERY browser on iOS/iPadOS (Chrome and
// Firefox there are WebKit reskins) — can play VP9-in-WebM but silently drops
// the BlockAdditional alpha plane: the transparent areas decode as white and
// the hero shows a flat grey band instead of the wireframe. Those browsers
// get the solid H.264 render instead; its baked black background is made
// neutral by screen/multiply blending on .hero__bg-video--solid, so only the
// wireframe shows — the same look the alpha WebM gives Chromium.
const SOLID_SRC = '/assets/hero-building-loop-solid.mp4';

const needsSolidSource = () => {
  const userAgent = navigator.userAgent;
  return (
    /iP(hone|ad|od)/.test(userAgent) ||
    (/Safari\/\d/.test(userAgent) && !/Chrom(e|ium)|Edg\/|OPR\//.test(userAgent))
  );
};

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const solid = needsSolidSource();
    const chosenSrc = solid
      ? SOLID_SRC
      : (video.querySelector('source')?.getAttribute('src') ?? '');
    if (solid) {
      video.classList.add('hero__bg-video--solid');
      video.src = chosenSrc;
      video.load();
    }

    const hero = video.closest('.hero');
    if (!hero || !('IntersectionObserver' in window)) return;

    let started = false;
    let retries = 0;
    let checkTimer: number | null = null;

    const clearTimer = () => {
      if (checkTimer !== null) {
        window.clearTimeout(checkTimer);
        checkTimer = null;
      }
    };

    // After a soft reload some browsers keep a partial/aborted range entry in
    // the media cache: play() never resolves and the hero shows the still
    // poster until a hard reload. Force a fresh request with a cache-busting
    // query and play again (at most twice; the poster stays as the fallback).
    const retryWithFreshRequest = () => {
      if (retries >= 2) return;
      retries += 1;
      if (!chosenSrc) return;
      video.src = `${chosenSrc}?retry=${retries}-${Date.now()}`;
      video.load();
      void video.play().catch(() => undefined);
      scheduleCheck();
    };

    const scheduleCheck = () => {
      clearTimer();
      checkTimer = window.setTimeout(() => {
        if (started || (!video.paused && video.currentTime > 0)) return;
        retryWithFreshRequest();
      }, 2200);
    };

    const markStarted = () => {
      started = true;
      clearTimer();
    };
    video.addEventListener('playing', markStarted);
    video.addEventListener('timeupdate', markStarted);
    video.addEventListener('error', retryWithFreshRequest);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void video.play().catch(retryWithFreshRequest);
            scheduleCheck();
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: '80px' },
    );

    observer.observe(hero);
    return () => {
      observer.disconnect();
      clearTimer();
      video.removeEventListener('playing', markStarted);
      video.removeEventListener('timeupdate', markStarted);
      video.removeEventListener('error', retryWithFreshRequest);
    };
  }, []);

  return (
    <>
      {/* The poster is the LCP element until the video's first frame paints.
          It must stay transparent (extracted from the alpha WebM) — an opaque
          poster paints a white block over the hero whenever the video has not
          started yet or a stale cached response delays the first frame. */}
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
      {/* WebM/VP9 is the only SSR source: it carries the alpha channel for
          Chromium/Firefox. WebKit swaps to the solid H.264 render in the
          effect above — see needsSolidSource(). */}
      <source src="/assets/hero-building-loop.webm" type="video/webm" />
      </video>
    </>
  );
}
