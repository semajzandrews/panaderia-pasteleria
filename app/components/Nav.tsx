"use client";

import { useEffect, useState } from "react";
import { BIZ } from "../data";
import { abrirCharola } from "../lib/abrir";
import LlamarOEscribir from "./LlamarOEscribir";

const LINKS = [
  { href: "#pan", es: "El Pan" },
  { href: "#carta", es: "La Carta" },
  { href: "#oficio", es: "El Oficio" },
  { href: "#visita", es: "Visita" },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{
        background: solid ? "rgba(244,236,221,0.92)" : "transparent",
        backdropFilter: solid ? "blur(10px) saturate(1.1)" : "none",
        borderBottom: solid ? "1px solid var(--rule)" : "1px solid transparent",
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        {/* Wordmark + wheat mark */}
        <a href="#top" className="group flex items-center gap-2.5" aria-label="El Trigal, inicio">
          <WheatMark
            className="h-6 w-6 shrink-0 transition-transform duration-500 group-hover:rotate-6"
            style={{ color: solid ? "var(--crust)" : "var(--cream)" }}
          />
          <span
            className="font-display text-[1.25rem] leading-none tracking-tight"
            style={{ color: solid ? "var(--crust-2)" : "var(--cream)" }}
          >
            El Trigal
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[0.82rem] uppercase tracking-[0.16em] transition-opacity hover:opacity-60"
              style={{ color: solid ? "var(--crust-2)" : "var(--cream)" }}
            >
              {l.es}
            </a>
          ))}
          {/* Ordering is a button that opens the flow. Calling is its own
              separate action, labelled as a phone call. */}
          <button
            onClick={() => abrirCharola("charola")}
            className="rounded-full px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] transition-transform hover:scale-[1.03]"
            style={{ background: "var(--honey)", color: "var(--crust-3)" }}
          >
            Pedir
          </button>
          {/* Llamar O escribir: el pastel a la medida se encarga mejor por
              mensaje que por telefono, asi que aqui se elige. */}
          <LlamarOEscribir tono={solid ? "linea" : "claro"} etiqueta="Llamar o escribir" />
        </div>

        {/* Mobile: call pill collapses to ~46px icon + menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <LlamarOEscribir variante="icono" alinear="derecha" />
          <button
            aria-label="Abrir menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-[46px] w-[46px] place-items-center rounded-full border"
            style={{
              borderColor: solid ? "var(--rule-2)" : "rgba(251,246,236,0.4)",
              color: solid ? "var(--crust-2)" : "var(--cream)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      {open && (
        <div
          className="md:hidden"
          style={{ background: "var(--crust-2)", color: "var(--cream)" }}
        >
          <div className="mx-auto max-w-6xl px-5 pb-6 pt-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b py-3.5 font-display text-2xl"
                style={{ borderColor: "rgba(251,246,236,0.14)" }}
              >
                {l.es}
              </a>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                abrirCharola("charola");
              }}
              className="mt-5 block w-full rounded-full px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.14em]"
              style={{ background: "var(--honey)", color: "var(--crust-3)" }}
            >
              Pedir para recoger
            </button>
            <LlamarOEscribir
              className="mt-2.5 loe-ancho"
              tono="claro"
              alinear="completo"
              etiqueta={`Llamar o escribir ${BIZ.phoneDisplay}`}
            />
          </div>
        </div>
      )}
    </header>
  );
}

export function WheatMark({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22V8" />
      <path d="M12 8c0-2 1.4-3.4 3-4-.2 2-1 3.4-3 4Z" />
      <path d="M12 8c0-2-1.4-3.4-3-4 .2 2 1 3.4 3 4Z" />
      <path d="M12 13c0-2 1.4-3.4 3-4-.2 2-1 3.4-3 4Z" />
      <path d="M12 13c0-2-1.4-3.4-3-4 .2 2 1 3.4 3 4Z" />
      <path d="M12 18c0-2 1.4-3.4 3-4-.2 2-1 3.4-3 4Z" />
      <path d="M12 18c0-2-1.4-3.4-3-4 .2 2 1 3.4 3 4Z" />
    </svg>
  );
}
