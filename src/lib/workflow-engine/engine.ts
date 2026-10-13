import type { Workflow, WfNode } from "@/types/workflow";
import { DEFS } from "./nodeDefs";
export interface Step { id: string; title: string; status: "success" | "failed" | "skipped"; out?: string; error?: string; ms: number }
export interface RunResult { ok: boolean; steps: Step[]; final: string; error?: string; ms: number }
export const MAX_NODES = 100;
export const interpolate = (t: string, v: Record<string, string>) => t.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k: string) => v[k] ?? "");
export function evalCondition(op: string, input: string, val: string): boolean {
  switch (op) {
    case "contains": return input.includes(val);
    case "equals": return input === val;
    case "not equals": return input !== val;
    case "starts with": return input.startsWith(val);
    case "is empty": return input.trim() === "";
    case "longer than": return input.length > (Number(val) || 0);
    default: throw new Error(`Unknown operator: ${op}`);
  }
}
export function topoOrder(wf: Workflow): string[] {
  const indeg = new Map(wf.nodes.map((n) => [n.id, 0]));
  wf.edges.forEach((e) => indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1));
  const q = wf.nodes.filter((n) => !indeg.get(n.id)).map((n) => n.id), out: string[] = [];
  while (q.length) {
    const id = q.shift() as string; out.push(id);
    for (const e of wf.edges.filter((x) => x.from === id)) { const d = (indeg.get(e.to) ?? 1) - 1; indeg.set(e.to, d); if (d === 0) q.push(e.to); }
  }
  if (out.length !== wf.nodes.length) throw new Error("Cycle detected in workflow.");
  return out;
}
function evalNode(n: WfNode, ins: string[]): { v: string; port?: number } {
  const d = n.data, input = ins.join("\n");
  switch (n.type) {
    case "chat_input": if (!d.text?.trim()) throw new Error("Input text is required."); return { v: d.text };
    case "static_text": return { v: d.text ?? "" };
    case "prompt": return { v: interpolate(d.template ?? "", { input }) };
    case "llm": return { v: `[SIMULATED, no model called] (${d.model}) Echo: "${input.slice(0, 120)}"` };
    case "formatter": return { v: d.op === "uppercase" ? input.toUpperCase() : d.op === "lowercase" ? input.toLowerCase() : d.op === "trim" ? input.trim() : [...input].reverse().join("") };
    case "merge": return { v: ins.join(d.sep ?? " ") };
    case "condition": return { v: input, port: evalCondition(d.op, input, d.value ?? "") ? 0 : 1 };
    case "chat_output": return { v: input };
    default: throw new Error(`Unsupported node type: ${String(n.type)}`);
  }
}
export function runWorkflow(wf: Workflow): RunResult {
  const t0 = Date.now(), steps: Step[] = [];
  const fail = (error: string): RunResult => ({ ok: false, steps, final: "", error, ms: Date.now() - t0 });
  if (!wf.nodes.length) return fail("Workflow is empty.");
  if (!wf.nodes.some((n) => n.type === "chat_output")) return fail("Add a Chat Output node.");
  let order: string[];
  try { order = topoOrder(wf); } catch (e) { return fail((e as Error).message); }
  if (order.length > MAX_NODES) return fail("Maximum node-execution limit reached.");
  const out = new Map<string, { v: string; port?: number } | null>(); let final = "";
  for (const id of order) {
    const n = wf.nodes.find((x) => x.id === id) as WfNode, title = DEFS[n.type].title, s = Date.now();
    const incoming = wf.edges.filter((e) => e.to === id);
    const usable = incoming.filter((e) => { const o = out.get(e.from); return o && (o.port === undefined || o.port === e.port); });
    if (DEFS[n.type].hasInput && !incoming.length) { steps.push({ id, title, status: "failed", error: "No input connected.", ms: 0 }); return fail(`${title}: no input connected.`); }
    if (incoming.length && !usable.length) { out.set(id, null); steps.push({ id, title, status: "skipped", ms: 0 }); continue; }
    try {
      const r = evalNode(n, usable.map((e) => (out.get(e.from) as { v: string }).v));
      out.set(id, r); if (n.type === "chat_output") final = r.v;
      steps.push({ id, title, status: "success", out: r.v, ms: Date.now() - s });
    } catch (e) { steps.push({ id, title, status: "failed", error: (e as Error).message, ms: Date.now() - s }); return fail(`${title}: ${(e as Error).message}`); }
  }
  return { ok: true, steps, final, ms: Date.now() - t0 };
}
