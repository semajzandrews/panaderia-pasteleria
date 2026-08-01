/**
 * The one way anything on the page opens the order flow.
 *
 * It lives in its own file on purpose: every entry point imports this instead
 * of importing the flow component, so no button that says "order" can quietly
 * become a phone link, and Nav and Charola never import each other.
 */
export type Puerta = "charola" | "encargo";

export function abrirCharola(puerta: Puerta = "charola") {
  window.dispatchEvent(new CustomEvent("trigal:charola", { detail: { puerta } }));
}
