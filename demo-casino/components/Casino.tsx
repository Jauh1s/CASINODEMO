"use client";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
export type Entry = { id: number; game: string; bet: number; win: number; note: string; t: number };
type Toast = { id: number; msg: string; ok: boolean };
type Ctx = { ready: boolean; balance: number; name: string; history: Entry[]; toasts: Toast[];
  take: (bet: number) => boolean; pay: (game: string, bet: number, payout: number, note: string) => void;
  reset: () => void; clear: () => void; setName: (n: string) => void; toast: (m: string, ok?: boolean) => void };
const START = 10000, KEY = "demo-casino-v1";
const C = createContext<Ctx>(null as unknown as Ctx);
export const useCasino = () => useContext(C);

export function Provider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false), [balance, setBal] = useState(START);
  const [name, setName] = useState("Guest"), [history, setH] = useState<Entry[]>([]), [toasts, setT] = useState<Toast[]>([]);
  const bal = useRef(START), id = useRef(1);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "null");
      if (s) { bal.current = Math.max(0, Math.floor(+s.balance) || 0); setBal(bal.current); setName(s.name || "Guest"); setH(s.history || []); }
      else setName("Player" + (1000 + Math.floor(Math.random() * 9000)));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify({ balance, name, history })); }, [ready, balance, name, history]);
  const toast = (msg: string, ok = true) => {
    const i = id.current++; setT(t => [...t, { id: i, msg, ok }]);
    setTimeout(() => setT(t => t.filter(x => x.id !== i)), 3000);
  };
  const take = (b: number) => {
    if (!Number.isInteger(b) || b <= 0) { toast("Enter a valid bet", false); return false; }
    if (b > bal.current) { toast("Bet exceeds your balance", false); return false; }
    bal.current -= b; setBal(bal.current); return true;
  };
  const pay = (game: string, bet: number, p: number, note: string) => {
    bal.current += p; setBal(bal.current);
    const win = p - bet;
    setH(h => [{ id: Date.now() + Math.random(), game, bet, win, note, t: Date.now() }, ...h].slice(0, 100));
    toast(win > 0 ? `+${win.toLocaleString()} credits` : win === 0 ? "Push — bet returned" : `-${bet.toLocaleString()} credits`, win >= 0);
  };
  const reset = () => { bal.current = START; setBal(START); setH([]); toast("Balance reset to 10,000"); };
  const clear = () => { setH([]); toast("History cleared"); };
  return <C.Provider value={{ ready, balance, name, history, toasts, take, pay, reset, clear, setName, toast }}>{children}</C.Provider>;
}
export function Balance() {
  const { ready, balance } = useCasino();
  return ready ? <>{balance.toLocaleString()}</> : <span className="inline-block h-4 w-14 animate-pulse rounded bg-white/20 align-middle" />;
}
export function Toasts() {
  const { toasts } = useCasino();
  return <div className="fixed bottom-4 right-4 z-50 space-y-2">{toasts.map(t =>
    <div key={t.id} className={`animate-slide rounded-xl border px-4 py-3 text-sm font-semibold shadow-xl ${t.ok ? "border-gold/60 bg-plum text-gold" : "border-red-500/60 bg-red-950 text-red-300"}`}>{t.msg}</div>)}</div>;
}
