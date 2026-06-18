import { TICKER } from "../data";
import { WheatMark } from "./Nav";

export default function Ticker() {
  const row = [...TICKER, ...TICKER];
  return (
    <div
      className="marquee-wrap overflow-hidden py-4"
      style={{ background: "var(--crust)", color: "var(--cream)" }}
      aria-label="Lo que horneamos hoy"
    >
      <div className="marquee-track">
        {row.map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="px-6 font-display text-[1.6rem] tracking-tight">{t}</span>
            <WheatMark className="h-4 w-4 opacity-60" />
          </span>
        ))}
      </div>
    </div>
  );
}
