"use client";
import Link from "next/link";
import { useState } from "react";
import { Star, Copy, Trash2 } from "lucide-react";
import { useAppState } from "@/hooks/useAppState";
export default function Workflows() {
  const { state, update, ready } = useAppState(); const [q, setQ] = useState(""); const [fav, setFav] = useState(false);
  const list = state.workflows.filter((w) => w.name.toLowerCase().includes(q.toLowerCase()) && (!fav || w.favorite)).sort((a, b) => b.updatedAt - a.updatedAt);
  if (!ready) return null;
  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="flex flex-wrap gap-2"><input aria-label="Search workflows" placeholder="Search" className="flex-1 rounded border border-line bg-surface px-3 py-1.5" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className={`btn ${fav ? "text-accent" : ""}`} onClick={() => setFav(!fav)}>Favorites</button><Link href="/workflows/new" className="btn btn-pri">New workflow</Link></div>
      {list.length === 0 && <p className="card text-muted">No workflows found.</p>}
      <ul className="space-y-2">{list.map((w) => (
        <li key={w.id} className="card flex items-center gap-2"><Link href={`/workflows/${w.id}`} className="flex-1 hover:text-accent">{w.name}<span className="text-muted"> · {w.nodes.length} nodes</span></Link>
          <button className="btn" aria-label="Favorite" onClick={() => update((s) => ({ ...s, workflows: s.workflows.map((x) => (x.id === w.id ? { ...x, favorite: !x.favorite } : x)) }))}><Star size={14} className={w.favorite ? "fill-current text-accent" : ""} /></button>
          <button className="btn" aria-label="Duplicate" onClick={() => update((s) => ({ ...s, workflows: [{ ...w, id: crypto.randomUUID(), name: `${w.name} copy`, updatedAt: Date.now() }, ...s.workflows] }))}><Copy size={14} /></button>
          <button className="btn" aria-label="Delete" onClick={() => confirm(`Delete "${w.name}"?`) && update((s) => ({ ...s, workflows: s.workflows.filter((x) => x.id !== w.id) }))}><Trash2 size={14} /></button></li>))}</ul>
    </div>);
}
