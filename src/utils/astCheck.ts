import type { AstValidator } from "../types/content";

/**
 * Builds a Python snippet that parses `code`'s AST and collects a set of
 * node-type / method-call tokens into `__ast_tokens__`, so the worker can
 * capture it like any other variable. Kept as a *string builder* (not a
 * separate worker message type) so ast validators reuse the same
 * run/capture-variables pipeline as everything else.
 */
export function buildAstProbeCode(studentCode: string): string {
  const encoded = JSON.stringify(studentCode);
  return `
import ast as __ast
__ast_tokens__ = set()
try:
    __tree = __ast.parse(${encoded})
    for __node in __ast.walk(__tree):
        __ast_tokens__.add(type(__node).__name__)
        if isinstance(__node, __ast.Call) and isinstance(__node.func, __ast.Attribute):
            __ast_tokens__.add(f"Call:{__node.func.attr}")
except SyntaxError:
    pass
__ast_tokens__ = list(__ast_tokens__)
`;
}

export function checkAstTokens(tokens: string[], validator: AstValidator): string[] {
  const missing = validator.mustContain.filter((required) => !tokens.includes(required));
  return missing.length > 0 ? [validator.message] : [];
}
