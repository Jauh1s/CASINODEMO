import { notFound } from "next/navigation";
import { GAMES } from "@/lib/games";
import { GameView } from "@/components/games";
export function generateStaticParams() { return GAMES.map(g => ({ game: g.slug })); }
export default function Page({ params }: { params: { game: string } }) {
  if (!GAMES.some(g => g.slug === params.game)) notFound();
  return <GameView slug={params.game} />;
}
