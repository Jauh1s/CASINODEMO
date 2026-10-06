"use client";
import { useState } from "react";
import { useCasino } from "./Casino";
import { Bet, Btn, Card, Chip, Shell } from "./ui";
import { rand, shuffle } from "@/lib/rng";

const Msg = ({ children }: { children: React.ReactNode }) => <p key={String(children)} className="animate-pop mt-4 text-center text-lg font-bold text-gold">{children}</p>;

/* ---------- SLOTS ---------- */
const SYM = ["🍒", "🍋", "🔔", "⭐", "💎", "7️⃣"], MUL = [5, 8, 10, 15, 25, 50];
function Slots() {
  const { take, pay } = useCasino();
  const [bet, setBet] = useState(100), [r, setR] = useState([0, 1, 2]), [busy, setBusy] = useState(false), [msg, setMsg] = useState("Place your bet and spin!");
  const spin = () => {
    if (busy || !take(bet)) return;
    setBusy(true); setMsg("Spinning…");
    const fin = [rand(6), rand(6), rand(6)];
    const t = setInterval(() => setR([rand(6), rand(6), rand(6)]), 90);
    setTimeout(() => {
      clearInterval(t); setR(fin);
      const [a, b, c] = fin; const m = a === b && b === c ? MUL[a] : a === b || b === c || a === c ? 1 : 0;
      pay("Slots", bet, bet * m, `${fin.map(i => SYM[i]).join("")} ×${m}`);
      setMsg(m > 1 ? `JACKPOT ×${m}! +${(bet * m - bet).toLocaleString()}` : m === 1 ? "Two of a kind — bet returned" : "No match");
      setBusy(false);
    }, 1200);
  };
  return <Shell title="Slots" icon="🎰"><Card className="space-y-4"><Bet v={bet} set={setBet} off={busy} /><Btn className="w-full" onClick={spin} disabled={busy}>{busy ? "Spinning…" : "SPIN"}</Btn>
    <p className="text-xs text-white/40">3 match: 🍒5× 🍋8× 🔔10× ⭐15× 💎25× 7️⃣50× · 2 match: bet back</p></Card>
    <Card><div className="flex justify-center gap-3">{r.map((s, i) => <div key={i} className={`flex h-28 w-24 items-center justify-center rounded-xl border-2 border-gold/50 bg-ink text-6xl ${busy ? "animate-pulse" : ""}`}>{SYM[s]}</div>)}</div><Msg>{msg}</Msg></Card></Shell>;
}

/* ---------- BLACKJACK ---------- */
type PC = { r: string; s: string };
const mkDeck = () => shuffle("♠♥♦♣".split("").flatMap(s => ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"].map(r => ({ r, s }))));
const val = (h: PC[]) => { let t = 0, a = 0; for (const c of h) { if (c.r === "A") { a++; t += 11; } else t += ["J", "Q", "K", "10"].includes(c.r) ? 10 : +c.r; } while (t > 21 && a > 0) { t -= 10; a--; } return t; };
const Face = ({ c, hide }: { c?: PC; hide?: boolean }) => <div className={`animate-pop flex h-24 w-16 flex-col items-center justify-center rounded-lg border-2 text-xl font-bold ${hide || !c ? "border-gold bg-plum text-gold" : "border-white/30 bg-white " + (c.s === "♥" || c.s === "♦" ? "text-red-600" : "text-black")}`}>{hide || !c ? "♠" : <><span>{c.r}</span><span>{c.s}</span></>}</div>;
function Blackjack() {
  const { take, pay } = useCasino();
  const [bet, setBet] = useState(100);
  const [g, setG] = useState({ deck: [] as PC[], p: [] as PC[], d: [] as PC[], bet: 0, phase: "bet", msg: "Place your bet and deal." });
  const finish = (p: PC[], d: PC[], deck: PC[], b: number) => {
    const dd = [...d], pv = val(p);
    if (pv <= 21) while (val(dd) < 17) dd.push(deck.pop()!);
    const dv = val(dd), bj = p.length === 2 && pv === 21; let out = 0, m = "Dealer wins";
    if (pv > 21) m = "Bust — dealer wins";
    else if (bj && !(dd.length === 2 && dv === 21)) { out = Math.floor(b * 2.5); m = "Blackjack! Pays 3:2"; }
    else if (dv > 21 || pv > dv) { out = b * 2; m = dv > 21 ? "Dealer busts — you win!" : "You win!"; }
    else if (pv === dv) { out = b; m = "Push"; }
    pay("Blackjack", b, out, `${pv} vs ${dv}`);
    setG({ deck, p, d: dd, bet: b, phase: "done", msg: m });
  };
  const deal = () => {
    if (!take(bet)) return;
    const deck = mkDeck(), p = [deck.pop()!, deck.pop()!], d = [deck.pop()!, deck.pop()!];
    if (val(p) === 21) finish(p, d, deck, bet); else setG({ deck, p, d, bet, phase: "play", msg: "Your move." });
  };
  const hit = () => { const deck = [...g.deck], p = [...g.p, deck.pop()!]; if (val(p) >= 21) finish(p, g.d, deck, g.bet); else setG({ ...g, deck, p }); };
  const dbl = () => { if (!take(g.bet)) return; const deck = [...g.deck]; finish([...g.p, deck.pop()!], g.d, deck, g.bet * 2); };
  const play = g.phase === "play";
  return <Shell title="Blackjack" icon="🃏"><Card className="space-y-4"><Bet v={bet} set={setBet} off={play} />
    {!play ? <Btn className="w-full" onClick={deal}>DEAL</Btn> : <div className="grid grid-cols-3 gap-2"><Btn onClick={hit}>Hit</Btn><Btn onClick={() => finish(g.p, g.d, [...g.deck], g.bet)}>Stand</Btn><Btn onClick={dbl} disabled={g.p.length !== 2}>Double</Btn></div>}
    <p className="text-xs text-white/40">Dealer stands on 17 · Blackjack pays 3:2</p></Card>
    <Card className="space-y-5"><div><p className="mb-2 text-xs uppercase text-white/50">Dealer {g.phase === "done" ? `(${val(g.d)})` : ""}</p><div className="flex min-h-24 gap-2">{g.d.map((c, i) => <Face key={i} c={c} hide={play && i === 1} />)}</div></div>
      <div><p className="mb-2 text-xs uppercase text-white/50">You {g.p.length ? `(${val(g.p)})` : ""}</p><div className="flex min-h-24 gap-2">{g.p.map((c, i) => <Face key={i} c={c} />)}</div></div><Msg>{g.msg}</Msg></Card></Shell>;
}

/* ---------- ROULETTE ---------- */
const RED = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const col = (n: number) => n === 0 ? "bg-green-600" : RED.includes(n) ? "bg-red-600" : "bg-zinc-800";
const OPTS: [string, (n: number, p: number) => boolean, number][] = [["Red", n => RED.includes(n), 2], ["Black", n => n > 0 && !RED.includes(n), 2], ["Even", n => n > 0 && n % 2 === 0, 2], ["Odd", n => n % 2 === 1, 2], ["1–18", n => n >= 1 && n <= 18, 2], ["19–36", n => n >= 19, 2], ["Number", (n, p) => n === p, 36]];
function Roulette() {
  const { take, pay } = useCasino();
  const [bet, setBet] = useState(100), [sel, setSel] = useState(0), [pick, setPick] = useState(7), [n, setN] = useState<number | null>(null), [busy, setBusy] = useState(false), [msg, setMsg] = useState("Choose a bet and spin.");
  const spin = () => {
    if (busy || !take(bet)) return;
    setBusy(true); setMsg("No more bets…");
    const fin = rand(37), t = setInterval(() => setN(rand(37)), 80);
    setTimeout(() => {
      clearInterval(t); setN(fin);
      const [label, test, m] = OPTS[sel], w = test(fin, pick);
      pay("Roulette", bet, w ? bet * m : 0, `${label}${sel === 6 ? " " + pick : ""} · landed ${fin}`);
      setMsg(w ? `${fin} — you win ×${m}!` : `${fin} — house wins`); setBusy(false);
    }, 1800);
  };
  return <Shell title="Roulette" icon="🎡"><Card className="space-y-4"><Bet v={bet} set={setBet} off={busy} />
    <div className="grid grid-cols-2 gap-2">{OPTS.map((o, i) => <Chip key={o[0]} on={sel === i} disabled={busy} onClick={() => setSel(i)}>{o[0]} <span className="text-white/40">{o[2] - 1}:1</span></Chip>)}</div>
    {sel === 6 && <input type="number" min={0} max={36} value={pick} disabled={busy} onChange={e => setPick(Math.min(36, Math.max(0, Math.floor(+e.target.value) || 0)))} />}
    <Btn className="w-full" onClick={spin} disabled={busy}>SPIN</Btn></Card>
    <Card className="flex flex-col items-center"><div className={`flex h-40 w-40 items-center justify-center rounded-full border-8 border-gold text-6xl font-black ${n === null ? "bg-ink" : col(n)} ${busy ? "animate-spin [animation-duration:.8s]" : ""}`}><span className={busy ? "animate-pulse" : ""}>{n ?? "?"}</span></div><Msg>{msg}</Msg></Card></Shell>;
}

/* ---------- COIN FLIP ---------- */
function CoinFlip() {
  const { take, pay } = useCasino();
  const [bet, setBet] = useState(100), [side, setSide] = useState(0), [res, setRes] = useState<number | null>(null), [busy, setBusy] = useState(false), [msg, setMsg] = useState("Call it!");
  const flip = () => {
    if (busy || !take(bet)) return;
    setBusy(true); setMsg("Flipping…");
    const out = rand(2);
    setTimeout(() => { setRes(out); const w = out === side; pay("Coin Flip", bet, w ? Math.floor(bet * 1.96) : 0, `${["Heads", "Tails"][side]} vs ${["Heads", "Tails"][out]}`); setMsg(w ? "You win ×1.96!" : "Wrong side"); setBusy(false); }, 1000);
  };
  return <Shell title="Coin Flip" icon="🪙"><Card className="space-y-4"><Bet v={bet} set={setBet} off={busy} />
    <div className="grid grid-cols-2 gap-2"><Chip on={side === 0} disabled={busy} onClick={() => setSide(0)}>Heads</Chip><Chip on={side === 1} disabled={busy} onClick={() => setSide(1)}>Tails</Chip></div>
    <Btn className="w-full" onClick={flip} disabled={busy}>FLIP</Btn></Card>
    <Card className="flex flex-col items-center"><div className={`flex h-36 w-36 items-center justify-center rounded-full border-4 border-yellow-200 bg-gradient-to-br from-gold to-yellow-700 text-3xl font-black text-black ${busy ? "animate-flip" : ""}`}>{res === null ? "?" : res === 0 ? "H" : "T"}</div><Msg>{msg}</Msg></Card></Shell>;
}

/* ---------- DICE ---------- */
function Dice() {
  const { take, pay } = useCasino();
  const [bet, setBet] = useState(100), [t, setT] = useState(50), [over, setOver] = useState(true), [roll, setRoll] = useState<number | null>(null), [busy, setBusy] = useState(false), [msg, setMsg] = useState("Set your odds and roll.");
  const chance = over ? 100 - t : t - 1, mult = 98 / chance;
  const go = () => {
    if (busy || !take(bet)) return;
    setBusy(true); const r = rand(100) + 1, iv = setInterval(() => setRoll(rand(100) + 1), 60);
    setTimeout(() => {
      clearInterval(iv); setRoll(r); const w = over ? r > t : r < t;
      pay("Dice", bet, w ? Math.floor(bet * mult) : 0, `Roll ${over ? "over" : "under"} ${t} → ${r}`); setMsg(w ? `${r} — you win ×${mult.toFixed(2)}!` : `${r} — you lose`); setBusy(false);
    }, 800);
  };
  return <Shell title="Dice" icon="🎲"><Card className="space-y-4"><Bet v={bet} set={setBet} off={busy} />
    <div className="grid grid-cols-2 gap-2"><Chip on={over} disabled={busy} onClick={() => setOver(true)}>Roll Over</Chip><Chip on={!over} disabled={busy} onClick={() => setOver(false)}>Roll Under</Chip></div>
    <div><label className="text-xs text-white/50">Target: {t}</label><input type="range" min={5} max={95} value={t} disabled={busy} onChange={e => setT(+e.target.value)} className="!p-0" /></div>
    <p className="text-sm text-white/60">Win chance {chance}% · Payout ×{mult.toFixed(2)}</p><Btn className="w-full" onClick={go} disabled={busy}>ROLL</Btn></Card>
    <Card className="flex flex-col items-center"><div className="flex h-36 w-36 items-center justify-center rounded-2xl border-4 border-gold bg-ink text-6xl font-black text-gold">{roll ?? "?"}</div>
      <div className="relative mt-6 h-3 w-full rounded bg-white/10"><div className={`absolute h-3 rounded ${over ? "bg-green-500/70" : "bg-green-500/70"}`} style={over ? { left: `${t}%`, right: 0 } : { left: 0, width: `${t - 1}%` }} />{roll && <div className="absolute -top-1 h-5 w-1 bg-gold transition-all" style={{ left: `${roll}%` }} />}</div><Msg>{msg}</Msg></Card></Shell>;
}

/* ---------- MINES ---------- */
const mineMult = (k: number, m: number) => { let x = 0.97; for (let i = 0; i < k; i++) x *= (25 - i) / (25 - m - i); return x; };
function Mines() {
  const { take, pay } = useCasino();
  const [bet, setBet] = useState(100), [m, setM] = useState(3);
  const [g, setG] = useState<{ bombs: number[]; open: number[]; over: boolean; bet: number } | null>(null), [msg, setMsg] = useState("Start a round, then reveal tiles.");
  const live = !!g && !g.over, k = g?.open.length ?? 0;
  const start = () => { if (!take(bet)) return; setG({ bombs: shuffle([...Array(25).keys()]).slice(0, m), open: [], over: false, bet }); setMsg("Pick a tile…"); };
  const cash = (s = g!) => { const p = Math.floor(s.bet * mineMult(s.open.length, m)); pay("Mines", s.bet, p, `${m} mines · ${s.open.length} gems · ×${mineMult(s.open.length, m).toFixed(2)}`); setG({ ...s, over: true }); setMsg(`Cashed out ${p.toLocaleString()}!`); };
  const click = (i: number) => {
    if (!g || g.over || g.open.includes(i)) return;
    if (g.bombs.includes(i)) { pay("Mines", g.bet, 0, `${m} mines · hit a mine after ${k} gems`); setG({ ...g, open: [...g.open, i], over: true }); setMsg("💥 Boom! You hit a mine."); return; }
    const s = { ...g, open: [...g.open, i] }; setG(s);
    if (s.open.length === 25 - m) cash(s); else setMsg(`Next tile pays ×${mineMult(s.open.length + 1, m).toFixed(2)}`);
  };
  return <Shell title="Mines" icon="💣"><Card className="space-y-4"><Bet v={bet} set={setBet} off={live} />
    <div><label className="text-xs text-white/50">Mines</label><select value={m} disabled={live} onChange={e => setM(+e.target.value)}>{[1, 3, 5, 10, 15, 20, 24].map(x => <option key={x} value={x}>{x}</option>)}</select></div>
    {live ? <Btn className="w-full" onClick={() => cash()} disabled={!k}>Cash out ×{mineMult(k, m).toFixed(2)}</Btn> : <Btn className="w-full" onClick={start}>START ROUND</Btn>}</Card>
    <Card><div className="mx-auto grid max-w-sm grid-cols-5 gap-2">{[...Array(25).keys()].map(i => { const o = g?.open.includes(i), b = g?.bombs.includes(i), show = o || (g?.over && b);
      return <button key={i} onClick={() => click(i)} disabled={!live} className={`aspect-square rounded-lg text-2xl transition ${show ? (b ? "bg-red-900" : "bg-green-900") + " animate-pop" : "bg-plum hover:bg-purple-800"}`}>{show ? (b ? "💣" : "💎") : ""}</button>; })}</div><Msg>{msg}</Msg></Card></Shell>;
}

const MAP: Record<string, () => JSX.Element> = { slots: Slots, blackjack: Blackjack, roulette: Roulette, coinflip: CoinFlip, dice: Dice, mines: Mines };
export function GameView({ slug }: { slug: string }) {
  const { ready } = useCasino(); const G = MAP[slug];
  if (!ready) return <div className="mx-auto max-w-5xl animate-pulse px-4 py-8"><div className="mb-6 h-9 w-48 rounded bg-white/10" /><div className="grid gap-6 md:grid-cols-[300px_1fr]"><div className="h-64 rounded-2xl bg-white/10" /><div className="h-64 rounded-2xl bg-white/10" /></div></div>;
  return <G />;
}
