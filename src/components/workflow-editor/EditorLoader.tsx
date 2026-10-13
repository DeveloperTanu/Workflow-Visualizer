"use client";
import { useAppState } from "@/hooks/useAppState";
import { Editor } from "./Editor";
export function EditorLoader({ id }: { id: string }) {
  const { state, ready } = useAppState();
  if (!ready) return <p className="p-6 text-muted">Loading…</p>;
  const wf = state.workflows.find((w) => w.id === id);
  return wf ? <Editor workflow={wf} /> : <p className="p-6">Workflow not found. It may have been deleted or stored in a different browser.</p>;
}
