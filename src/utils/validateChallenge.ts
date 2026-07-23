import type { RunResult } from "../hooks/usePyodide";
import type { Validator } from "../types/content";

export interface ValidationOutcome {
  passed: boolean;
  failures: string[];
}

const DEFAULT_TOLERANCE = 0.01;

function numbersClose(a: unknown, b: unknown, tolerance: number): boolean {
  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) <= tolerance;
  }
  return a === b;
}

function normalizeStdout(s: string): string {
  return s.trim().replace(/\s+/g, " ");
}

/** Extracts bare numbers from stdout so "$1234.5" and "1234.50" compare equal. */
function extractNumbers(s: string): number[] {
  const matches = s.match(/-?\d+(\.\d+)?/g);
  return matches ? matches.map(Number) : [];
}

function validateStdout(
  result: RunResult,
  expectedStdout: string | undefined,
  tolerance: number
): string[] {
  if (!expectedStdout) return [];
  const actual = normalizeStdout(result.stdout);
  const expected = normalizeStdout(expectedStdout);
  if (actual === expected) return [];

  // Fall back to numeric-tolerant comparison so float rounding
  // (29.99 vs 29.990000000000002) doesn't fail a correct solution.
  const actualNums = extractNumbers(result.stdout);
  const expectedNums = extractNumbers(expectedStdout);
  const numbersMatch =
    actualNums.length === expectedNums.length &&
    actualNums.every((n, i) => numbersClose(n, expectedNums[i], tolerance));

  if (numbersMatch) return [];
  return ["Your output doesn't match what we expected. Check the values you're printing."];
}

function validateVariables(
  result: RunResult,
  expected: Record<string, unknown>,
  tolerance: number
): string[] {
  const failures: string[] = [];
  for (const [name, expectedValue] of Object.entries(expected)) {
    if (!(name in result.variables)) {
      failures.push(`We expected a variable named \`${name}\` — did you name it something else?`);
      continue;
    }
    const actualValue = result.variables[name];
    const matches =
      typeof expectedValue === "number"
        ? numbersClose(actualValue, expectedValue, tolerance)
        : JSON.stringify(actualValue) === JSON.stringify(expectedValue);
    if (!matches) {
      failures.push(`\`${name}\` came out to ${JSON.stringify(actualValue)}, expected ${JSON.stringify(expectedValue)}.`);
    }
  }
  return failures;
}

function validateFunctionResults(
  result: RunResult,
  functionName: string,
  cases: { args: unknown[]; expected: unknown }[],
  tolerance: number
): string[] {
  const actualResults = result.functionResults[functionName];
  if (!actualResults) {
    return [`We couldn't find a function called \`${functionName}\` — check the name matches exactly.`];
  }
  const failures: string[] = [];
  cases.forEach((testCase, i) => {
    const actual = actualResults[i];
    const matches =
      typeof testCase.expected === "number"
        ? numbersClose(actual, testCase.expected, tolerance)
        : JSON.stringify(actual) === JSON.stringify(testCase.expected);
    if (!matches) {
      failures.push(
        `${functionName}(${testCase.args.map((a) => JSON.stringify(a)).join(", ")}) returned ${JSON.stringify(actual)}, expected ${JSON.stringify(testCase.expected)}.`
      );
    }
  });
  return failures;
}

/**
 * Runs every declared validator against a Pyodide execution result.
 * AST-based validators are checked separately (see astCheck.ts) since they
 * inspect the source, not the runtime result.
 */
export function validateChallenge(
  result: RunResult,
  validators: Validator[],
  expectedStdout?: string
): ValidationOutcome {
  if (result.error) {
    return { passed: false, failures: [result.error] };
  }

  const failures: string[] = [];
  for (const validator of validators) {
    switch (validator.kind) {
      case "stdout":
        failures.push(...validateStdout(result, expectedStdout, validator.tolerance ?? DEFAULT_TOLERANCE));
        break;
      case "variables":
        failures.push(...validateVariables(result, validator.expected, DEFAULT_TOLERANCE));
        break;
      case "function":
        failures.push(
          ...validateFunctionResults(result, validator.functionName, validator.cases, DEFAULT_TOLERANCE)
        );
        break;
      case "ast":
        // handled by astCheck.ts against source code, not execution result
        break;
    }
  }

  return { passed: failures.length === 0, failures };
}
