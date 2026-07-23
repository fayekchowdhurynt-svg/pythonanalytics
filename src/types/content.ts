// Content schema: lessons are authored as data (JSON), not code, so new
// modules can be added without touching component logic.

export type BusinessDomain =
  | "retail"
  | "healthcare"
  | "finance"
  | "insurance"
  | "marketing"
  | "logistics"
  | "streaming"
  | "manufacturing"
  | "technology";

export interface GuidedLine {
  code: string;
  explanation: string;
  commonMistakes?: string[];
  bestPractice?: string;
}

export type ValidatorKind = "stdout" | "variables" | "function" | "ast";

export interface StdoutValidator {
  kind: "stdout";
  /** Numeric tolerance applied when comparing floats embedded in output. */
  tolerance?: number;
}

export interface VariablesValidator {
  kind: "variables";
  /** Variable name -> expected value (compared with type + numeric tolerance). */
  expected: Record<string, unknown>;
}

export interface FunctionTestCase {
  args: unknown[];
  expected: unknown;
}

export interface FunctionValidator {
  kind: "function";
  functionName: string;
  cases: FunctionTestCase[];
}

export interface AstValidator {
  kind: "ast";
  /** e.g. "ListComp", "For", "Call:apply" — matched against parsed node types. */
  mustContain: string[];
  message: string;
}

export type Validator =
  | StdoutValidator
  | VariablesValidator
  | FunctionValidator
  | AstValidator;

export interface Hint {
  level: 1 | 2 | 3;
  text: string;
}

export interface Challenge {
  prompt: string;
  starterCode: string;
  datasetIds?: string[];
  validators: Validator[];
  hints: [Hint, Hint, Hint];
  solutionCode: string;
  solutionExplanation: string;
  businessContext: string;
  alternativeSolution?: string;
  bestPractices: string[];
}

export interface QuizOption {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface LessonSummary {
  keyTakeaways: string[];
  commonMistakes: string[];
  interviewTips: string[];
  realWorldApplications: string[];
}

export interface Lesson {
  id: string;
  title: string;
  estimatedMinutes: number;
  businessDomain: BusinessDomain;
  learn: {
    whatItIs: string;
    whyItMatters: string;
    whenToUseIt: string;
  };
  businessScenario: {
    title: string;
    narrative: string;
  };
  guidedExample: GuidedLine[];
  challenge: Challenge;
  quiz: QuizQuestion[];
  summary: LessonSummary;
}

export interface Module {
  id: string;
  order: number;
  title: string;
  businessDomain: BusinessDomain;
  xpReward: number;
  lessons: Lesson[];
}
