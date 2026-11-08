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
}

export const GalaxyBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check reduced motion preference
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

    // Generate subtle star particles
    const starCount = Math.min(Math.floor((width * height) / 18000), 70);
    const stars: Star[] = [];

    // Lavender/purple hues: 250 - 290
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.6,
        baseAlpha: Math.random() * 0.5 + 0.2,
        alpha: Math.random() * 0.5 + 0.2,
        twinkleSpeed: (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        hue: Math.random() > 0.4 ? 265 + Math.random() * 25 : 240,
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle dynamic cosmic energy ribbon
      if (!prefersReducedMotion) {
        time += 0.005;
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.03)');
        gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.05)');
        gradient.addColorStop(1, 'rgba(217, 70, 239, 0.03)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.4 + Math.sin(time) * 40);
        ctx.bezierCurveTo(
          width * 0.33,
          height * 0.3 + Math.cos(time) * 50,
          width * 0.66,
          height * 0.6 + Math.sin(time * 0.8) * 60,
          width,
          height * 0.5 + Math.cos(time * 1.2) * 40
        );
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
      }

      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!prefersReducedMotion) {
          star.x += star.vx;
          star.y += star.vy;
          star.alpha += star.twinkleSpeed;

          if (star.alpha > star.baseAlpha + 0.3 || star.alpha < 0.15) {
            star.twinkleSpeed = -star.twinkleSpeed;
          }

          if (star.x < 0) star.x = width;
          if (star.x > width) star.x = 0;
          if (star.y < 0) star.y = height;
          if (star.y > height) star.y = 0;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 85%, 85%, ${star.alpha})`;
        ctx.shadowBlur = star.radius > 1.2 ? 6 : 2;
        ctx.shadowColor = `hsla(${star.hue}, 90%, 75%, 0.6)`;
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

  return (
    <div className="relative min-h-screen w-full bg-[#080514] text-[#F8F7FF] overflow-x-hidden">
      {/* Fixed Ambient Cosmic Nebula Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Primary Purple Nebula Orb */}
        <div
          className="absolute -top-[15%] left-[20%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-25 animate-nebula-pulse pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8B5CF6 0%, rgba(139, 92, 246, 0) 70%)' }}
        />

        {/* Electric Violet Wave Orb */}
        <div
          className="absolute top-[40%] -right-[10%] w-[550px] h-[550px] rounded-full blur-[130px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #A855F7 0%, rgba(168, 85, 247, 0) 70%)' }}
        />

        {/* Neon Magenta Deep Accent */}
        <div
          className="absolute -bottom-[10%] left-[10%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D946EF 0%, rgba(217, 70, 239, 0) 70%)' }}
        />

        {/* Star Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block opacity-70" />

        {/* Subtle Cosmic Dust Grid Overlay */}
        <div
          className="absolute inset-0 bg-repeat opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #C4B5FD 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
