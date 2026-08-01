/**
 * El Trigal · single source of truth for the carta, the charola and the clock.
 *
 * The printed carta (Carta.tsx) and the pickup flow (Charola.tsx) both read
 * this file, so the shelf and the order can never drift apart.
 *
 * No prices anywhere: this build publishes none and the shop has not given us
 * a list, so none are invented. The counter confirms the total at pickup.
 * Items are exactly the ones the build already names. Hours are the verified
 * Google Places hours carried in app/data.ts.
 */

/** How a thing is actually bought in a panaderia. */
export type Way =
  /** off the shelf with tongs, laid on the charola piece by piece */
  | "pieza"
  /** made to order, taken as an encargo days before it is picked up */
  | "encargo"
  /** poured at the register, added to the bag on the way out */
  | "mostrador";

export type Piece = {
  id: string;
  /** name as the shelf label reads it */
  n: string;
  /** the shelf note, in the kitchen's own Spanish */
  d: string;
  way: Way;
};

export type Shelf = {
  key: string;
  es: string;
  en: string;
  /** the line the shelf card carries in the flow */
  nota: string;
  items: Piece[];
};

export const SHELVES: Shelf[] = [
  {
    key: "dulce",
    es: "Pan Dulce",
    en: "Sweet bread, baked fresh daily",
    nota: "Por pieza, con las pinzas",
    items: [
      { id: "conchas", n: "Conchas", d: "vainilla y chocolate", way: "pieza" },
      { id: "orejas", n: "Orejas", d: "hojaldre crujiente", way: "pieza" },
      { id: "cuernos", n: "Cuernos", d: "suaves, recien horneados", way: "pieza" },
      { id: "empanadas", n: "Empanadas", d: "de calabaza y crema", way: "pieza" },
      { id: "mantecadas", n: "Mantecadas", d: "esponjosas, de la manana", way: "pieza" },
    ],
  },
  {
    key: "salado",
    es: "Pan Salado",
    en: "Savory bread and rolls",
    nota: "Por pieza, para la torta y el cafe",
    items: [
      { id: "bolillo", n: "Bolillo", d: "para tortas y el cafe", way: "pieza" },
      { id: "telera", n: "Telera", d: "fresca cada dia", way: "pieza" },
      { id: "birote", n: "Birote", d: "corteza dorada", way: "pieza" },
    ],
  },
  {
    key: "pasteleria",
    es: "Pasteleria",
    en: "Cakes for every occasion",
    nota: "Por encargo, con fecha",
    items: [
      { id: "tresleches", n: "Tres Leches", d: "el clasico, humedo", way: "encargo" },
      { id: "fiesta", n: "Pasteles de fiesta", d: "por encargo, decorados", way: "encargo" },
      { id: "gelatinas", n: "Gelatinas", d: "de temporada", way: "encargo" },
    ],
  },
  {
    key: "cafe",
    es: "Cafe",
    en: "Coffee and more",
    nota: "En el mostrador, para llevar",
    items: [
      { id: "olla", n: "Cafe de olla", d: "canela y piloncillo", way: "mostrador" },
      { id: "conleche", n: "Cafe con leche", d: "para acompanar el pan", way: "mostrador" },
      { id: "champurrado", n: "Champurrado", d: "espeso, de temporada", way: "mostrador" },
    ],
  },
];

/** Everything you carry out on the charola, shelf by shelf. */
export const SHELVES_PIEZA = SHELVES.filter((s) =>
  s.items.some((i) => i.way === "pieza")
);
/** Everything poured at the register. */
export const MOSTRADOR = SHELVES.flatMap((s) => s.items).filter(
  (i) => i.way === "mostrador"
);
/** Everything that has to be ordered ahead with a date on it. */
export const ENCARGOS = SHELVES.flatMap((s) => s.items).filter(
  (i) => i.way === "encargo"
);

export const byId = (id: string): Piece | undefined =>
  SHELVES.flatMap((s) => s.items).find((i) => i.id === id);

/* ── The clock ────────────────────────────────────────────────────────────
   Verified hours: Mon to Sat 6:00 AM to 9:00 PM, Sun 6:00 AM to 6:00 PM.
   Indexed by JS getDay(), 0 = Sunday. Never open past these, never closed
   on a day the shop is open. The shop has no closed day.                  */
const OPEN_HOUR = 6;
const CLOSE_HOUR: number[] = [18, 21, 21, 21, 21, 21, 21];

export const DIAS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

export type Slot = { key: string; label: string };

/** Half-hour pickup slots inside the real hours for a given date. */
export function slotsFor(date: Date, now: Date): Slot[] {
  const close = CLOSE_HOUR[date.getDay()];
  const sameDay = date.toDateString() === now.toDateString();
  /** give the counter a little room rather than promising this minute */
  const earliest = sameDay ? now.getHours() * 60 + now.getMinutes() + 45 : 0;
  const out: Slot[] = [];
  for (let m = OPEN_HOUR * 60; m <= close * 60 - 30; m += 30) {
    if (m < earliest) continue;
    const h = Math.floor(m / 60);
    const mm = m % 60;
    const ampm = h < 12 ? "AM" : "PM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    out.push({
      key: `${h}:${mm.toString().padStart(2, "0")}`,
      label: `${h12}:${mm.toString().padStart(2, "0")} ${ampm}`,
    });
  }
  return out;
}

export function closeLabel(date: Date): string {
  const c = CLOSE_HOUR[date.getDay()];
  const h12 = c % 12 === 0 ? 12 : c % 12;
  return `${h12}:00 ${c < 12 ? "AM" : "PM"}`;
}

export type DayKey = { key: string; dia: string; corto: string; num: number };

/** The next `n` days the shop is open, starting `from` days out. */
export function openDays(now: Date, from: number, n: number): DayKey[] {
  const out: DayKey[] = [];
  for (let i = from; out.length < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({
      key: d.toISOString().slice(0, 10),
      dia: DIAS[d.getDay()],
      corto: DIAS[d.getDay()].slice(0, 3),
      num: d.getDate(),
    });
  }
  return out;
}

export const dateFromKey = (k: string) => new Date(`${k}T12:00:00`);

export function prettyDay(k: string, now: Date): string {
  const d = dateFromKey(k);
  if (d.toDateString() === now.toDateString()) return "hoy";
  const t = new Date(now);
  t.setDate(now.getDate() + 1);
  if (d.toDateString() === t.toDateString()) return "manana";
  return `el ${DIAS[d.getDay()].toLowerCase()} ${d.getDate()}`;
}

/* ── Phone, shared behaviour across every build ───────────────────────────
   Formats progressively to (xxx) xxx-xxxx, hard-caps at 10 digits, drops a
   leading country 1 so a pasted "+1 973 555 0123" still lands.            */
export function formatPhone(input: string): string {
  const d = input.replace(/\D/g, "").replace(/^1(?=\d{10})/, "").slice(0, 10);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
export const isPhoneComplete = (v: string) => v.replace(/\D/g, "").length === 10;
