export type SourceType = 'textbook' | 'slide' | 'video';

// ─── Agentic Reasoning Trace ───────────────────────────────────────────────

export type AgentStepStatus = 'pending' | 'running' | 'done' | 'skipped';

export type AgentStepTool =
  | 'INTENT_CLASSIFY'
  | 'SCOPE_CHECK'
  | 'DECOMPOSE_QUERY'
  | 'RETRIEVAL_PLAN'
  | 'EXECUTE_RETRIEVAL'
  | 'GENERATE'
  | 'SELF_EVALUATE'
  | 'REFINE_QUERY'
  | 'SYNTHESIZE'
  | 'GROUNDING_CHECK'
  | 'BKT_UPDATE';

export interface AgentStep {
  tool: AgentStepTool;
  label: string;
  detail: string;
  status: AgentStepStatus;
  durationMs?: number;
  outputPreview?: string;
  toolCallName?: string;
  toolArgs?: Record<string, unknown>;
  toolResult?: Record<string, unknown> | string;
  isFunctionCall?: boolean;
  iteration?: number;
}

export interface AgentTrace {
  sessionId: string;
  query: string;
  startedAt: Date;
  steps: AgentStep[];
  totalDurationMs: number;
  llmBackend: 'gemini-2.0-flash' | 'gemini-1.5-pro' | 'mock-rag';
  isAgenticLoop?: boolean;
  toolCallCount?: number;
  retryCount?: number;
  subTasks?: string[];
  reflectionVerdict?: 'passed_first_try' | 'refined_and_passed' | 'refusal';
}

// ─── Agent Session Log (persisted across pages) ────────────────────────────

export interface AgentSessionLogEntry {
  traceId: string;
  timestamp: Date;
  query: string;
  stepsCompleted: number;
  totalSteps: number;
  llmBackend: string;
  outcome: 'answered' | 'refused' | 'error';
  faithfulnessScore?: number;
  toolCallCount?: number;
  retries?: number;
  isAutonomous?: boolean;
  subTasksCount?: number;
}

export interface SourceLocation {
  pageNumber?: number;
  slideNumber?: number;
  timestampSeconds?: number;
  timestampLabel?: string;
  chapterOrSection?: string;
}

export interface ContentUnit {
  id: string;
  sourceType: SourceType;
  sourceTitle: string;
  location: SourceLocation;
  topicId: string;
  topicName: string;
  subtopic: string;
  content: string;
  summary: string;
  diagramUrl?: string;
  diagramCaption?: string;
  prerequisites: string[];
}

export interface TopicNode {
  id: string;
  name: string;
  description: string;
  category: string;
  prerequisites: string[];
  difficultyLevel: 'Foundational' | 'Intermediate' | 'Advanced';
}

export interface Citation {
  id: string;
  unitId: string;
  sourceType: SourceType;
  sourceTitle: string;
  location: SourceLocation;
  excerpt: string;
  diagramUrl?: string;
  diagramCaption?: string;
}

export interface RAGConfig {
  retrievalMode: 'hybrid' | 'dense' | 'bm25';
  topK: number;
  similarityThreshold: number;
  hallucinationGuardrail: 'strict' | 'balanced' | 'permissive';
  temperature: number;
}

export interface RetrievalTelemetry {
  latencyMs: number;
  retrievalMode: string;
  chunksEvaluated: number;
  chunksRetrieved: number;
  denseScore: number;
  sparseScore: number;
  refusalConfidence: number;
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: Date;
  isDeclined?: boolean; // Out of syllabus refusal flag
  citations?: Citation[];
  language?: 'english' | 'hinglish';
  extractedConcepts?: string[];
  telemetry?: RetrievalTelemetry;
  agentTrace?: AgentTrace; // Agentic reasoning trace for this response
}

export type QuestionType = 'mcq' | 'short_answer' | 'numerical';

export interface ModelVerificationReport {
  questionId: string;
  primaryModel: {
    name: string;
    isCorrect: boolean;
    confidence: number;
    reasoning: string;
  };
  secondaryModel: {
    name: string;
    isCorrect: boolean;
    confidence: number;
    reasoning: string;
  };
  distractorPlausibilityScore: number;
  noveltySimilarityScore: number;
  finalVerificationStatus: 'Verified' | 'Flagged';
}

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  topicId: string;
  topicName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  bloomLevel: 'Recall' | 'Application' | 'Analysis';
  question: string;
  options?: string[]; // For MCQ
  correctAnswer: string | number;
  rubricKeywords?: string[]; // For short answer
  tolerance?: number; // For numerical
  sourceUnitId: string;
  sourceCitation: Citation;
  explanation: string;
  commonMisconception?: string;
  verificationStatus: 'verified' | 'cross_model_checked';
  verificationReport?: ModelVerificationReport;
}

export interface QuestionAttempt {
  questionId: string;
  studentAnswer: string | number;
  isCorrect: boolean;
  score: number; // 0 to 1
  feedback: string;
  detectedMisconception?: string;
  citation: Citation;
}

export interface AssessmentSession {
  id: string;
  title: string;
  startedAt: Date;
  completedAt?: Date;
  topicsCovered: string[];
  questions: AssessmentQuestion[];
  attempts: Record<string, QuestionAttempt>;
  overallScore: number;
  weakTopics: string[];
  misconceptionsFound: string[];
}

export interface BKTParameters {
  pL0: number; // Initial mastery prior
  pT: number;  // Transition probability (learning rate)
  pG: number;  // Guess probability
  pS: number;  // Slip probability
}

export interface TopicMasteryState {
  topicId: string;
  topicName: string;
  masteryProbability: number; // P(L) in [0, 1]
  attemptsCount: number;
  correctCount: number;
  lastUpdated: Date;
  status: 'Novice' | 'Practicing' | 'Mastered';
}

export interface RagasMetric {
  name: string;
  score: number;
  description: string;
  targetThreshold: number;
}

export interface BenchmarkTestCase {
  id: string;
  question: string;
  inSyllabus: boolean;
  expectedSource?: string;
  groundTruthExcerpt?: string;
  modelResponse: string;
  faithfulnessScore: number;
  answerRelevancyScore: number;
  contextPrecisionScore: number;
  contextRecallScore: number;
  refusalValid: boolean;
}

export interface SimulatedStudentProfile {
  id: string;
  persona: 'Fast Learner' | 'Average Student' | 'Struggling Learner';
  description: string;
  sessions: {
    sessionNumber: number;
    masteryScore: number;
    quizAccuracy: number;
    repetitionRate: number;
  }[];
}
