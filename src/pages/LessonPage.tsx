import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLessonById } from "../data/moduleRegistry";
import { useProgress } from "../hooks/useProgress";
import { LearnPanel } from "../components/lesson/LearnPanel";
import { BusinessScenarioCard } from "../components/lesson/BusinessScenarioCard";
import { GuidedWalkthrough } from "../components/lesson/GuidedWalkthrough";
import { ChallengePanel } from "../components/lesson/ChallengePanel";
import { HintPanel } from "../components/lesson/HintPanel";
import { SolutionReveal } from "../components/lesson/SolutionReveal";
import { SummaryPanel } from "../components/lesson/SummaryPanel";
import { MultipleChoiceQuiz } from "../components/quiz/MultipleChoiceQuiz";

const STEPS = ["Learn", "Scenario", "Guided Example", "Challenge", "Hints", "Solution", "Summary & Quiz"];

export function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { completeLesson } = useProgress();
  const [step, setStep] = useState(0);
  const [passed, setPassed] = useState(false);

  const found = lessonId ? getLessonById(lessonId) : undefined;
  if (!found) {
    return <p className="text-[var(--color-text-muted)]">Lesson not found.</p>;
  }
  const { module, lesson } = found;

  const goNext = () => {
    if (step === STEPS.length - 1) {
      completeLesson(lesson.id, module.xpReward);
      navigate("/");
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="row-index mb-2">
          {STEPS[step]} · Step {step + 1} of {STEPS.length}
        </div>
        <h1 className="font-display text-2xl font-bold">{lesson.title}</h1>
        <p className="text-sm text-[var(--color-text-muted)]">{lesson.estimatedMinutes} min estimated</p>
      </div>

      <div className="min-h-[300px]">
        {step === 0 && <LearnPanel learn={lesson.learn} />}
        {step === 1 && <BusinessScenarioCard scenario={lesson.businessScenario} />}
        {step === 2 && <GuidedWalkthrough lines={lesson.guidedExample} />}
        {step === 3 && (
          <ChallengePanel challenge={lesson.challenge} onPassed={() => setPassed(true)} />
        )}
        {step === 4 && <HintPanel hints={lesson.challenge.hints} />}
        {step === 5 && <SolutionReveal challenge={lesson.challenge} />}
        {step === 6 && (
          <div className="space-y-8">
            <SummaryPanel summary={lesson.summary} />
            <MultipleChoiceQuiz questions={lesson.quiz} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="text-sm px-4 py-2 rounded-md text-[var(--color-text-muted)] disabled:opacity-30 hover:text-[var(--color-text)] transition-colors"
        >
          ← Back
        </button>
        {step === 3 && !passed ? (
          <span className="text-xs text-[var(--color-text-muted)]">
            Pass the challenge to continue
          </span>
        ) : (
          <button
            onClick={goNext}
            className="text-sm px-5 py-2 rounded-md bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold hover:bg-[var(--color-accent-dim)] transition-colors"
          >
            {step === STEPS.length - 1 ? "Finish lesson" : "Continue →"}
          </button>
        )}
      </div>
    </div>
  );
}
