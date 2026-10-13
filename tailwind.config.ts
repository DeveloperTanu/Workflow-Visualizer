import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: { colors: { bg: "var(--bg)", surface: "var(--surface)", fg: "var(--fg)", muted: "var(--muted)", line: "var(--line)", accent: "var(--accent)" }, borderRadius: { DEFAULT: "6px" } } },
} satisfies Config;
