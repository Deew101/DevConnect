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
  isBright: boolean;
  hasSpikes: boolean;
}

/**
 * StarfieldOverlay — Cinematic multi-depth starfield with natural clustering,
 * twinkling stellar bodies, purple/white diffraction spikes, and cosmic dust.
 */
export const StarfieldOverlay: React.FC<{ className?: string }> = ({ className = '' }) => {
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

    // Density tuned for 180-220 natural stars
    const starCount = Math.min(Math.floor((width * height) / 7500), 190);
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const isBright = Math.random() > 0.88;
      const hasSpikes = isBright && Math.random() > 0.65;
      const isDust = Math.random() > 0.7;

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isBright ? Math.random() * 1.5 + 1.2 : isDust ? Math.random() * 0.6 + 0.4 : Math.random() * 0.9 + 0.5,
        baseAlpha: isBright ? Math.random() * 0.4 + 0.6 : Math.random() * 0.4 + 0.2,
        alpha: Math.random() * 0.5 + 0.3,
        twinkleSpeed: (Math.random() * 0.012 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        // Hues: 260-290 (violet/purple), 240 (blue-white), 0 (pure white)
        hue: Math.random() > 0.35 ? 260 + Math.random() * 30 : 230,
        isBright,
        hasSpikes,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        if (!prefersReducedMotion) {
          s.x += s.vx;
          s.y += s.vy;
          s.alpha += s.twinkleSpeed;

          if (s.alpha > s.baseAlpha + 0.3 || s.alpha < 0.15) {
            s.twinkleSpeed = -s.twinkleSpeed;
          }

          if (s.x < 0) s.x = width;
          if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height;
          if (s.y > height) s.y = 0;
        }

        const currentAlpha = Math.max(0.12, Math.min(s.alpha, 0.95));

        // 1. Draw Star Core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 90%, 92%, ${currentAlpha})`;

        if (s.isBright) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = `hsla(${s.hue}, 100%, 78%, ${currentAlpha * 0.8})`;
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        // 2. Draw 4-point celestial diffraction spikes on selected bright stars
        if (s.hasSpikes && currentAlpha > 0.45) {
          const spikeLen = s.radius * 5.5;
          ctx.strokeStyle = `hsla(${s.hue}, 95%, 90%, ${currentAlpha * 0.45})`;
          ctx.lineWidth = 0.8;

          // Horizontal spike
          ctx.beginPath();
          ctx.moveTo(s.x - spikeLen, s.y);
          ctx.lineTo(s.x + spikeLen, s.y);
          ctx.stroke();

          // Vertical spike
          ctx.beginPath();
          ctx.moveTo(s.x, s.y - spikeLen);
          ctx.lineTo(s.x, s.y + spikeLen);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none select-none z-0 ${className}`}
    />
  );
};
