"use client";
import { useAppState } from "@/hooks/useAppState";
import { DEFAULT_STATE } from "@/lib/storage/storage";
export default function SettingsPage() {
  const { state, update, ready } = useAppState();
  if (!ready) return null;
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6"><h1 className="text-xl font-semibold">Settings</h1>
      <section className="card"><h2 className="mb-2 font-medium">Appearance</h2>
        <select aria-label="Theme" className="rounded border border-line bg-bg p-1.5" value={state.settings.theme} onChange={(e) => update((s) => ({ ...s, settings: { theme: e.target.value as "light" | "dark" | "system" } }))}><option>system</option><option>light</option><option>dark</option></select></section>
      <section className="card"><h2 className="mb-2 font-medium">AI providers</h2><p className="text-muted">All AI nodes run in simulated mode. No model is called and no key is needed. A real provider would be added behind a server-side route reading keys from environment variables (see .env.example).</p></section>
      <section className="card"><h2 className="mb-2 font-medium">Workspace</h2><p className="mb-2 text-muted">Data lives in this browser only (localStorage) and does not sync across devices.</p>
        <button className="btn text-red-600" onClick={() => confirm("Delete all workflows and run history?") && update(() => DEFAULT_STATE)}>Clear local data</button></section></div>);
}
