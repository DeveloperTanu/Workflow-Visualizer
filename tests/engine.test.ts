import { describe, it, expect } from "vitest";
import { runWorkflow, interpolate, evalCondition, topoOrder } from "../src/lib/workflow-engine/engine";
import { fromTemplate, TEMPLATES } from "../src/features/templates/templates";
import { parseState } from "../src/lib/storage/storage";
describe("engine", () => {
  it("interpolates variables", () => expect(interpolate("Hi {{input}}", { input: "Ada" })).toBe("Hi Ada"));
  it("evaluates conditions", () => { expect(evalCondition("contains", "Hello", "ell")).toBe(true); expect(evalCondition("equals", "a", "b")).toBe(false); });
  it("runs the prompt template end to end", () => { const r = runWorkflow(fromTemplate(TEMPLATES[0])); expect(r.ok).toBe(true); expect(r.final).toContain("SIMULATED"); });
  it("skips the inactive branch", () => { const r = runWorkflow(fromTemplate(TEMPLATES[1])); expect(r.ok).toBe(true); expect(r.steps.filter((s) => s.status === "skipped")).toHaveLength(1); });
  it("detects cycles", () => { const w = fromTemplate(TEMPLATES[2]); w.edges.push({ id: "x", from: w.nodes[2].id, port: 0, to: w.nodes[1].id }); expect(() => topoOrder(w)).toThrow(/Cycle/); });
  it("fails on empty workflow", () => expect(runWorkflow({ ...fromTemplate(TEMPLATES[2]), nodes: [], edges: [] }).ok).toBe(false));
  it("survives corrupted storage", () => { expect(parseState("{nope").workflows).toEqual([]); expect(parseState('{"version":2}').workflows).toEqual([]); });
});
