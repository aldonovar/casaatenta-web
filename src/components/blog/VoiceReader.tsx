"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Gauge, Pause, Play, RotateCcw, Volume2 } from "lucide-react";

type ReaderStatus = "idle" | "playing" | "paused" | "finished" | "unsupported";

interface VoiceReaderProps {
  chunks: string[];
}

function selectSpanishVoice(voices: SpeechSynthesisVoice[]) {
  const spanishVoices = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith("es"),
  );

  return (
    spanishVoices.find((voice) => /per[uú]|latam|mex/i.test(voice.name)) ||
    spanishVoices[0] ||
    voices[0]
  );
}

export function VoiceReader({ chunks }: VoiceReaderProps) {
  const [status, setStatus] = useState<ReaderStatus>("idle");
  const [rate, setRate] = useState(1);
  const [currentChunk, setCurrentChunk] = useState(0);
  const sessionRef = useRef(0);
  const currentChunkRef = useRef(0);
  const rateRef = useRef(rate);

  const queueFrom = useCallback(
    (startIndex: number, session: number) => {
      if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
        setStatus("unsupported");
        return;
      }

      const voice = selectSpanishVoice(window.speechSynthesis.getVoices());
      chunks.slice(startIndex).forEach((text, offset) => {
        const index = startIndex + offset;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-PE";
        utterance.rate = rateRef.current;
        utterance.pitch = 1;
        utterance.voice = voice;
        utterance.onstart = () => {
          if (sessionRef.current !== session) return;
          currentChunkRef.current = index;
          setCurrentChunk(index);
          setStatus("playing");
        };
        utterance.onend = () => {
          if (sessionRef.current !== session || index !== chunks.length - 1) return;
          setStatus("finished");
          setCurrentChunk(chunks.length - 1);
        };
        utterance.onerror = (event) => {
          if (sessionRef.current !== session || event.error === "canceled") return;
          setStatus("idle");
        };
        window.speechSynthesis.speak(utterance);
      });
      setStatus("playing");
    },
    [chunks],
  );

  const stop = useCallback(
    (nextStatus: ReaderStatus = "idle") => {
      sessionRef.current += 1;
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      currentChunkRef.current = 0;
      setCurrentChunk(0);
      setStatus(nextStatus);
    },
    [],
  );

  useEffect(() => {
    return () => {
      sessionRef.current += 1;
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const togglePlayback = () => {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setStatus("unsupported");
      return;
    }

    if (status === "playing") {
      window.speechSynthesis.pause();
      setStatus("paused");
      return;
    }

    if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
      return;
    }

    window.speechSynthesis.cancel();
    const session = sessionRef.current + 1;
    sessionRef.current = session;
    queueFrom(0, session);
  };

  const updateRate = (nextRate: number) => {
    rateRef.current = nextRate;
    setRate(nextRate);

    if (status === "playing" || status === "paused") {
      const index = currentChunkRef.current;
      window.speechSynthesis.cancel();
      const session = sessionRef.current + 1;
      sessionRef.current = session;
      queueFrom(index, session);
    }
  };

  const progress = chunks.length
    ? Math.round(((currentChunk + (status === "finished" ? 1 : 0)) / chunks.length) * 100)
    : 0;
  const playing = status === "playing";

  return (
    <div className="rounded-xl border border-ca-border bg-ca-bg-card/70 p-5" aria-label="Lector del artículo">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-brand-gold/35 bg-brand-gold/10 text-brand-gold">
            <Volume2 size={17} aria-hidden="true" />
          </span>
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-[.2em] text-brand-gold">
              Escuchar artículo
            </span>
            <span className="mt-1 block text-xs text-ca-text-secondary" aria-live="polite">
              {status === "playing" && "Reproduciendo"}
              {status === "paused" && "Lectura en pausa"}
              {status === "finished" && "Lectura finalizada"}
              {status === "unsupported" && "Lectura por voz no disponible en este navegador"}
              {status === "idle" && "Narración disponible en español"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex h-10 items-center gap-2 rounded-full border border-ca-border px-3 font-mono text-[9px] uppercase tracking-[.12em] text-ca-text-secondary">
            <Gauge size={13} aria-hidden="true" />
            <span className="sr-only">Velocidad de lectura</span>
            <select
              value={rate}
              onChange={(event) => updateRate(Number(event.target.value))}
              className="bg-transparent text-ca-text outline-none"
              aria-label="Velocidad de lectura"
            >
              <option value="0.8">0.8×</option>
              <option value="1">1×</option>
              <option value="1.2">1.2×</option>
              <option value="1.4">1.4×</option>
            </select>
          </label>
          <button
            type="button"
            onClick={togglePlayback}
            className="inline-flex h-10 min-w-28 items-center justify-center gap-2 rounded-full bg-brand-gold px-4 font-mono text-[9px] font-semibold uppercase tracking-[.16em] text-[#07111d] transition hover:bg-brand-gold-light disabled:cursor-wait disabled:opacity-60"
            aria-label={playing ? "Pausar lectura" : "Reproducir lectura"}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? "Pausar" : status === "paused" ? "Continuar" : "Escuchar"}
          </button>
          <button
            type="button"
            onClick={() => stop("idle")}
            disabled={status === "idle"}
            className="grid h-10 w-10 place-items-center rounded-full border border-ca-border text-ca-text-secondary transition hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Reiniciar lectura"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-ca-border" aria-hidden="true">
        <div
          className="h-full rounded-full bg-brand-gold transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
