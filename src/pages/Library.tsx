import React, { useState } from 'react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';
import { ScrollReveal } from '../components/ScrollReveal';
import { Upload, FileText, Video, Link as LinkIcon, X, BookOpen, Download, Eye, Star } from 'lucide-react';

interface Resource {
    id: number;
    title: string;
    description: string;
    type: 'PDF' | 'Video' | 'Link' | 'Article';
    uploadedBy: string;
    uploadedAt: Date;
    category: string;
    views: number;
    rating: number;
}

const MOCK_RESOURCES: Resource[] = [
    { id: 1, title: 'Calculus I: Derivatives and Applications', description: 'Comprehensive guide covering limits, derivatives, chain rule, and optimization problems with detailed examples', type: 'PDF', uploadedBy: 'Dr. John Smith', uploadedAt: new Date('2024-01-15'), category: 'Mathematics', views: 1247, rating: 4.8 },
    { id: 2, title: 'Linear Algebra Complete Course', description: 'MIT OpenCourseWare - Full semester covering vector spaces, matrices, eigenvalues, and linear transformations', type: 'Video', uploadedBy: 'MIT OCW', uploadedAt: new Date('2024-01-10'), category: 'Mathematics', views: 3421, rating: 4.9 },
    { id: 3, title: 'React Official Documentation', description: 'Complete React documentation including hooks, components, state management, and best practices', type: 'Link', uploadedBy: 'React Team', uploadedAt: new Date('2024-01-05'), category: 'Computer Science', views: 2156, rating: 4.7 },
    { id: 4, title: 'Organic Chemistry Mechanisms', description: 'Detailed explanation of reaction mechanisms, electron flow, and synthesis strategies', type: 'PDF', uploadedBy: 'Prof. Sarah Chen', uploadedAt: new Date('2024-01-20'), category: 'Chemistry', views: 892, rating: 4.6 },
    { id: 5, title: 'Introduction to Quantum Mechanics', description: 'Lecture series covering wave functions, Schrödinger equation, and quantum operators', type: 'Video', uploadedBy: 'Dr. Mike Ross', uploadedAt: new Date('2024-01-18'), category: 'Physics', views: 1567, rating: 4.8 },
    { id: 6, title: 'Data Structures and Algorithms', description: 'Comprehensive guide to arrays, linked lists, trees, graphs, sorting, and searching algorithms', type: 'Article', uploadedBy: 'Emma Watson', uploadedAt: new Date('2024-01-12'), category: 'Computer Science', views: 2890, rating: 4.9 },
    { id: 7, title: 'Microeconomics Principles', description: 'Supply and demand, market equilibrium, elasticity, and consumer behavior analysis', type: 'PDF', uploadedBy: 'Prof. David Lee', uploadedAt: new Date('2024-01-08'), category: 'Economics', views: 1123, rating: 4.5 },
    { id: 8, title: 'Python Programming Fundamentals', description: 'Complete Python tutorial from basics to advanced topics including OOP and data structures', type: 'Video', uploadedBy: 'Lisa Park', uploadedAt: new Date('2024-01-25'), category: 'Computer Science', views: 4521, rating: 4.9 },
    { id: 9, title: 'World History: Renaissance Period', description: 'Detailed analysis of Renaissance art, culture, politics, and scientific revolution', type: 'Article', uploadedBy: 'Dr. James Wilson', uploadedAt: new Date('2024-01-14'), category: 'History', views: 756, rating: 4.4 },
    { id: 10, title: 'Statistics and Probability', description: 'Probability distributions, hypothesis testing, regression analysis, and statistical inference', type: 'PDF', uploadedBy: 'Prof. Anna Martinez', uploadedAt: new Date('2024-01-22'), category: 'Mathematics', views: 1678, rating: 4.7 },
    { id: 11, title: 'Constitutional Law Fundamentals', description: 'Overview of constitutional principles, judicial review, and landmark Supreme Court cases', type: 'Article', uploadedBy: 'Prof. Robert Taylor', uploadedAt: new Date('2024-01-16'), category: 'Law', views: 934, rating: 4.6 },
    { id: 12, title: 'Machine Learning Basics', description: 'Introduction to supervised learning, neural networks, and practical ML applications', type: 'Video', uploadedBy: 'Dr. Kevin Zhang', uploadedAt: new Date('2024-01-28'), category: 'Computer Science', views: 5234, rating: 4.9 },
];

export function Library() {
    const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        type: 'PDF' as 'PDF' | 'Video' | 'Link' | 'Article',
        category: 'Mathematics',
    });

    const categories = ['All', ...Array.from(new Set(resources.map(r => r.category)))];

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        const newResource: Resource = {
            id: Date.now(),
            ...uploadForm,
            uploadedBy: 'You',
            uploadedAt: new Date(),
            views: 0,
            rating: 5.0,
        };
        setResources([newResource, ...resources]);
        setUploadForm({ title: '', description: '', type: 'PDF', category: 'Mathematics' });
        setIsUploadDialogOpen(false);
    };

    const filteredResources = selectedCategory === 'All'
        ? resources
        : resources.filter(r => r.category === selectedCategory);

    const getIcon = (type: string) => {
        switch (type) {
            case 'PDF':
                return <FileText className="h-5 w-5" />;
            case 'Video':
                return <Video className="h-5 w-5" />;
            case 'Link':
                return <LinkIcon className="h-5 w-5" />;
            case 'Article':
                return <BookOpen className="h-5 w-5" />;
            default:
                return <FileText className="h-5 w-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'PDF': return 'bg-red-500/20 text-red-400 border-red-400/30';
            case 'Video': return 'bg-purple-500/20 text-purple-400 border-purple-400/30';
            case 'Link': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
            case 'Article': return 'bg-green-500/20 text-green-400 border-green-400/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-400/30';
        }
    };

    return (
        <AnimatedWrapper className="space-y-6 animate-fade-in">
            {/* Enhanced Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-cyan-900 to-blue-900 rounded-2xl p-8 border border-blue-400/30 shadow-lg shadow-blue-500/20 animate-slide-down">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent animate-pulse" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Resource Library</h1>
                        <p className="text-blue-100 text-lg">Share and discover study materials</p>
                    </div>
                    <button
                        onClick={() => setIsUploadDialogOpen(true)}
                        className="group inline-flex items-center justify-center rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-all h-12 px-8 py-2"
                    >
                        <Upload className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                        Upload Resource
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <ScrollReveal delay={0.1} width="100%">
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur border-2 border-blue-300/30 rounded-xl p-6 hover:scale-105 transition-all">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-blue-400" />
                            <div>
                                <p className="text-2xl font-bold text-white">{resources.length}</p>
                                <p className="text-sm text-blue-300">Resources</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 backdrop-blur border-2 border-purple-300/30 rounded-xl p-6 hover:scale-105 transition-all">
                        <div className="flex items-center gap-3">
                            <Video className="w-8 h-8 text-purple-400" />
                            <div>
                                <p className="text-2xl font-bold text-white">{resources.filter(r => r.type === 'Video').length}</p>
                                <p className="text-sm text-purple-300">Videos</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur border-2 border-red-300/30 rounded-xl p-6 hover:scale-105 transition-all">
                        <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-red-400" />
                            <div>
                                <p className="text-2xl font-bold text-white">{resources.filter(r => r.type === 'PDF').length}</p>
                                <p className="text-sm text-red-300">PDFs</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur border-2 border-green-300/30 rounded-xl p-6 hover:scale-105 transition-all">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-green-400" />
                            <div>
                                <p className="text-2xl font-bold text-white">{resources.filter(r => r.type === 'Article').length}</p>
                                <p className="text-sm text-green-300">Articles</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* Category Filters */}
            <ScrollReveal delay={0.2} width="100%">
                <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${selectedCategory === category
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </ScrollReveal>

            {/* Upload Dialog */}
            {isUploadDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl border-2 border-cyan-400/30 bg-slate-900 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-cyan-400/20 p-6">
                            <h2 className="text-xl font-bold text-white">Upload Resource</h2>
                            <button
                                onClick={() => setIsUploadDialogOpen(false)}
                                className="rounded-lg p-2 hover:bg-slate-800 transition-colors"
                            >
                                <X className="h-5 w-5 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleUpload} className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-white">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 flex h-11 w-full rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    value={uploadForm.title}
                                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-white">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="mt-1 flex w-full rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    value={uploadForm.description}
                                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-white">Type</label>
                                    <select
                                        className="mt-1 flex h-11 w-full rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        value={uploadForm.type}
                                        onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value as any })}
                                    >
                                        <option>PDF</option>
                                        <option>Video</option>
                                        <option>Link</option>
                                        <option>Article</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-white">Category</label>
                                    <select
                                        className="mt-1 flex h-11 w-full rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        value={uploadForm.category}
                                        onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                                    >
                                        <option>Mathematics</option>
                                        <option>Computer Science</option>
                                        <option>Physics</option>
                                        <option>Chemistry</option>
                                        <option>Economics</option>
                                        <option>History</option>
                                        <option>Law</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadDialogOpen(false)}
                                    className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all"
                                >
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Resources Grid */}
            <ScrollReveal delay={0.3} width="100%">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredResources.map((resource, index) => (
                        <div
                            key={resource.id}
                            className="group relative rounded-2xl border-2 border-blue-300/30 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 hover:border-blue-400/50 transition-all duration-300 overflow-hidden"
                        >
                            {/* Hover glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-cyan-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative p-6 space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                                            {getIcon(resource.type)}
                                        </div>
                                        <div>
                                            <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${getTypeColor(resource.type)}`}>
                                                {resource.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Title and Description */}
                                <div>
                                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors mb-2">{resource.title}</h3>
                                    <p className="text-sm text-slate-400 line-clamp-3">{resource.description}</p>
                                </div>

                                {/* Category */}
                                <div className="inline-flex items-center rounded-lg bg-cyan-500/10 border border-cyan-400/30 px-3 py-1 text-xs font-medium text-cyan-300">
                                    {resource.category}
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        <span>{resource.views.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-yellow-400">{resource.rating}</span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                                    <div className="text-xs text-slate-500">
                                        <p>By {resource.uploadedBy}</p>
                                        <p>{resource.uploadedAt.toLocaleDateString()}</p>
                                    </div>
                                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-medium transition-all hover:shadow-lg">
                                        <Download className="w-4 h-4" />
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollReveal>
        </AnimatedWrapper>
    );
}
