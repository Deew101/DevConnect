import React, { useEffect, useRef } from 'react';

interface Mote {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  pulseSpeed: number;
  vx: number;
  vy: number;
  color: string;
}

/**
 * SubtleAnimatedParticles — Gentle floating stardust & luminous plasma motes
 * Ultra-lightweight supplemental particle drift that gives the cosmos a living, breathing feel.
 */
export const SubtleAnimatedParticles: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const colors = [
      'rgba(196, 181, 253, ', // Lavender
      'rgba(168, 85, 247, ',  // Electric violet
      'rgba(217, 70, 239, ',  // Neon magenta
      'rgba(248, 247, 255, ', // Starlight white
    ];

    const motes: Mote[] = [];
    const count = Math.min(Math.floor((w * h) / 36000), 32);

    for (let i = 0; i < count; i++) {
      motes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 1.8 + 1.2,
        baseAlpha: Math.random() * 0.35 + 0.25,
        alpha: Math.random() * 0.4 + 0.2,
        pulseSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const loop = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.x += m.vx;
        m.y += m.vy;
        m.alpha += m.pulseSpeed;

        if (m.alpha > m.baseAlpha + 0.25 || m.alpha < 0.1) {
          m.pulseSpeed = -m.pulseSpeed;
        }

        if (m.x < 0) m.x = w;
        if (m.x > w) m.x = 0;
        if (m.y < 0) m.y = h;
        if (m.y > h) m.y = 0;

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${m.color}${Math.max(0.08, Math.min(m.alpha, 0.7))})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `${m.color}0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none select-none z-0 ${className}`}
    />
  );
};
