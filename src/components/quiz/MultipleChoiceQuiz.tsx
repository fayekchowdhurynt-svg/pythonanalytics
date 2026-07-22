import { useState } from "react";
import type { QuizQuestion } from "../../types/content";

export function MultipleChoiceQuiz({ questions }: { questions: QuizQuestion[] }) {
  const [selected, setSelected] = useState<Record<number, number>>({});

  const select = (qIndex: number, optIndex: number) => {
    if (qIndex in selected) return; // lock after first answer
    setSelected((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  return (
    <div className="space-y-6">
      {questions.map((q, qIndex) => {
        const chosen = selected[qIndex];
        const answered = chosen !== undefined;
        return (
          <div key={qIndex} className="rounded-lg border border-[var(--color-border)] p-4">
            <p className="font-medium mb-3">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, optIndex) => {
                const isChosen = chosen === optIndex;
                const showCorrect = answered && opt.correct;
                const showWrong = answered && isChosen && !opt.correct;
                return (
                  <button
                    key={optIndex}
                    onClick={() => select(qIndex, optIndex)}
                    className={`w-full text-left text-sm px-4 py-2 rounded-md border transition-colors ${
                      showCorrect
                        ? "border-[var(--color-positive)] bg-[var(--color-positive)]/10 text-[var(--color-positive)]"
                        : showWrong
                        ? "border-[var(--color-negative)] bg-[var(--color-negative)]/10 text-[var(--color-negative)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
                    }`}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
            {answered && (
              <p className="text-sm text-[var(--color-text-muted)] mt-3">{q.explanation}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
