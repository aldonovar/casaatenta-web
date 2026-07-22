"use client";

import { useId } from "react";

export const serviceMotionSlugs = [
  "techos-sol-y-sombra",
  "iluminacion-inteligente",
  "smart-homes",
  "diseno-terrazas",
  "mantenimiento-general",
] as const;

export type ServiceMotionSlug = (typeof serviceMotionSlugs)[number];

export function isServiceMotionSlug(slug: string): slug is ServiceMotionSlug {
  return serviceMotionSlugs.includes(slug as ServiceMotionSlug);
}

type ServiceMotionSceneProps = {
  slug: string;
  className?: string;
  decorative?: boolean;
};

const sceneCopy: Record<
  ServiceMotionSlug,
  { title: string; description: string }
> = {
  "techos-sol-y-sombra": {
    title: "Sistema alveolar de lamas orientables",
    description:
      "Esquema tridimensional de listones que giran para graduar la luz y se desplazan lateralmente para liberar la cubierta.",
  },
  "iluminacion-inteligente": {
    title: "Escena de iluminación regulable",
    description:
      "Diagrama de haces, temperatura de color y regulación de una escena de iluminación residencial.",
  },
  "smart-homes": {
    title: "Red doméstica coordinada",
    description:
      "Casa isométrica con sensores, iluminación, acceso y control conectados mediante una red local.",
  },
  "diseno-terrazas": {
    title: "Del plano al volumen de una terraza",
    description:
      "Plano arquitectónico que evoluciona hacia una vista tridimensional con estructura, circulación y zonas de uso.",
  },
  "mantenimiento-general": {
    title: "Diagnóstico y corrección de acabados",
    description:
      "Escaneo técnico por capas que identifica una falla, prepara la superficie y muestra el acabado corregido.",
  },
};

const sharedSvgClass =
  "h-full w-full overflow-visible fill-none stroke-brand-gold [stroke-linecap:round] [stroke-linejoin:round]";

export function ServiceMotionScene({
  slug,
  className = "",
  decorative = false,
}: ServiceMotionSceneProps) {
  const rawId = useId();
  const uid = `ca-motion-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const resolvedSlug: ServiceMotionSlug = isServiceMotionSlug(slug)
    ? slug
    : "diseno-terrazas";
  const copy = sceneCopy[resolvedSlug];
  const accessibilityProps = decorative
    ? ({ "aria-hidden": true } as const)
    : ({
        role: "img",
        "aria-labelledby": `${uid}-title ${uid}-description`,
      } as const);

  if (resolvedSlug === "techos-sol-y-sombra") {
    return (
      <svg
        viewBox="0 0 760 520"
        className={`${sharedSvgClass} ${className}`}
        {...accessibilityProps}
      >
        {!decorative && <title id={`${uid}-title`}>{copy.title}</title>}
        {!decorative && (
          <desc id={`${uid}-description`}>{copy.description}</desc>
        )}
        <defs>
          <linearGradient id={`${uid}-roof-face`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F6D58C" stopOpacity="0.72" />
            <stop offset="58%" stopColor="#D8B36A" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#6C5128" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id={`${uid}-roof-edge`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D8B36A" stopOpacity="0.64" />
            <stop offset="100%" stopColor="#72572D" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id={`${uid}-roof-sun`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF4C7" stopOpacity="0.94" />
            <stop offset="42%" stopColor="#F2D38D" stopOpacity="0.44" />
            <stop offset="100%" stopColor="#F2D38D" stopOpacity="0" />
          </radialGradient>
          <filter
            id={`${uid}-roof-glow`}
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <pattern
            id={`${uid}-roof-grid`}
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M22 0H0V22"
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeWidth="0.7"
            />
          </pattern>
        </defs>

        <rect
          x="34"
          y="30"
          width="692"
          height="450"
          rx="26"
          fill={`url(#${uid}-roof-grid)`}
          strokeOpacity="0.1"
        />
        <g
          data-roof-sun
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle
            cx="126"
            cy="112"
            r="70"
            fill={`url(#${uid}-roof-sun)`}
            stroke="none"
            filter={`url(#${uid}-roof-glow)`}
          />
          <circle
            cx="126"
            cy="112"
            r="23"
            fill="#F2D38D"
            fillOpacity="0.5"
            strokeOpacity="0.46"
          />
        </g>
        <g data-roof-rays strokeOpacity="0.17" strokeWidth="1.1">
          <path d="M164 136L360 405" />
          <path d="M142 144L282 414" />
          <path d="M184 122L442 388" />
          <path d="M196 101L514 349" />
        </g>

        <polygon
          data-roof-shadow
          points="112,278 478,410 684,307 302,189"
          fill="#06101C"
          fillOpacity="0.68"
          stroke="none"
        />

        <g data-reveal data-roof-frame strokeWidth="2.4">
          <path d="M98 222L292 126L684 206L488 304Z" />
          <path
            d="M98 222V411M488 304V451M684 206V397M292 126V315"
            strokeOpacity="0.48"
          />
          <path d="M98 411L292 315L684 397L488 451Z" strokeOpacity="0.24" />
          <path d="M110 238L300 145M490 286L670 198" strokeOpacity="0.34" />
        </g>

        <path
          data-roof-rail
          d="M112 218L300 126L674 202"
          strokeWidth="4"
          strokeOpacity="0.38"
        />
        <g data-roof-carriage>
          <circle cx="121" cy="215" r="8" fill="#081524" strokeWidth="1.6" />
          <circle cx="121" cy="215" r="2.8" fill="#D8B36A" stroke="none" />
        </g>

        <g>
          {Array.from({ length: 9 }, (_, index) => {
            const x = 112 + index * 46;
            return (
              <g
                key={x}
                data-roof-slat
                data-slat-index={index}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <polygon
                  points={`${x},220 ${x + 176},137 ${x + 197},148 ${x + 21},231`}
                  fill={`url(#${uid}-roof-face)`}
                  strokeWidth="1.15"
                  strokeOpacity={0.58 + index * 0.035}
                />
                <path
                  d={`M${x + 21} 231L${x + 197} 148V156L${x + 21} 239Z`}
                  fill={`url(#${uid}-roof-edge)`}
                  strokeWidth="0.8"
                  strokeOpacity="0.34"
                />
                <circle
                  cx={x + 99}
                  cy="184"
                  r="2.3"
                  fill="#F2D38D"
                  stroke="none"
                />
              </g>
            );
          })}
        </g>

        <g data-roof-measure opacity="0.18" strokeWidth="0.9">
          <path d="M100 467H684M100 459V475M684 459V475" />
          <path d="M706 206V397M698 206H714M698 397H714" />
        </g>
        <g className="stroke-none fill-brand-gold font-mono">
          <text x="58" y="72" className="text-[10px] tracking-[0.24em]">
            SISTEMA ALVEOLAR / ESTUDIO CINEMÁTICO
          </text>
          <text x="58" y="458" className="text-[9px] tracking-[0.18em]">
            GIRO DE LAMAS · PASO DE LUZ · APERTURA LATERAL
          </text>
          <text
            x="553"
            y="458"
            className="text-[8px] tracking-[0.14em]"
            opacity="0.66"
          >
            SOLUCIÓN ESPECIAL
          </text>
        </g>
      </svg>
    );
  }

  if (resolvedSlug === "iluminacion-inteligente") {
    return (
      <svg
        viewBox="0 0 760 520"
        className={`${sharedSvgClass} ${className}`}
        {...accessibilityProps}
      >
        {!decorative && <title id={`${uid}-title`}>{copy.title}</title>}
        {!decorative && (
          <desc id={`${uid}-description`}>{copy.description}</desc>
        )}
        <defs>
          <radialGradient id={`${uid}-light-warm`} cx="50%" cy="48%" r="54%">
            <stop offset="0%" stopColor="#FFF2C7" stopOpacity="0.95" />
            <stop offset="38%" stopColor="#EBC779" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#D8B36A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-light-cool`} cx="50%" cy="45%" r="56%">
            <stop offset="0%" stopColor="#D6ECFF" stopOpacity="0.74" />
            <stop offset="48%" stopColor="#75B9E7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0C2742" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}-spectrum`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F5A64A" />
            <stop offset="48%" stopColor="#FFF1CE" />
            <stop offset="100%" stopColor="#78BDEB" />
          </linearGradient>
          <pattern
            id={`${uid}-light-grid`}
            width="26"
            height="26"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M26 0H0V26"
              stroke="currentColor"
              strokeOpacity="0.07"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect
          x="36"
          y="32"
          width="688"
          height="448"
          rx="26"
          fill={`url(#${uid}-light-grid)`}
          strokeOpacity="0.1"
        />
        <path
          d="M112 390H648L590 174H170Z"
          strokeOpacity="0.28"
          strokeWidth="1.3"
          data-reveal
        />
        <path
          d="M170 174L380 94L590 174"
          strokeOpacity="0.42"
          strokeWidth="2"
          data-draw
        />
        <g
          data-light-orbit
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <ellipse
            cx="380"
            cy="242"
            rx="216"
            ry="124"
            strokeOpacity="0.17"
            strokeDasharray="4 13"
          />
          <ellipse
            cx="380"
            cy="242"
            rx="162"
            ry="91"
            strokeOpacity="0.26"
            strokeDasharray="18 11"
          />
        </g>
        <circle
          data-light-cool
          cx="380"
          cy="232"
          r="160"
          fill={`url(#${uid}-light-cool)`}
          stroke="none"
          opacity="0.76"
        />
        <circle
          data-light-warm
          cx="380"
          cy="232"
          r="148"
          fill={`url(#${uid}-light-warm)`}
          stroke="none"
          opacity="0.34"
        />
        <g data-light-beams opacity="0.28">
          <path
            d="M246 154L174 390H326L344 160Z"
            fill={`url(#${uid}-light-warm)`}
            stroke="none"
          />
          <path
            d="M380 132L308 390H452L398 132Z"
            fill={`url(#${uid}-light-warm)`}
            stroke="none"
          />
          <path
            d="M514 154L434 390H586L532 160Z"
            fill={`url(#${uid}-light-cool)`}
            stroke="none"
          />
        </g>
        {[246, 380, 514].map((cx, index) => (
          <g key={cx} data-light-point data-reveal>
            <path
              d={`M${cx - 14} 151H${cx + 14}L${cx + 8} 166H${cx - 8}Z`}
              fill="#D8B36A"
              fillOpacity="0.18"
            />
            <circle
              cx={cx}
              cy="154"
              r="5"
              fill={index === 2 ? "#A8D6F3" : "#F2D38D"}
              stroke="none"
            />
          </g>
        ))}
        <g data-light-dimmer>
          <rect
            x="194"
            y="422"
            width="372"
            height="16"
            rx="8"
            fill={`url(#${uid}-spectrum)`}
            fillOpacity="0.58"
            strokeOpacity="0.34"
          />
          <circle
            data-light-knob
            cx="210"
            cy="430"
            r="15"
            fill="#081524"
            strokeWidth="1.5"
          />
          <path d="M210 420V430L219 435" strokeWidth="1.2" />
        </g>
        <g className="stroke-none fill-brand-gold font-mono">
          <text x="58" y="72" className="text-[10px] tracking-[0.24em]">
            LUZ / ESCENA REGULABLE
          </text>
          <text x="190" y="466" className="text-[8px] tracking-[0.15em]">
            1800K
          </text>
          <text x="354" y="466" className="text-[8px] tracking-[0.15em]">
            4000K
          </text>
          <text x="530" y="466" className="text-[8px] tracking-[0.15em]">
            6500K
          </text>
        </g>
      </svg>
    );
  }

  if (resolvedSlug === "smart-homes") {
    const nodes = [
      { x: 380, y: 238, label: "HUB" },
      { x: 228, y: 214, label: "LUZ" },
      { x: 532, y: 214, label: "ACCESO" },
      { x: 268, y: 344, label: "CLIMA" },
      { x: 492, y: 344, label: "SENSOR" },
    ];
    return (
      <svg
        viewBox="0 0 760 520"
        className={`${sharedSvgClass} ${className}`}
        {...accessibilityProps}
      >
        {!decorative && <title id={`${uid}-title`}>{copy.title}</title>}
        {!decorative && (
          <desc id={`${uid}-description`}>{copy.description}</desc>
        )}
        <defs>
          <radialGradient id={`${uid}-node-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF2BE" stopOpacity="0.96" />
            <stop offset="35%" stopColor="#D8B36A" stopOpacity="0.58" />
            <stop offset="100%" stopColor="#D8B36A" stopOpacity="0" />
          </radialGradient>
          <pattern
            id={`${uid}-smart-grid`}
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M24 0H0V24"
              stroke="currentColor"
              strokeOpacity="0.07"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect
          x="36"
          y="32"
          width="688"
          height="448"
          rx="26"
          fill={`url(#${uid}-smart-grid)`}
          strokeOpacity="0.1"
        />
        <g data-smart-shell data-reveal strokeWidth="1.8">
          <path d="M144 248L380 100L616 248V418H144Z" />
          <path
            d="M144 248L380 322L616 248M380 100V322M380 322V418"
            strokeOpacity="0.35"
          />
          <path d="M172 264V394H588V264" strokeOpacity="0.2" />
          <path
            d="M188 278L380 336L572 278"
            strokeOpacity="0.16"
            strokeDasharray="5 10"
          />
        </g>
        <g data-smart-rooms opacity="0.26">
          <path
            d="M174 274L290 310V390H174Z"
            fill="#D8B36A"
            fillOpacity="0.08"
          />
          <path
            d="M470 310L586 274V390H470Z"
            fill="#6FB4E1"
            fillOpacity="0.07"
          />
          <path
            d="M306 314L380 336L454 314V390H306Z"
            fill="#D8B36A"
            fillOpacity="0.06"
          />
        </g>
        <g
          data-smart-links
          strokeDasharray="12 10"
          strokeWidth="1.6"
          strokeOpacity="0.64"
        >
          <path d="M380 238C320 230 288 208 228 214" />
          <path d="M380 238C440 230 472 208 532 214" />
          <path d="M380 238C340 278 316 322 268 344" />
          <path d="M380 238C420 278 444 322 492 344" />
        </g>
        <g data-smart-packets>
          <circle
            data-smart-packet
            cx="380"
            cy="238"
            r="4"
            fill="#F2D38D"
            stroke="none"
          />
          <circle
            data-smart-packet
            cx="380"
            cy="238"
            r="4"
            fill="#F2D38D"
            stroke="none"
          />
          <circle
            data-smart-packet
            cx="380"
            cy="238"
            r="4"
            fill="#9FD2F2"
            stroke="none"
          />
          <circle
            data-smart-packet
            cx="380"
            cy="238"
            r="4"
            fill="#9FD2F2"
            stroke="none"
          />
        </g>
        {nodes.map(({ x, y, label }, index) => (
          <g
            key={label}
            data-smart-node
            data-node-index={index}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <circle
              cx={x}
              cy={y}
              r={index === 0 ? 34 : 25}
              fill={`url(#${uid}-node-glow)`}
              stroke="none"
              opacity="0.38"
            />
            <circle
              cx={x}
              cy={y}
              r={index === 0 ? 17 : 12}
              fill="#081524"
              strokeWidth="1.5"
            />
            <circle
              cx={x}
              cy={y}
              r={index === 0 ? 5 : 3.5}
              fill="#D8B36A"
              stroke="none"
            />
            <text
              x={x}
              y={y + (index === 0 ? 38 : 30)}
              textAnchor="middle"
              className="fill-brand-gold stroke-none font-mono text-[8px] tracking-[0.14em]"
            >
              {label}
            </text>
          </g>
        ))}
        <g className="stroke-none fill-brand-gold font-mono">
          <text x="58" y="72" className="text-[10px] tracking-[0.24em]">
            DOMÓTICA / RED LOCAL
          </text>
          <text x="58" y="458" className="text-[9px] tracking-[0.18em]">
            INFRAESTRUCTURA · NODOS · RUTINAS · CONTROL
          </text>
        </g>
      </svg>
    );
  }

  if (resolvedSlug === "diseno-terrazas") {
    return (
      <svg
        viewBox="0 0 760 520"
        className={`${sharedSvgClass} ${className}`}
        {...accessibilityProps}
      >
        {!decorative && <title id={`${uid}-title`}>{copy.title}</title>}
        {!decorative && (
          <desc id={`${uid}-description`}>{copy.description}</desc>
        )}
        <defs>
          <pattern
            id={`${uid}-plan-grid`}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 0H0V20"
              stroke="currentColor"
              strokeOpacity="0.09"
              strokeWidth="0.65"
            />
          </pattern>
          <linearGradient id={`${uid}-volume`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0D18B" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#0C2742" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <rect
          x="36"
          y="32"
          width="688"
          height="448"
          rx="26"
          fill={`url(#${uid}-plan-grid)`}
          strokeOpacity="0.1"
        />
        <g
          data-terrace-plan
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <path data-draw d="M118 144H642V410H118Z" strokeWidth="1.8" />
          <path data-draw d="M118 250H642M382 144V410" strokeOpacity="0.43" />
          <path
            data-draw
            d="M158 178H330V228H158ZM436 178H602V228H436Z"
            strokeOpacity="0.55"
          />
          <circle data-draw cx="382" cy="330" r="48" strokeOpacity="0.52" />
          <path
            data-draw
            d="M334 330H430M382 282V378"
            strokeOpacity="0.28"
            strokeDasharray="4 8"
          />
        </g>
        <g data-terrace-circulation opacity="0.18">
          <path
            d="M142 382C234 290 274 286 356 300S506 344 620 170"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d="M142 382C234 290 274 286 356 300S506 344 620 170"
            stroke="#081524"
            strokeWidth="15"
            strokeLinecap="round"
          />
        </g>
        <g
          data-terrace-volume
          opacity="0.04"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <path
            d="M180 350L382 250L586 350L382 450Z"
            fill={`url(#${uid}-volume)`}
            strokeWidth="1.4"
          />
          <path
            d="M180 350V248L382 148V250M586 350V248L382 148"
            strokeWidth="2"
          />
          <path d="M180 248L382 350L586 248" strokeOpacity="0.34" />
          <path d="M230 326V230M534 326V230" strokeOpacity="0.42" />
          <path
            d="M226 326L382 248L538 326"
            strokeOpacity="0.28"
            strokeDasharray="5 8"
          />
        </g>
        <g data-terrace-furniture opacity="0.04">
          <ellipse
            cx="382"
            cy="345"
            rx="52"
            ry="26"
            fill="#D8B36A"
            fillOpacity="0.12"
          />
          <path d="M350 345V391M414 345V391" />
          <path
            d="M270 318L318 342L288 357L240 333Z"
            fill="#D8B36A"
            fillOpacity="0.09"
          />
          <path
            d="M446 342L494 318L524 333L476 357Z"
            fill="#D8B36A"
            fillOpacity="0.09"
          />
        </g>
        <g data-measure opacity="0.32" strokeWidth="0.8">
          <path d="M118 112H642M118 104V120M642 104V120" />
          <path d="M674 144V410M666 144H682M666 410H682" />
          <text
            x="354"
            y="103"
            className="fill-brand-gold stroke-none font-mono text-[8px] tracking-[0.14em]"
          >
            6.20 M
          </text>
          <text
            x="691"
            y="286"
            transform="rotate(90 691 286)"
            className="fill-brand-gold stroke-none font-mono text-[8px] tracking-[0.14em]"
          >
            4.10 M
          </text>
        </g>
        <g className="stroke-none fill-brand-gold font-mono">
          <text x="58" y="72" className="text-[10px] tracking-[0.24em]">
            TERRAZA / DEL PLANO AL VOLUMEN
          </text>
          <text x="58" y="458" className="text-[9px] tracking-[0.18em]">
            MEDIDAS · DISTRIBUCIÓN · ESTRUCTURA · USO
          </text>
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 760 520"
      className={`${sharedSvgClass} ${className}`}
      {...accessibilityProps}
    >
      {!decorative && <title id={`${uid}-title`}>{copy.title}</title>}
      {!decorative && <desc id={`${uid}-description`}>{copy.description}</desc>}
      <defs>
        <linearGradient id={`${uid}-surface`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D8B36A" stopOpacity="0.04" />
          <stop offset="50%" stopColor="#D8B36A" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0C2742" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id={`${uid}-scan`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F2D38D" stopOpacity="0" />
          <stop offset="50%" stopColor="#F2D38D" stopOpacity="0.82" />
          <stop offset="100%" stopColor="#F2D38D" stopOpacity="0" />
        </linearGradient>
        <pattern
          id={`${uid}-maint-grid`}
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M22 0H0V22"
            stroke="currentColor"
            strokeOpacity="0.07"
            strokeWidth="0.6"
          />
        </pattern>
      </defs>
      <rect
        x="36"
        y="32"
        width="688"
        height="448"
        rx="26"
        fill={`url(#${uid}-maint-grid)`}
        strokeOpacity="0.1"
      />
      <g data-maintenance-surface>
        <path
          d="M126 150H634V396H126Z"
          fill={`url(#${uid}-surface)`}
          strokeWidth="1.5"
        />
        <path d="M126 224H634M126 298H634" strokeOpacity="0.13" />
        <path d="M250 150V396M382 150V396M514 150V396" strokeOpacity="0.13" />
      </g>
      <g data-maintenance-damage strokeWidth="2" strokeOpacity="0.72">
        <path d="M252 198L286 224L268 252L308 278L290 322" />
        <path d="M504 176L476 216L500 244L468 286" />
        <path d="M346 330L378 304L410 334" />
        <circle
          cx="286"
          cy="224"
          r="32"
          strokeDasharray="4 8"
          strokeOpacity="0.34"
        />
        <circle
          cx="488"
          cy="234"
          r="42"
          strokeDasharray="4 8"
          strokeOpacity="0.34"
        />
      </g>
      <g data-maintenance-layers opacity="0.08">
        <path
          data-maintenance-layer
          d="M148 176H612V370H148Z"
          fill="#D8B36A"
          fillOpacity="0.08"
        />
        <path
          data-maintenance-layer
          d="M166 194H594V352H166Z"
          fill="#6FB4E1"
          fillOpacity="0.06"
        />
        <path
          data-maintenance-layer
          d="M184 212H576V334H184Z"
          fill="#D8B36A"
          fillOpacity="0.06"
        />
      </g>
      <rect
        data-maintenance-finish
        x="126"
        y="150"
        width="508"
        height="246"
        fill="#D8B36A"
        fillOpacity="0.08"
        stroke="none"
        opacity="0"
      />
      <g data-maintenance-scan>
        <rect
          x="118"
          y="138"
          width="12"
          height="270"
          fill={`url(#${uid}-scan)`}
          stroke="none"
        />
        <path d="M124 138V408" strokeWidth="1.5" />
      </g>
      <g data-maintenance-tool>
        <path d="M206 438H554" strokeOpacity="0.26" />
        <rect
          x="280"
          y="424"
          width="200"
          height="28"
          rx="14"
          fill="#081524"
          strokeWidth="1.3"
        />
        <ellipse
          data-maintenance-bubble
          cx="338"
          cy="438"
          rx="17"
          ry="10"
          fill="#D8B36A"
          fillOpacity="0.42"
        />
        <path d="M370 424V452M390 424V452" strokeOpacity="0.48" />
      </g>
      <g className="stroke-none fill-brand-gold font-mono">
        <text x="58" y="72" className="text-[10px] tracking-[0.24em]">
          MANTENIMIENTO / LECTURA POR CAPAS
        </text>
        <text x="58" y="458" className="text-[9px] tracking-[0.18em]">
          DIAGNÓSTICO · PREPARACIÓN · CORRECCIÓN · ACABADO
        </text>
      </g>
    </svg>
  );
}

export default ServiceMotionScene;
