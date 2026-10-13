"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { LayoutDashboard, Workflow, LayoutTemplate, History, Settings, Menu, Sun, Moon, Boxes } from "lucide-react";
import { useAppState } from "@/hooks/useAppState";
const NAV = [["/", "Dashboard", LayoutDashboard], ["/workflows", "Workflows", Workflow], ["/templates", "Templates", LayoutTemplate], ["/executions", "Executions", History], ["/settings", "Settings", Settings]] as const;
export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname(); const [open, setOpen] = useState(false); const main = useRef<HTMLElement>(null);
  const { state, update, ready } = useAppState();
  useEffect(() => {
    if (!ready) return; const t = state.settings.theme;
    const dark = t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [state.settings.theme, ready]);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !main.current) return;
    const ctx = gsap.context(() => { gsap.from(main.current, { opacity: 0, y: 8, duration: 0.25 }); });
    return () => ctx.revert();
  }, [path]);
  useEffect(() => setOpen(false), [path]);
  const dark = ready && document.documentElement.dataset.theme === "dark";
  return (
    <div className="flex h-screen">
      <aside className={`fixed z-20 inset-y-0 left-0 w-56 border-r border-line bg-surface p-3 flex flex-col gap-1 transition-transform md:static md:translate-x-0 ${open ? "" : "-translate-x-full"}`} aria-label="Primary">
        <div className="flex items-center gap-2 px-2 py-2 font-semibold"><Boxes size={18} className="text-accent" />Workflow Visualizer</div>
        <div className="px-2 py-1 mb-2 text-xs text-muted border border-line rounded">Personal Workspace</div>
        {NAV.map(([href, label, Icon]) => (
          <Link key={href} href={href} className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-bg ${path === href ? "bg-bg text-accent font-medium" : ""}`}><Icon size={16} />{label}</Link>))}
        <button className="btn mt-auto flex items-center gap-2" aria-label="Toggle theme" onClick={() => update((s) => ({ ...s, settings: { theme: dark ? "light" : "dark" } }))}>{dark ? <Sun size={16} /> : <Moon size={16} />}Theme</button>
      </aside>
      {open && <div className="fixed inset-0 z-10 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center gap-2 border-b border-line bg-surface p-2"><button className="btn" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={16} /></button>Workflow Visualizer</header>
        <main ref={main} className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
