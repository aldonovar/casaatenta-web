"use client";

import React, { useEffect, useRef } from "react";

export const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track scroll velocity for particle acceleration
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }

    const particles: Particle[] = [];
    const maxParticles = 60;
    const connectionDist = 120;

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.4 + 0.15,
          color: Math.random() > 0.7 ? "#D8B36A" : "#6F8496", // Gold accent or Blue Gray
        });
      }
    };

    initParticles();

    const drawGrid = () => {
      if (!ctx) return;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.012)";
      ctx.lineWidth = 0.5;

      const gridSize = 80;
      const scrollOffset = window.scrollY * 0.08; // Grid parallax offset

      ctx.beginPath();
      // Vertical grid lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      // Horizontal grid lines (parallax scrolling)
      for (let y = -(scrollOffset % gridSize); y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    };

    const drawParticles = () => {
      if (!ctx) return;

      const currentScrollY = window.scrollY;
      // Convert scroll delta to vertical displacement
      scrollVelocity = (currentScrollY - lastScrollY) * 0.12;
      lastScrollY = currentScrollY;

      ctx.clearRect(0, 0, width, height);

      // Draw structural grid in the background
      drawGrid();

      // Update and draw network particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply scroll movement and drift velocity
        p.y -= scrollVelocity * 0.35;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around canvas edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Check distance to other nodes and draw thin connection links
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const linkAlpha = (1 - dist / connectionDist) * 0.07;
            ctx.strokeStyle = p.color === "#D8B36A" ? "#D8B36A" : "#ffffff";
            ctx.globalAlpha = linkAlpha;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1.0;
    };

    const tick = () => {
      drawParticles();
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 h-full w-full pointer-events-none opacity-50"
    />
  );
};
