"use client";

import Image from "next/image";
import { type KeyboardEvent, useRef, useState } from "react";
import { BrandText } from "./BrandText";

const modes = [
  {
    id: "llegada",
    label: "Llegada",
    title: "El acceso prepara la primera escena.",
    text: "La apertura autorizada puede activar una luz de cortesía y encender solo los ambientes definidos.",
    trigger: "Acceso autorizado",
    action: "Luz de ingreso",
    response: "Escena de llegada",
    dependency: "Cerradura, relé y red compatibles",
    image: "/media/cases/fachada-acceso/after.png",
    alt: "Propuesta visual de acceso residencial con iluminación coordinada.",
  },
  {
    id: "presencia",
    label: "Presencia",
    title: "La luz responde al uso real del ambiente.",
    text: "Un sensor puede encender, regular o apagar por horario y permanencia, según la función de cada zona.",
    trigger: "Presencia detectada",
    action: "Regulación por zona",
    response: "Luz funcional",
    dependency: "Sensor, driver y circuito compatibles",
    image: "/media/cases/cocina-renovada/after.png",
    alt: "Propuesta visual de iluminación residencial por presencia.",
  },
  {
    id: "noche",
    label: "Noche",
    title: "Una orden agrupa varias acciones.",
    text: "La escena nocturna puede apagar zonas, mantener recorridos mínimos y verificar accesos definidos.",
    trigger: "Horario o control",
    action: "Apagado selectivo",
    response: "Escena nocturna",
    dependency: "Controlador y dispositivos configurados",
    image: "/media/cinematic-walk/luz-03.png",
    alt: "Propuesta visual de escena nocturna con iluminación cálida.",
  },
  {
    id: "exterior",
    label: "Exterior",
    title: "Cubierta y luz pueden coordinarse.",
    text: "En una terraza motorizada, apertura e iluminación pueden operar desde controles separados o una escena compatible.",
    trigger: "Control disponible",
    action: "Motor e iluminación",
    response: "Configuración exterior",
    dependency: "Motor, protecciones y plataforma compatibles",
    image: "/media/cinematic-walk/terraza-02.png",
    alt: "Propuesta visual de terraza con cubierta e iluminación.",
  },
] as const;

type SceneId = (typeof modes)[number]["id"];

export function SceneController() {
  const [activeId, setActiveId] = useState<SceneId>("llegada");
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const active = modes.find((mode) => mode.id === activeId) ?? modes[0];

  const selectTab = (index: number, moveFocus = false) => {
    const mode = modes[index];
    if (!mode) return;

    setActiveId(mode.id);
    if (moveFocus) {
      requestAnimationFrame(() => tabsRef.current[index]?.focus());
    }
  };

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % modes.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + modes.length) % modes.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = modes.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    selectTab(nextIndex, true);
  };

  return (
    <section
      id="scene-controller"
      aria-labelledby="scene-controller-title"
      className="relative overflow-hidden border-t border-ca-border bg-ca-bg-deep px-6 py-24 text-ca-text md:py-32 lg:px-10"
    >
      <div className="architectural-grid absolute inset-0 opacity-[.04]" />
      <div className="relative mx-auto max-w-[1440px]">
        <div className="mb-14 grid gap-8 border-b border-ca-border pb-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <span className="font-mono text-[10px] uppercase tracking-[.28em] text-brand-gold">
              Automatización por escenas
            </span>
            <h2
              id="scene-controller-title"
              className="mt-5 font-display text-4xl font-light uppercase leading-[1.02] md:text-6xl"
            >
              <BrandText>Condición, acción y respuesta.</BrandText>
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-ca-text-secondary lg:col-span-4">
            Cada escena depende de dispositivos compatibles, alimentación, red
            y una lógica definida antes de configurar.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="relative min-h-[360px] overflow-hidden rounded-xl border border-ca-border bg-ca-bg-surface sm:min-h-[430px] lg:col-span-7">
            <Image
              key={active.image}
              src={active.image}
              alt={active.alt}
              fill
              sizes="(max-width:1024px) 100vw,58vw"
              className="object-cover opacity-60 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep via-ca-bg-deep/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-9">
              <span className="font-mono text-[9px] uppercase tracking-[.2em] text-brand-gold">
                Escena / {active.label}
              </span>
              <h3 className="mt-4 max-w-2xl font-display text-2xl font-light uppercase md:text-4xl">
                <BrandText>{active.title}</BrandText>
              </h3>
            </div>
          </div>

          <div className="glass-panel flex flex-col p-6 md:p-8 lg:col-span-5">
            <div
              role="tablist"
              aria-label="Escenas de automatización"
              className="grid grid-cols-2 gap-3"
            >
              {modes.map((mode, index) => {
                const selected = activeId === mode.id;

                return (
                  <button
                    key={mode.id}
                    ref={(node) => {
                      tabsRef.current[index] = node;
                    }}
                    id={`scene-tab-${mode.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`scene-panel-${mode.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectTab(index)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    className={`min-h-12 border px-4 text-left font-mono text-[9px] uppercase tracking-[.16em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ca-bg-deep ${
                      selected
                        ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                        : "border-ca-border text-ca-text-secondary hover:border-ca-text/40 hover:text-ca-text"
                    }`}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>

            {modes.map((mode) => (
              <div
                key={mode.id}
                id={`scene-panel-${mode.id}`}
                role="tabpanel"
                aria-labelledby={`scene-tab-${mode.id}`}
                hidden={activeId !== mode.id}
                className="focus:outline-none"
              >
                <p className="mt-7 text-sm leading-7 text-ca-text-secondary">
                  {mode.text}
                </p>
                <dl className="mt-7 space-y-4 border-t border-ca-border pt-6 text-xs">
                  <div className="flex justify-between gap-5">
                    <dt className="text-ca-text-secondary">Condición</dt>
                    <dd className="text-right text-ca-text">{mode.trigger}</dd>
                  </div>
                  <div className="flex justify-between gap-5">
                    <dt className="text-ca-text-secondary">Acción</dt>
                    <dd className="text-right text-ca-text">{mode.action}</dd>
                  </div>
                  <div className="flex justify-between gap-5">
                    <dt className="text-ca-text-secondary">Respuesta</dt>
                    <dd className="text-right text-ca-text">{mode.response}</dd>
                  </div>
                  <div className="flex justify-between gap-5 border-t border-ca-border pt-4">
                    <dt className="text-brand-gold">Requiere</dt>
                    <dd className="max-w-[62%] text-right text-ca-text-secondary">
                      {mode.dependency}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SceneController;
