import { useState } from 'react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';
import { Bell, Plus, Trash2, Clock, Calendar, X, Check } from 'lucide-react';

interface Reminder {
    id: number;
    title: string;
    description: string;
    time: string;
    date: string;
    category: 'Study' | 'Assignment' | 'Exam' | 'Meeting';
    completed: boolean;
}

const MOCK_REMINDERS: Reminder[] = [
    { id: 1, title: 'Group Study: Linear Algebra', description: 'Review chapter 5 with study group', time: '14:00', date: '2024-11-29', category: 'Study', completed: false },
    { id: 2, title: 'Physics Assignment Due', description: 'Submit quantum mechanics problem set', time: '23:59', date: '2024-11-30', category: 'Assignment', completed: false },
    { id: 3, title: 'Calculus Midterm', description: 'Chapters 1-6, bring calculator', time: '10:00', date: '2024-12-05', category: 'Exam', completed: false },
];

export function Reminders() {
    const [reminders, setReminders] = useState<Reminder[]>(MOCK_REMINDERS);
    const [isAddingReminder, setIsAddingReminder] = useState(false);
    const [newReminder, setNewReminder] = useState({
        title: '',
        description: '',
        time: '',
        date: '',
        category: 'Study' as 'Study' | 'Assignment' | 'Exam' | 'Meeting',
    });

    const handleAddReminder = (e: React.FormEvent) => {
        e.preventDefault();
        const reminder: Reminder = {
            id: Date.now(),
            ...newReminder,
            completed: false,
        };
        setReminders([reminder, ...reminders]);
        setNewReminder({ title: '', description: '', time: '', date: '', category: 'Study' });
        setIsAddingReminder(false);
    };

    const toggleComplete = (id: number) => {
        setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
    };

    const deleteReminder = (id: number) => {
        setReminders(reminders.filter(r => r.id !== id));
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Study': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-400/30' };
            case 'Assignment': return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-400/30' };
            case 'Exam': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-400/30' };
            case 'Meeting': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-400/30' };
            default: return { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-400/30' };
        }
    };

    const upcomingReminders = reminders.filter(r => !r.completed);
    const completedReminders = reminders.filter(r => r.completed);

    return (
        <AnimatedWrapper className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-cyan-900 to-blue-900 rounded-2xl p-8 border border-blue-400/30 shadow-lg shadow-blue-500/20 animate-slide-down">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent animate-pulse" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Smart Reminders</h1>
                        <p className="text-blue-100 text-lg">Never miss an important study session</p>
                    </div>
                    <button
                        onClick={() => setIsAddingReminder(true)}
                        className="group inline-flex items-center justify-center rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-all h-12 px-8 py-2"
                    >
                        <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
                        Add Reminder
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur border-2 border-blue-300/30 rounded-xl p-6 hover:scale-105 transition-all">
                    <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 text-blue-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">{upcomingReminders.length}</p>
                            <p className="text-sm text-blue-300">Upcoming</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur border-2 border-green-300/30 rounded-xl p-6 hover:scale-105 transition-all">
                    <div className="flex items-center gap-3">
                        <Check className="w-8 h-8 text-green-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">{completedReminders.length}</p>
                            <p className="text-sm text-green-300">Completed</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 backdrop-blur border-2 border-purple-300/30 rounded-xl p-6 hover:scale-105 transition-all">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-purple-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">{reminders.length}</p>
                            <p className="text-sm text-purple-300">Total</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Reminders */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Upcoming Reminders</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {upcomingReminders.map((reminder, index) => {
                        const colors = getCategoryColor(reminder.category);
                        return (
                            <div
                                key={reminder.id}
                                className="group relative rounded-2xl border-2 border-blue-300/30 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02] hover:border-blue-400/50 transition-all duration-300 overflow-hidden animate-slide-up"
                                style={{ animationDelay: `${200 + index * 50}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-cyan-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative p-6 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`inline-flex items-center rounded-lg border ${colors.border} ${colors.bg} px-3 py-1 text-xs font-semibold ${colors.text}`}>
                                                    {reminder.category}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-xl text-white group-hover:text-cyan-300 transition-colors mb-2">
                                                {reminder.title}
                                            </h3>
                                            <p className="text-sm text-slate-400">{reminder.description}</p>
                                        </div>
                                        <button
                                            onClick={() => deleteReminder(reminder.id)}
                                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:scale-110 transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-cyan-400" />
                                            <span>{reminder.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-purple-400" />
                                            <span>{new Date(reminder.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleComplete(reminder.id)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium transition-all hover:scale-105 shadow-lg"
                                    >
                                        <Check className="w-5 h-5" />
                                        Mark as Complete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {upcomingReminders.length === 0 && (
                    <div className="text-center py-16 bg-slate-900/50 rounded-2xl border-2 border-slate-700/30">
                        <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-400 mb-2">No upcoming reminders</h3>
                        <p className="text-slate-500">Add a reminder to get started</p>
                    </div>
                )}
            </div>

            {/* Completed Reminders */}
            {completedReminders.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Completed</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {completedReminders.map((reminder) => {
                            const colors = getCategoryColor(reminder.category);
                            return (
                                <div
                                    key={reminder.id}
                                    className="group relative rounded-2xl border-2 border-green-300/30 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur shadow-lg opacity-60 hover:opacity-100 transition-all duration-300 overflow-hidden"
                                >
                                    <div className="relative p-6 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`inline-flex items-center rounded-lg border ${colors.border} ${colors.bg} px-3 py-1 text-xs font-semibold ${colors.text}`}>
                                                        {reminder.category}
                                                    </span>
                                                    <Check className="w-5 h-5 text-green-400" />
                                                </div>
                                                <h3 className="font-bold text-xl text-white line-through mb-2">
                                                    {reminder.title}
                                                </h3>
                                                <p className="text-sm text-slate-400">{reminder.description}</p>
                                            </div>
                                            <button
                                                onClick={() => deleteReminder(reminder.id)}
                                                className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:scale-110 transition-all"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Add Reminder Dialog */}
            {isAddingReminder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl border-2 border-cyan-400/30 bg-slate-900 shadow-2xl animate-scale-up">
                        <div className="flex items-center justify-between border-b border-cyan-400/20 p-6">
                            <h2 className="text-xl font-bold text-white">Add New Reminder</h2>
                            <button
                                onClick={() => setIsAddingReminder(false)}
                                className="rounded-lg p-2 hover:bg-slate-800 transition-colors"
                            >
                                <X className="h-5 w-5 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddReminder} className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-white">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 w-full h-11 rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    value={newReminder.title}
                                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                                    placeholder="e.g., Study Session"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-white">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="mt-1 w-full rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    value={newReminder.description}
                                    onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                                    placeholder="Add details..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-white">Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="mt-1 w-full h-11 rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        value={newReminder.time}
                                        onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-white">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="mt-1 w-full h-11 rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        value={newReminder.date}
                                        onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-white">Category</label>
                                <select
                                    className="mt-1 w-full h-11 rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    value={newReminder.category}
                                    onChange={(e) => setNewReminder({ ...newReminder, category: e.target.value as any })}
                                >
                                    <option>Study</option>
                                    <option>Assignment</option>
                                    <option>Exam</option>
                                    <option>Meeting</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all hover:scale-105 font-bold"
                                >
                                    Add Reminder
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingReminder(false)}
                                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AnimatedWrapper>
    );
}
