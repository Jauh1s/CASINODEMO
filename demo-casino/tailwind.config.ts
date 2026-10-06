import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  theme: { extend: { colors: { gold: "#d4af37", ink: "#07050d", plum: "#2a1245" } } }, plugins: [] } satisfies Config;
