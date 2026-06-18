"use client";

import React, { useEffect, useRef } from "react";

export type PreloaderDirection =
  | "radial-out"
  | "radial-in"
  | "up"
  | "down"
  | "left"
  | "right"
  | "diagonal";

export function getPreloaderDirection(pathname: string): PreloaderDirection {
  if (!pathname || pathname === "/") return "radial-out";
  const p = pathname.toLowerCase();
  if (p.includes("/nosotros") || p.includes("/proceso") || p.includes("/about")) {
    return "up";
  }
  if (
    p.includes("/servicios") ||
    p.includes("/soluciones") ||
    p.includes("/configurador") ||
    p.includes("/diseno")
  ) {
    return "right";
  }
  if (p.includes("/contacto") || p.includes("/cotiza") || p.includes("/reclamaciones")) {
    return "down";
  }
  if (p.includes("/proyectos")) {
    return "radial-in";
  }
  return "diagonal";
}

interface PreloaderParticlesProps {
  direction: PreloaderDirection;
}

export const PreloaderParticles: React.FC<PreloaderParticlesProps> = ({
  direction,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      isStreak: boolean;
      angle?: number;
      speed?: number;
      distance?: number;
    }

    const particles: Particle[] = [];
    const starCount = 35;
    const streakCount = 25;
    const connectionDist = 110;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    const initParticles = () => {
      particles.length = 0;
      const cx = width / 2;
      const cy = height / 2;

      // 1. Initialize star particles (constellation nodes)
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        let vx = 0;
        let vy = 0;

        switch (direction) {
          case "up":
            vx = (Math.random() - 0.5) * 0.15;
            vy = -0.15 - Math.random() * 0.2;
            break;
          case "down":
            vx = (Math.random() - 0.5) * 0.15;
            vy = 0.15 + Math.random() * 0.2;
            break;
          case "left":
            vx = -0.15 - Math.random() * 0.2;
            vy = (Math.random() - 0.5) * 0.15;
            break;
          case "right":
            vx = 0.15 + Math.random() * 0.2;
            vy = (Math.random() - 0.5) * 0.15;
            break;
          case "radial-out":
          case "radial-in":
            vx = (Math.random() - 0.5) * 0.12;
            vy = (Math.random() - 0.5) * 0.12;
            break;
          case "diagonal":
          default:
            vx = 0.08 + Math.random() * 0.12;
            vy = 0.08 + Math.random() * 0.12;
            break;
        }

        particles.push({
          x,
          y,
          vx,
          vy,
          size: Math.random() * 1.4 + 0.8,
          alpha: Math.random() * 0.45 + 0.15,
          color: Math.random() > 0.75 ? "#D8B36A" : "#F4F0E8", // Gold or Warm White
          isStreak: false,
        });
      }

      // 2. Initialize streak particles (stellar rain)
      for (let i = 0; i < streakCount; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        let vx = 0;
        let vy = 0;
        let angle = 0;
        let speed = 0;
        let distance = 0;

        switch (direction) {
          case "up":
            vx = (Math.random() - 0.5) * 0.2;
            vy = -2.5 - Math.random() * 2.0;
            break;
          case "down":
            vx = (Math.random() - 0.5) * 0.2;
            vy = 2.5 + Math.random() * 2.0;
            break;
          case "left":
            vx = -2.5 - Math.random() * 2.0;
            vy = (Math.random() - 0.5) * 0.2;
            break;
          case "right":
            vx = 2.5 + Math.random() * 2.0;
            vy = (Math.random() - 0.5) * 0.2;
            break;
          case "radial-out":
            angle = Math.random() * Math.PI * 2;
            speed = 1.5 + Math.random() * 3.0;
            distance = Math.random() * 60 + 10;
            x = cx + Math.cos(angle) * distance;
            y = cy + Math.sin(angle) * distance;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            break;
          case "radial-in":
            angle = Math.random() * Math.PI * 2;
            speed = 1.5 + Math.random() * 2.0;
            distance = Math.max(width, height) / 2 + Math.random() * 100;
            x = cx + Math.cos(angle) * distance;
            y = cy + Math.sin(angle) * distance;
            vx = -Math.cos(angle) * speed;
            vy = -Math.sin(angle) * speed;
            break;
          case "diagonal":
          default:
            vx = 1.5 + Math.random() * 1.5;
            vy = 1.5 + Math.random() * 1.5;
            break;
        }

        particles.push({
          x,
          y,
          vx,
          vy,
          angle,
          speed,
          distance,
          size: Math.random() * 1.0 + 0.5,
          alpha: Math.random() * 0.5 + 0.25,
          color: Math.random() > 0.4 ? "#D8B36A" : "#F4F0E8", // High gold ratio
          isStreak: true,
        });
      }
    };

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.isStreak) {
          p.x += p.vx;
          p.y += p.vy;

          if (direction === "radial-out") {
            const dx = p.x - cx;
            const dy = p.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            p.alpha = Math.max(0, 1 - dist / (Math.max(width, height) * 0.5));

            if (dist > Math.max(width, height) * 0.65 || p.alpha <= 0) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 1.5 + Math.random() * 3.0;
              p.x = cx + Math.cos(angle) * 10;
              p.y = cy + Math.sin(angle) * 10;
              p.vx = Math.cos(angle) * speed;
              p.vy = Math.sin(angle) * speed;
              p.alpha = Math.random() * 0.5 + 0.3;
            }
          } else if (direction === "radial-in") {
            const dx = p.x - cx;
            const dy = p.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 30) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 1.5 + Math.random() * 2.0;
              const startDist = Math.max(width, height) / 2 + Math.random() * 100;
              p.x = cx + Math.cos(angle) * startDist;
              p.y = cy + Math.sin(angle) * startDist;
              p.vx = -Math.cos(angle) * speed;
              p.vy = -Math.sin(angle) * speed;
              p.alpha = Math.random() * 0.5 + 0.3;
            }
          } else {
            if (direction === "up" && p.y < -50) {
              p.y = height + 10;
              p.x = Math.random() * width;
            } else if (direction === "down" && p.y > height + 50) {
              p.y = -10;
              p.x = Math.random() * width;
            } else if (direction === "left" && p.x < -50) {
              p.x = width + 10;
              p.y = Math.random() * height;
            } else if (direction === "right" && p.x > width + 50) {
              p.x = -10;
              p.y = Math.random() * height;
            } else if (direction === "diagonal" && (p.x > width + 50 || p.y > height + 50)) {
              if (Math.random() > 0.5) {
                p.x = -10;
                p.y = Math.random() * height;
              } else {
                p.y = -10;
                p.x = Math.random() * width;
              }
            }
          }

          // Streak line rendering
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          const trailLength = 5.0;
          ctx.lineTo(p.x - p.vx * trailLength, p.y - p.vy * trailLength);
          ctx.stroke();
        } else {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Constellation lines connection
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.isStreak) continue;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.isStreak) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          const minDist = connectionDist * connectionDist;

          if (distSq < minDist) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / connectionDist) * 0.08;
            ctx.strokeStyle =
              p1.color === "#D8B36A"
                ? `rgba(216, 179, 106, ${lineAlpha})`
                : `rgba(244, 240, 232, ${lineAlpha})`;
            ctx.globalAlpha = 1.0;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;
    };

    const tick = () => {
      updateAndDraw();
      animationFrameId = requestAnimationFrame(tick);
    };

    resize();
    tick();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [direction]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default PreloaderParticles;
