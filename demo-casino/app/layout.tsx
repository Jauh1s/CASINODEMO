import "./globals.css";
import type { Metadata } from "next";
import { Provider, Toasts } from "@/components/Casino";
import { Navbar, Footer } from "@/components/Navbar";
export const metadata: Metadata = { title: "Royal Demo Casino — Play Money", description: "Fictional play-money casino demo. No real money." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><Provider>
    <div className="bg-red-600/90 py-1 text-center text-xs font-bold tracking-widest text-white">DEMO / PLAY MONEY — VIRTUAL CREDITS ONLY</div>
    <Navbar /><main>{children}</main><Footer /><Toasts /></Provider></body></html>;
}
