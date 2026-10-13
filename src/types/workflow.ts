export type NodeType = "chat_input" | "static_text" | "prompt" | "llm" | "formatter" | "condition" | "merge" | "chat_output";
export interface WfNode { id: string; type: NodeType; x: number; y: number; data: Record<string, string> }
export interface WfEdge { id: string; from: string; port: number; to: string }
export interface Workflow { id: string; name: string; nodes: WfNode[]; edges: WfEdge[]; updatedAt: number; favorite: boolean }
export interface RunRecord { id: string; workflowId: string; workflowName: string; at: number; ok: boolean; ms: number; final: string; steps: number; log: string[] }
export interface Settings { theme: "light" | "dark" | "system" }
export interface AppState { version: 1; workflows: Workflow[]; runs: RunRecord[]; settings: Settings }
