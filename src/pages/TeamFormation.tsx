import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Shield, Target, Sparkles, CheckCircle, Search } from 'lucide-react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';

export function TeamFormation() {
    const navigate = useNavigate();
    const [teamName, setTeamName] = useState('');
    const [description, setDescription] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);

    // Mock users for selection
    const availableUsers = [
        { id: '1', name: 'Sarah Chen', role: 'Computer Science', avatar: '👩‍💻' },
        { id: '2', name: 'Mike Ross', role: 'Law', avatar: '⚖️' },
        { id: '3', name: 'Jessica Pearson', role: 'Business', avatar: '💼' },
        { id: '4', name: 'Harvey Specter', role: 'Law', avatar: '👔' },
        { id: '5', name: 'Rachel Zane', role: 'Paralegal', avatar: '📚' },
    ];

    const toggleMember = (userId: string) => {
        if (selectedMembers.includes(userId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== userId));
        } else {
            if (selectedMembers.length < 4) {
                setSelectedMembers([...selectedMembers, userId]);
            } else {
                alert('Maximum 4 members allowed!');
            }
        }
    };

    const handleCreateTeam = () => {
        if (!teamName || !description) {
            alert('Please fill in all fields');
            return;
        }
        setShowSuccess(true);
        setTimeout(() => {
            navigate('/app/dashboard');
        }, 2000);
    };

    const filteredUsers = availableUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AnimatedWrapper className="min-h-screen bg-slate-950 p-8 pb-24">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 animate-slide-down">
                    <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-4 backdrop-blur-sm border border-purple-500/20">
                        <Shield className="w-8 h-8 text-purple-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        Form Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Dream Team</span>
                    </h1>
                    <p className="text-slate-400 text-lg">Collaborate, compete, and achieve goals together</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Team Details */}
                    <div className="lg:col-span-2 space-y-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        {/* Team Info Card */}
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                <Target className="w-5 h-5 text-purple-400" />
                                Team Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Team Name</label>
                                    <input
                                        type="text"
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        placeholder="e.g., The Code Wizards"
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Description & Goals</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="What will your team focus on?"
                                        rows={4}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Member Selection */}
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-purple-400" />
                                    Add Members
                                </h2>
                                <span className="text-sm text-slate-400">{selectedMembers.length}/4 selected</span>
                            </div>

                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search students..."
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => toggleMember(user.id)}
                                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${selectedMembers.includes(user.id)
                                            ? 'bg-purple-500/20 border-purple-500/50'
                                            : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{user.avatar}</span>
                                            <div>
                                                <p className="text-white font-medium">{user.name}</p>
                                                <p className="text-xs text-slate-400">{user.role}</p>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${selectedMembers.includes(user.id)
                                            ? 'bg-purple-500 border-purple-500'
                                            : 'border-slate-600'
                                            }`}>
                                            {selectedMembers.includes(user.id) && <CheckCircle className="w-4 h-4 text-white" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Preview & Action */}
                    <div className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        {/* Team Preview */}
                        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-slate-950 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-purple-500/30 shadow-lg shadow-purple-500/20">
                                    <Sparkles className="w-10 h-10 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{teamName || 'Team Name'}</h3>
                                <p className="text-sm text-purple-200/70">{selectedMembers.length + 1} Members</p>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-950/30">
                                    <span className="text-xl">👤</span>
                                    <span className="text-sm text-white">You (Leader)</span>
                                </div>
                                {selectedMembers.map(id => {
                                    const user = availableUsers.find(u => u.id === id);
                                    return (
                                        <div key={id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-950/30 animate-fade-in">
                                            <span className="text-xl">{user?.avatar}</span>
                                            <span className="text-sm text-white">{user?.name}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={handleCreateTeam}
                                className="w-full py-3 bg-white text-purple-900 rounded-xl font-bold hover:bg-purple-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10 flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Create Team
                            </button>
                        </div>

                        {/* Features Info */}
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-white font-medium mb-4">Team Perks</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm text-slate-400">
                                    <div className="p-1 rounded bg-purple-500/10 text-purple-400"><Target className="w-4 h-4" /></div>
                                    Shared Goals & Streaks
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-400">
                                    <div className="p-1 rounded bg-blue-500/10 text-blue-400"><Shield className="w-4 h-4" /></div>
                                    Team Leaderboard
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-400">
                                    <div className="p-1 rounded bg-green-500/10 text-green-400"><Users className="w-4 h-4" /></div>
                                    Private Team Chat
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl shadow-purple-500/20 animate-scale-up">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Team Created!</h2>
                        <p className="text-slate-400">Your squad is ready to conquer.</p>
                    </div>
                </div>
            )}
        </AnimatedWrapper>
    );
}
