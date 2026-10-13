"use client";
import { useCallback, useEffect, useState } from "react";
import type { AppState } from "@/types/workflow";
import { DEFAULT_STATE, loadState, saveState } from "@/lib/storage/storage";
export function useAppState() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);
  useEffect(() => { setState(loadState()); setReady(true); }, []);
  const update = useCallback((fn: (s: AppState) => AppState) => setState((p) => { const n = fn(p); saveState(n); return n; }), []);
  return { state, update, ready };
}
