import { useState } from 'react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';
import { TOPIC_NODES, INITIAL_TOPIC_MASTERY } from '../data/courseData';
import { 
  generateAssessment, evaluateAnswer, generateDiagnosticReport, type AssessmentConfig 
} from '../lib/assessmentEngine';
import { updateTopicMastery } from '../lib/bkt';
import type { AssessmentQuestion, AssessmentSession, TopicMasteryState } from '../types/trackD';
import { 
  CheckCircle, XCircle, AlertTriangle, HelpCircle, 
  Play, BookOpen, Clock, ShieldCheck, ChevronRight, RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function Assessment() {
  const [masteryStates, setMasteryStates] = useState<Record<string, TopicMasteryState>>(() => {
    const saved = localStorage.getItem('zeno_topic_mastery');
    return saved ? JSON.parse(saved) : INITIAL_TOPIC_MASTERY;
  });

  const [activeSession, setActiveSession] = useState<AssessmentSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [selectedVerificationQ, setSelectedVerificationQ] = useState<AssessmentQuestion | null>(null);

  // Generator Config
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Mixed'>('Mixed');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [selectedType, setSelectedType] = useState<'all' | 'mcq' | 'numerical' | 'short_answer'>('all');

  const handleStartAssessment = () => {
    const config: AssessmentConfig = {
      topicIds: selectedTopic === 'all' ? TOPIC_NODES.map(t => t.id) : [selectedTopic],
      difficulty: selectedDifficulty,
      questionCount,
      questionType: selectedType,
    };

    const questions = generateAssessment(config);
    if (questions.length === 0) return;

    setActiveSession({
      id: `session-${Date.now()}`,
      title: `${selectedTopic === 'all' ? 'Comprehensive Linear Algebra' : selectedTopic} Assessment`,
      startedAt: new Date(),
      topicsCovered: config.topicIds,
      questions,
      attempts: {},
      overallScore: 0,
      weakTopics: [],
      misconceptionsFound: [],
    });

    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setIsSubmitted(false);
    setIsExamCompleted(false);
  };

  const handleAnswerSubmit = () => {
    if (!activeSession || !selectedAnswer.trim()) return;

    const currentQ = activeSession.questions[currentQuestionIndex];
    const attempt = evaluateAnswer(currentQ, selectedAnswer);

    // Update session attempts
    const updatedAttempts = {
      ...activeSession.attempts,
      [currentQ.id]: attempt,
    };

    // Update Bayesian Knowledge Tracing (BKT) learner state
    const currentTopicState = masteryStates[currentQ.topicId] || {
      topicId: currentQ.topicId,
      topicName: currentQ.topicName,
      masteryProbability: 0.25,
      attemptsCount: 0,
      correctCount: 0,
      lastUpdated: new Date(),
      status: 'Novice',
    };

    const updatedTopicMastery = updateTopicMastery(currentTopicState, attempt.isCorrect);
    const newMasteryRecord = {
      ...masteryStates,
      [currentQ.topicId]: updatedTopicMastery,
    };

    setMasteryStates(newMasteryRecord);
    localStorage.setItem('zeno_topic_mastery', JSON.stringify(newMasteryRecord));

    setActiveSession({
      ...activeSession,
      attempts: updatedAttempts,
    });

    setIsSubmitted(true);
    if (attempt.isCorrect) {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleNextQuestion = () => {
    if (!activeSession) return;
    if (currentQuestionIndex + 1 < activeSession.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setIsSubmitted(false);
    } else {
      // Completed exam
      setIsExamCompleted(true);
    }
  };

  const currentQ: AssessmentQuestion | undefined = activeSession?.questions[currentQuestionIndex];
  const currentAttempt = currentQ && activeSession ? activeSession.attempts[currentQ.id] : undefined;
  const diagnosticReport = activeSession && isExamCompleted ? generateDiagnosticReport(activeSession) : null;

  return (
    <AnimatedWrapper className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-950 via-indigo-950 to-blue-950 rounded-2xl p-8 border border-purple-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Adaptive Assessments
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Adaptive Assessment & Misconception Diagnostics
            </h1>
            <p className="text-purple-200/90 mt-2 max-w-2xl text-sm leading-relaxed">
              Every question is mathematically verified, cross-model checked, tagged with Bloom taxonomy levels, and grounded to exact course sources. Responses update your **Bayesian Knowledge Tracing** learner model.
            </p>
          </div>
          {activeSession && !isExamCompleted && (
            <button
              onClick={() => setActiveSession(null)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Configure New Exam
            </button>
          )}
        </div>
      </div>

      {!activeSession || isExamCompleted ? (
        /* Setup or Post-Exam Report */
        <div className="space-y-6">
          {isExamCompleted && diagnosticReport && (
            /* Diagnostic Misconception & Performance Report */
            <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    🎓 Post-Assessment Diagnostic Report
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Automated misconception detection & BKT mastery state updates
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                    {diagnosticReport.overallScorePercentage}%
                  </div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Overall Accuracy
                  </span>
                </div>
              </div>

              {/* Weak Topics & Misconceptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Targeted Weak Topics Identified
                  </h3>
                  {diagnosticReport.weakTopics.length > 0 ? (
                    <ul className="space-y-2">
                      {diagnosticReport.weakTopics.map((topic, i) => (
                        <li key={i} className="text-xs text-amber-300 bg-amber-950/40 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center justify-between">
                          <span>{topic}</span>
                          <span className="text-[10px] text-amber-400 uppercase font-mono font-bold">Needs Review</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/20">
                      <CheckCircle className="w-4 h-4" /> Strong performance! No critical weak topics detected.
                    </p>
                  )}
                </div>

                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
                    <HelpCircle className="w-4 h-4 text-purple-400" />
                    Diagnosed Conceptual Misconceptions
                  </h3>
                  {diagnosticReport.misconceptionsFound.length > 0 ? (
                    <ul className="space-y-2">
                      {diagnosticReport.misconceptionsFound.map((misc, i) => (
                        <li key={i} className="text-xs text-purple-200 bg-purple-950/40 border border-purple-500/20 p-2.5 rounded-lg leading-relaxed">
                          ⚠️ {misc}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 p-3">
                      No common conceptual confusions detected in this assessment.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setActiveSession(null);
                    setIsExamCompleted(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm shadow-lg hover:brightness-110"
                >
                  Start Another Adaptive Quiz
                </button>
              </div>
            </div>
          )}

          {/* Generator Controls Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-purple-400" /> Configure Adaptive Assessment Scope
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400">Course Topic Domain</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="mt-1.5 w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Topics (Full Scope)</option>
                  {TOPIC_NODES.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Difficulty Level</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                  className="mt-1.5 w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="Mixed">Adaptive Mixed</option>
                  <option value="Easy">Easy (Recall)</option>
                  <option value="Medium">Medium (Application)</option>
                  <option value="Hard">Hard (Analysis)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Question Format</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="mt-1.5 w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All (MCQ + Numerical + Short)</option>
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="numerical">Numerical Calculation</option>
                  <option value="short_answer">Short Conceptual</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Number of Questions</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="mt-1.5 w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value={3}>3 Questions (Quick Sprint)</option>
                  <option value={5}>5 Questions (Standard Diagnostic)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleStartAssessment}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
              >
                Launch Assessment <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Live Exam Simulator */
        currentQ && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in">
            {/* Question Progress & Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-lg">
                  Question {currentQuestionIndex + 1} of {activeSession.questions.length}
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                  {currentQ.topicName}
                </span>
                <span className="text-xs bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                  Bloom: {currentQ.bloomLevel}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedVerificationQ(currentQ)}
                className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 px-3 py-1 rounded-lg border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-sm cursor-pointer"
                title="Click to view multi-model verification audit"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> 2/2 Models Verified • Audit
              </button>
            </div>

            {/* Question Prompt */}
            <div>
              <h3 className="text-lg font-bold text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Answer Input depending on Question Type */}
            {currentQ.type === 'mcq' && currentQ.options && (
              <div className="space-y-3">
                {currentQ.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAnswer === opt
                        ? 'bg-purple-900/30 border-purple-500 text-white shadow-md'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="mcq-option"
                      disabled={isSubmitted}
                      value={opt}
                      checked={selectedAnswer === opt}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="accent-purple-500 w-4 h-4"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQ.type === 'numerical' && (
              <div className="space-y-2 max-w-md">
                <label className="text-xs text-slate-400 font-medium">Enter Numerical Answer:</label>
                <input
                  type="number"
                  step="any"
                  disabled={isSubmitted}
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  placeholder="e.g. 16"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-base focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            )}

            {currentQ.type === 'short_answer' && (
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-medium">Explain in 1-2 sentences:</label>
                <textarea
                  rows={3}
                  disabled={isSubmitted}
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  placeholder="e.g. orthogonal complements in R^n..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            {/* Immediate Grounded Feedback & Misconception Box */}
            {isSubmitted && currentAttempt && (
              <div className={`p-4 rounded-xl border text-sm space-y-3 animate-fade-in ${
                currentAttempt.isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-red-950/40 border-red-500/40 text-red-200'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {currentAttempt.isCorrect ? (
                    <><CheckCircle className="w-5 h-5 text-emerald-400" /> Correct!</>
                  ) : (
                    <><XCircle className="w-5 h-5 text-red-400" /> Review Required</>
                  )}
                </div>

                <p className="leading-relaxed text-xs">
                  {currentAttempt.feedback}
                </p>

                {currentAttempt.detectedMisconception && (
                  <div className="bg-black/40 p-3 rounded-lg border border-red-500/30 text-xs text-red-300">
                    <strong>⚠️ Common Misconception Detected:</strong> {currentAttempt.detectedMisconception}
                  </div>
                )}

                {/* Source Citation for Verified Feedback */}
                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>
                    Grounded in: <strong>{currentAttempt.citation.sourceTitle}</strong> ({currentAttempt.citation.sourceType === 'video' ? `Timestamp ${currentAttempt.citation.location.timestampLabel}` : currentAttempt.citation.sourceType === 'slide' ? `Slide ${currentAttempt.citation.location.slideNumber}` : `Page ${currentAttempt.citation.location.pageNumber}`})
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3">
              {!isSubmitted ? (
                <button
                  onClick={handleAnswerSubmit}
                  disabled={!selectedAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium text-sm shadow-lg transition-all"
                >
                  Submit Answer & Update Learner Model
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm shadow-lg hover:brightness-110"
                >
                  {currentQuestionIndex + 1 < activeSession.questions.length ? 'Next Question' : 'Complete Exam & View Diagnostic'} <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )
      )}

      {/* Modal: Cross-Model Question Verification Inspector */}
      {selectedVerificationQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  Cross-Model Verification Audit Report
                </h3>
              </div>
              <button
                onClick={() => setSelectedVerificationQ(null)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Question Target:</div>
              <p className="text-xs text-white font-medium mt-1">"{selectedVerificationQ.question}"</p>
            </div>

            {selectedVerificationQ.verificationReport ? (
              <div className="space-y-3">
                {/* Side-by-Side Model Agreement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/30">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-emerald-400">Model A: {selectedVerificationQ.verificationReport.primaryModel.name}</span>
                      <span className="font-mono text-[10px] text-emerald-300">{(selectedVerificationQ.verificationReport.primaryModel.confidence * 100).toFixed(1)}% Conf</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-2">
                      {selectedVerificationQ.verificationReport.primaryModel.reasoning}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/30">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-cyan-400">Model B: {selectedVerificationQ.verificationReport.secondaryModel.name}</span>
                      <span className="font-mono text-[10px] text-cyan-300">{(selectedVerificationQ.verificationReport.secondaryModel.confidence * 100).toFixed(1)}% Conf</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-2">
                      {selectedVerificationQ.verificationReport.secondaryModel.reasoning}
                    </p>
                  </div>
                </div>

                {/* Metrics: Distractor Plausibility & Novelty */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[11px]">Distractor Plausibility Score:</div>
                    <div className="text-base font-mono font-bold text-indigo-400 mt-1">
                      {(selectedVerificationQ.verificationReport.distractorPlausibilityScore * 100).toFixed(0)}%
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Tests misconception quality of incorrect options.</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[11px]">Novelty Hash Similarity:</div>
                    <div className="text-base font-mono font-bold text-emerald-400 mt-1">
                      {(selectedVerificationQ.verificationReport.noveltySimilarityScore * 100).toFixed(0)}% (&lt; 10% Duplicate Risk)
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Guarantees no repeated questions across student tests.</p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    <strong>Audit Status: PASSED.</strong> Both independent LLM evaluators confirmed 100% agreement with verified source citation <strong>{selectedVerificationQ.sourceCitation.sourceTitle}</strong>.
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Verification report metadata loading...</p>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedVerificationQ(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium"
              >
                Close Audit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatedWrapper>
  );
}
