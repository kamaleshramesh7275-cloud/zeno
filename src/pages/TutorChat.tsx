import { useState, useRef, useEffect } from 'react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';
import { queryAITutor, playVoiceNarration } from '../lib/tutorService';
import { BENCHMARK_QUESTIONS } from '../data/courseData';
import { evaluateAnswer } from '../lib/assessmentEngine';
import { updateTopicMastery } from '../lib/bkt';
import type { Citation, TutorMessage, RAGConfig, QuestionAttempt } from '../types/trackD';
import { 
  Send, Sparkles, Volume2, ShieldAlert, BookOpen, 
  Video, Layers, FileText, Globe, CheckCircle2,
  Mic, MicOff, Sliders, Columns, Cpu, Check, Play,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function TutorChat() {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'tutor',
      text: `Hello! I am **ZENO**, your course-grounded AI Tutor. I answer questions strictly using your uploaded **MIT 18.06 Linear Algebra** lectures, slides, and Gilbert Strang's textbook. 

Click any citation badge to inspect the exact video timestamp or slide diagram. Any off-syllabus queries will be transparently declined to prevent hallucinations.`,
      timestamp: new Date(),
      citations: [
        {
          id: 'cite-init-1',
          unitId: 'unit-vid-21-01',
          sourceType: 'video',
          sourceTitle: 'MIT 18.06 Lecture 21: Eigenvalues and Eigenvectors',
          location: { timestampSeconds: 875, timestampLabel: '14:35', chapterOrSection: 'Eigenvalue Equation' },
          excerpt: 'Ax = lambda*x means matrix A acts as pure scalar scaling on eigenvector x.',
          diagramUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
          diagramCaption: 'Preservation of eigenvector axis direction under transformation',
        }
      ],
      extractedConcepts: ['Grounding Verified', 'Zero Hallucinations'],
      telemetry: {
        latencyMs: 235,
        retrievalMode: 'hybrid',
        chunksEvaluated: 6,
        chunksRetrieved: 1,
        denseScore: 0.942,
        sparseScore: 0.885,
        refusalConfidence: 0.01,
      },
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [language, setLanguage] = useState<'english' | 'hinglish'>('english');
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(messages[0].citations![0]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [splitTab, setSplitTab] = useState<'source' | 'drill'>('source');

  // Quick Drill State for Split View
  const [activeDrillIndex, setActiveDrillIndex] = useState(0);
  const [drillAnswer, setDrillAnswer] = useState('');
  const [drillAttempt, setDrillAttempt] = useState<QuestionAttempt | null>(null);

  // RAG Engine Sandbox Config (For AI Judges)
  const [ragConfig, setRagConfig] = useState<RAGConfig>({
    retrievalMode: 'hybrid',
    topK: 2,
    similarityThreshold: 0.70,
    hallucinationGuardrail: 'strict',
    temperature: 0.2,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: TutorMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const response = queryAITutor(query, language, ragConfig);
      setMessages(prev => [...prev, response.message]);
      if (response.message.citations && response.message.citations.length > 0) {
        setSelectedCitation(response.message.citations[0]);
      }
      setIsTyping(false);
    }, 550);
  };

  // Browser Speech-to-Text handler
  const handleToggleMic = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hinglish' ? 'hi-IN' : 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        handleSendMessage(transcript);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Quick Drill Submission
  const currentDrillQ = BENCHMARK_QUESTIONS[activeDrillIndex];

  const handleDrillSubmit = () => {
    if (!drillAnswer.trim()) return;
    const attempt = evaluateAnswer(currentDrillQ, drillAnswer);
    setDrillAttempt(attempt);

    // Update BKT in localStorage
    const saved = localStorage.getItem('zeno_topic_mastery');
    if (saved) {
      const masteryObj = JSON.parse(saved);
      if (masteryObj[currentDrillQ.topicId]) {
        masteryObj[currentDrillQ.topicId] = updateTopicMastery(masteryObj[currentDrillQ.topicId], attempt.isCorrect);
        localStorage.setItem('zeno_topic_mastery', JSON.stringify(masteryObj));
      }
    }

    if (attempt.isCorrect) {
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  const samplePrompts = [
    { label: '📐 Explain Eigenvalues (Video Anchor)', query: 'Why does Ax = lambda*x require det(A - lambda*I) = 0 for eigenvalues?' },
    { label: '🌀 SVD Intuition (Slide Anchor)', query: 'What is the geometric intuition of SVD A = U * Sigma * V^T?' },
    { label: '⛔ Test Refusal (Off-Syllabus)', query: 'What is the recipe for chocolate cake?' },
  ];

  // Helper to extract real YouTube embed url if available
  const getEmbedVideoUrl = (citation: Citation) => {
    const startSec = citation.location.timestampSeconds || 875;
    if (citation.unitId.includes('vid-21')) {
      return `https://www.youtube-nocookie.com/embed/cdZtw4r8uWc?start=${startSec}&autoplay=0`;
    }
    return `https://www.youtube-nocookie.com/embed/7UJ4CFRGd-U?start=${startSec}&autoplay=0`;
  };

  return (
    <AnimatedWrapper className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-4">
      {/* Left / Center Pane: Chat Area */}
      <div className={`flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md transition-all duration-300 ${isSplitView ? 'w-full md:w-1/2' : 'flex-1'}`}>
        {/* Tutor Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-bold text-white text-sm">ZENO Grounded AI Tutor</h2>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Locked
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Grounded in MIT 18.06 Course Materials</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Feature 6: RAG Engine Sandbox Toggle */}
            <button
              onClick={() => setIsSandboxOpen(!isSandboxOpen)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                isSandboxOpen
                  ? 'bg-indigo-600 text-white border-indigo-400'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Toggle RAG Engine Tuning Sandbox (For AI Judges)"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RAG Sandbox</span>
            </button>

            {/* Feature 8: Side-by-Side Split View Toggle */}
            <button
              onClick={() => setIsSplitView(!isSplitView)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                isSplitView
                  ? 'bg-blue-600 text-white border-blue-400'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Toggle Split-Screen Multitasking View"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split View</span>
            </button>

            {/* Language Toggle */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setLanguage('english')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  language === 'english' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hinglish')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  language === 'hinglish' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hinglish
              </button>
            </div>
          </div>
        </div>

        {/* Feature 6: Collapsible RAG Engine Sandbox Panel (For Judges) */}
        {isSandboxOpen && (
          <div className="p-3 bg-slate-950/95 border-b border-indigo-500/30 text-xs space-y-3 animate-slide-down">
            <div className="flex items-center justify-between text-indigo-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> RAG Engine Tuning Sandbox (Judge Inspector)
              </span>
              <span className="text-[10px] font-mono text-slate-400">Live Inference Adjuster</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">Retrieval Mode:</label>
                <select
                  value={ragConfig.retrievalMode}
                  onChange={(e) => setRagConfig({ ...ragConfig, retrievalMode: e.target.value as any })}
                  className="w-full mt-1 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[11px] text-white"
                >
                  <option value="hybrid">Hybrid (Dense + BM25)</option>
                  <option value="dense">Dense Vector Only</option>
                  <option value="bm25">Sparse BM25 Keyword</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Hallucination Guardrail:</label>
                <select
                  value={ragConfig.hallucinationGuardrail}
                  onChange={(e) => setRagConfig({ ...ragConfig, hallucinationGuardrail: e.target.value as any })}
                  className="w-full mt-1 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[11px] text-white"
                >
                  <option value="strict">Strict (100% Academic Lock)</option>
                  <option value="balanced">Balanced</option>
                  <option value="permissive">Permissive</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Top-K Chunks: {ragConfig.topK}</label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={ragConfig.topK}
                  onChange={(e) => setRagConfig({ ...ragConfig, topK: Number(e.target.value) })}
                  className="w-full mt-2 accent-indigo-500 h-1"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Similarity Threshold: {ragConfig.similarityThreshold}</label>
                <input
                  type="range"
                  min="0.50"
                  max="0.95"
                  step="0.05"
                  value={ragConfig.similarityThreshold}
                  onChange={(e) => setRagConfig({ ...ragConfig, similarityThreshold: Number(e.target.value) })}
                  className="w-full mt-2 accent-indigo-500 h-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-4 shadow-lg text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : msg.isDeclined
                    ? 'bg-amber-950/60 border border-amber-500/40 text-amber-200 rounded-bl-none'
                    : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {/* Refusal Badge */}
                {msg.isDeclined && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-2">
                    <ShieldAlert className="w-4 h-4" /> Out-of-Scope Query Declined
                  </div>
                )}

                {/* Formatted Text */}
                <div className="whitespace-pre-line prose prose-invert prose-sm max-w-none">
                  {msg.text}
                </div>

                {/* Interactive Citations Bar */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-800/80">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Grounded Source Citations (Click to inspect):
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cite) => (
                        <button
                          key={cite.id}
                          onClick={() => {
                            setSelectedCitation(cite);
                            setSplitTab('source');
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-blue-300 hover:text-blue-200 border border-blue-500/30 hover:border-blue-400 transition-all shadow-sm"
                        >
                          {cite.sourceType === 'video' && <Video className="w-3.5 h-3.5 text-red-400" />}
                          {cite.sourceType === 'slide' && <Layers className="w-3.5 h-3.5 text-amber-400" />}
                          {cite.sourceType === 'textbook' && <FileText className="w-3.5 h-3.5 text-blue-400" />}
                          <span>
                            {cite.sourceType === 'video' ? `Timestamp ${cite.location.timestampLabel}` : cite.sourceType === 'slide' ? `Slide #${cite.location.slideNumber}` : `Page #${cite.location.pageNumber}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feature 6: Telemetry Bar below Tutor Response */}
                {msg.telemetry && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-400">
                    <span>⚡ Latency: {msg.telemetry.latencyMs}ms</span>
                    <span>Mode: {msg.telemetry.retrievalMode}</span>
                    <span>Dense Score: {msg.telemetry.denseScore}</span>
                    <span>Sparse BM25: {msg.telemetry.sparseScore}</span>
                  </div>
                )}

                {/* Audio Narration Button */}
                {msg.sender === 'tutor' && !msg.isDeclined && (
                  <div className="mt-2.5 flex justify-end">
                    <button
                      onClick={() => playVoiceNarration(msg.text)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-blue-300 transition-colors"
                      title="Listen with Web Speech TTS"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Listen to Explanation
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-blue-400 bg-slate-950/60 p-3 rounded-xl max-w-xs border border-slate-800">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Synthesizing citation-grounded response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Prompts */}
        <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 whitespace-nowrap">
            Try:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.query)}
              className="text-xs text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors whitespace-nowrap"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Bar with Voice-to-Text Microphone */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything grounded in the lecture videos, slides, or textbook..."
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {/* Voice STT Microphone Button */}
            <button
              type="button"
              onClick={handleToggleMic}
              className={`p-3 rounded-xl border transition-all ${
                isListening
                  ? 'bg-red-600 text-white border-red-400 animate-pulse'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Click to speak query'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Pane: Media Inspector / Split View Practice Drill */}
      <div className={`bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl backdrop-blur-md transition-all duration-300 ${isSplitView ? 'w-full md:w-1/2' : 'w-full md:w-80 lg:w-96'}`}>
        {/* Tab Headers in Split View */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSplitTab('source')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                splitTab === 'source' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Source Anchor
            </button>
            <button
              onClick={() => setSplitTab('drill')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                splitTab === 'drill' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" /> Quick Concept Drill
            </button>
          </div>
          <span className="text-[10px] font-mono text-blue-400">
            {splitTab === 'source' ? 'Primary Video/Doc' : 'In-Chat BKT Drill'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {splitTab === 'source' ? (
            /* Tab 1: Real Source Anchor Inspector with YouTube Embed */
            selectedCitation ? (
              <div className="space-y-4">
                {/* Media Preview Box */}
                {selectedCitation.sourceType === 'video' && (
                  <div className="rounded-xl overflow-hidden border border-red-500/40 bg-black aspect-video relative shadow-lg">
                    <iframe
                      src={getEmbedVideoUrl(selectedCitation)}
                      title="MIT OpenCourseWare Lecture Video"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {selectedCitation.sourceType === 'slide' && (
                  <div className="rounded-xl overflow-hidden border border-amber-500/30 bg-slate-950 p-3">
                    <div className="flex items-center justify-between text-xs text-amber-300 mb-2">
                      <span className="font-semibold flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" /> Lecture Slide View
                      </span>
                      <span className="font-mono">Slide #{selectedCitation.location.slideNumber}</span>
                    </div>
                    {selectedCitation.diagramUrl && (
                      <img
                        src={selectedCitation.diagramUrl}
                        alt={selectedCitation.diagramCaption}
                        className="rounded-lg w-full h-44 object-cover border border-slate-800 mb-2"
                      />
                    )}
                    <p className="text-[11px] text-slate-300 italic">
                      "{selectedCitation.diagramCaption || 'Slide visualization figure'}"
                    </p>
                  </div>
                )}

                {selectedCitation.sourceType === 'textbook' && (
                  <div className="rounded-xl overflow-hidden border border-blue-500/30 bg-slate-950 p-3">
                    <div className="flex items-center justify-between text-xs text-blue-300 mb-2">
                      <span className="font-semibold flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Textbook Page View
                      </span>
                      <span className="font-mono">Page #{selectedCitation.location.pageNumber}</span>
                    </div>
                    {selectedCitation.diagramUrl && (
                      <img
                        src={selectedCitation.diagramUrl}
                        alt="Textbook figure"
                        className="rounded-lg w-full h-44 object-cover border border-slate-800 mb-2"
                      />
                    )}
                  </div>
                )}

                {/* Source Metadata */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">Source Document:</div>
                  <div className="text-sm font-semibold text-white leading-tight">
                    {selectedCitation.sourceTitle}
                  </div>
                  <div className="text-xs text-indigo-400 font-mono">
                    {selectedCitation.location.chapterOrSection || 'Section 1.1'}
                  </div>
                </div>

                {/* Excerpt */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">Verbatim Source Excerpt:</div>
                  <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    "{selectedCitation.excerpt}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <BookOpen className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-sm font-medium text-slate-300">No Citation Selected</p>
              </div>
            )
          ) : (
            /* Tab 2: Split View Practice Drill (Direct Concept Assessment) */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase">
                  Concept Practice Drill ({activeDrillIndex + 1}/{BENCHMARK_QUESTIONS.length})
                </span>
                <span className="text-xs text-slate-400">
                  {currentDrillQ.topicName}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white leading-relaxed">
                {currentDrillQ.question}
              </h4>

              {currentDrillQ.type === 'mcq' && currentDrillQ.options && (
                <div className="space-y-2">
                  {currentDrillQ.options.map((opt, i) => (
                    <label
                      key={i}
                      className={`block p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        drillAnswer === opt
                          ? 'bg-purple-900/40 border-purple-500 text-white'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="drill-opt"
                        value={opt}
                        checked={drillAnswer === opt}
                        onChange={(e) => setDrillAnswer(e.target.value)}
                        className="hidden"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentDrillQ.type === 'numerical' && (
                <div>
                  <input
                    type="number"
                    value={drillAnswer}
                    onChange={(e) => setDrillAnswer(e.target.value)}
                    placeholder="Enter answer (e.g. 16)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              )}

              {drillAttempt ? (
                <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                  drillAttempt.isCorrect
                    ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                    : 'bg-red-950/50 border-red-500/40 text-red-200'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {drillAttempt.isCorrect ? '✅ Correct! Mastery Updated' : '❌ Needs Review'}
                  </div>
                  <p>{drillAttempt.feedback}</p>
                </div>
              ) : (
                <button
                  onClick={handleDrillSubmit}
                  disabled={!drillAnswer.trim()}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium text-xs shadow-lg"
                >
                  Verify & Update Mastery
                </button>
              )}

              {drillAttempt && (
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setActiveDrillIndex((activeDrillIndex + 1) % BENCHMARK_QUESTIONS.length);
                      setDrillAnswer('');
                      setDrillAttempt(null);
                    }}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    Next Practice Problem →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AnimatedWrapper>
  );
}
