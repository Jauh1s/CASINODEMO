import Link from "next/link";
import { Balance } from "./Casino";
export function Navbar() {
  return <header className="sticky top-0 z-40 border-b border-gold/20 bg-ink/80 backdrop-blur">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
      <Link href="/" className="text-lg font-black tracking-wider text-gold">♠ ROYAL<span className="text-white">DEMO</span></Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/#games" className="hover:text-gold">Games</Link>
        <Link href="/history" className="hover:text-gold">History</Link>
        <span className="rounded-full border border-red-400/60 bg-red-500/10 px-2 py-0.5 text-xs font-bold text-red-300">DEMO</span>
        <span className="rounded-xl border border-gold/40 bg-plum px-3 py-1 font-bold text-gold">🪙 <Balance /></span>
      </nav></div></header>;
}
export function Footer() {
  return <footer className="mt-16 border-t border-gold/20 py-8 text-center text-xs text-white/50">
    <p className="font-bold text-gold">DEMO / PLAY MONEY</p>
    <p className="mx-auto mt-2 max-w-xl px-4">This is a fictional play-money casino. Credits are virtual, have no monetary value, cannot be bought, withdrawn or exchanged, and no prizes are awarded. For entertainment and learning only.</p></footer>;
}
