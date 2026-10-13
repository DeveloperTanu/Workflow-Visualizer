import type { NodeType, Workflow } from "@/types/workflow";
import { defaultData } from "@/lib/workflow-engine/nodeDefs";
type T = { name: string; nodes: [NodeType, number, number, Record<string, string>?][]; edges: [number, number, number][] };
export const TEMPLATES: T[] = [
  { name: "Prompt Builder", nodes: [["chat_input", 0, 60, { text: "Explain closures" }], ["prompt", 300, 60], ["llm", 600, 60], ["chat_output", 900, 60]], edges: [[0, 0, 1], [1, 0, 2], [2, 0, 3]] },
  { name: "Conditional Text Processor", nodes: [["chat_input", 0, 80], ["condition", 300, 80], ["formatter", 600, 0, { op: "uppercase" }], ["formatter", 600, 200, { op: "reverse" }], ["chat_output", 900, 100]], edges: [[0, 0, 1], [1, 0, 2], [1, 1, 3], [2, 0, 4], [3, 0, 4]] },
  { name: "Simple Text Formatter", nodes: [["static_text", 0, 60], ["formatter", 300, 60], ["chat_output", 600, 60]], edges: [[0, 0, 1], [1, 0, 2]] },
];
export function fromTemplate(t: T): Workflow {
  const ids = t.nodes.map(() => crypto.randomUUID());
  return { id: crypto.randomUUID(), name: t.name, favorite: false, updatedAt: Date.now(),
    nodes: t.nodes.map(([type, x, y, d], i) => ({ id: ids[i], type, x, y, data: { ...defaultData(type), ...d } })),
    edges: t.edges.map(([a, p, b]) => ({ id: crypto.randomUUID(), from: ids[a], port: p, to: ids[b] })) };
}
export const blankWorkflow = (): Workflow => ({ id: crypto.randomUUID(), name: "Untitled workflow", nodes: [], edges: [], favorite: false, updatedAt: Date.now() });
