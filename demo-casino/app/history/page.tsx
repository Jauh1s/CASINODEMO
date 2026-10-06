"use client";
import { useCasino } from "@/components/Casino";
import { Btn, Card } from "@/components/ui";
export default function History() {
  const { ready, name, setName, history, reset, clear } = useCasino();
  return <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
    <h1 className="text-3xl font-bold text-gold">Player &amp; History</h1>
    <Card className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
      <div><label className="text-xs uppercase tracking-widest text-white/50">Demo username</label>
        <input value={name} maxLength={20} onChange={e => setName(e.target.value)} /></div>
      <Btn onClick={() => window.confirm("Reset balance to 10,000 and clear history?") && reset()}>Reset balance</Btn>
      <Btn className="!bg-none !bg-white/10 !text-white" onClick={clear} disabled={!history.length}>Clear history</Btn>
    </Card>
    <Card>{!ready ? <div className="h-24 animate-pulse rounded bg-white/10" /> : !history.length ?
      <p className="py-10 text-center text-white/50">🎲 No rounds yet — play a game and your results will appear here.</p> :
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-white/50"><tr><th className="p-2">Game</th><th>Details</th><th>Bet</th><th>Result</th><th>Time</th></tr></thead>
        <tbody>{history.map(h => <tr key={h.id} className="border-t border-white/10"><td className="p-2">{h.game}</td><td>{h.note}</td><td>{h.bet.toLocaleString()}</td>
          <td className={h.win > 0 ? "text-green-400" : h.win < 0 ? "text-red-400" : "text-white/60"}>{h.win > 0 ? "+" : ""}{h.win.toLocaleString()}</td>
          <td className="text-white/40">{new Date(h.t).toLocaleTimeString()}</td></tr>)}</tbody></table></div>}</Card></div>;
}
