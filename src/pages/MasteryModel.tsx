import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedWrapper } from '../components/AnimatedWrapper';
import { TOPIC_NODES, INITIAL_TOPIC_MASTERY } from '../data/courseData';
import { calibrateColdStartPriors } from '../lib/bkt';
import type { TopicMasteryState } from '../types/trackD';
import { 
  GitBranch, Sparkles, CheckCircle2, RotateCcw, 
  Calendar, Layers, Check, ArrowRight, Zap, Target,
  Award, Play, ChevronRight, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function MasteryModel() {
  const navigate = useNavigate();
  const [masteryStates, setMasteryStates] = useState<Record<string, TopicMasteryState>>(() => {
    const saved = localStorage.getItem('zeno_topic_mastery');
    return saved ? JSON.parse(saved) : INITIAL_TOPIC_MASTERY;
  });

  const [selectedTopicId, setSelectedTopicId] = useState<string>('eigenvalues-eigenvectors');
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [diagStep, setDiagStep] = useState(0);
  const [diagAnswers, setDiagAnswers] = useState<{ topicId: string; isCorrect: boolean }[]>([]);
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Diagnostic questions for cold-start intake
  const diagnosticQuestions = [
    {
      topicId: 'vectors-basis',
      topicName: 'Vectors & Subspaces',
      question: 'Does the linear span of two non-collinear vectors in R^3 form a 2D plane through the origin?',
      answer: true,
      rationale: 'Yes, span{v1, v2} = {c1*v1 + c2*v2} defines a 2-dimensional subspace (plane passing through the origin).',
    },
    {
      topicId: 'linear-independence',
      topicName: 'Linear Independence',
      question: 'If a set of vectors contains the zero vector {0}, can it ever be linearly independent?',
      answer: false,
      rationale: 'No. Any set containing {0} is automatically dependent because c1*{0} = 0 for non-zero scalar c1.',
    },
    {
      topicId: 'eigenvalues-eigenvectors',
      topicName: 'Eigenvalues & Invariance',
      question: 'Is det(A - lambda*I) = 0 required so that (A - lambda*I) has a non-trivial nullspace of eigenvectors?',
      answer: true,
      rationale: 'Yes. An eigenvector must be non-zero (x != 0), requiring (A - lambda*I) to be singular with zero determinant.',
    },
  ];

  const handleDiagnosticAnswer = (userChoice: boolean) => {
    const currentQ = diagnosticQuestions[diagStep];
    const isCorrect = userChoice === currentQ.answer;
    const newAnswers = [...diagAnswers, { topicId: currentQ.topicId, isCorrect }];
    setDiagAnswers(newAnswers);

    if (diagStep + 1 < diagnosticQuestions.length) {
      setDiagStep(prev => prev + 1);
    } else {
      setIsCalibrating(true);
      setTimeout(() => {
        // Calibrate priors across all nodes
        const updated = calibrateColdStartPriors(newAnswers, masteryStates);
        setMasteryStates(updated);
        localStorage.setItem('zeno_topic_mastery', JSON.stringify(updated));
        setIsCalibrating(false);
        setIsDiagnosticOpen(false);
        setDiagStep(0);
        setDiagAnswers([]);
        confetti({ particleCount: 90, spread: 70 });
      }, 700);
    }
  };

  const handleResetPriors = () => {
    setMasteryStates(INITIAL_TOPIC_MASTERY);
    localStorage.removeItem('zeno_topic_mastery');
  };

  const activeNode = TOPIC_NODES.find(t => t.id === selectedTopicId) || TOPIC_NODES[0];
  const activeMastery = masteryStates[activeNode.id] || { masteryProbability: 0.25, status: 'Novice', attemptsCount: 0, correctCount: 0 };

  // Calculate upstream prerequisites (ancestors)
  const upstreamPrereqs = new Set(activeNode.prerequisites);

  // Calculate downstream unlocked topics (descendants)
  const downstreamUnlocked = new Set(
    TOPIC_NODES.filter(t => t.prerequisites.includes(activeNode.id)).map(t => t.id)
  );

  const getStatusColor = (status: 'Novice' | 'Practicing' | 'Mastered') => {
    switch (status) {
      case 'Mastered': return 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300';
      case 'Practicing': return 'border-amber-500/50 bg-amber-950/20 text-amber-300';
      case 'Novice': return 'border-red-500/50 bg-red-950/20 text-red-300';
    }
  };

  const getStatusBadge = (prob: number) => {
    if (prob >= 0.70) return { label: 'Mastered', color: 'text-emerald-400' };
    if (prob >= 0.40) return { label: 'Practicing', color: 'text-amber-400' };
    return { label: 'Novice', color: 'text-red-400' };
  };

  return (
    <AnimatedWrapper className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-teal-950 to-indigo-950 rounded-2xl p-8 border border-emerald-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Bayesian Knowledge Tracing (BKT) Cognitive Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Cognitive Learner Model & Prerequisite DAG
            </h1>
            <p className="text-emerald-200/90 mt-2 max-w-2xl text-sm leading-relaxed">
              Dynamically estimates latent concept mastery $P(L_t)$ with each quiz attempt. Click any concept in the DAG to illuminate required foundations and launch targeted drills.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDiagnosticOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-lg shadow-emerald-600/30"
            >
              <Award className="w-4 h-4" /> Cold-Start Intake Diagnostic
            </button>
            <button
              onClick={handleResetPriors}
              title="Reset Priors to Benchmark Defaults"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature 5: Interactive Directed Acyclic Graph (DAG) Network */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Course Prerequisite Topology DAG</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Required Foundation (Upstream)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Unlocks Next (Downstream)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Mastered</span>
          </div>
        </div>

        {/* Multi-tier DAG canvas */}
        <div className="p-6 bg-slate-950/90 rounded-xl border border-slate-800 overflow-x-auto">
          <div className="min-w-[760px] grid grid-cols-7 gap-3 py-4">
            {TOPIC_NODES.map((node, index) => {
              const state = masteryStates[node.id] || { masteryProbability: 0.25, status: 'Novice' };
              const badge = getStatusBadge(state.masteryProbability);
              const isSelected = node.id === selectedTopicId;
              const isUpstream = upstreamPrereqs.has(node.id);
              const isDownstream = downstreamUnlocked.has(node.id);

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedTopicId(node.id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between relative shadow-lg ${
                    isSelected
                      ? 'border-cyan-400 bg-slate-900 ring-4 ring-cyan-500/20 scale-105 z-10'
                      : isUpstream
                      ? 'border-cyan-500/70 bg-cyan-950/30'
                      : isDownstream
                      ? 'border-indigo-500/70 bg-indigo-950/30'
                      : getStatusColor(state.status) + ' bg-slate-900/80 hover:border-slate-600'
                  }`}
                >
                  {/* Status Indicator Tag */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Tier {index + 1}</span>
                      {isSelected && <span className="text-cyan-300 font-bold">Active</span>}
                      {isUpstream && <span className="text-cyan-400 font-bold">Prereq</span>}
                      {isDownstream && <span className="text-indigo-400 font-bold">Unlocks</span>}
                    </div>

                    <div className="font-bold text-white text-xs leading-tight line-clamp-2">
                      {node.name}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold text-slate-200">
                        {(state.masteryProbability * 100).toFixed(0)}%
                      </span>
                      <span className={`text-[10px] font-semibold ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    {/* Mastery Fill bar */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full transition-all duration-500"
                        style={{ width: `${state.masteryProbability * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Topic Deep-Dive Card with 1-Click "Drill This Topic" */}
        <div className="bg-slate-950 p-5 rounded-xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
                Selected Concept
              </span>
              <h3 className="text-base font-bold text-white">{activeNode.name}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeNode.description}
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <span>BKT Mastery P(L): <strong className="text-emerald-400 font-bold">{(activeMastery.masteryProbability * 100).toFixed(0)}%</strong></span>
              <span>Attempts: <strong className="text-white">{activeMastery.attemptsCount}</strong></span>
              <span>Prerequisites: <strong className="text-cyan-300">{activeNode.prerequisites.length > 0 ? activeNode.prerequisites.join(', ') : 'None (Foundational)'}</strong></span>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/assessment')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 whitespace-nowrap transition-all hover:scale-105 active:scale-95"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Drill This Topic (Adaptive Quiz)</span>
          </button>
        </div>
      </div>

      {/* BKT Mathematical Parameters & Topic Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Math BKT Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            📐 Active BKT Model Parameters
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400">Prior Initial Knowledge P(L₀):</span>
              <span className="font-mono font-bold text-emerald-400">0.25</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400">Learning Transition P(T):</span>
              <span className="font-mono font-bold text-blue-400">0.15</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400">Guess Probability P(G):</span>
              <span className="font-mono font-bold text-amber-400">0.20</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400">Slip Probability P(S):</span>
              <span className="font-mono font-bold text-purple-400">0.10</span>
            </div>
          </div>
        </div>

        {/* Spaced-Repetition Revision Cards */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" /> Auto-Generated Revision Pack
          </h3>
          <p className="text-xs text-slate-400">
            High-yield flashcard compiled for weakest topic (<strong>SVD</strong>):
          </p>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs">
            <span className="text-[10px] text-indigo-300 uppercase font-mono">Flashcard • Weak Topic</span>
            <div className="font-bold text-white">Q: What is the geometric transformation of A = U * Sigma * V^T?</div>
            <p className="text-slate-300 pt-1.5 border-t border-slate-800 text-[11px]">
              A: Unit circle in R^n is rotated by V^T, axes scaled by singular values sigma_i, and rotated into R^m by U.
            </p>
          </div>
        </div>

        {/* Forgetting Curve Schedule */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-400" /> Ebbinghaus Study Timeline
          </h3>
          <p className="text-xs text-slate-400">
            Optimal review intervals to prevent memory decay:
          </p>
          <ul className="space-y-1.5 text-xs">
            <li className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-300">Day 1: Singular Value Decomposition</span>
              <span className="text-emerald-400 font-mono text-[11px]">24h Review</span>
            </li>
            <li className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-300">Day 3: Diagonalization & Powers</span>
              <span className="text-blue-400 font-mono text-[11px]">72h Review</span>
            </li>
            <li className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-300">Day 7: Four Subspaces Orthogonality</span>
              <span className="text-indigo-400 font-mono text-[11px]">7-Day Review</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Feature 7: Modal: Cold-Start Onboarding Wizard */}
      {isDiagnosticOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                Diagnostic Intake Step {diagStep + 1} of {diagnosticQuestions.length}
              </span>
              <button
                onClick={() => setIsDiagnosticOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Step Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${((diagStep + 1) / diagnosticQuestions.length) * 100}%` }}
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
                Calibrating: {diagnosticQuestions[diagStep].topicName}
              </span>
              <h3 className="text-base font-bold text-white leading-relaxed mt-2">
                {diagnosticQuestions[diagStep].question}
              </h3>
            </div>

            {isCalibrating ? (
              <div className="py-8 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <p className="text-xs text-emerald-300 font-mono">Calibrating Bayesian Knowledge Tracing priors...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  onClick={() => handleDiagnosticAnswer(true)}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-emerald-600/40 border border-slate-700 hover:border-emerald-500 text-white font-medium text-sm transition-all"
                >
                  True
                </button>
                <button
                  onClick={() => handleDiagnosticAnswer(false)}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-red-600/40 border border-slate-700 hover:border-red-500 text-white font-medium text-sm transition-all"
                >
                  False
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatedWrapper>
  );
}
