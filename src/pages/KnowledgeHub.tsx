import { useState } from 'react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';
import { MULTIMODAL_CONTENT_UNITS, TOPIC_NODES } from '../data/courseData';
import type { ContentUnit, SourceType } from '../types/trackD';
import { 
  FileText, Video, Layers, Plus, ExternalLink, 
  Search, BookOpen, Clock, Tag
} from 'lucide-react';

export function KnowledgeHub() {
  const [units, setUnits] = useState<ContentUnit[]>(MULTIMODAL_CONTENT_UNITS);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [activePreviewUnit, setActivePreviewUnit] = useState<ContentUnit | null>(null);

  // New Ingest Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<SourceType>('video');
  const [newTopic, setNewTopic] = useState('eigenvalues-eigenvectors');
  const [newLocation, setNewLocation] = useState('08:45');
  const [newText, setNewText] = useState('');

  const filteredUnits = units.filter(unit => {
    const matchesType = selectedType === 'all' || unit.sourceType === selectedType;
    const matchesSearch = 
      unit.sourceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleIngest = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedTopic = TOPIC_NODES.find(t => t.id === newTopic) || TOPIC_NODES[0];
    
    const newUnit: ContentUnit = {
      id: `unit-${Date.now()}`,
      sourceType: newType,
      sourceTitle: newTitle || 'Custom Ingested Course Material',
      location: newType === 'video' 
        ? { timestampSeconds: 525, timestampLabel: newLocation, chapterOrSection: 'Parsed Section' }
        : newType === 'slide' 
          ? { slideNumber: parseInt(newLocation) || 12, chapterOrSection: `Slide ${newLocation}` }
          : { pageNumber: parseInt(newLocation) || 105, chapterOrSection: `Page ${newLocation}` },
      topicId: matchedTopic.id,
      topicName: matchedTopic.name,
      subtopic: 'User Ingested Concept',
      content: newText || 'Newly parsed and indexed content segment with multimodal deep anchors.',
      summary: 'Extracted key concept and indexed into vector knowledge base.',
      diagramUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
      diagramCaption: 'Auto-extracted figure from uploaded document',
      prerequisites: matchedTopic.prerequisites,
    };

    setUnits([newUnit, ...units]);
    setIsIngestModalOpen(false);
    setNewTitle('');
    setNewText('');
  };

  const getSourceIcon = (type: SourceType) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5 text-red-400" />;
      case 'slide': return <Layers className="h-5 w-5 text-amber-400" />;
      case 'textbook': return <FileText className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <AnimatedWrapper className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-950 via-indigo-900 to-purple-950 rounded-2xl p-8 border border-blue-500/30 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5" /> Track D Multimodal Knowledge Base
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Course Knowledge Base & Multimodal Ingestion
            </h1>
            <p className="text-blue-200/90 mt-2 max-w-2xl text-sm leading-relaxed">
              Every unit is deeply linked to exact textbook pages, slide deck numbers, or video lecture timestamps (`mm:ss`) with extracted figures and prerequisite graphs.
            </p>
          </div>
          <button
            onClick={() => setIsIngestModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Ingest New Source
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by topic, concept, textbook page, or timestamp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Source Type Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['all', 'video', 'slide', 'textbook'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                selectedType === type
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {type === 'all' ? 'All Sources' : `${type}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnits.map((unit) => (
          <div
            key={unit.id}
            onClick={() => setActivePreviewUnit(unit)}
            className="group relative bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 rounded-xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Type & Anchor Tag */}
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase bg-slate-800 border border-slate-700">
                  {getSourceIcon(unit.sourceType)}
                  <span className="text-slate-300">{unit.sourceType}</span>
                </span>
                <span className="flex items-center gap-1 text-xs font-mono font-medium text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">
                  <Clock className="w-3 h-3" />
                  {unit.sourceType === 'video' && `Time: ${unit.location.timestampLabel}`}
                  {unit.sourceType === 'slide' && `Slide #${unit.location.slideNumber}`}
                  {unit.sourceType === 'textbook' && `Page #${unit.location.pageNumber}`}
                </span>
              </div>

              {/* Title & Topic */}
              <h3 className="font-semibold text-slate-100 group-hover:text-blue-300 transition-colors line-clamp-1 text-base">
                {unit.sourceTitle}
              </h3>
              <div className="flex items-center gap-2 mt-1 mb-3">
                <span className="text-xs text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/20">
                  {unit.topicName}
                </span>
                <span className="text-xs text-slate-400 line-clamp-1">
                  • {unit.subtopic}
                </span>
              </div>

              {/* Content Excerpt */}
              <p className="text-xs text-slate-300/90 line-clamp-3 leading-relaxed mb-4">
                {unit.content}
              </p>

              {/* Diagram / Visual Figure Thumbnail */}
              {unit.diagramUrl && (
                <div className="relative rounded-lg overflow-hidden border border-slate-800 mb-3 h-28 bg-slate-950">
                  <img
                    src={unit.diagramUrl}
                    alt={unit.diagramCaption || 'Extracted diagram'}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-2 text-[10px] text-slate-300 truncate">
                    🖼️ {unit.diagramCaption}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Prerequisite Linkages */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-500" />
                {unit.prerequisites.length > 0 ? `${unit.prerequisites.length} Prerequisites` : 'Foundational Unit'}
              </span>
              <span className="text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                View Anchor <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Deep Anchor Unit Previewer */}
      {activePreviewUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {getSourceIcon(activePreviewUnit.sourceType)}
                <h2 className="text-lg font-bold text-white">
                  {activePreviewUnit.sourceTitle}
                </h2>
              </div>
              <button
                onClick={() => setActivePreviewUnit(null)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 font-mono border border-blue-400/30">
                Anchor: {activePreviewUnit.sourceType === 'video' ? `Timestamp ${activePreviewUnit.location.timestampLabel}` : activePreviewUnit.sourceType === 'slide' ? `Slide ${activePreviewUnit.location.slideNumber}` : `Page ${activePreviewUnit.location.pageNumber}`}
              </span>
              <span className="text-xs px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Topic: {activePreviewUnit.topicName}
              </span>
            </div>

            {activePreviewUnit.diagramUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                <img
                  src={activePreviewUnit.diagramUrl}
                  alt={activePreviewUnit.diagramCaption}
                  className="w-full max-h-60 object-cover"
                />
                <p className="p-2.5 text-xs text-slate-300 bg-slate-900/90 border-t border-slate-800">
                  <strong>Visual Figure:</strong> {activePreviewUnit.diagramCaption}
                </p>
              </div>
            )}

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-sm text-slate-200 leading-relaxed">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Ground-Truth Passage Content</h4>
              {activePreviewUnit.content}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActivePreviewUnit(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Ingestion Form */}
      {isIngestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleIngest} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" /> Ingest Course Material
            </h2>
            <p className="text-xs text-slate-300">
              Upload textbook PDF, lecture slides, or provide YouTube video URL to automatically extract chapters, figures, and timestamped chunks.
            </p>

            <div>
              <label className="text-xs font-medium text-slate-300">Source Type</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {(['video', 'slide', 'textbook'] as SourceType[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNewType(t)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium capitalize border transition-all ${
                      newType === t
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Title / Source Name</label>
              <input
                type="text"
                required
                placeholder="e.g. MIT 18.06 Lecture 3 or Linear Algebra Ch. 4"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300">Target Topic</label>
                <select
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {TOPIC_NODES.map(topic => (
                    <option key={topic.id} value={topic.id}>{topic.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">
                  {newType === 'video' ? 'Timestamp (e.g. 12:45)' : newType === 'slide' ? 'Slide Number' : 'Page Number'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={newType === 'video' ? '12:45' : '42'}
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Extracted Text Content</label>
              <textarea
                rows={3}
                required
                placeholder="Paste extracted transcript passage, slide bullet points, or book excerpt..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsIngestModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-medium rounded-lg shadow-lg"
              >
                Ingest & Index
              </button>
            </div>
          </form>
        </div>
      )}
    </AnimatedWrapper>
  );
}
