import { BENCHMARK_QUESTIONS } from '../data/courseData';
import type { AssessmentQuestion, AssessmentSession, QuestionAttempt } from '../types/trackD';

export interface AssessmentConfig {
  topicIds: string[];
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  questionCount: number;
  questionType?: 'all' | 'mcq' | 'numerical' | 'short_answer';
}

/**
 * Generates an adaptive assessment adhering to student scope and preventing repetition.
 */
export function generateAssessment(
  config: AssessmentConfig,
  previousQuestionIds: Set<string> = new Set()
): AssessmentQuestion[] {
  let pool = [...BENCHMARK_QUESTIONS];

  // Filter by topic scope
  if (config.topicIds.length > 0 && !config.topicIds.includes('all')) {
    pool = pool.filter(q => config.topicIds.includes(q.topicId));
  }

  // Filter by difficulty
  if (config.difficulty && config.difficulty !== 'Mixed') {
    const diffMatches = pool.filter(q => q.difficulty === config.difficulty);
    if (diffMatches.length > 0) pool = diffMatches;
  }

  // Filter by type
  if (config.questionType && config.questionType !== 'all') {
    const typeMatches = pool.filter(q => q.type === config.questionType);
    if (typeMatches.length > 0) pool = typeMatches;
  }

  // Deduplicate against previously attempted question IDs to avoid repeats
  const unattempted = pool.filter(q => !previousQuestionIds.has(q.id));
  const candidatePool = unattempted.length >= config.questionCount ? unattempted : pool;

  // Shuffle and take count
  const shuffled = [...candidatePool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(config.questionCount, shuffled.length));
}

/**
 * Grades an assessment attempt and detects misconceptions.
 */
export function evaluateAnswer(
  question: AssessmentQuestion,
  studentAnswer: string | number
): QuestionAttempt {
  let isCorrect = false;
  let score = 0;
  let feedback = '';

  if (question.type === 'mcq') {
    isCorrect = String(studentAnswer).trim() === String(question.correctAnswer).trim();
    score = isCorrect ? 1.0 : 0.0;
  } else if (question.type === 'numerical') {
    const sNum = Number(studentAnswer);
    const cNum = Number(question.correctAnswer);
    const tol = question.tolerance || 0.05;
    isCorrect = Math.abs(sNum - cNum) <= tol;
    score = isCorrect ? 1.0 : 0.0;
  } else if (question.type === 'short_answer') {
    const normalized = String(studentAnswer).toLowerCase();
    const keywords = question.rubricKeywords || [];
    const matchedCount = keywords.filter(kw => normalized.includes(kw.toLowerCase())).length;
    score = keywords.length > 0 ? matchedCount / keywords.length : 0;
    isCorrect = score >= 0.5;
  }

  if (isCorrect) {
    feedback = `✅ Excellent! You correctly understood the concept grounded in ${question.sourceCitation.sourceTitle}.`;
  } else {
    feedback = `❌ Needs Review. Correct Answer: "${question.correctAnswer}". ${question.explanation}`;
  }

  return {
    questionId: question.id,
    studentAnswer,
    isCorrect,
    score,
    feedback,
    detectedMisconception: !isCorrect ? question.commonMisconception : undefined,
    citation: question.sourceCitation,
  };
}

/**
 * Computes diagnostic report identifying weak topics and misconceptions.
 */
export function generateDiagnosticReport(
  session: AssessmentSession
): {
  overallScorePercentage: number;
  weakTopics: string[];
  misconceptionsFound: string[];
  masteryGainsSummary: string;
} {
  const attempts = Object.values(session.attempts);
  const total = attempts.length;
  if (total === 0) {
    return {
      overallScorePercentage: 0,
      weakTopics: [],
      misconceptionsFound: [],
      masteryGainsSummary: 'No attempts recorded.',
    };
  }

  const correctCount = attempts.filter(a => a.isCorrect).length;
  const percentage = Math.round((correctCount / total) * 100);

  // Group attempts by topic
  const topicStats: Record<string, { correct: number; total: number; name: string }> = {};
  const misconceptions: string[] = [];

  for (const q of session.questions) {
    const attempt = session.attempts[q.id];
    if (!topicStats[q.topicId]) {
      topicStats[q.topicId] = { correct: 0, total: 0, name: q.topicName };
    }
    topicStats[q.topicId].total += 1;
    if (attempt && attempt.isCorrect) {
      topicStats[q.topicId].correct += 1;
    }
    if (attempt && attempt.detectedMisconception) {
      misconceptions.push(attempt.detectedMisconception);
    }
  }

  const weakTopics: string[] = [];
  for (const tid of Object.keys(topicStats)) {
    const stat = topicStats[tid];
    if (stat.total > 0 && stat.correct / stat.total < 0.6) {
      weakTopics.push(stat.name);
    }
  }

  return {
    overallScorePercentage: percentage,
    weakTopics,
    misconceptionsFound: Array.from(new Set(misconceptions)),
    masteryGainsSummary: `Evaluated ${total} verified problems with ${percentage}% overall accuracy across ${Object.keys(topicStats).length} topic domains.`,
  };
}
