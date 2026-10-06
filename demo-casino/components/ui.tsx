"use client";
import { ReactNode, ButtonHTMLAttributes } from "react";
import { useCasino } from "./Casino";
export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) =>
  <div className={`rounded-2xl border border-gold/20 bg-white/[0.04] p-5 backdrop-blur ${className}`}>{children}</div>;
export const Btn = ({ className = "", ...p }: ButtonHTMLAttributes<HTMLButtonElement>) =>
  <button {...p} className={`rounded-xl bg-gradient-to-b from-gold to-yellow-700 px-4 py-2.5 font-bold text-black transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${className}`} />;
export const Chip = ({ on, className = "", ...p }: { on?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) =>
  <button {...p} className={`rounded-lg border px-3 py-2 text-sm transition disabled:opacity-40 ${on ? "border-gold bg-gold/20 text-gold" : "border-white/10 hover:border-gold/50"} ${className}`} />;
export function Bet({ v, set, off }: { v: number; set: (n: number) => void; off?: boolean }) {
  const { balance } = useCasino();
  return <div className="space-y-2"><label className="text-xs uppercase tracking-widest text-white/50">Bet (credits)</label>
    <input type="number" min={1} max={balance} value={v || ""} disabled={off} onChange={e => set(Math.floor(+e.target.value) || 0)} />
    <div className="grid grid-cols-3 gap-2">
      <Chip disabled={off} onClick={() => set(Math.max(1, Math.floor(v / 2)))}>½</Chip>
      <Chip disabled={off} onClick={() => set(Math.min(balance, Math.max(1, v * 2)))}>2×</Chip>
      <Chip disabled={off} onClick={() => set(balance)}>Max</Chip></div></div>;
}
export const Shell = ({ title, icon, children }: { title: string; icon: string; children: ReactNode }) =>
  <div className="mx-auto max-w-5xl px-4 py-8"><h1 className="mb-6 text-3xl font-bold text-gold">{icon} {title}</h1>
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">{children}</div></div>;
