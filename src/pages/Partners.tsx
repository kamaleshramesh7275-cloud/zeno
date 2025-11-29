import { useState } from 'react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';
import { Search, UserPlus, Sparkles, Users, CheckCircle, Clock, X, Mail, BookOpen, Award } from 'lucide-react';

interface Partner {
    id: number;
    name: string;
    major: string;
    interests: string[];
    avatar: string;
    status: 'online' | 'offline' | 'studying';
    studyHours: number;
    rating: number;
}

const MOCK_PARTNERS: Partner[] = [
    { id: 1, name: 'Sarah Chen', major: 'Computer Science', interests: ['React', 'Algorithms', 'AI'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', status: 'online', studyHours: 127, rating: 4.8 },
    { id: 2, name: 'Mike Ross', major: 'Law', interests: ['Constitutional Law', 'Debate'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', status: 'studying', studyHours: 89, rating: 4.6 },
    { id: 3, name: 'Emma Watson', major: 'Literature', interests: ['Shakespeare', 'Poetry'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', status: 'offline', studyHours: 156, rating: 4.9 },
    { id: 4, name: 'John Smith', major: 'Mathematics', interests: ['Calculus', 'Statistics'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', status: 'online', studyHours: 203, rating: 4.7 },
    { id: 5, name: 'Lisa Park', major: 'Physics', interests: ['Quantum', 'Mechanics'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', status: 'studying', studyHours: 178, rating: 4.9 },
    { id: 6, name: 'David Lee', major: 'Chemistry', interests: ['Organic', 'Lab Work'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', status: 'online', studyHours: 145, rating: 4.5 },
];

export function Partners() {
    const [isSearching, setIsSearching] = useState(false);
    const [partners] = useState<Partner[]>(MOCK_PARTNERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [sentRequests, setSentRequests] = useState<number[]>([]);
    const [activeTab, setActiveTab] = useState<'all' | 'online' | 'studying'>('all');

    const handleAutoMatch = () => {
        setIsSearching(true);
        setTimeout(() => {
            setIsSearching(false);
            alert('Match found! You have been paired with Sarah Chen based on your interests.');
        }, 2000);
    };

    const handleSendRequest = (partnerId: number) => {
        setSentRequests([...sentRequests, partnerId]);
        setTimeout(() => {
            alert('Connection request sent successfully!');
        }, 300);
    };

    const filteredPartners = partners.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesTab = activeTab === 'all' || p.status === activeTab;

        return matchesSearch && matchesTab;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'studying': return 'bg-blue-500';
            case 'offline': return 'bg-slate-500';
            default: return 'bg-slate-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'online': return 'Available';
            case 'studying': return 'In Session';
            case 'offline': return 'Offline';
            default: return 'Unknown';
        }
    };

    return (
        <AnimatedWrapper className="space-y-6 animate-fade-in">
            {/* Enhanced Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-cyan-900 to-blue-900 rounded-2xl p-8 border border-blue-400/30 shadow-lg shadow-blue-500/20 animate-slide-down">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent animate-pulse" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Study Partners</h1>
                        <p className="text-blue-100 text-lg">Connect with fellow learners</p>
                    </div>
                    <button
                        onClick={handleAutoMatch}
                        disabled={isSearching}
                        className="group inline-flex items-center justify-center rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 disabled:opacity-50 disabled:pointer-events-none transition-all h-12 px-8 py-2"
                    >
                        {isSearching ? (
                            <span className="animate-pulse">Finding match...</span>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                                Auto Match
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur border-2 border-blue-300/30 rounded-xl p-6 hover:scale-105 transition-all">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">{partners.length}</p>
                            <p className="text-sm text-blue-300">Total Users</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur border-2 border-green-300/30 rounded-xl p-6 hover:scale-105 transition-all">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">{partners.filter(p => p.status === 'online').length}</p>
                            <p className="text-sm text-green-300">Online Now</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur border-2 border-cyan-300/30 rounded-xl p-6 hover:scale-105 transition-all">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-cyan-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">{partners.filter(p => p.status === 'studying').length}</p>
                            <p className="text-sm text-cyan-300">Studying</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="relative">
                    <Search className="absolute left-4 top-4 h-5 w-5 text-cyan-400" />
                    <input
                        type="text"
                        placeholder="Search by name, major, or interest..."
                        className="flex h-14 w-full rounded-xl border-2 border-cyan-300/30 bg-slate-900/50 backdrop-blur px-4 py-2 pl-12 text-sm text-white placeholder:text-cyan-300/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:border-transparent transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'all'
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                            }`}
                    >
                        All Users
                    </button>
                    <button
                        onClick={() => setActiveTab('online')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'online'
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                            }`}
                    >
                        Online
                    </button>
                    <button
                        onClick={() => setActiveTab('studying')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'studying'
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                            }`}
                    >
                        Studying
                    </button>
                </div>
            </div>

            {/* Partners Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPartners.map((partner, index) => {
                    const requestSent = sentRequests.includes(partner.id);

                    return (
                        <div
                            key={partner.id}
                            className="group relative rounded-2xl border-2 border-blue-300/30 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 hover:border-blue-400/50 transition-all duration-300 overflow-hidden animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Hover glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-cyan-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative p-6 flex flex-col items-center text-center space-y-4">
                                {/* Avatar with status */}
                                <div className="relative">
                                    <img
                                        src={partner.avatar}
                                        alt={partner.name}
                                        className="h-24 w-24 rounded-full bg-slate-800 border-4 border-blue-400/30 group-hover:border-blue-400/60 transition-all group-hover:scale-110"
                                    />
                                    <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-slate-900 ${getStatusColor(partner.status)} animate-pulse`} />
                                </div>

                                {/* Name and Major */}
                                <div>
                                    <h3 className="font-bold text-xl text-white group-hover:text-cyan-300 transition-colors">{partner.name}</h3>
                                    <p className="text-sm text-blue-300/80">{partner.major}</p>
                                    <p className="text-xs text-slate-400 mt-1">{getStatusText(partner.status)}</p>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-4 w-full justify-center">
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        <Award className="w-4 h-4" />
                                        <span className="text-sm font-medium">{partner.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-cyan-400">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm font-medium">{partner.studyHours}h</span>
                                    </div>
                                </div>

                                {/* Interests */}
                                <div className="flex flex-wrap justify-center gap-2">
                                    {partner.interests.map((interest) => (
                                        <span
                                            key={interest}
                                            className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 hover:scale-110 transition-all"
                                        >
                                            {interest}
                                        </span>
                                    ))}
                                </div>

                                {/* Action Button */}
                                {requestSent ? (
                                    <button
                                        disabled
                                        className="inline-flex w-full items-center justify-center rounded-xl text-sm font-bold bg-green-500/20 text-green-300 border-2 border-green-400/30 h-11 px-4 py-2"
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Request Sent
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleSendRequest(partner.id)}
                                        className="group/btn inline-flex w-full items-center justify-center rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-2 border-cyan-400/30 hover:border-cyan-400/60 h-11 px-4 py-2 transition-all hover:shadow-lg hover:shadow-cyan-500/50"
                                    >
                                        <UserPlus className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                                        Send Request
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* No results */}
            {filteredPartners.length === 0 && (
                <div className="text-center py-16 animate-fade-in">
                    <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-400 mb-2">No partners found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters</p>
                </div>
            )}
        </AnimatedWrapper>
    );
}
