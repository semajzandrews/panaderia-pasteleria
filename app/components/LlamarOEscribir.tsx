"use client";

import { useEffect, useRef, useState } from "react";
import { telHref, smsHref } from "../lib/phone";
import { BIZ, TEXTO_PASTEL, TEXTO_EVENTO } from "../data";

/**
 * Llamar o escribir.
 *
 * Un boton que solo marca pierde a media clientela de una panaderia: el pastel
 * a la medida y el pedido de fiesta se explican mejor por mensaje, con calma y
 * con foto, que gritando por telefono con fila en el mostrador. Por eso el
 * numero abre una eleccion, y el mensaje ya va escrito.
 *
 * El trato es el de esta casa: pildoras completamente redondas, tarjeta de
 * crema con esquina de 20px, hilo de miel entre las opciones y versalitas con
 * mucho tracking. Nada cuadrado, nada oscuro: no se parece a ningun otro
 * selector del taller.
 */

type Recado = "pastel" | "evento";

type Props = {
  /** pildora = disparador redondo con popover · fila = las dos opciones a la vista */
  variante?: "pildora" | "fila" | "icono";
  /** tono del disparador, para que no queden dos pildoras de miel juntas */
  tono?: "miel" | "linea" | "claro";
  recado?: Recado;
  etiqueta?: string;
  className?: string;
  /** para el popover del menu movil, que abre hacia abajo y a la izquierda */
  alinear?: "derecha" | "izquierda" | "completo";
};

const cuerpo = (r: Recado) => (r === "evento" ? TEXTO_EVENTO : TEXTO_PASTEL);
const pista = (r: Recado) =>
  r === "evento"
    ? "Cotiza pan y pastel para tu fiesta"
    : "Pide tu pastel a la medida, con foto";

function IconoTelefono({ s = 17 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconoMensaje({ s = 17 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 0 1-9 8.4 9.6 9.6 0 0 1-3.4-.6L3 21l1.8-5.2A8.4 8.4 0 0 1 12 3.1a8.38 8.38 0 0 1 9 8.4Z" />
    </svg>
  );
}

export default function LlamarOEscribir({
  variante = "pildora",
  tono = "linea",
  recado = "pastel",
  etiqueta,
  className,
  alinear = "derecha",
}: Props) {
  const [abierto, setAbierto] = useState(false);
  const raiz = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAbierto(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", esc);
    };
  }, [abierto]);

  const tel = telHref(BIZ.phoneDigits);
  const sms = smsHref(BIZ.phoneDigits, cuerpo(recado));

  /* fila: las dos puertas abiertas, para Visita y para la nota del mostrador */
  if (variante === "fila") {
    return (
      <div className={`loe-fila ${className ?? ""}`}>
        <a href={tel} className="loe-pan loe-pan-miel">
          <IconoTelefono s={16} />
          <span>Llamar {BIZ.phoneDisplay}</span>
        </a>
        <a href={sms} className="loe-pan loe-pan-linea">
          <IconoMensaje s={16} />
          <span>Mandar mensaje</span>
        </a>
        <style>{cssComun}</style>
      </div>
    );
  }

  return (
    <div className={`loe ${className ?? ""}`} ref={raiz} data-alinear={alinear} data-variante={variante}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-haspopup="menu"
        aria-label={`Llamar o escribir a El Trigal, ${BIZ.phoneDisplay}`}
        className={`loe-disp loe-disp-${tono} ${variante === "icono" ? "loe-disp-icono" : ""}`}
      >
        <IconoTelefono s={variante === "icono" ? 19 : 15} />
        {variante !== "icono" && (
          <span className="loe-et">{etiqueta ?? "Llamar o escribir"}</span>
        )}
      </button>

      <div className="loe-menu" data-abierto={abierto} role="menu">
        <a href={tel} role="menuitem" onClick={() => setAbierto(false)}>
          <span className="loe-ico">
            <IconoTelefono s={16} />
          </span>
          <span className="loe-txt">
            <strong>Llamar</strong>
            <em>{BIZ.phoneDisplay} · contestamos desde las 6</em>
          </span>
        </a>
        <span className="honey-rule loe-hilo" aria-hidden />
        <a href={sms} role="menuitem" onClick={() => setAbierto(false)}>
          <span className="loe-ico">
            <IconoMensaje s={16} />
          </span>
          <span className="loe-txt">
            <strong>Escribir</strong>
            <em>{pista(recado)}</em>
          </span>
        </a>
      </div>

      <style>{cssComun}</style>
    </div>
  );
}

/* Ojo: la raiz NO se llama .wrap. Varios builds definen un .wrap global de
   ancho maximo y el popover se iba fuera de la pantalla. Aqui es .loe. */
const cssComun = `
  .loe { position: relative; display: inline-block; }

  .loe-disp {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    border-radius: 999px; padding: 0.62rem 1.05rem; cursor: pointer;
    font-size: 0.78rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.14em; border: 1px solid transparent;
    transition: transform .3s ease, background .3s ease, color .3s ease, border-color .3s ease;
  }
  .loe-disp:hover { transform: scale(1.03); }
  .loe-disp-miel { background: var(--honey); color: var(--crust-3); }
  .loe-disp-linea { border-color: var(--rule-2); color: var(--crust-2); }
  .loe-disp-claro { border-color: rgba(251,246,236,0.4); color: var(--cream); }
  .loe-disp-icono {
    height: 46px; width: 46px; padding: 0; background: var(--honey); color: var(--crust-3);
  }
  .loe-et { display: none; }
  @media (min-width: 560px) { .loe-et { display: inline; } }

  /* a lo ancho: para el menu movil, donde el boton ocupa toda la linea y la
     etiqueta si se lee aunque la pantalla sea de 375px */
  .loe-ancho, .loe-ancho .loe-disp { display: block; width: 100%; }
  .loe-ancho .loe-disp { display: flex; padding: 0.85rem 1.25rem; }
  .loe-ancho .loe-et { display: inline; }

  /* la tarjeta: crema, esquina de horno, sombra de pan tibio */
  .loe-menu {
    position: absolute; top: calc(100% + 10px); right: 0; z-index: 80;
    width: max-content; min-width: 252px; max-width: min(92vw, 320px);
    background: var(--cream); color: var(--crust-2);
    border: 1px solid var(--rule); border-radius: 20px; padding: 0.45rem;
    box-shadow: 0 20px 44px rgba(44,30,20,0.18);
    opacity: 0; transform: translateY(-6px) scale(0.98); pointer-events: none;
    transition: opacity .26s ease, transform .26s ease;
  }
  .loe[data-alinear="izquierda"] .loe-menu { right: auto; left: 0; }
  /* En el nav movil el disparador es un icono pegado a la orilla: si la tarjeta
     se cuelga de el, se sale por la izquierda en 375px. Ahi se ancla a la
     pantalla, con 12px de aire a cada lado. */
  @media (max-width: 559px) {
    .loe[data-variante="icono"] .loe-menu {
      position: fixed; top: 68px; left: 12px; right: 12px;
      width: auto; max-width: none; min-width: 0;
    }
  }
  .loe[data-alinear="completo"] .loe-menu { right: 0; left: 0; width: auto; max-width: none; }
  .loe-menu[data-abierto="true"] { opacity: 1; transform: none; pointer-events: auto; }
  .loe-menu a {
    display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 0.75rem;
    padding: 0.7rem 0.8rem; border-radius: 15px; color: inherit;
    transition: background .25s ease;
  }
  .loe-menu a:hover { background: var(--flour); }
  .loe-hilo { display: block; margin: 0.15rem 0.8rem; }
  .loe-ico {
    display: grid; place-items: center; height: 34px; width: 34px; border-radius: 999px;
    background: var(--honey); color: var(--crust-3);
  }
  .loe-menu strong {
    display: block; font-size: 0.74rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.16em;
  }
  .loe-menu em {
    display: block; font-style: normal; font-size: 0.82rem; margin-top: 3px;
    color: var(--crust); line-height: 1.35;
  }

  .loe-fila { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .loe-pan {
    display: inline-flex; align-items: center; gap: 0.55rem;
    border-radius: 999px; padding: 0.85rem 1.5rem;
    font-size: 0.78rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.14em; border: 1px solid transparent;
    transition: transform .3s ease;
  }
  .loe-pan:hover { transform: scale(1.03); }
  .loe-pan-miel { background: var(--honey); color: var(--crust-3); }
  .loe-pan-linea { border-color: var(--rule-2); color: var(--crust-2); }
`;
