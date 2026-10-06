import Link from "next/link";
import { GAMES } from "@/lib/games";
import { Balance } from "@/components/Casino";
export default function Home() {
  return <div className="mx-auto max-w-6xl px-4">
    <section className="py-16 text-center">
      <span className="rounded-full border border-red-400/60 bg-red-500/10 px-3 py-1 text-xs font-bold tracking-widest text-red-300">DEMO / PLAY MONEY</span>
      <h1 className="mt-6 text-5xl font-black md:text-7xl"><span className="bg-gradient-to-r from-gold via-yellow-200 to-gold bg-clip-text text-transparent">Royal Demo</span> Casino</h1>
      <p className="mx-auto mt-4 max-w-xl text-white/60">Six polished games, zero risk. Play with virtual credits only — nothing here has monetary value.</p>
      <p className="mt-6 text-2xl font-bold text-gold">🪙 <Balance /> credits</p>
      <Link href="#games" className="mt-6 inline-block rounded-xl bg-gradient-to-b from-gold to-yellow-700 px-8 py-3 font-bold text-black transition hover:scale-105">Start playing</Link>
    </section>
    <section id="games" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {GAMES.map(g => <Link key={g.slug} href={`/play/${g.slug}`} className="group rounded-2xl border border-gold/20 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-gold hover:shadow-[0_0_30px_rgba(212,175,55,.25)]">
        <div className="text-5xl transition group-hover:scale-110">{g.icon}</div>
        <h2 className="mt-4 text-xl font-bold text-gold">{g.title}</h2>
        <p className="mt-1 text-sm text-white/60">{g.desc}</p></Link>)}
    </section></div>;
}
