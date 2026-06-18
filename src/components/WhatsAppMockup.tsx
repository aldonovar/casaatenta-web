"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface Message {
  from: "user" | "bot";
  text: string;
  delay: number;
}

const messages: Message[] = [
  { from: "user", text: "Casa, activa modo terraza.", delay: 0 },
  {
    from: "bot",
    text: "Listo. Encendí las luces cálidas, activé la pérgola y dejé la escena social preparada. 🏡",
    delay: 1200,
  },
  { from: "user", text: "Baja la intensidad al 40%.", delay: 2800 },
  {
    from: "bot",
    text: "Hecho. Iluminación exterior al 40%. Ambiente íntimo activo. ✨",
    delay: 4000,
  },
  { from: "user", text: "Activa modo seguridad en 2 horas.", delay: 5800 },
  {
    from: "bot",
    text: "Programado. A las 11:00 pm se activará el modo seguridad: luces perimetrales, sensores activos, accesos bloqueados. 🔒",
    delay: 7000,
  },
];

export const WhatsAppMockup: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    messages.forEach((msg, idx) => {
      const timeout = setTimeout(() => {
        setVisibleMessages((prev) => prev + 1);
      }, msg.delay);
      timeoutsRef.current.push(timeout);
    });

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [hasStarted]);

  useEffect(() => {
    if (visibleMessages === 0) return;
    const lastBubble = containerRef.current?.querySelector(
      `[data-msg-idx="${visibleMessages - 1}"]`
    );
    if (lastBubble) {
      gsap.fromTo(
        lastBubble,
        { opacity: 0, y: 12, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.4)" }
      );
    }
  }, [visibleMessages]);

  const currentTime = "9:02 PM";

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-sm rounded-2xl border border-ca-border overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
      style={{
        background:
          "linear-gradient(180deg, #0b1622 0%, #0e1e30 50%, #0a1520 100%)",
      }}
    >
      {/* WhatsApp-style header */}
      <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3">
        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold text-xs font-bold font-mono">
          CA
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-ca-text leading-tight">
            Casa Atenta
          </p>
          <p className="text-[10px] text-green-400/70 tracking-wide">
            en línea
          </p>
        </div>
        {/* Dots */}
        <div className="flex flex-col gap-[3px]">
          <span className="block h-[3px] w-[3px] rounded-full bg-ca-text-secondary" />
          <span className="block h-[3px] w-[3px] rounded-full bg-ca-text-secondary" />
          <span className="block h-[3px] w-[3px] rounded-full bg-ca-text-secondary" />
        </div>
      </div>

      {/* Chat body */}
      <div className="flex min-h-[280px] flex-col gap-2.5 p-4 pb-3">
        {messages.slice(0, visibleMessages).map((msg, idx) => (
          <div
            key={idx}
            data-msg-idx={idx}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            style={{ opacity: 0 }}
          >
            <div
              className={`max-w-[82%] rounded-xl px-3.5 py-2 text-[13px] leading-relaxed ${
                msg.from === "user"
                  ? "rounded-br-sm bg-[#005c4b] text-white"
                  : "rounded-bl-sm bg-white/[0.08] text-ca-text"
              }`}
            >
              <p>{msg.text}</p>
              <p
                className={`mt-0.5 text-right text-[10px] ${
                  msg.from === "user"
                    ? "text-white/40"
                    : "text-ca-text-secondary/60"
                }`}
              >
                {currentTime}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {hasStarted && visibleMessages < messages.length && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-xl rounded-bl-sm bg-white/[0.08] px-4 py-2.5">
              <span className="ca-pulse inline-block h-1.5 w-1.5 rounded-full bg-ca-text-secondary" />
              <span
                className="ca-pulse inline-block h-1.5 w-1.5 rounded-full bg-ca-text-secondary"
                style={{ animationDelay: "0.3s" }}
              />
              <span
                className="ca-pulse inline-block h-1.5 w-1.5 rounded-full bg-ca-text-secondary"
                style={{ animationDelay: "0.6s" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 border-t border-white/[0.06] px-3 py-2.5">
        <div className="flex-1 rounded-full bg-white/[0.06] px-4 py-2 text-[12px] text-ca-text-secondary/50">
          Escribe un mensaje...
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/20">
          <svg
            className="h-4 w-4 text-brand-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19V5m0 0l-5 5m5-5l5 5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
