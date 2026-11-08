import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  vx: number;
  vy: number;
  hue: number;
  glow: boolean;
}

/**
 * StarParticleLayer — Canvas-based twinkling stars with dual-depth parallax & cosmic hues
 */
export const StarParticleLayer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Star count optimized for 60fps performance without cluttering
    const starCount = Math.min(Math.floor((width * height) / 16000), 80);
    const stars: Star[] = [];

    // Lavender/purple/violet hues (240-290)
    for (let i = 0; i < starCount; i++) {
      const isBig = Math.random() > 0.85;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isBig ? Math.random() * 1.2 + 1.2 : Math.random() * 0.9 + 0.5,
        baseAlpha: Math.random() * 0.45 + 0.25,
        alpha: Math.random() * 0.45 + 0.25,
        twinkleSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        hue: Math.random() > 0.4 ? 260 + Math.random() * 25 : 240,
        glow: isBig,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!prefersReducedMotion) {
          star.x += star.vx;
          star.y += star.vy;
          star.alpha += star.twinkleSpeed;

          if (star.alpha > star.baseAlpha + 0.35 || star.alpha < 0.12) {
            star.twinkleSpeed = -star.twinkleSpeed;
          }

          if (star.x < 0) star.x = width;
          if (star.x > width) star.x = 0;
          if (star.y < 0) star.y = height;
          if (star.y > height) star.y = 0;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 85%, 88%, ${Math.max(0.1, Math.min(star.alpha, 0.9))})`;

        if (star.glow) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = `hsla(${star.hue}, 90%, 75%, 0.7)`;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block opacity-80 pointer-events-none" />;
};
