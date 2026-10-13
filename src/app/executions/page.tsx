"use client";
import { useState } from "react";
import { useAppState } from "@/hooks/useAppState";
export default function Executions() {
  const { state, ready } = useAppState(); const [q, setQ] = useState(""); const [open, setOpen] = useState<string | null>(null);
  if (!ready) return null;
  const list = state.runs.filter((r) => r.workflowName.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto max-w-4xl space-y-3 p-6"><input aria-label="Search executions" placeholder="Search by workflow" className="w-full rounded border border-line bg-surface px-3 py-1.5" value={q} onChange={(e) => setQ(e.target.value)} />
      {list.length === 0 && <p className="card text-muted">No executions yet. Run a workflow from the editor.</p>}
      {list.map((r) => (<div key={r.id} className="card"><button className="w-full text-left" onClick={() => setOpen(open === r.id ? null : r.id)}>{r.ok ? "✓" : "✗"} {r.workflowName}<span className="text-muted"> · {r.ms}ms · {r.steps} nodes · {new Date(r.at).toLocaleString()}</span><div className="truncate text-muted">{r.final}</div></button>
        {open === r.id && <pre className="mt-2 overflow-auto rounded bg-bg p-2 font-mono text-xs">{r.log.join("\n")}</pre>}</div>))}</div>);
}
