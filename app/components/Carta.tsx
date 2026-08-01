"use client";

/**
 * La carta. Reads app/lib/menu.ts, the same file the order flow reads, so the
 * shelf on the page and the shelf in the charola can never disagree.
 * No prices: the build publishes none and none are invented.
 */

import { SHELVES } from "../lib/menu";
import { IMG } from "../data";
import Reveal from "./Reveal";
import { abrirCharola } from "../lib/abrir";

export default function Carta() {
  return (
    <section id="carta" className="band-flour flour-grain px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_400px]">
        <div>
          <Reveal>
            <span className="text-[0.68rem] uppercase tracking-[0.26em]" style={{ color: "var(--crust)" }}>
              La carta
            </span>
            <h2 className="mt-3 font-display text-[2.6rem] leading-[0.95] sm:text-[3.6rem]">
              Lo que hay en los estantes
            </h2>
            <p className="mt-4 max-w-lg text-[0.98rem] leading-relaxed" style={{ color: "var(--crust)" }}>
              El pan se lleva por pieza y por docena. Los pasteles se hacen por
              encargo. El mostrador confirma el total cuando recoges.
            </p>
          </Reveal>

          {SHELVES.map((s, si) => (
            <Reveal key={s.key} as="section" delay={0.05 + si * 0.05} className="mt-10">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-[2rem] leading-none">{s.es}</h3>
                <span className="text-right text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: "var(--crust)" }}>
                  {s.en}
                </span>
              </div>
              <div className="honey-rule mt-3" />
              <ul>
                {s.items.map((i) => (
                  <li
                    key={i.id}
                    className="flex items-baseline justify-between gap-5 border-b py-3"
                    style={{ borderColor: "var(--rule)" }}
                  >
                    <span className="font-display text-[1.25rem] leading-tight">{i.n}</span>
                    <span className="text-right text-[0.86rem] leading-tight" style={{ color: "var(--crust)" }}>
                      {i.d}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}

          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-3">
              <button
                onClick={() => abrirCharola("charola")}
                className="rounded-full px-7 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em] transition-transform hover:scale-[1.03]"
                style={{ background: "var(--honey)", color: "var(--crust-3)" }}
              >
                Llenar mi charola
              </button>
              <button
                onClick={() => abrirCharola("encargo")}
                className="rounded-full border px-7 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-[rgba(201,138,60,0.12)]"
                style={{ borderColor: "var(--rule-2)", color: "var(--crust-2)" }}
              >
                Encargar un pastel
              </button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.08} className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-[18px]">
            <img
              src={IMG.cakesPastel}
              alt="Pasteles de fiesta decorados con betun en tonos pastel"
              className="h-[320px] w-full object-cover lg:h-[420px]"
            />
          </div>
          <p className="mt-4 font-display text-[1.5rem] leading-tight">
            Pasteles por encargo, con lo que quieras escrito encima
          </p>
          <p className="mt-2 text-[0.92rem] leading-relaxed" style={{ color: "var(--crust)" }}>
            Dinos que pastel, para cuanta gente y para que fecha. El Trigal te llama
            para confirmar la fecha y el precio.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
