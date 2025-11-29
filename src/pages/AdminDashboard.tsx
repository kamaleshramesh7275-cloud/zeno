import { useState } from 'react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';
import {
    Users, Activity, Bell, TrendingUp, UserCheck, MessageSquare, Send,
    BarChart3, Shield, Clock, BookOpen, Target, Award, Zap, Eye,
    TrendingDown, Calendar, Download, Filter
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    lastActive: string;
    studyHours: number;
    completedTasks: number;
    joinedDate: string;
}

interface ActivityLog {
    id: number;
    user: string;
    action: string;
    timestamp: string;
    type: 'success' | 'info' | 'warning';
}

const MOCK_USERS: User[] = [
    { id: 1, name: 'Sarah Chen', email: 'sarah@zeno.com', status: 'active', lastActive: '2 min ago', studyHours: 24, completedTasks: 15, joinedDate: '2024-01-15' },
    { id: 2, name: 'Mike Ross', email: 'mike@zeno.com', status: 'active', lastActive: '5 min ago', studyHours: 18, completedTasks: 12, joinedDate: '2024-02-20' },
    { id: 3, name: 'Emma Watson', email: 'emma@zeno.com', status: 'inactive', lastActive: '2 hours ago', studyHours: 32, completedTasks: 25, joinedDate: '2024-01-10' },
    { id: 4, name: 'John Doe', email: 'john@zeno.com', status: 'active', lastActive: '1 min ago', studyHours: 15, completedTasks: 8, joinedDate: '2024-03-05' },
    { id: 5, name: 'Alice Johnson', email: 'alice@zeno.com', status: 'active', lastActive: '10 min ago', studyHours: 28, completedTasks: 20, joinedDate: '2024-01-25' },
];

const MOCK_ACTIVITIES: ActivityLog[] = [
    { id: 1, user: 'Sarah Chen', action: 'Completed Calculus assignment', timestamp: '2 minutes ago', type: 'success' },
    { id: 2, user: 'Mike Ross', action: 'Joined study session', timestamp: '5 minutes ago', type: 'info' },
    { id: 3, user: 'Emma Watson', action: 'Uploaded resource to Library', timestamp: '1 hour ago', type: 'success' },
    { id: 4, user: 'John Doe', action: 'Connected with study partner', timestamp: '3 minutes ago', type: 'info' },
    { id: 5, user: 'Alice Johnson', action: 'Achieved study milestone', timestamp: '15 minutes ago', type: 'success' },
    { id: 6, user: 'Sarah Chen', action: 'Started new study session', timestamp: '30 minutes ago', type: 'info' },
];

export function AdminDashboard() {
    const [users] = useState<User[]>(MOCK_USERS);
    const [activities] = useState<ActivityLog[]>(MOCK_ACTIVITIES);
    const [announcement, setAnnouncement] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const handleSendAnnouncement = (e: React.FormEvent) => {
        e.preventDefault();
        if (!announcement.trim()) return;
        alert(`Announcement sent to all users: "${announcement}"`);
        setAnnouncement('');
    };

    const filteredUsers = users.filter(u => {
        if (selectedFilter === 'all') return true;
        return u.status === selectedFilter;
    });

    const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        totalStudyHours: users.reduce((sum, u) => sum + u.studyHours, 0),
        avgStudyHours: Math.round(users.reduce((sum, u) => sum + u.studyHours, 0) / users.length),
        totalTasks: users.reduce((sum, u) => sum + u.completedTasks, 0),
        avgTasksPerUser: Math.round(users.reduce((sum, u) => sum + u.completedTasks, 0) / users.length),
    };

    return (
        <AnimatedWrapper className="space-y-6 animate-fade-in pb-8">
            {/* Header with Quick Actions */}
            <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl p-8 border border-violet-300/20 backdrop-blur-lg shadow-2xl animate-slide-up">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 animate-pulse shadow-lg shadow-violet-500/50">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="text-violet-300 mt-1 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Real-time platform monitoring
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-400/20 hover:border-violet-400/40 transition-all hover:scale-105 flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Data
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/20 hover:border-purple-400/40 transition-all hover:scale-105 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Reports
                        </button>
                    </div>
                </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-violet-200/20 bg-gradient-to-br from-violet-500/10 to-transparent backdrop-blur-lg p-6 shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 hover:scale-105 transition-all duration-300 animate-slide-up group" style={{ animationDelay: '0ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-violet-500/20 group-hover:bg-violet-500/30 transition-colors">
                            <Users className="w-6 h-6 text-violet-400" />
                        </div>
                        <div className="flex items-center gap-1 text-green-400 text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span>+12%</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-violet-300/80">Total Users</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.totalUsers}</p>
                    <p className="text-xs text-violet-300/60 mt-2">Registered members</p>
                </div>

                <div className="rounded-2xl border border-purple-200/20 bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-lg p-6 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300 animate-slide-up group" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                            <UserCheck className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="flex items-center gap-1 text-green-400 text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span>+8%</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-purple-300/80">Active Now</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.activeUsers}</p>
                    <p className="text-xs text-purple-300/60 mt-2">Online users</p>
                </div>

                <div className="rounded-2xl border border-indigo-200/20 bg-gradient-to-br from-indigo-500/10 to-transparent backdrop-blur-lg p-6 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-105 transition-all duration-300 animate-slide-up group" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
                            <Clock className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div className="flex items-center gap-1 text-green-400 text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span>+15%</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-indigo-300/80">Study Hours</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.totalStudyHours}h</p>
                    <p className="text-xs text-indigo-300/60 mt-2">Total platform time</p>
                </div>

                <div className="rounded-2xl border border-violet-200/20 bg-gradient-to-br from-violet-500/10 to-transparent backdrop-blur-lg p-6 shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 hover:scale-105 transition-all duration-300 animate-slide-up group" style={{ animationDelay: '300ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-violet-500/20 group-hover:bg-violet-500/30 transition-colors">
                            <BarChart3 className="w-6 h-6 text-violet-400" />
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 text-sm">
                            <TrendingDown className="w-4 h-4" />
                            <span>-2%</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-violet-300/80">Avg Hours/User</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.avgStudyHours}h</p>
                    <p className="text-xs text-violet-300/60 mt-2">Per user average</p>
                </div>

                <div className="rounded-2xl border border-purple-200/20 bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-lg p-6 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300 animate-slide-up group" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                            <Target className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="flex items-center gap-1 text-green-400 text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span>+20%</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-purple-300/80">Tasks Completed</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.totalTasks}</p>
                    <p className="text-xs text-purple-300/60 mt-2">Platform-wide</p>
                </div>

                <div className="rounded-2xl border border-indigo-200/20 bg-gradient-to-br from-indigo-500/10 to-transparent backdrop-blur-lg p-6 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-105 transition-all duration-300 animate-slide-up group" style={{ animationDelay: '500ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
                            <Award className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div className="flex items-center gap-1 text-green-400 text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span>+18%</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-indigo-300/80">Avg Tasks/User</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.avgTasksPerUser}</p>
                    <p className="text-xs text-indigo-300/60 mt-2">Completion rate</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Enhanced Users Table */}
                <div className="rounded-2xl border border-violet-200/20 bg-black/20 backdrop-blur-lg shadow-2xl animate-slide-up" style={{ animationDelay: '600ms' }}>
                    <div className="border-b border-violet-200/20 bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Users className="h-6 w-6 text-violet-400" />
                                <div>
                                    <h3 className="font-semibold text-lg text-white">User Management</h3>
                                    <p className="text-sm text-violet-300/60">Monitor all platform users</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedFilter('all')}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${selectedFilter === 'all' ? 'bg-violet-500 text-white' : 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setSelectedFilter('active')}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${selectedFilter === 'active' ? 'bg-green-500 text-white' : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setSelectedFilter('inactive')}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${selectedFilter === 'inactive' ? 'bg-gray-500 text-white' : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'}`}
                                >
                                    Inactive
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 max-h-[600px] overflow-y-auto">
                        <div className="space-y-3">
                            {filteredUsers.map((user, index) => (
                                <div
                                    key={user.id}
                                    className="group flex items-center justify-between p-4 rounded-xl border border-violet-200/10 bg-gradient-to-r from-violet-500/5 to-transparent hover:from-violet-500/10 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-200 animate-slide-in-right"
                                    style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${user.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{user.name}</p>
                                            <p className="text-xs text-violet-300/60">{user.email}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-violet-300/80 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {user.studyHours}h
                                                </span>
                                                <span className="text-xs text-violet-300/80 flex items-center gap-1">
                                                    <Target className="w-3 h-3" />
                                                    {user.completedTasks} tasks
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-violet-300/60">{user.lastActive}</p>
                                        <button className="mt-2 px-3 py-1 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 text-xs font-medium transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Enhanced Activity Feed */}
                <div className="rounded-2xl border border-purple-200/20 bg-black/20 backdrop-blur-lg shadow-2xl animate-slide-up" style={{ animationDelay: '700ms' }}>
                    <div className="border-b border-purple-200/20 bg-gradient-to-r from-purple-500/10 to-violet-500/10 p-6">
                        <div className="flex items-center gap-3">
                            <Activity className="h-6 w-6 text-purple-400" />
                            <div>
                                <h3 className="font-semibold text-lg text-white">Live Activity Feed</h3>
                                <p className="text-sm text-purple-300/60">Real-time user actions</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 max-h-[600px] overflow-y-auto">
                        <div className="space-y-4">
                            {activities.map((activity, index) => (
                                <div
                                    key={activity.id}
                                    className="flex gap-4 p-4 rounded-xl hover:bg-purple-500/5 transition-all animate-slide-up group"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${activity.type === 'success' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                                            activity.type === 'warning' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                                                'bg-gradient-to-br from-purple-500 to-violet-500'
                                        }`}>
                                        {activity.type === 'success' ? <Zap className="w-5 h-5 text-white" /> :
                                            activity.type === 'warning' ? <Bell className="w-5 h-5 text-white" /> :
                                                <Activity className="w-5 h-5 text-white" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">{activity.user}</p>
                                        <p className="text-sm text-violet-300/80">{activity.action}</p>
                                        <p className="text-xs text-violet-300/60 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {activity.timestamp}
                                        </p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-lg text-xs font-medium h-fit ${activity.type === 'success' ? 'bg-green-500/20 text-green-300' :
                                            activity.type === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                                                'bg-purple-500/20 text-purple-300'
                                        }`}>
                                        {activity.type}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Announcement Section */}
            <div className="rounded-2xl border border-violet-200/20 bg-black/20 backdrop-blur-lg shadow-2xl animate-slide-up" style={{ animationDelay: '800ms' }}>
                <div className="border-b border-violet-200/20 bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-6">
                    <div className="flex items-center gap-3">
                        <Bell className="h-6 w-6 text-violet-400 animate-pulse" />
                        <div>
                            <h3 className="font-semibold text-lg text-white">Broadcast Announcement</h3>
                            <p className="text-sm text-violet-300/60">Send messages to all platform users</p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSendAnnouncement} className="space-y-4">
                        <div className="transform transition-all hover:scale-[1.01]">
                            <textarea
                                placeholder="Type your announcement here... (e.g., 'Platform maintenance scheduled for tonight at 10 PM')"
                                className="w-full h-40 rounded-xl border border-violet-300/30 bg-violet-500/5 backdrop-blur px-4 py-3 text-sm text-white ring-offset-background placeholder:text-violet-300/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:border-transparent transition-all resize-none"
                                value={announcement}
                                onChange={(e) => setAnnouncement(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-violet-300/60">
                                This will be sent to all {stats.totalUsers} registered users
                            </p>
                            <button
                                type="submit"
                                className="group inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/50 hover:scale-105 transition-all h-11 px-8 py-2"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Send to All Users
                                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AnimatedWrapper>
    );
}
