import { describe, it, expect } from "vitest";
import { validateChallenge } from "./validateChallenge";
import type { RunResult } from "../hooks/usePyodide";
import type { Validator } from "../types/content";

function makeResult(overrides: Partial<RunResult> = {}): RunResult {
  return {
    stdout: "",
    stderr: "",
    variables: {},
    functionResults: {},
    error: null,
    ...overrides,
  };
}

describe("validateChallenge — variables validator", () => {
  it("passes when variable values match exactly", () => {
    const result = makeResult({ variables: { order_total: 74, qualifies_for_free_shipping: true } });
    const validators: Validator[] = [
      { kind: "variables", expected: { order_total: 74, qualifies_for_free_shipping: true } },
    ];
    expect(validateChallenge(result, validators).passed).toBe(true);
  });

  it("passes with a different but equivalent code path (multiple correct solutions)", () => {
    // Student computed order_total via a loop instead of a single
    // multiplication — the validator only checks the resulting value.
    const result = makeResult({ variables: { order_total: 74.0 } });
    const validators: Validator[] = [{ kind: "variables", expected: { order_total: 74 } }];
    expect(validateChallenge(result, validators).passed).toBe(true);
  });

  it("tolerates float rounding noise", () => {
    const result = makeResult({ variables: { order_total: 74.00000000000001 } });
    const validators: Validator[] = [{ kind: "variables", expected: { order_total: 74 } }];
    expect(validateChallenge(result, validators).passed).toBe(true);
  });

  it("fails and explains when a variable is missing", () => {
    const result = makeResult({ variables: {} });
    const validators: Validator[] = [{ kind: "variables", expected: { order_total: 74 } }];
    const outcome = validateChallenge(result, validators);
    expect(outcome.passed).toBe(false);
    expect(outcome.failures[0]).toMatch(/order_total/);
  });

  it("fails when a variable value is wrong", () => {
    const result = makeResult({ variables: { order_total: 50 } });
    const validators: Validator[] = [{ kind: "variables", expected: { order_total: 74 } }];
    expect(validateChallenge(result, validators).passed).toBe(false);
  });
});

describe("validateChallenge — stdout validator", () => {
  it("passes on exact match after whitespace normalization", () => {
    const result = makeResult({ stdout: "74.0   True\n" });
    const validators: Validator[] = [{ kind: "stdout" }];
    expect(validateChallenge(result, validators, "74.0 True").passed).toBe(true);
  });

  it("passes when numbers match within tolerance despite formatting differences", () => {
    const result = makeResult({ stdout: "Total: $74.00\n" });
    const validators: Validator[] = [{ kind: "stdout" }];
    expect(validateChallenge(result, validators, "Total: 74").passed).toBe(true);
  });
});

describe("validateChallenge — function validator", () => {
  it("passes when all test cases match", () => {
    const result = makeResult({ functionResults: { calculate_tax: [5, 0, 500] } });
    const validators: Validator[] = [
      {
        kind: "function",
        functionName: "calculate_tax",
        cases: [
          { args: [50], expected: 5 },
          { args: [0], expected: 0 },
          { args: [5000], expected: 500 },
        ],
      },
    ];
    expect(validateChallenge(result, validators).passed).toBe(true);
  });

  it("reports the specific failing case", () => {
    const result = makeResult({ functionResults: { calculate_tax: [5, 999] } });
    const validators: Validator[] = [
      {
        kind: "function",
        functionName: "calculate_tax",
        cases: [
          { args: [50], expected: 5 },
          { args: [0], expected: 0 },
        ],
      },
    ];
    const outcome = validateChallenge(result, validators);
    expect(outcome.passed).toBe(false);
    expect(outcome.failures[0]).toMatch(/calculate_tax/);
  });
});

describe("validateChallenge — runtime errors", () => {
  it("fails immediately on a Python error, without running validators", () => {
    const result = makeResult({ error: "NameError: name 'x' is not defined" });
    const validators: Validator[] = [{ kind: "variables", expected: { x: 1 } }];
    const outcome = validateChallenge(result, validators);
    expect(outcome.passed).toBe(false);
    expect(outcome.failures).toEqual(["NameError: name 'x' is not defined"]);
  });
});
