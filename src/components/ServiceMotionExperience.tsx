"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrandText } from "./BrandText";
import {
  isServiceMotionSlug,
  ServiceMotionScene,
  type ServiceMotionSlug,
} from "./service-motion/ServiceMotionScene";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type StoryStage = {
  label: string;
  title: string;
  description: string;
};

type MotionStory = {
  eyebrow: string;
  title: string;
  intro: string;
  note?: string;
  stages: [StoryStage, StoryStage, StoryStage, StoryStage];
};

type ServiceMotionExperienceProps = {
  slug: string;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const stories: Record<ServiceMotionSlug, MotionStory> = {
  "techos-sol-y-sombra": {
    eyebrow: "Subservicio interactivo / sistema alveolar",
    title: "La cubierta gira, filtra la luz y se desplaza.",
    intro:
      "Recorre el sistema para entender cómo cambia la sombra cuando los listones orientables rotan y se agrupan hacia un lateral.",
    note: "Visualización conceptual. Las lamas orientables son una solución especial sujeta a evaluación de estructura, mecanismo y presupuesto.",
    stages: [
      {
        label: "01 / Cubierta",
        title: "Plano cerrado",
        description:
          "Los listones forman una superficie continua y controlan la exposición directa.",
      },
      {
        label: "02 / Giro",
        title: "Ángulo graduable",
        description:
          "Cada lama rota sobre su eje para abrir el paso de luz y ventilación.",
      },
      {
        label: "03 / Luz",
        title: "Sombra regulada",
        description:
          "El ángulo modifica la franja de luz sin liberar todavía toda la cubierta.",
      },
      {
        label: "04 / Recorrido",
        title: "Apertura lateral",
        description:
          "Los módulos se desplazan y agrupan a un costado para liberar el vano.",
      },
    ],
  },
  "iluminacion-inteligente": {
    eyebrow: "Motion study / iluminación y escenas",
    title: "Una misma arquitectura, cuatro estados de luz.",
    intro:
      "El recorrido combina intensidad, temperatura de color, encendidos por zona y una escena final coordinada.",
    stages: [
      {
        label: "01 / Función",
        title: "Puntos definidos",
        description:
          "Cada haz responde a una superficie de trabajo, recorrido o zona de permanencia.",
      },
      {
        label: "02 / Nivel",
        title: "Intensidad regulada",
        description:
          "La cantidad de luz cambia sin encender innecesariamente todo el espacio.",
      },
      {
        label: "03 / Espectro",
        title: "Temperatura de color",
        description:
          "La escena viaja de una luz cálida de descanso a una luz más neutra y funcional.",
      },
      {
        label: "04 / Escena",
        title: "Zonas coordinadas",
        description:
          "Los puntos trabajan juntos como una escena de uso, circulación o seguridad.",
      },
    ],
  },
  "smart-homes": {
    eyebrow: "Motion study / domótica aplicada",
    title: "La automatización nace en una red estable.",
    intro:
      "La casa se construye como un mapa de infraestructura, nodos, rutinas y control antes de sumar automatizaciones.",
    stages: [
      {
        label: "01 / Base",
        title: "Infraestructura",
        description:
          "Alimentación, red local y compatibilidad sostienen el sistema completo.",
      },
      {
        label: "02 / Nodos",
        title: "Sensores y actuadores",
        description:
          "Iluminación, clima, acceso y presencia se integran como funciones concretas.",
      },
      {
        label: "03 / Rutina",
        title: "Datos en movimiento",
        description:
          "Las señales viajan entre nodos para ejecutar escenas y respuestas coordinadas.",
      },
      {
        label: "04 / Control",
        title: "Local y remoto",
        description:
          "La interfaz depende de la plataforma y de los equipos elegidos para el proyecto.",
      },
    ],
  },
  "diseno-terrazas": {
    eyebrow: "Motion study / diseño de intervención",
    title: "El plano gana altura antes de fabricar.",
    intro:
      "Medidas, circulación y apoyos se convierten progresivamente en estructura, volumen y zonas de uso.",
    stages: [
      {
        label: "01 / Medición",
        title: "Levantamiento",
        description:
          "El perímetro y las condiciones existentes fijan la base de la propuesta.",
      },
      {
        label: "02 / Planta",
        title: "Distribución",
        description:
          "Circulación, mesa, parrilla y áreas técnicas encuentran una relación clara.",
      },
      {
        label: "03 / Volumen",
        title: "Estructura y sombra",
        description:
          "La planta se eleva para revisar apoyos, alturas y relación con la vivienda.",
      },
      {
        label: "04 / Uso",
        title: "Escena habitable",
        description:
          "Mobiliario, recorridos y permanencia validan las decisiones antes de ejecutar.",
      },
    ],
  },
  "mantenimiento-general": {
    eyebrow: "Motion study / mantenimiento y acabados",
    title: "Corregir empieza por leer la superficie.",
    intro:
      "El escaneo separa diagnóstico, preparación, reparación y control final para mostrar qué cambia en cada capa.",
    stages: [
      {
        label: "01 / Estado",
        title: "Diagnóstico",
        description:
          "Fisuras, corrosión, desprendimientos y deformaciones se registran antes de intervenir.",
      },
      {
        label: "02 / Capas",
        title: "Preparación",
        description:
          "Cada material exige limpieza, retiro o protección compatible con su condición.",
      },
      {
        label: "03 / Corrección",
        title: "Reparación puntual",
        description:
          "La intervención resuelve causa, nivel, unión y continuidad de la superficie.",
      },
      {
        label: "04 / Control",
        title: "Acabado revisado",
        description:
          "Alineación, uniformidad y limpieza se verifican antes de cerrar el trabajo.",
      },
    ],
  },
};

function prepareDrawPaths(root: HTMLElement) {
  root.querySelectorAll<SVGGeometryElement>("[data-draw]").forEach((path) => {
    const length =
      typeof path.getTotalLength === "function" ? path.getTotalLength() : 0;
    if (!length) return;
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  });
}

function createRoofTimeline(root: HTMLElement) {
  const slats = Array.from(root.querySelectorAll("[data-roof-slat]"));
  const drawPaths = Array.from(root.querySelectorAll("[data-draw]"));
  const slatCount = slats.length;
  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: "none" },
  });

  if (drawPaths.length) {
    timeline.to(
      drawPaths,
      { strokeDashoffset: 0, stagger: 0.02, duration: 0.18 },
      0,
    );
  }

  return timeline
    .to("[data-roof-sun]", { scale: 1.12, opacity: 0.9, duration: 0.3 }, 0.06)
    .to("[data-roof-rays]", { opacity: 0.9, duration: 0.3 }, 0.14)
    .to(
      slats,
      { scaleY: 0.2, rotation: -7, stagger: 0.018, duration: 0.34 },
      0.2,
    )
    .to("[data-roof-shadow]", { opacity: 0.18, duration: 0.36 }, 0.2)
    .to(
      slats,
      {
        x: (index) => (slatCount - 1 - index) * 34,
        stagger: 0.012,
        duration: 0.38,
        ease: "power2.inOut",
      },
      0.57,
    )
    .to(
      "[data-roof-carriage]",
      { x: 274, duration: 0.38, ease: "power2.inOut" },
      0.57,
    )
    .to("[data-roof-measure]", { opacity: 0.68, duration: 0.14 }, 0.86);
}

function createLightingTimeline() {
  return gsap
    .timeline({ paused: true, defaults: { ease: "none" } })
    .to("[data-draw]", { strokeDashoffset: 0, duration: 0.22 }, 0)
    .to(
      "[data-light-point]",
      {
        opacity: 1,
        scale: 1.08,
        transformOrigin: "50% 50%",
        stagger: 0.045,
        duration: 0.24,
      },
      0.08,
    )
    .to("[data-light-beams]", { opacity: 0.8, duration: 0.34 }, 0.14)
    .to(
      "[data-light-warm]",
      {
        opacity: 0.88,
        scale: 1.14,
        transformOrigin: "50% 50%",
        duration: 0.38,
      },
      0.2,
    )
    .to(
      "[data-light-cool]",
      { opacity: 0.1, scale: 0.88, transformOrigin: "50% 50%", duration: 0.38 },
      0.2,
    )
    .to("[data-light-knob]", { x: 340, duration: 0.54 }, 0.38)
    .to("[data-light-warm]", { opacity: 0.16, duration: 0.34 }, 0.62)
    .to(
      "[data-light-cool]",
      { opacity: 0.86, scale: 1.12, duration: 0.34 },
      0.62,
    )
    .to(
      "[data-light-orbit]",
      { rotation: 190, transformOrigin: "50% 50%", duration: 0.78 },
      0.18,
    );
}

function createSmartHomeTimeline(root: HTMLElement) {
  const nodes = Array.from(root.querySelectorAll("[data-smart-node]"));
  const packets = Array.from(root.querySelectorAll("[data-smart-packet]"));
  const destinations = [
    { x: -152, y: -24 },
    { x: 152, y: -24 },
    { x: -112, y: 106 },
    { x: 112, y: 106 },
  ];
  const timeline = gsap
    .timeline({ paused: true, defaults: { ease: "none" } })
    .fromTo(
      "[data-smart-shell]",
      { opacity: 0.18 },
      { opacity: 0.88, duration: 0.22 },
      0,
    )
    .fromTo(
      nodes,
      { opacity: 0.18, scale: 0.7 },
      { opacity: 1, scale: 1, stagger: 0.035, duration: 0.28 },
      0.16,
    )
    .fromTo(
      "[data-smart-links]",
      { strokeDashoffset: 92, opacity: 0.14 },
      { strokeDashoffset: 0, opacity: 0.72, duration: 0.34 },
      0.32,
    )
    .to("[data-smart-rooms]", { opacity: 0.72, duration: 0.3 }, 0.52);

  packets.forEach((packet, index) => {
    timeline.fromTo(
      packet,
      { x: 0, y: 0, opacity: 0 },
      { ...destinations[index], opacity: 1, duration: 0.34 },
      0.6 + index * 0.025,
    );
  });
  timeline.to(
    nodes,
    { scale: 1.12, stagger: { each: 0.025, from: "center" }, duration: 0.22 },
    0.78,
  );
  return timeline;
}

function createTerraceTimeline() {
  return gsap
    .timeline({ paused: true, defaults: { ease: "none" } })
    .to(
      "[data-draw]",
      { strokeDashoffset: 0, stagger: 0.018, duration: 0.28 },
      0,
    )
    .to("[data-measure]", { opacity: 0.78, duration: 0.22 }, 0.12)
    .to("[data-terrace-circulation]", { opacity: 0.7, duration: 0.28 }, 0.25)
    .to("[data-terrace-plan]", { opacity: 0.28, y: -20, duration: 0.34 }, 0.42)
    .fromTo(
      "[data-terrace-volume]",
      { opacity: 0.02, y: 34 },
      { opacity: 0.92, y: 0, duration: 0.38 },
      0.42,
    )
    .fromTo(
      "[data-terrace-furniture]",
      { opacity: 0.02, y: 24 },
      { opacity: 0.82, y: 0, duration: 0.28 },
      0.7,
    );
}

function createMaintenanceTimeline() {
  return gsap
    .timeline({ paused: true, defaults: { ease: "none" } })
    .to("[data-maintenance-scan]", { x: 500, duration: 0.34 }, 0)
    .to("[data-maintenance-damage]", { opacity: 1, duration: 0.2 }, 0.05)
    .to("[data-maintenance-layers]", { opacity: 0.7, duration: 0.22 }, 0.28)
    .to(
      "[data-maintenance-layer]",
      {
        x: (index) => (index - 1) * 30,
        y: (index) => (index - 1) * -20,
        stagger: 0.025,
        duration: 0.3,
      },
      0.3,
    )
    .to("[data-maintenance-damage]", { opacity: 0.08, duration: 0.26 }, 0.54)
    .to(
      "[data-maintenance-layer]",
      { x: 0, y: 0, stagger: 0.025, duration: 0.24 },
      0.62,
    )
    .to("[data-maintenance-finish]", { opacity: 0.74, duration: 0.26 }, 0.72)
    .to(
      "[data-maintenance-bubble]",
      { x: 44, duration: 0.68, ease: "power2.out" },
      0.22,
    );
}

function createStoryTimeline(slug: ServiceMotionSlug, root: HTMLElement) {
  prepareDrawPaths(root);
  const factories: Record<ServiceMotionSlug, () => gsap.core.Timeline> = {
    "techos-sol-y-sombra": () => createRoofTimeline(root),
    "iluminacion-inteligente": createLightingTimeline,
    "smart-homes": () => createSmartHomeTimeline(root),
    "diseno-terrazas": createTerraceTimeline,
    "mantenimiento-general": createMaintenanceTimeline,
  };
  return factories[slug]();
}

export function ServiceMotionExperience({
  slug,
}: ServiceMotionExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLOutputElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const reducedMotionRef = useRef(false);
  const activeStageRef = useRef(0);
  const [activeStage, setActiveStage] = useState(0);

  const resolvedSlug = isServiceMotionSlug(slug) ? slug : null;
  const story = resolvedSlug ? stories[resolvedSlug] : null;

  const syncProgress = useCallback((progress: number) => {
    const clamped = gsap.utils.clamp(0, 1, progress);
    if (rangeRef.current)
      rangeRef.current.value = String(Math.round(clamped * 100));
    if (outputRef.current)
      outputRef.current.value = `${Math.round(clamped * 100)}%`;
    rootRef.current?.style.setProperty(
      "--service-motion-progress",
      `${clamped * 100}%`,
    );

    const nextStage = Math.min(3, Math.floor(clamped * 4));
    if (nextStage !== activeStageRef.current) {
      activeStageRef.current = nextStage;
      setActiveStage(nextStage);
    }
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !resolvedSlug) return;

    reducedMotionRef.current = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const context = gsap.context(() => {
      const timeline = createStoryTimeline(resolvedSlug, root);
      timelineRef.current = timeline;

      if (reducedMotionRef.current) {
        timeline.progress(0.5);
        syncProgress(0.5);
        return;
      }

      const driver = gsap.to(timeline, {
        progress: 1,
        duration: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => syncProgress(self.progress),
        },
      });
      triggerRef.current = driver.scrollTrigger ?? null;
      syncProgress(0);
    }, root);

    return () => {
      triggerRef.current = null;
      timelineRef.current = null;
      context.revert();
    };
  }, [resolvedSlug, syncProgress]);

  if (!resolvedSlug || !story) return null;

  const seekTo = (progress: number, smooth = false) => {
    const clamped = gsap.utils.clamp(0, 1, progress);
    timelineRef.current?.progress(clamped);
    syncProgress(clamped);

    const trigger = triggerRef.current;
    if (!trigger || reducedMotionRef.current) return;
    const destination = trigger.start + (trigger.end - trigger.start) * clamped;
    window.scrollTo({
      top: destination,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  return (
    <section
      ref={rootRef}
      data-service-motion-story={resolvedSlug}
      data-motion-stage={activeStage + 1}
      aria-labelledby={`motion-story-${resolvedSlug}`}
      className="relative min-h-[220vh] border-y border-ca-border bg-ca-bg-deep text-ca-text motion-reduce:min-h-0"
    >
      <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden px-6 py-12 motion-reduce:relative motion-reduce:min-h-0 lg:px-10 lg:py-16 [@media(max-height:760px)]:py-8">
        <div className="architectural-grid pointer-events-none absolute inset-0 opacity-[0.055]" />
        <div className="pointer-events-none absolute left-[8%] top-[12%] h-64 w-64 rounded-full bg-brand-gold/[0.045] blur-[110px]" />
        <div className="relative mx-auto grid w-full max-w-[1440px] gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-5">
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-brand-gold">
              {story.eyebrow}
            </span>
            <h2
              id={`motion-story-${resolvedSlug}`}
              className="mt-5 max-w-xl font-display text-4xl font-light uppercase leading-[1.02] md:text-5xl"
            >
              <BrandText>{story.title}</BrandText>
            </h2>
            <p className="mt-6 max-w-xl text-sm font-light leading-7 text-ca-text-secondary md:text-base">
              {story.intro}
            </p>

            <ol
              className="mt-7 grid gap-2 sm:grid-cols-2"
              aria-label="Etapas de la experiencia"
            >
              {story.stages.map((stage, index) => {
                const isActive = activeStage === index;
                return (
                  <li key={stage.label}>
                    <button
                      type="button"
                      aria-current={isActive ? "step" : undefined}
                      onClick={() =>
                        seekTo(index / (story.stages.length - 1), true)
                      }
                      className={`group/stage grid w-full grid-cols-[auto_1fr] gap-4 border-l px-4 py-3 text-left transition duration-300 ${
                        isActive
                          ? "border-brand-gold bg-brand-gold/[0.07]"
                          : "border-ca-border text-ca-text-secondary hover:border-brand-gold/45 hover:bg-white/[0.025]"
                      }`}
                    >
                      <span
                        className={`mt-1 h-1.5 w-1.5 rounded-full ${isActive ? "bg-brand-gold" : "bg-ca-text/20"}`}
                      />
                      <span>
                        <span className="block font-mono text-[8px] uppercase tracking-[0.2em] text-brand-gold/80">
                          {stage.label}
                        </span>
                        <span className="mt-1 block text-xs uppercase tracking-[0.08em] text-ca-text">
                          {stage.title}
                        </span>
                        <span
                          className={`mt-1.5 block text-xs leading-5 transition ${isActive ? "max-h-20 opacity-100" : "max-h-0 overflow-hidden opacity-0 lg:group-hover/stage:max-h-20 lg:group-hover/stage:opacity-80"}`}
                        >
                          {stage.description}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="lg:col-span-7">
            <div
              id={`motion-canvas-${resolvedSlug}`}
              className="relative overflow-hidden rounded-[2rem] border border-white/[0.1] bg-[radial-gradient(circle_at_50%_35%,rgba(216,179,106,0.1),transparent_58%),linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.006))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-60px_140px_rgba(0,0,0,0.32),0_40px_120px_rgba(0,0,0,0.22)] sm:p-6"
            >
              <div className="absolute left-5 top-5 z-10 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-brand-gold/80">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-gold motion-reduce:animate-none" />
                SVG / 2D—3D / Scroll linked
              </div>
              <div className="h-[clamp(300px,58svh,520px)] w-full">
                <ServiceMotionScene slug={resolvedSlug} />
              </div>
              <div className="absolute inset-x-5 bottom-5 h-px bg-white/10">
                <div
                  className="h-full bg-brand-gold shadow-[0_0_14px_rgba(216,179,106,0.5)]"
                  style={{ width: "var(--service-motion-progress, 0%)" }}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <label
                className="grid gap-2"
                htmlFor={`motion-range-${resolvedSlug}`}
              >
                <span className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-ca-text-secondary">
                  <span>Desliza el sistema</span>
                  <output
                    ref={outputRef}
                    htmlFor={`motion-range-${resolvedSlug}`}
                  >
                    0%
                  </output>
                </span>
                <input
                  ref={rangeRef}
                  id={`motion-range-${resolvedSlug}`}
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue="0"
                  aria-controls={`motion-canvas-${resolvedSlug}`}
                  aria-label={`Recorrido interactivo: ${story.title}`}
                  onChange={(event) =>
                    seekTo(Number(event.currentTarget.value) / 100)
                  }
                  className="h-6 w-full cursor-ew-resize accent-[#D8B36A]"
                />
              </label>
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-ca-text-secondary/70">
                Scroll ↕ / control ↔
              </span>
            </div>

            {story.note ? (
              <p className="mt-4 border-l border-brand-gold/35 pl-4 text-[11px] leading-5 text-ca-text-secondary/80">
                {story.note}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceMotionExperience;
