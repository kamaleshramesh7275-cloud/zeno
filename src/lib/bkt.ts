import type { BKTParameters, TopicMasteryState } from '../types/trackD';

export const DEFAULT_BKT_PARAMS: BKTParameters = {
  pL0: 0.25, // Initial prior probability student knows skill
  pT: 0.15,  // Transition probability (learns skill at this step)
  pG: 0.20,  // Guess probability (gets correct without knowing)
  pS: 0.10,  // Slip probability (makes mistake despite knowing)
};

/**
 * Updates topic mastery probability using standard Bayesian Knowledge Tracing (BKT).
 * 
 * Step 1: Posterior update based on observed student response:
 * If Correct:
 *   P(L_{t-1} | Correct) = [ P(L_{t-1}) * (1 - P(S)) ] / [ P(L_{t-1}) * (1 - P(S)) + (1 - P(L_{t-1})) * P(G) ]
 * If Incorrect:
 *   P(L_{t-1} | Incorrect) = [ P(L_{t-1}) * P(S) ] / [ P(L_{t-1}) * P(S) + (1 - P(L_{t-1})) * (1 - P(G)) ]
 * 
 * Step 2: Learning transition:
 *   P(L_t) = P(L_{t-1} | Obs) + (1 - P(L_{t-1} | Obs)) * P(T)
 */
export function updateTopicMastery(
  currentState: TopicMasteryState,
  isCorrect: boolean,
  params: BKTParameters = DEFAULT_BKT_PARAMS
): TopicMasteryState {
  const pL_prev = Math.max(0.01, Math.min(0.99, currentState.masteryProbability));
  const { pT, pG, pS } = params;

  let pL_given_obs: number;

  if (isCorrect) {
    const numerator = pL_prev * (1 - pS);
    const denominator = numerator + (1 - pL_prev) * pG;
    pL_given_obs = numerator / denominator;
  } else {
    const numerator = pL_prev * pS;
    const denominator = numerator + (1 - pL_prev) * (1 - pG);
    pL_given_obs = numerator / denominator;
  }

  // Account for learning transition
  const pL_next = pL_given_obs + (1 - pL_given_obs) * pT;
  const clampedMastery = Number(Math.max(0.02, Math.min(0.98, pL_next)).toFixed(3));

  let status: 'Novice' | 'Practicing' | 'Mastered' = 'Novice';
  if (clampedMastery >= 0.70) {
    status = 'Mastered';
  } else if (clampedMastery >= 0.40) {
    status = 'Practicing';
  }

  return {
    ...currentState,
    masteryProbability: clampedMastery,
    attemptsCount: currentState.attemptsCount + 1,
    correctCount: isCorrect ? currentState.correctCount + 1 : currentState.correctCount,
    lastUpdated: new Date(),
    status,
  };
}

/**
 * Calibrates cold-start initial priors for a new student based on diagnostic intake answers.
 */
export function calibrateColdStartPriors(
  diagnosticResults: { topicId: string; isCorrect: boolean }[],
  initialStates: Record<string, TopicMasteryState>
): Record<string, TopicMasteryState> {
  const updated = { ...initialStates };

  for (const res of diagnosticResults) {
    const existing = updated[res.topicId];
    if (existing) {
      // Diagnostic baseline calibration with adjusted priors
      const prior = res.isCorrect ? 0.65 : 0.20;
      updated[res.topicId] = {
        ...existing,
        masteryProbability: prior,
        attemptsCount: 1,
        correctCount: res.isCorrect ? 1 : 0,
        status: prior >= 0.60 ? 'Practicing' : 'Novice',
        lastUpdated: new Date(),
      };
    }
  }

  return updated;
}
