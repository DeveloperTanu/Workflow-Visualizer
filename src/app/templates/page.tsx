"use client";
import { useRouter } from "next/navigation";
import { useAppState } from "@/hooks/useAppState";
import { TEMPLATES, fromTemplate } from "@/features/templates/templates";
export default function Templates() {
  const router = useRouter(); const { update } = useAppState();
  return (
    <div className="mx-auto max-w-4xl p-6"><h1 className="mb-4 text-xl font-semibold">Templates</h1>
      <div className="grid gap-3 sm:grid-cols-2">{TEMPLATES.map((t) => (
        <button key={t.name} className="card text-left hover:border-accent" onClick={() => { const w = fromTemplate(t); update((s) => ({ ...s, workflows: [w, ...s.workflows] })); router.push(`/workflows/${w.id}`); }}>
          <div className="font-medium">{t.name}</div><div className="text-muted">{t.nodes.length} nodes · opens in the editor</div></button>))}</div></div>);
}
