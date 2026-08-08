"use client";

import { useEffect, useState } from "react";
import { BIZ, IMG } from "../data";
import Reveal from "./Reveal";
import { abrirCharola } from "../lib/abrir";
import { WheatMark } from "./Nav";
import LlamarOEscribir from "./LlamarOEscribir";

export default function Visita() {
  /** read after mount only, so the server and the client agree on the day */
  const [indiceHoy, setIndiceHoy] = useState(-1);
  useEffect(() => {
    const d = new Date().getDay();
    /** BIZ.hours starts on Lunes; getDay starts on Domingo */
    setIndiceHoy(d === 0 ? 6 : d - 1);
  }, []);

  return (
    <section id="visita" className="band-flour flour-grain px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[0.68rem] uppercase tracking-[0.26em]" style={{ color: "var(--crust)" }}>
            Visita
          </span>
          <h2 className="mt-3 font-display text-[2.6rem] leading-[0.95] sm:text-[3.6rem]">
            23 S Essex Ave, en el corazon de Orange
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <div className="overflow-hidden rounded-[18px]">
              <iframe
                src={BIZ.mapsEmbed}
                title="Mapa de Panaderia y Pasteleria El Trigal"
                className="h-[300px] w-full border-0 sm:h-[380px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => abrirCharola("charola")}
                className="rounded-full px-6 py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.14em] transition-transform hover:scale-[1.03]"
                style={{ background: "var(--honey)", color: "var(--crust-3)" }}
              >
                Pedir para recoger
              </button>
              {/* Aqui sobra espacio, asi que las dos puertas quedan a la vista.
                  El mensaje llega escrito para el pedido de fiesta, que es lo
                  que nadie quiere dictar por telefono. */}
              <LlamarOEscribir variante="fila" recado="evento" />
              <a
                href={BIZ.mapsUri}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border px-6 py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.14em]"
                style={{ borderColor: "var(--rule-2)", color: "var(--crust-2)" }}
              >
                Como llegar
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h3 className="font-display text-[1.6rem] leading-none">Horario</h3>
            <div className="honey-rule mt-3" />
            <ul>
              {BIZ.hours.map((h, i) => (
                <li
                  key={h.d}
                  className="flex items-baseline justify-between gap-4 border-b py-2.5"
                  style={{
                    borderColor: "var(--rule)",
                    fontWeight: i === indiceHoy ? 600 : 400,
                    color: i === indiceHoy ? "var(--crust-3)" : "var(--crust-2)",
                  }}
                >
                  <span className="text-[0.98rem]">{h.d}</span>
                  <span className="tabnum text-[0.92rem]">{h.h}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 overflow-hidden rounded-[16px]">
              <img
                src={IMG.interior}
                alt="Interior calido de la panaderia con cajas de pan y luz de trigo"
                className="h-[220px] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>

      <footer className="mx-auto mt-20 max-w-6xl">
        <div className="honey-rule" />
        <div className="flex flex-col gap-4 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2.5">
            <WheatMark className="h-5 w-5" style={{ color: "var(--crust)" }} />
            <span className="font-display text-[1.2rem]">{BIZ.name}</span>
          </span>
          <span className="text-[0.85rem]" style={{ color: "var(--crust)" }}>
            {BIZ.address} · {BIZ.cityLine}
          </span>
          <a
            href="https://bysemaj.com"
            target="_blank"
            rel="noreferrer"
            className="text-[0.78rem] uppercase tracking-[0.16em] transition-opacity hover:opacity-60"
            style={{ color: "var(--crust)" }}
          >
            built bysemaj.com
          </a>
        </div>
      </footer>
    </section>
  );
}
