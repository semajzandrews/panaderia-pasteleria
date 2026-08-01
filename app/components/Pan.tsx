import { IMG } from "../data";
import Reveal from "./Reveal";

export default function Pan() {
  return (
    <section id="pan" className="band-paper flour-grain px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[0.68rem] uppercase tracking-[0.26em]" style={{ color: "var(--crust)" }}>
            El pan de cada dia
          </span>
          <h2 className="mt-3 max-w-3xl font-display text-[2.6rem] leading-[0.95] sm:text-[4rem]">
            Desde las 6 de la manana, el horno ya lleva rato encendido
          </h2>
          <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed" style={{ color: "var(--crust)" }}>
            Conchas de vainilla y de chocolate, orejas de hojaldre, cuernos, bolillo
            y telera. Todo se hace aqui mismo, a mano, y sale caliente a la charola
            antes de que abra la puerta.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { src: IMG.panOverhead, alt: "Conchas recien horneadas vistas desde arriba con huevo y harina", cap: "Conchas" },
            { src: IMG.breadShelf, alt: "Bolillo y pan salado en los estantes tibios de la panaderia", cap: "Bolillo y telera" },
            { src: IMG.conchaDark, alt: "Concha en primer plano dentro de un tazon de madera", cap: "Recien salida" },
          ].map((f, i) => (
            <Reveal key={f.cap} as="figure" delay={i * 0.08}>
              <div className="overflow-hidden rounded-[16px]">
                <img
                  src={f.src}
                  alt={f.alt}
                  className="h-[300px] w-full object-cover transition-transform duration-700 hover:scale-[1.04] sm:h-[340px]"
                />
              </div>
              <figcaption className="mt-2.5 text-[0.72rem] uppercase tracking-[0.2em]" style={{ color: "var(--crust)" }}>
                {f.cap}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
