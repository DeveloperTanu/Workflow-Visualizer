import { z } from "zod";
import type { AppState } from "@/types/workflow";
export const KEY = "wv:state";
const Node = z.object({ id: z.string(), type: z.enum(["chat_input", "static_text", "prompt", "llm", "formatter", "condition", "merge", "chat_output"]), x: z.number(), y: z.number(), data: z.record(z.string()) });
const Edge = z.object({ id: z.string(), from: z.string(), port: z.number(), to: z.string() });
export const WorkflowSchema = z.object({ id: z.string(), name: z.string(), nodes: z.array(Node), edges: z.array(Edge), updatedAt: z.number(), favorite: z.boolean() });
const Run = z.object({ id: z.string(), workflowId: z.string(), workflowName: z.string(), at: z.number(), ok: z.boolean(), ms: z.number(), final: z.string(), steps: z.number(), log: z.array(z.string()) });
export const StateSchema = z.object({ version: z.literal(1), workflows: z.array(WorkflowSchema), runs: z.array(Run), settings: z.object({ theme: z.enum(["light", "dark", "system"]) }) });
export const DEFAULT_STATE: AppState = { version: 1, workflows: [], runs: [], settings: { theme: "system" } };
export function parseState(raw: string | null): AppState {
  if (!raw) return DEFAULT_STATE;
  try { const r = StateSchema.safeParse(JSON.parse(raw)); return r.success ? r.data : DEFAULT_STATE; } catch { return DEFAULT_STATE; }
}
export function loadState(): AppState { try { return parseState(localStorage.getItem(KEY)); } catch { return DEFAULT_STATE; } }
export function saveState(s: AppState): boolean { try { localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch { return false; } }
export function parseImport(raw: string) { const r = WorkflowSchema.safeParse(JSON.parse(raw)); if (!r.success) throw new Error("Invalid workflow file"); return r.data; }
