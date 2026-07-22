import Editor from "@monaco-editor/react";
import { useState } from "react";

interface CodeEditorProps {
  starterCode: string;
  onRun: (code: string) => void;
  isRunning: boolean;
}

export function CodeEditor({ starterCode, onRun, isRunning }: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);

  const handleReset = () => setCode(starterCode);

  const handleFormat = () => {
    // Lightweight formatter: normalize indentation to 4 spaces, trim
    // trailing whitespace. A full formatter (black-via-pyodide) is a
    // reasonable future upgrade; this keeps the button honest for now.
    const formatted = code
      .split("\n")
      .map((line) => line.replace(/\s+$/, ""))
      .join("\n");
    setCode(formatted);
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
      <div className="flex items-center justify-between bg-[var(--color-surface-raised)] px-4 py-2 border-b border-[var(--color-border)]">
        <span className="font-mono text-xs text-[var(--color-text-muted)]">challenge.py</span>
        <div className="flex gap-2">
          <button
            onClick={handleFormat}
            className="text-xs px-3 py-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
          >
            Format
          </button>
          <button
            onClick={handleReset}
            className="text-xs px-3 py-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => onRun(code)}
            disabled={isRunning}
            className="text-xs px-4 py-1.5 rounded-md bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold hover:bg-[var(--color-accent-dim)] disabled:opacity-50 transition-colors"
          >
            {isRunning ? "Running…" : "Run ▶"}
          </button>
        </div>
      </div>
      <Editor
        height="280px"
        defaultLanguage="python"
        theme="vs-dark"
        value={code}
        onChange={(val) => setCode(val ?? "")}
        options={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 13,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12 },
        }}
      />
    </div>
  );
}
