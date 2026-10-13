import type { NodeType } from "@/types/workflow";
export interface Field { key: string; label: string; def: string; options?: string[]; multiline?: boolean }
export interface NodeDef { title: string; desc: string; category: string; hasInput: boolean; outputs: string[]; fields: Field[] }
export const DEFS: Record<NodeType, NodeDef> = {
  chat_input: { title: "Chat Input", desc: "Provides the starting text.", category: "Input & Output", hasInput: false, outputs: ["Chat Message"], fields: [{ key: "text", label: "Input text", def: "Hello" }] },
  static_text: { title: "Static Text", desc: "Returns configured text.", category: "Data Sources", hasInput: false, outputs: ["Text"], fields: [{ key: "text", label: "Text", def: "Static text", multiline: true }] },
  prompt: { title: "Prompt Template", desc: "Interpolates {{input}}.", category: "LLM Operations", hasInput: true, outputs: ["Prompt"], fields: [{ key: "template", label: "Template", def: "Answer as an expert: {{input}}", multiline: true }] },
  llm: { title: "Language Model", desc: "Simulated; no model is called.", category: "Models & Agents", hasInput: true, outputs: ["Model Response"], fields: [{ key: "model", label: "Model name", def: "sim-model-1" }] },
  formatter: { title: "Text Formatter", desc: "Transforms a string.", category: "Processing", hasInput: true, outputs: ["Text"], fields: [{ key: "op", label: "Operation", def: "uppercase", options: ["uppercase", "lowercase", "trim", "reverse"] }] },
  merge: { title: "Merge", desc: "Joins incoming values.", category: "Flow Control", hasInput: true, outputs: ["Merged"], fields: [{ key: "sep", label: "Separator", def: " " }] },
  condition: { title: "Condition", desc: "Routes to True or False.", category: "Flow Control", hasInput: true, outputs: ["True", "False"], fields: [{ key: "op", label: "Operator", def: "contains", options: ["contains", "equals", "not equals", "starts with", "is empty", "longer than"] }, { key: "value", label: "Compare value", def: "Hello" }] },
  chat_output: { title: "Chat Output", desc: "Shows the final result.", category: "Input & Output", hasInput: true, outputs: ["Output Message"], fields: [] },
};
export const defaultData = (t: NodeType): Record<string, string> => Object.fromEntries(DEFS[t].fields.map((f) => [f.key, f.def]));
