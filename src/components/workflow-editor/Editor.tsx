"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ReactFlow, Background, Controls, MiniMap, Handle, Position, addEdge, useNodesState, useEdgesState, type Connection, type Edge, type Node, type NodeProps } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ArrowLeft, Play, Trash2 } from "lucide-react";
import { useAppState } from "@/hooks/useAppState";
import { DEFS, defaultData } from "@/lib/workflow-engine/nodeDefs";
import { runWorkflow } from "@/lib/workflow-engine/engine";
import type { NodeType, Workflow } from "@/types/workflow";
type RFData = { kind: NodeType; values: Record<string, string>; status?: string };
type RFNode = Node<RFData>;
function WfNodeView({ data, selected }: NodeProps<RFNode>) {
  const d = DEFS[data.kind]; const first = d.fields[0];
  const ring = data.status === "success" ? "border-green-600" : data.status === "failed" ? "border-red-600" : data.status === "skipped" ? "opacity-50 border-line" : selected ? "border-accent" : "border-line";
  return (
    <div className={`w-56 rounded-lg border bg-surface text-fg ${ring}`}>
      {d.hasInput && <Handle type="target" position={Position.Left} />}
      <div className="px-3 pt-2 font-semibold">{d.title}</div>
      <div className="px-3 pb-2 text-xs text-muted">{d.desc}{first && <div className="mt-1 truncate rounded border border-line bg-bg px-2 py-1 text-fg">{data.values[first.key] || "—"}</div>}</div>
      {d.outputs.map((o, i) => (<div key={o} className="relative border-t border-line px-3 py-1 text-right text-xs">{o}<Handle id={`o${i}`} type="source" position={Position.Right} style={{ top: "50%" }} /></div>))}
    </div>);
}
const nodeTypes = { wf: WfNodeView };
const toRF = (wf: Workflow): { n: RFNode[]; e: Edge[] } => ({
  n: wf.nodes.map((n) => ({ id: n.id, type: "wf", position: { x: n.x, y: n.y }, data: { kind: n.type, values: n.data } })),
  e: wf.edges.map((e) => ({ id: e.id, source: e.from, sourceHandle: `o${e.port}`, target: e.to })) });
export function Editor({ workflow }: { workflow: Workflow }) {
  const { update } = useAppState(); const init = useMemo(() => toRF(workflow), [workflow]);
  const [nodes, setNodes, onNodesChange] = useNodesState<RFNode>(init.n); const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(init.e);
  const [name, setName] = useState(workflow.name); const [saved, setSaved] = useState("Saved");
  const [log, setLog] = useState<string[]>([]); const [sel, setSel] = useState<string | null>(null);
  const snapshot = useCallback((): Workflow => ({ ...workflow, name, updatedAt: Date.now(),
    nodes: nodes.map((n) => ({ id: n.id, type: n.data.kind, x: n.position.x, y: n.position.y, data: n.data.values })),
    edges: edges.map((e) => ({ id: e.id, from: e.source, port: Number((e.sourceHandle ?? "o0").slice(1)), to: e.target })) }), [workflow, name, nodes, edges]);
  const save = useCallback(() => update((s) => ({ ...s, workflows: s.workflows.some((w) => w.id === workflow.id) ? s.workflows.map((w) => (w.id === workflow.id ? snapshot() : w)) : [snapshot(), ...s.workflows] })), [update, snapshot, workflow.id]);
  useEffect(() => { setSaved("Saving…"); const t = setTimeout(() => { save(); setSaved("Saved"); }, 600); return () => clearTimeout(t); }, [nodes, edges, name]); // eslint-disable-line react-hooks/exhaustive-deps
  const onConnect = useCallback((c: Connection) => {
    if (c.source === c.target) return;
    setEdges((es) => (es.some((e) => e.source === c.source && e.target === c.target && e.sourceHandle === c.sourceHandle) ? es : addEdge(c, es)));
  }, [setEdges]);
  const add = (t: NodeType) => setNodes((ns) => [...ns, { id: crypto.randomUUID(), type: "wf", position: { x: 80 + ns.length * 24, y: 80 + ns.length * 24 }, data: { kind: t, values: defaultData(t) } }]);
  const run = () => {
    const wf = snapshot(); const r = runWorkflow(wf); const st = new Map(r.steps.map((s) => [s.id, s.status]));
    setNodes((ns) => ns.map((n) => ({ ...n, data: { ...n.data, status: st.get(n.id) } })));
    const lines = r.steps.map((s) => `${s.status === "success" ? "✓" : s.status === "skipped" ? "⤼" : "✗"} ${s.title}${s.out ? ` → ${s.out.slice(0, 120)}` : ""}${s.error ? `: ${s.error}` : ""}`);
    lines.push(r.ok ? `Done in ${r.ms}ms. Result: ${r.final}` : `Failed: ${r.error}`); setLog(lines);
    update((s) => ({ ...s, runs: [{ id: crypto.randomUUID(), workflowId: wf.id, workflowName: wf.name, at: Date.now(), ok: r.ok, ms: r.ms, final: r.final, steps: r.steps.length, log: lines }, ...s.runs].slice(0, 200) }));
  };
  const selected = nodes.find((n) => n.id === sel);
  const setVal = (k: string, v: string) => setNodes((ns) => ns.map((n) => (n.id === sel ? { ...n, data: { ...n.data, values: { ...n.data.values, [k]: v } } } : n)));
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-line bg-surface p-2">
        <Link href="/workflows" className="btn" aria-label="Back to workflows"><ArrowLeft size={16} /></Link>
        <input aria-label="Workflow name" className="rounded border border-transparent bg-transparent px-2 py-1 font-semibold hover:border-line" value={name} onChange={(e) => setName(e.target.value)} />
        <span className="text-xs text-muted" role="status">{saved}</span><span className="flex-1" />
        <button className="btn" onClick={() => { setNodes([]); setEdges([]); }} aria-label="Clear"><Trash2 size={16} /></button>
        <button className="btn btn-pri flex items-center gap-1" onClick={run}><Play size={14} />Run</button>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="hidden w-52 overflow-auto border-r border-line bg-surface p-2 sm:block">
          {(Object.keys(DEFS) as NodeType[]).map((t) => (<button key={t} className="btn mb-1 block w-full text-left" onClick={() => add(t)}>{DEFS[t].title}<div className="text-xs text-muted">{DEFS[t].category}</div></button>))}
        </div>
        <div className="flex-1">
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onSelectionChange={({ nodes: s }) => setSel(s[0]?.id ?? null)} fitView deleteKeyCode={["Delete", "Backspace"]}>
            <Background gap={20} /><Controls /><MiniMap pannable zoomable />
          </ReactFlow>
        </div>
        {selected && (
          <aside className="w-64 overflow-auto border-l border-line bg-surface p-3" aria-label="Inspector">
            <div className="font-semibold">{DEFS[selected.data.kind].title}</div>
            {DEFS[selected.data.kind].fields.map((f) => (<label key={f.key} className="mt-3 block text-xs text-muted">{f.label}
              {f.options ? <select className="mt-1 w-full rounded border border-line bg-bg p-1.5 text-fg" value={selected.data.values[f.key]} onChange={(e) => setVal(f.key, e.target.value)}>{f.options.map((o) => <option key={o}>{o}</option>)}</select>
                : f.multiline ? <textarea rows={4} className="mt-1 w-full rounded border border-line bg-bg p-1.5 text-fg" value={selected.data.values[f.key]} onChange={(e) => setVal(f.key, e.target.value)} />
                : <input className="mt-1 w-full rounded border border-line bg-bg p-1.5 text-fg" value={selected.data.values[f.key]} onChange={(e) => setVal(f.key, e.target.value)} />}</label>))}
          </aside>)}
      </div>
      {log.length > 0 && <pre className="max-h-40 overflow-auto border-t border-line bg-surface p-2 font-mono text-xs" aria-live="polite">{log.join("\n")}</pre>}
    </div>);
}
