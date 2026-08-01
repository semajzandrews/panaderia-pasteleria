import { BIZ, IMG } from "../data";
import Reveal from "./Reveal";

export default function Oficio() {
  return (
    <section id="oficio" className="band-dark px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="overflow-hidden rounded-[18px]">
            <img
              src={IMG.bakerRacks}
              alt="Panadero acomodando charolas de pan dulce en los estantes de madera"
              className="h-[360px] w-full object-cover sm:h-[520px]"
            />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <span className="text-[0.68rem] uppercase tracking-[0.26em]" style={{ color: "var(--honey-2)" }}>
            El oficio
          </span>
          <h2 className="mt-3 font-display text-[2.6rem] leading-[0.95] sm:text-[3.6rem]">
            El trigal es el campo de trigo, y de ahi sale todo
          </h2>
          <p className="mt-5 text-[1.02rem] leading-relaxed" style={{ color: "rgba(251,246,236,0.82)" }}>
            Harina, tiempo y manos. Nada llega en caja: se amasa, se deja reposar y
            se hornea aqui mismo, en Essex Avenue, todos los dias del ano. Cuando
            pides directo con nosotros el dinero se queda completo en la panaderia,
            sin comision de ninguna aplicacion.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-2.5">
              <span className="inline-flex" style={{ color: "var(--honey-2)" }} aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.9 6.26L21.5 9.27l-4.75 4.64L17.8 21 12 17.27 6.2 21l1.05-7.09L2.5 9.27l6.6-1.01L12 2z" />
                  </svg>
                ))}
              </span>
              <span className="tabnum text-[0.95rem]">{BIZ.rating.toFixed(1)}</span>
              <span className="text-[0.9rem]" style={{ color: "rgba(251,246,236,0.6)" }}>
                de {BIZ.reviews} resenas
              </span>
            </span>
            <span className="stamp px-4 py-2 text-[0.7rem] uppercase tracking-[0.18em]" style={{ color: "var(--honey-2)" }}>
              Abierto todos los dias
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
