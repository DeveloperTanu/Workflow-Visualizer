"use client";
import Link from "next/link";
import { useAppState } from "@/hooks/useAppState";
export default function Dashboard() {
  const { state, ready } = useAppState(); const { workflows, runs } = state;
  const rate = runs.length ? Math.round((runs.filter((r) => r.ok).length / runs.length) * 100) : null;
  const recent = [...workflows].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
  if (!ready) return null;
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2"><div><h1 className="text-xl font-semibold">Welcome back</h1><p className="text-muted">Build workflows by connecting nodes, then run them locally.</p></div><Link href="/workflows/new" className="btn btn-pri">Create workflow</Link></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="card"><div className="text-muted">Workflows</div><div className="text-2xl font-semibold">{workflows.length}</div></div>
        <div className="card"><div className="text-muted">Runs</div><div className="text-2xl font-semibold">{runs.length}</div></div>
        <div className="card"><div className="text-muted">Success rate</div><div className="text-2xl font-semibold">{rate === null ? "—" : `${rate}%`}</div></div>
      </div>
      <section><h2 className="mb-2 font-semibold">Recently edited</h2>
        {recent.length ? <ul className="space-y-2">{recent.map((w) => (<li key={w.id}><Link className="card block hover:border-accent" href={`/workflows/${w.id}`}>{w.name}<span className="text-muted"> · {w.nodes.length} nodes · {new Date(w.updatedAt).toLocaleString()}</span></Link></li>))}</ul>
          : <p className="card text-muted">No workflows yet. <Link className="text-accent" href="/templates">Start from a template</Link> or create a blank one.</p>}</section>
      <section><h2 className="mb-2 font-semibold">Recent executions</h2>
        {runs.length ? <ul className="space-y-2">{runs.slice(0, 5).map((r) => <li key={r.id} className="card">{r.ok ? "✓" : "✗"} {r.workflowName}<span className="text-muted"> · {r.ms}ms · {new Date(r.at).toLocaleString()}</span></li>)}</ul> : <p className="card text-muted">Runs will appear here after you execute a workflow.</p>}</section>
    </div>);
}
