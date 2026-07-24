"use client";

import React from "react";

interface ZenitDesignSignatureProps {
  className?: string;
}

export const ZenitDesignSignature: React.FC<ZenitDesignSignatureProps> = ({
  className = "w-48 md:w-56 h-auto",
}) => {
  return (
    <svg
      viewBox="0 0 380 90"
      className={`select-none transition-all duration-300 drop-shadow-[0_2px_12px_rgba(216,179,106,0.25)] ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="zenit design"
    >
      <defs>
        <linearGradient id="gold-stroke-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F2D38D" />
          <stop offset="50%" stopColor="#D8B36A" />
          <stop offset="100%" stopColor="#B88E43" />
        </linearGradient>
        <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g
        fill="none"
        stroke="url(#gold-stroke-grad)"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#gold-glow)"
      >
        {/* === z === */}
        {/* Top curve & fluid loop of z */}
        <path d="M 28 42 C 34 32, 48 30, 48 36 C 48 42, 32 46, 36 54 C 40 60, 48 58, 52 52" strokeWidth="2.2" />
        <path d="M 36 54 C 30 64, 20 74, 26 80 C 32 86, 42 76, 50 64 L 56 50" strokeWidth="1.8" />

        {/* === e === */}
        <path d="M 50 64 C 54 52, 66 42, 68 50 C 70 58, 56 64, 66 64 C 72 64, 78 58, 82 52" strokeWidth="2.0" />

        {/* === n === */}
        <path d="M 82 52 C 86 44, 92 42, 94 54 L 94 64 M 94 54 C 100 44, 108 42, 110 56 L 110 64 C 112 64, 118 56, 122 50" strokeWidth="2.0" />

        {/* === i === */}
        <path d="M 122 50 L 126 64 C 128 64, 134 54, 138 42" strokeWidth="2.0" />
        <circle cx="127" cy="40" r="1.5" fill="url(#gold-stroke-grad)" stroke="none" />

        {/* === t === */}
        <path d="M 138 34 L 140 64 C 142 66, 148 64, 154 58" strokeWidth="2.2" />
        {/* Elegant calligraphic crossbar loop for t */}
        <path d="M 128 46 C 142 42, 160 42, 166 44" strokeWidth="1.8" />

        {/* --- SPACE --- */}

        {/* === d === */}
        <path d="M 194 56 C 184 56, 176 48, 184 38 C 192 30, 202 38, 200 48 C 198 58, 188 64, 202 64 L 204 26 L 204 64 C 206 64, 212 56, 216 48" strokeWidth="2.2" />

        {/* === e === */}
        <path d="M 216 48 C 220 38, 230 36, 232 44 C 234 52, 222 58, 232 58 C 238 58, 244 52, 248 44" strokeWidth="2.0" />

        {/* === s === */}
        <path d="M 248 44 C 254 36, 262 36, 260 44 C 258 50, 246 52, 252 60 C 256 66, 264 62, 268 54" strokeWidth="2.0" />

        {/* === i === */}
        <path d="M 268 54 L 272 64 C 274 64, 280 54, 284 42" strokeWidth="2.0" />
        <circle cx="273" cy="38" r="1.5" fill="url(#gold-stroke-grad)" stroke="none" />

        {/* === g === */}
        <path d="M 300 52 C 290 52, 284 44, 290 36 C 296 28, 306 34, 304 44 C 302 54, 292 60, 304 60 L 304 44 L 304 66 C 304 80, 284 90, 276 80 C 270 72, 284 66, 310 64" strokeWidth="2.2" />

        {/* === n === */}
        <path d="M 310 64 C 314 54, 320 50, 322 60 L 322 64 M 322 56 C 328 48, 336 48, 338 60 L 338 64 C 342 64, 356 50, 368 40" strokeWidth="2.0" />

        {/* Master Author Signature Flourish (Underline loop) */}
        <path
          d="M 60 76 C 130 88, 240 86, 340 70 C 360 66, 372 58, 355 56 C 330 54, 210 64, 110 66"
          strokeWidth="1.2"
          opacity="0.85"
        />
      </g>
    </svg>
  );
};
