"use client";

import { BIZ, IMG } from "../data";
import { WheatMark } from "./Nav";
import { abrirCharola } from "../lib/abrir";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      style={{ background: "var(--crust-3)" }}
    >
      {/* Photo, warm-graded, behind the ovenlight */}
      <img
        src={IMG.heroTrays}
        alt="Charolas de conchas y pan dulce recien horneado en El Trigal"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0.82 }}
      />
      {/* Espresso vignette so type reads */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(44,30,20,0.78) 0%, rgba(44,30,20,0.30) 38%, rgba(44,30,20,0.55) 70%, rgba(44,30,20,0.92) 100%)",
        }}
      />

      {/* SIGNATURE — el horno encendido: rising ovenlight heat-haze */}
      <div className="heat-haze" aria-hidden />
      <div className="heat-wisp" style={{ left: "12%", animationDelay: "0s" }} aria-hidden />
      <div className="heat-wisp" style={{ left: "40%", height: "82%", animationDelay: "2.4s" }} aria-hidden />
      <div className="heat-wisp" style={{ left: "68%", animationDelay: "4.1s" }} aria-hidden />
      <div className="heat-wisp" style={{ left: "88%", height: "60%", animationDelay: "1.2s" }} aria-hidden />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-5 pb-14 pt-28 sm:px-8 sm:pb-20">
        <div
          className="mb-5 flex items-center gap-2.5 text-[0.72rem] uppercase tracking-[0.26em]"
          style={{ color: "var(--honey-2)", animation: "soft-rise 0.8s ease-out both" }}
        >
          <WheatMark className="h-4 w-4" />
          Panaderia &amp; Pasteleria · City of Orange, NJ
        </div>

        <h1
          className="font-display leading-[0.92]"
          style={{ animation: "soft-rise 0.9s ease-out 0.05s both" }}
        >
          <span className="block text-[15vw] sm:text-[10rem] lg:text-[12rem]">
            <span className="glaze-text">El Trigal</span>
          </span>
          <span
            className="mt-1 block text-[6.4vw] font-normal italic sm:text-[2.6rem] lg:text-[3rem]"
            style={{ color: "var(--cream)", fontWeight: 400 }}
          >
            pan recien horneado desde las 6 de la manana
          </span>
        </h1>

        <p
          className="mt-6 max-w-xl text-[1.02rem] leading-relaxed"
          style={{ color: "rgba(251,246,236,0.86)", animation: "soft-rise 1s ease-out 0.12s both" }}
        >
          Conchas, pan dulce, bolillo y pasteles para toda ocasion, hechos a mano
          cada manana en el corazon de Orange. Fresh bread and Mexican pastries,
          baked daily.
        </p>

        <div
          className="mt-9 flex flex-wrap items-center gap-3.5"
          style={{ animation: "soft-rise 1.05s ease-out 0.2s both" }}
        >
          {/* Both of these open the flow. The phone stands on its own below,
              labelled as a phone call, so nothing that says "order" dials. */}
          <button
            onClick={() => abrirCharola("charola")}
            className="rounded-full px-7 py-3.5 text-[0.82rem] font-semibold uppercase tracking-[0.14em] transition-transform hover:scale-[1.03]"
            style={{ background: "var(--honey)", color: "var(--crust-3)" }}
          >
            Llenar mi charola
          </button>
          <button
            onClick={() => abrirCharola("encargo")}
            className="rounded-full border px-7 py-3.5 text-[0.82rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-[rgba(251,246,236,0.08)]"
            style={{ borderColor: "rgba(251,246,236,0.4)", color: "var(--cream)" }}
          >
            Encargar un pastel
          </button>
          <a
            href="#carta"
            className="text-[0.82rem] uppercase tracking-[0.14em] underline-offset-4 hover:underline"
            style={{ color: "rgba(251,246,236,0.8)" }}
          >
            Ver la carta
          </a>
          <span
            className="flex items-center gap-2 text-[0.82rem]"
            style={{ color: "rgba(251,246,236,0.78)" }}
          >
            <Stars />
            <span className="tabnum">{BIZ.rating.toFixed(1)}</span>
            <span style={{ color: "rgba(251,246,236,0.5)" }}>· {BIZ.reviews} resenas</span>
          </span>
        </div>
      </div>
    </section>
  );
}

function Stars() {
  return (
    <span className="inline-flex" style={{ color: "var(--honey-2)" }} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.9 6.26L21.5 9.27l-4.75 4.64L17.8 21 12 17.27 6.2 21l1.05-7.09L2.5 9.27l6.6-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}
