import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import Pan from "./components/Pan";
import Carta from "./components/Carta";
import Oficio from "./components/Oficio";
import Visita from "./components/Visita";
import Charola from "./components/Charola";

export default function Page() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Ticker />
      <Pan />
      <Carta />
      <Oficio />
      <Visita />

      {/* Pedido directo: la charola y las pinzas */}
      <Charola />
    </main>
  );
}
