"use client";

/**
 * El Trigal · La charola.
 *
 * SPINE (same in every build): what -> specifics -> when -> who -> confirm.
 *
 * SKIN: the tray and the tongs. In a panaderia you do not fill a cart, you
 * pick up a charola and a pair of tongs at the door and walk the shelves,
 * laying pan dulce on the tray piece by piece until it looks like enough.
 * So the flow is the tray: the shelves run down one side, the papered charola
 * sits at the other and never leaves the screen, every tap lays one more piece
 * on it, and tapping a piece takes it back off. Quantity is not a number in a
 * box, it is how full the tray looks, counted the way the counter counts it,
 * by the piece and by the dozen.
 *
 * TWO DOORS, because a panaderia does two different jobs:
 *   la charola  · pan dulce and pan salado, by the piece, ready today
 *   el encargo  · a cake with a date and writing on it, made to order
 * They are separate shapes because they are separate jobs. Cake questions do
 * not belong on a tray of conchas.
 *
 * NO PRICES AND NO TOTAL: this build publishes none, so none are invented.
 * The order is collected and the counter confirms the total at pickup, which
 * is exactly how the shop already works, and it is why no delivery app takes
 * a cut of it.
 *
 * NO LEAD TIME INVENTED: the site never states how many days a cake needs.
 * The encargo asks for the date the customer wants and says plainly that
 * El Trigal confirms whether it works. Pickup times are generated from the
 * real verified hours in app/lib/menu.ts.
 */

import { useEffect, useMemo, useState } from "react";
import { BIZ } from "../data";
import {
  ENCARGOS,
  MOSTRADOR,
  SHELVES_PIEZA,
  byId,
  closeLabel,
  dateFromKey,
  formatAsYouType,
  isCompletePhone,
  openDays,
  prettyDay,
  slotsFor,
} from "../lib/menu";
import type { Puerta } from "../lib/abrir";
import { WheatMark } from "./Nav";
import LlamarOEscribir from "./LlamarOEscribir";

type Etapa = "puerta" | "llenar" | "pastel" | "cuando" | "quien" | "listo";

const PERSONAS = [
  { id: "chico", label: "10 a 15 personas" },
  { id: "mediano", label: "20 a 30 personas" },
  { id: "grande", label: "40 o mas" },
  { id: "nose", label: "Todavia no se" },
];

/** how the counter says it out loud */
function contar(n: number): string {
  if (n === 0) return "La charola esta vacia";
  const doc = Math.floor(n / 12);
  const resto = n % 12;
  const p = (x: number) => (x === 1 ? "1 pieza" : `${x} piezas`);
  if (doc === 0) return p(n);
  const d = doc === 1 ? "1 docena" : `${doc} docenas`;
  return resto === 0 ? d : `${d} y ${p(resto)}`;
}

export default function Charola() {
  const [abierta, setAbierta] = useState(false);
  const [etapa, setEtapa] = useState<Etapa>("puerta");
  const [puerta, setPuerta] = useState<Puerta>("charola");

  /** the tray: one entry per piece laid down, in the order it was laid */
  const [charola, setCharola] = useState<string[]>([]);
  const [mostrador, setMostrador] = useState<Record<string, number>>({});

  const [pastel, setPastel] = useState("");
  const [personas, setPersonas] = useState("");
  const [texto, setTexto] = useState("");

  const [dia, setDia] = useState("");
  const [hora, setHora] = useState("");

  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [nota, setNota] = useState("");

  /** the clock is read after mount only, so server and client agree */
  const [ahora, setAhora] = useState<Date | null>(null);
  useEffect(() => setAhora(new Date()), []);

  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ puerta?: Puerta }>).detail;
      const p = d?.puerta ?? "charola";
      setPuerta(p);
      setEtapa(p === "charola" ? "llenar" : "pastel");
      setAbierta(true);
    };
    window.addEventListener("trigal:charola", on as EventListener);
    return () => window.removeEventListener("trigal:charola", on as EventListener);
  }, []);

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setAbierta(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  useEffect(() => {
    document.body.style.overflow = abierta ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierta]);

  const dias = useMemo(
    () => (ahora ? openDays(ahora, puerta === "charola" ? 0 : 1, 8) : []),
    [ahora, puerta]
  );
  const horas = useMemo(
    () => (ahora && dia ? slotsFor(dateFromKey(dia), ahora) : []),
    [ahora, dia]
  );

  const piezas = charola.length;
  const tazas = Object.values(mostrador).reduce((a, b) => a + b, 0);
  const listoCharola = piezas > 0 || tazas > 0;
  const listoPastel = pastel !== "" && personas !== "";
  const listoCuando = dia !== "" && hora !== "";
  const listoQuien = nombre.trim().length > 1 && isCompletePhone(tel);

  function poner(id: string) {
    setCharola((c) => [...c, id]);
  }
  function quitar(index: number) {
    setCharola((c) => c.filter((_, i) => i !== index));
  }
  function taza(id: string, delta: number) {
    setMostrador((m) => {
      const n = Math.max(0, (m[id] ?? 0) + delta);
      const next = { ...m };
      if (n === 0) delete next[id];
      else next[id] = n;
      return next;
    });
  }

  function limpiar() {
    setEtapa("puerta");
    setCharola([]);
    setMostrador({});
    setPastel("");
    setPersonas("");
    setTexto("");
    setDia("");
    setHora("");
    setNombre("");
    setTel("");
    setNota("");
  }

  /** the tray counted by kind, the way the counter reads it back */
  const porTipo = useMemo(() => {
    const m = new Map<string, number>();
    charola.forEach((id) => m.set(id, (m.get(id) ?? 0) + 1));
    return [...m.entries()];
  }, [charola]);

  if (!abierta) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col"
      style={{ background: "var(--flour)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Pedido en El Trigal"
    >
      {/* Cabecera: the door of the shop */}
      <header
        className="flex shrink-0 items-center justify-between px-5 py-3.5 sm:px-8"
        style={{ background: "var(--crust-2)", color: "var(--cream)" }}
      >
        <div className="flex items-center gap-2.5">
          <WheatMark className="h-5 w-5" style={{ color: "var(--honey-2)" }} />
          <span className="font-display text-[1.15rem] leading-none">
            {puerta === "charola" ? "Tu charola" : "Tu encargo"}
          </span>
        </div>
        <button
          onClick={() => setAbierta(false)}
          aria-label="Cerrar"
          className="grid h-10 w-10 place-items-center rounded-full border"
          style={{ borderColor: "rgba(251,246,236,0.32)", color: "var(--cream)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-5 py-7 sm:px-8 sm:py-10">
          {etapa === "puerta" && (
            <Puertas
              onPick={(p) => {
                setPuerta(p);
                setEtapa(p === "charola" ? "llenar" : "pastel");
              }}
            />
          )}

          {etapa === "llenar" && (
            <div className="grid gap-8 md:grid-cols-[1fr_320px]">
              {/* Los estantes */}
              <div>
                <Titulo
                  chico="Toma las pinzas"
                  grande="Pon el pan en la charola"
                  linea="Cada toque deja una pieza en la charola. Toca una pieza de la charola para quitarla."
                />
                {SHELVES_PIEZA.map((s) => (
                  <section key={s.key} className="mt-7">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-[1.75rem] leading-none">{s.es}</h3>
                      <span className="text-[0.7rem] uppercase tracking-[0.18em]" style={{ color: "var(--crust)" }}>
                        {s.nota}
                      </span>
                    </div>
                    <div className="honey-rule mt-2.5" />
                    <ul className="mt-1">
                      {s.items
                        .filter((i) => i.way === "pieza")
                        .map((i) => {
                          const n = charola.filter((x) => x === i.id).length;
                          return (
                            <li key={i.id}>
                              <button
                                onClick={() => poner(i.id)}
                                aria-label={`Poner una ${i.n} en la charola`}
                                className="flex w-full items-center gap-3 border-b py-3.5 text-left transition-colors hover:bg-[rgba(201,138,60,0.08)]"
                                style={{ borderColor: "var(--rule)" }}
                              >
                                <Pinzas />
                                <span className="min-w-0 flex-1">
                                  <span className="block font-display text-[1.15rem] leading-tight">{i.n}</span>
                                  <span className="block text-[0.83rem] leading-tight" style={{ color: "var(--crust)" }}>
                                    {i.d}
                                  </span>
                                </span>
                                {n > 0 && (
                                  <span
                                    className="tabnum grid h-7 min-w-7 shrink-0 place-items-center rounded-full px-2 text-[0.8rem] font-semibold"
                                    style={{ background: "var(--honey)", color: "var(--crust-3)" }}
                                  >
                                    {n}
                                  </span>
                                )}
                              </button>
                            </li>
                          );
                        })}
                    </ul>
                  </section>
                ))}

                {/* Del mostrador: poured at the register, never on the tray */}
                <section className="mt-9">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-[1.75rem] leading-none">Del mostrador</h3>
                    <span className="text-[0.7rem] uppercase tracking-[0.18em]" style={{ color: "var(--crust)" }}>
                      Para llevar
                    </span>
                  </div>
                  <div className="honey-rule mt-2.5" />
                  <ul className="mt-1">
                    {MOSTRADOR.map((i) => {
                      const n = mostrador[i.id] ?? 0;
                      return (
                        <li
                          key={i.id}
                          className="flex items-center gap-3 border-b py-3"
                          style={{ borderColor: "var(--rule)" }}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block font-display text-[1.15rem] leading-tight">{i.n}</span>
                            <span className="block text-[0.83rem] leading-tight" style={{ color: "var(--crust)" }}>
                              {i.d}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            <Redondo
                              label={`Quitar un ${i.n}`}
                              onClick={() => taza(i.id, -1)}
                              disabled={n === 0}
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14" /></svg>
                            </Redondo>
                            <span className="tabnum w-5 text-center text-[0.95rem]">{n}</span>
                            <Redondo label={`Agregar un ${i.n}`} onClick={() => taza(i.id, 1)}>
                              <svg width="15" height="15" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                            </Redondo>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </div>

              {/* LA CHAROLA: papered tray, always in view */}
              {/* Desktop: the tray sits beside the shelves and never scrolls
                  away. Mobile: it rides the bottom bar instead, so the phone
                  is not showing the same tray twice. */}
              <aside className="hidden md:sticky md:top-6 md:block md:self-start">
                <div
                  className="rounded-[18px] p-4"
                  style={{
                    background: "var(--flour-2)",
                    border: "1px solid var(--rule-2)",
                    boxShadow: "0 14px 34px rgba(74,52,36,0.14)",
                  }}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-[1.3rem] leading-none">La charola</span>
                    <span className="text-[0.72rem] uppercase tracking-[0.16em]" style={{ color: "var(--crust)" }}>
                      papel de panaderia
                    </span>
                  </div>
                  <div
                    className="mt-3 min-h-[132px] rounded-[12px] p-3 flour-grain"
                    style={{ background: "var(--cream)", border: "1px dashed var(--rule-2)" }}
                  >
                    {piezas === 0 ? (
                      <p className="py-8 text-center text-[0.87rem]" style={{ color: "var(--crust)" }}>
                        Todavia no has puesto nada.
                        <br />
                        Usa las pinzas.
                      </p>
                    ) : (
                      <ul className="flex flex-wrap gap-1.5">
                        {charola.map((id, i) => {
                          const p = byId(id);
                          return (
                            <li key={`${id}-${i}`}>
                              <button
                                onClick={() => quitar(i)}
                                aria-label={`Quitar ${p?.n ?? "la pieza"} de la charola`}
                                title={`Quitar ${p?.n ?? ""}`}
                                className="group grid h-[52px] w-[52px] place-items-center rounded-full transition-transform hover:scale-95"
                                style={{
                                  background: "var(--flour-2)",
                                  border: "1px solid var(--rule-2)",
                                  animation: "soft-rise 0.35s ease-out both",
                                }}
                              >
                                <Bollo />
                                <span
                                  className="mt-0.5 block max-w-[46px] truncate text-[0.52rem] uppercase tracking-[0.06em]"
                                  style={{ color: "var(--crust)" }}
                                >
                                  {p?.n}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  <p className="mt-3 font-display text-[1.15rem] leading-tight">{contar(piezas)}</p>
                  {tazas > 0 && (
                    <p className="text-[0.85rem]" style={{ color: "var(--crust)" }}>
                      {tazas === 1 ? "1 del mostrador" : `${tazas} del mostrador`}
                    </p>
                  )}
                  <p className="mt-2 text-[0.78rem] leading-snug" style={{ color: "var(--crust)" }}>
                    El total lo confirma el mostrador cuando recoges. Sin comision de
                    aplicaciones.
                  </p>

                  <button
                    disabled={!listoCharola}
                    onClick={() => setEtapa("cuando")}
                    className="mt-4 w-full rounded-full px-5 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em] transition-transform enabled:hover:scale-[1.02] disabled:opacity-40"
                    style={{ background: "var(--honey)", color: "var(--crust-3)" }}
                  >
                    Cuando la recojo
                  </button>
                </div>
              </aside>
            </div>
          )}

          {etapa === "pastel" && (
            <div className="max-w-2xl">
              <Titulo
                chico="Por encargo"
                grande="Un pastel con fecha"
                linea="Los pasteles se hacen por encargo. Dinos que buscas y para cuando; El Trigal confirma la fecha y el precio antes de empezar."
              />

              <Campo label="Que pastel" />
              <div className="grid gap-2.5 sm:grid-cols-3">
                {ENCARGOS.map((i) => (
                  <Tarjeta key={i.id} activo={pastel === i.id} onClick={() => setPastel(i.id)}>
                    <span className="block font-display text-[1.2rem] leading-tight">{i.n}</span>
                    <span className="mt-0.5 block text-[0.82rem] leading-snug" style={{ color: "var(--crust)" }}>
                      {i.d}
                    </span>
                  </Tarjeta>
                ))}
              </div>

              <Campo label="Para cuanta gente" />
              <div className="grid gap-2.5 sm:grid-cols-2">
                {PERSONAS.map((p) => (
                  <Tarjeta key={p.id} activo={personas === p.id} onClick={() => setPersonas(p.id)}>
                    <span className="block font-display text-[1.15rem] leading-tight">{p.label}</span>
                  </Tarjeta>
                ))}
              </div>

              <Campo label="Que quieres que diga el pastel (opcional)" />
              <input
                value={texto}
                maxLength={40}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Feliz cumpleanos, Maria"
                className="w-full rounded-[12px] px-4 py-3 font-display text-[1.2rem] outline-none"
                style={{ background: "var(--cream)", border: "1px solid var(--rule-2)" }}
              />
              <p className="mt-1.5 text-[0.78rem]" style={{ color: "var(--crust)" }}>
                Se escribe a mano en la panaderia. {40 - texto.length} letras disponibles.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Volver onClick={() => setEtapa("puerta")} />
                <button
                  disabled={!listoPastel}
                  onClick={() => setEtapa("cuando")}
                  className="rounded-full px-7 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em] transition-transform enabled:hover:scale-[1.02] disabled:opacity-40"
                  style={{ background: "var(--honey)", color: "var(--crust-3)" }}
                >
                  Elegir la fecha
                </button>
              </div>
            </div>
          )}

          {etapa === "cuando" && (
            <div className="max-w-2xl">
              <Titulo
                chico={puerta === "charola" ? "Paso 2" : "Paso 2"}
                grande={puerta === "charola" ? "Cuando pasas por ella" : "Para cuando lo necesitas"}
                linea={
                  puerta === "charola"
                    ? "El pan sale caliente por la manana. Elige el dia y la hora dentro del horario de la panaderia."
                    : "Elige la fecha que buscas. El Trigal te confirma por telefono si alcanza esa fecha."
                }
              />

              <Campo label="Dia" />
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dias.map((d) => {
                  const activo = dia === d.key;
                  return (
                    <button
                      key={d.key}
                      onClick={() => {
                        setDia(d.key);
                        setHora("");
                      }}
                      className="shrink-0 rounded-[14px] px-4 py-3 text-center transition-colors"
                      style={{
                        background: activo ? "var(--crust-2)" : "var(--cream)",
                        color: activo ? "var(--cream)" : "var(--crust-2)",
                        border: `1px solid ${activo ? "var(--crust-2)" : "var(--rule-2)"}`,
                      }}
                    >
                      <span className="block text-[0.68rem] uppercase tracking-[0.16em]">{d.corto}</span>
                      <span className="tabnum block font-display text-[1.5rem] leading-none">{d.num}</span>
                    </button>
                  );
                })}
              </div>

              {dia && (
                <>
                  <Campo label="Hora" />
                  {horas.length === 0 ? (
                    <p className="text-[0.9rem]" style={{ color: "var(--crust)" }}>
                      Ya no queda hora para hoy. Elige otro dia.
                    </p>
                  ) : (
                    <>
                      <div className="flex flex-wrap gap-2">
                        {horas.map((h) => {
                          const activo = hora === h.key;
                          return (
                            <button
                              key={h.key}
                              onClick={() => setHora(h.key)}
                              className="tabnum rounded-full px-4 py-2.5 text-[0.85rem] transition-colors"
                              style={{
                                background: activo ? "var(--honey)" : "var(--cream)",
                                color: "var(--crust-3)",
                                border: `1px solid ${activo ? "var(--honey)" : "var(--rule-2)"}`,
                              }}
                            >
                              {h.label}
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-2 text-[0.78rem]" style={{ color: "var(--crust)" }}>
                        Ese dia la panaderia cierra a las {closeLabel(dateFromKey(dia))}.
                      </p>
                    </>
                  )}
                </>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Volver onClick={() => setEtapa(puerta === "charola" ? "llenar" : "pastel")} />
                <button
                  disabled={!listoCuando}
                  onClick={() => setEtapa("quien")}
                  className="rounded-full px-7 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em] transition-transform enabled:hover:scale-[1.02] disabled:opacity-40"
                  style={{ background: "var(--honey)", color: "var(--crust-3)" }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {etapa === "quien" && (
            <div className="max-w-2xl">
              <Titulo
                chico="Paso 3"
                grande="A nombre de quien"
                linea="Solo para tenerlo listo y llamarte si hace falta. No se cobra nada aqui."
              />

              <Campo label="Nombre" />
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Maria Hernandez"
                className="w-full rounded-[12px] px-4 py-3 font-display text-[1.2rem] outline-none"
                style={{ background: "var(--cream)", border: "1px solid var(--rule-2)" }}
              />

              <Campo label="Telefono" />
              <input
                value={tel}
                inputMode="tel"
                onChange={(e) => setTel(formatAsYouType(e.target.value))}
                placeholder="(973) 555-0123"
                className="tabnum w-full rounded-[12px] px-4 py-3 font-display text-[1.2rem] outline-none"
                style={{ background: "var(--cream)", border: "1px solid var(--rule-2)" }}
              />

              <Campo label="Algo mas que debamos saber (opcional)" />
              <textarea
                value={nota}
                rows={3}
                onChange={(e) => setNota(e.target.value)}
                placeholder="Sin nuez, por favor"
                className="w-full rounded-[12px] px-4 py-3 text-[0.95rem] outline-none"
                style={{ background: "var(--cream)", border: "1px solid var(--rule-2)" }}
              />

              <div className="mt-8 flex flex-wrap gap-3">
                <Volver onClick={() => setEtapa("cuando")} />
                <button
                  disabled={!listoQuien}
                  onClick={() => setEtapa("listo")}
                  className="rounded-full px-7 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em] transition-transform enabled:hover:scale-[1.02] disabled:opacity-40"
                  style={{ background: "var(--honey)", color: "var(--crust-3)" }}
                >
                  {puerta === "charola" ? "Apartar la charola" : "Mandar el encargo"}
                </button>
              </div>
            </div>
          )}

          {etapa === "listo" && ahora && (
            <div className="mx-auto max-w-lg">
              {/* the slip the counter tapes to the bag */}
              <div
                className="rounded-[18px] p-6 sm:p-8"
                style={{
                  background: "var(--cream)",
                  border: "1px solid var(--rule-2)",
                  boxShadow: "0 18px 44px rgba(74,52,36,0.16)",
                }}
              >
                <div className="flex items-center gap-2.5" style={{ color: "var(--crust)" }}>
                  <WheatMark className="h-4 w-4" />
                  <span className="text-[0.68rem] uppercase tracking-[0.24em]">
                    {puerta === "charola" ? "Charola apartada" : "Encargo recibido"}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-[2.3rem] leading-[0.95]">
                  Gracias, {nombre.split(" ")[0]}
                </h2>
                <p className="mt-2 text-[0.95rem] leading-relaxed" style={{ color: "var(--crust)" }}>
                  {puerta === "charola"
                    ? `Te esperamos ${prettyDay(dia, ahora)} a las ${
                        horas.find((h) => h.key === hora)?.label ?? ""
                      } en ${BIZ.address}.`
                    : `Pediste el pastel para ${prettyDay(dia, ahora)}. El Trigal te llama al ${tel} para confirmar la fecha y el precio.`}
                </p>

                <div className="honey-rule my-5" />

                {puerta === "charola" ? (
                  <ul className="space-y-1.5">
                    {porTipo.map(([id, n]) => (
                      <li key={id} className="flex items-baseline justify-between gap-4">
                        <span className="font-display text-[1.1rem]">{byId(id)?.n}</span>
                        <span className="tabnum text-[0.9rem]" style={{ color: "var(--crust)" }}>
                          {n}
                        </span>
                      </li>
                    ))}
                    {Object.entries(mostrador).map(([id, n]) => (
                      <li key={id} className="flex items-baseline justify-between gap-4">
                        <span className="font-display text-[1.1rem]">{byId(id)?.n}</span>
                        <span className="tabnum text-[0.9rem]" style={{ color: "var(--crust)" }}>
                          {n}
                        </span>
                      </li>
                    ))}
                    <li className="pt-2 font-display text-[1.15rem]">{contar(piezas)}</li>
                  </ul>
                ) : (
                  <ul className="space-y-1.5 text-[0.95rem]">
                    <li className="font-display text-[1.3rem]">{byId(pastel)?.n}</li>
                    <li style={{ color: "var(--crust)" }}>
                      {PERSONAS.find((p) => p.id === personas)?.label}
                    </li>
                    {texto && (
                      <li style={{ color: "var(--crust)" }}>
                        Escrito en el pastel: <span className="font-display text-[1.1rem]">{texto}</span>
                      </li>
                    )}
                  </ul>
                )}

                {nota && (
                  <p className="mt-4 text-[0.88rem] italic" style={{ color: "var(--crust)" }}>
                    {nota}
                  </p>
                )}

                <div className="honey-rule my-5" />
                <p className="text-[0.85rem] leading-relaxed" style={{ color: "var(--crust)" }}>
                  No se cobro nada aqui. El total se confirma y se paga en el mostrador,
                  y se queda completo en la panaderia porque no pasa por ninguna
                  aplicacion de entrega.
                </p>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  {/* Ya con el encargo hecho, la duda tipica es del pastel:
                      sabor, tamano y que va escrito. Se puede llamar o mandar
                      ese recado ya escrito. */}
                  <LlamarOEscribir tono="miel" recado="pastel" etiqueta="Llamar o escribir" />
                  <button
                    onClick={() => {
                      limpiar();
                      setAbierta(false);
                    }}
                    className="rounded-full border px-5 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.14em]"
                    style={{ borderColor: "var(--rule-2)", color: "var(--crust-2)" }}
                  >
                    Listo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: the tray never leaves the screen either, it rides the bottom */}
      {etapa === "llenar" && (piezas > 0 || tazas > 0) && (
        <div
          className="shrink-0 px-5 py-3 md:hidden"
          style={{ background: "var(--flour-2)", borderTop: "1px solid var(--rule-2)" }}
        >
          {/* the pieces stay visible and removable while you keep shopping */}
          {piezas > 0 && (
            <ul className="mb-2.5 flex gap-1.5 overflow-x-auto pb-1">
              {charola.map((id, i) => {
                const p = byId(id);
                return (
                  <li key={`m-${id}-${i}`}>
                    <button
                      onClick={() => quitar(i)}
                      aria-label={`Quitar ${p?.n ?? "la pieza"} de la charola`}
                      className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full"
                      style={{ background: "var(--cream)", border: "1px solid var(--rule-2)" }}
                    >
                      <Bollo />
                      <span
                        className="mt-0.5 block max-w-[40px] truncate text-[0.48rem] uppercase"
                        style={{ color: "var(--crust)" }}
                      >
                        {p?.n}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="flex items-center gap-3">
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[1.05rem] leading-tight">{contar(piezas)}</span>
              <span className="block text-[0.72rem]" style={{ color: "var(--crust)" }}>
                {tazas > 0 ? `mas ${tazas} del mostrador` : "en la charola"}
              </span>
            </span>
            <button
              onClick={() => setEtapa("cuando")}
              className="shrink-0 rounded-full px-5 py-3 text-[0.76rem] font-semibold uppercase tracking-[0.14em]"
              style={{ background: "var(--honey)", color: "var(--crust-3)" }}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── piezas de UI ───────────────────────────────────────────────────────── */

function Puertas({ onPick }: { onPick: (p: Puerta) => void }) {
  return (
    <div className="max-w-2xl">
      <Titulo
        chico="Pedido directo"
        grande="Que necesitas hoy"
        linea="Dos cosas distintas, dos caminos distintos. El pan se lleva hoy; el pastel se encarga con fecha."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Tarjeta activo={false} onClick={() => onPick("charola")}>
          <span className="block font-display text-[1.6rem] leading-tight">La charola</span>
          <span className="mt-1 block text-[0.88rem] leading-snug" style={{ color: "var(--crust)" }}>
            Pan dulce y pan salado, por pieza y por docena, listo para recoger.
          </span>
        </Tarjeta>
        <Tarjeta activo={false} onClick={() => onPick("encargo")}>
          <span className="block font-display text-[1.6rem] leading-tight">El encargo</span>
          <span className="mt-1 block text-[0.88rem] leading-snug" style={{ color: "var(--crust)" }}>
            Pastel para una fiesta, con lo que quieras escrito encima.
          </span>
        </Tarjeta>
      </div>
    </div>
  );
}

function Titulo({ chico, grande, linea }: { chico: string; grande: string; linea: string }) {
  return (
    <div className="mb-6">
      <span className="text-[0.68rem] uppercase tracking-[0.26em]" style={{ color: "var(--crust)" }}>
        {chico}
      </span>
      <h2 className="mt-2 font-display text-[2.3rem] leading-[0.95] sm:text-[2.9rem]">{grande}</h2>
      <p className="mt-2.5 max-w-xl text-[0.95rem] leading-relaxed" style={{ color: "var(--crust)" }}>
        {linea}
      </p>
    </div>
  );
}

function Campo({ label }: { label: string }) {
  return (
    <p className="mb-2.5 mt-7 text-[0.68rem] uppercase tracking-[0.22em]" style={{ color: "var(--crust)" }}>
      {label}
    </p>
  );
}

function Tarjeta({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-[14px] px-4 py-3.5 text-left transition-colors"
      style={
        {
          background: activo ? "var(--crust-2)" : "var(--cream)",
          color: activo ? "var(--cream)" : "var(--crust-2)",
          border: `1px solid ${activo ? "var(--crust-2)" : "var(--rule-2)"}`,
          /* the note inside reads on the dark card too, once picked */
          "--crust": activo ? "rgba(251,246,236,0.72)" : undefined,
        } as React.CSSProperties
      }
    >
      {children}
    </button>
  );
}

function Volver({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-6 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em]"
      style={{ borderColor: "var(--rule-2)", color: "var(--crust-2)" }}
    >
      Atras
    </button>
  );
}

function Redondo({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid h-9 w-9 place-items-center rounded-full border transition-colors disabled:opacity-30"
      style={{ borderColor: "var(--rule-2)", color: "var(--crust-2)", fill: "none" }}
    >
      {children}
    </button>
  );
}

/** tongs: the tool you actually pick the bread up with */
function Pinzas() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "var(--crust)" }}
      aria-hidden
    >
      <path d="M6 3c2.6 2.4 4.4 5.4 5.4 9 .3 1.2.5 2.4.6 3.6" />
      <path d="M18 3c-2.6 2.4-4.4 5.4-5.4 9-.3 1.2-.5 2.4-.6 3.6" />
      <path d="M12 15.6c1 0 1.8.9 1.8 2s-.8 2.4-1.8 3.4c-1-1-1.8-2.3-1.8-3.4s.8-2 1.8-2Z" />
    </svg>
  );
}

/** a piece of pan dulce as it sits on the tray, scored like a concha */
function Bollo() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="var(--honey)" />
      <path
        d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"
        stroke="var(--crust-3)"
        strokeOpacity="0.35"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
