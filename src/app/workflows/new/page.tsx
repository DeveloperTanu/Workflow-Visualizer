"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/hooks/useAppState";
import { blankWorkflow } from "@/features/templates/templates";
export default function NewWorkflow() {
  const router = useRouter(); const { update, ready } = useAppState();
  useEffect(() => { if (!ready) return; const w = blankWorkflow(); update((s) => ({ ...s, workflows: [w, ...s.workflows] })); router.replace(`/workflows/${w.id}`); }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps
  return <p className="p-6 text-muted">Creating workflow…</p>;
}
