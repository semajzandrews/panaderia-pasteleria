// Verified recon facts — Panaderia y Pasteleria El Trigal
// Source: Google Places (sweep-07050.json), 06-16-2026. NO existing website (confirmed).
import { formatPhone, e164 } from "./lib/phone";

const PHONE_DIGITS = "3478429351";

/* Los dos mensajes que se pueden mandar por texto. Una panaderia vive de dos
   encargos que nadie quiere explicar por telefono con fila en el mostrador:
   el pastel a la medida (sabor, tamano, que va escrito) y el pedido grande
   para una fiesta. Cada boton de texto llega con su recado ya escrito. */
export const TEXTO_PASTEL =
  "Hola El Trigal, quiero encargar un pastel. Sabor, tamano, que va escrito y para cuando lo necesito: ";
export const TEXTO_EVENTO =
  "Hola El Trigal, quiero pan y pastel para una fiesta. Somos mas o menos ___ personas y es el ___. ";

export const BIZ = {
  name: "Panaderia y Pasteleria El Trigal",
  short: "El Trigal",
  category: "Panaderia mexicana",
  address: "23 S Essex Ave",
  cityLine: "City of Orange, NJ 07050",
  // DOCTRINA DEL TELEFONO — un solo constante de puros digitos. Lo que se ve y
  // lo que marca salen de app/lib/phone.ts, asi nunca se separan.
  phoneDigits: PHONE_DIGITS,
  phoneDisplay: formatPhone(PHONE_DIGITS), // (347) 842-9351
  phoneHref: e164(PHONE_DIGITS), // +13478429351
  rating: 4.9,
  reviews: 11,
  mapsUri: "https://maps.google.com/?cid=1680703119358804383",
  mapsEmbed:
    "https://www.google.com/maps?q=23+S+Essex+Ave,+City+of+Orange,+NJ+07050&output=embed",
  // Real verified hours (Places periods): Mon–Sat 6 AM–9 PM, Sun 6 AM–6 PM
  hours: [
    { d: "Lunes", e: "Monday", h: "6:00 AM – 9:00 PM" },
    { d: "Martes", e: "Tuesday", h: "6:00 AM – 9:00 PM" },
    { d: "Miercoles", e: "Wednesday", h: "6:00 AM – 9:00 PM" },
    { d: "Jueves", e: "Thursday", h: "6:00 AM – 9:00 PM" },
    { d: "Viernes", e: "Friday", h: "6:00 AM – 9:00 PM" },
    { d: "Sabado", e: "Saturday", h: "6:00 AM – 9:00 PM" },
    { d: "Domingo", e: "Sunday", h: "6:00 AM – 6:00 PM" },
  ] as { d: string; e: string; h: string }[],
};

// Local Pexels imagery (downloaded, each used exactly once, every shot LOOKED at).
export const IMG = {
  heroTrays: "/img/p12097596.jpg", // conchas + pan dulce on bakery trays  (HERO)
  bakerRacks: "/img/p34504589.jpg", // baker loading pan dulce onto wood racks (craft)
  interior: "/img/p33574700.jpg", // warm wheat-lit bakery interior, bread crates
  breadShelf: "/img/p15009979.jpg", // bolillo + baguettes on warm shelves
  panOverhead: "/img/p11880572.jpg", // overhead conchas with eggs + flour
  conchaDark: "/img/p34971022.jpg", // dramatic concha closeup in wood bowl
  cakesPastel: "/img/p36988262.jpg", // pastel buttercream celebration cakes
  cakeStraw: "/img/p18604369.jpg", // strawberry cream cake closeup
};

// The carta now lives in app/lib/menu.ts, which both the printed carta and
// the order flow read, so the shelf and the order cannot drift apart.

// Ticker — the daily bake, in the kitchen's own language.
export const TICKER = [
  "Conchas",
  "Bolillo",
  "Tres Leches",
  "Orejas",
  "Pan de cada dia",
  "Pasteles por encargo",
  "Cafe de olla",
  "Cuernos",
  "Empanadas",
  "Telera",
];
