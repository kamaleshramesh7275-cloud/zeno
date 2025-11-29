import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, CheckSquare, Plus, Trash2, Flame, Calendar as CalendarIcon, TrendingUp, Target } from 'lucide-react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';
import { Timer } from '../components/Timer';
import { ScrollReveal } from '../components/ScrollReveal';
import confetti from 'canvas-confetti';

export function Dashboard() {
    const { user } = useAuth();
    const [todos, setTodos] = useState([
        { id: 1, text: 'Review Calculus notes', completed: false },
        { id: 2, text: 'Complete Physics assignment', completed: true },
    ]);
    const [newTodo, setNewTodo] = useState('');
    const streak = 7;

    // Generate calendar data for current month
    const generateCalendar = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const calendar = generateCalendar();
    const today = new Date().getDate();
    const studiedDays = [today, today - 1, today - 2, today - 3, today - 4, today - 5, today - 6];

    const addTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
        setNewTodo('');
    };

    const toggleTodo = (id: number) => {
        setTodos(todos.map(t => {
            if (t.id === id) {
                const newCompleted = !t.completed;
                if (newCompleted) {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
                return { ...t, completed: newCompleted };
            }
            return t;
        }));
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <AnimatedWrapper className="space-y-6 animate-fade-in">
            {/* Enhanced Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900 rounded-2xl p-8 border border-blue-400/30 shadow-lg shadow-blue-500/20 animate-slide-down">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent animate-pulse" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Dashboard</h1>
                        <p className="text-blue-100 text-lg">Welcome back, {user?.name} 👋</p>
                    </div>
                    <Timer />
                </div>
            </div>

            {/* Grid Layout for Streak, Activity, and Goals */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Compact Streak Counter */}
                <ScrollReveal delay={0.1} width="100%">
                    <div className="bg-gradient-to-br from-orange-500/10 via-red-500/10 to-purple-500/10 backdrop-blur border-2 border-orange-400/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 h-full">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/50 animate-pulse">
                                    <Flame className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Study Streak</h3>
                                    <p className="text-orange-300 text-sm">Keep it going!</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-lg">
                                    {streak}
                                </p>
                                <p className="text-orange-300 text-xs uppercase tracking-wider">Days</p>
                            </div>
                        </div>

                        {/* Compact Calendar */}
                        <div className="bg-black/20 backdrop-blur rounded-xl p-4 border border-orange-400/20">
                            <div className="flex items-center gap-2 mb-3">
                                <CalendarIcon className="w-4 h-4 text-orange-400" />
                                <h4 className="font-semibold text-white text-sm">
                                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </h4>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                    <div key={i} className="text-center text-xs font-semibold text-orange-300/60 pb-1">
                                        {day}
                                    </div>
                                ))}
                                {calendar.map((day, i) => (
                                    <div
                                        key={i}
                                        className={`aspect-square flex items-center justify-center rounded-md text-xs font-medium transition-all ${day === null
                                            ? 'invisible'
                                            : day === today
                                                ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md scale-105 animate-pulse'
                                                : studiedDays.includes(day)
                                                    ? 'bg-green-500/30 text-green-300 border border-green-400/30 hover:scale-110'
                                                    : 'bg-slate-800/30 text-slate-400 hover:bg-slate-700/30 hover:scale-105'
                                            }`}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Recent Activity Feed */}
                <ScrollReveal delay={0.2} width="100%">
                    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur border-2 border-cyan-300/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-cyan-500/20">
                                <TrendingUp className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                                <p className="text-cyan-300 text-xs">Your latest actions</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-400/20 hover:bg-cyan-500/20 transition-all">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <div className="flex-1">
                                    <p className="text-sm text-white font-medium">Completed Calculus assignment</p>
                                    <p className="text-xs text-cyan-300/70">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-400/20 hover:bg-cyan-500/20 transition-all">
                                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                <div className="flex-1">
                                    <p className="text-sm text-white font-medium">Joined study session with Sarah</p>
                                    <p className="text-xs text-cyan-300/70">5 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-400/20 hover:bg-cyan-500/20 transition-all">
                                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                <div className="flex-1">
                                    <p className="text-sm text-white font-medium">Uploaded Physics notes</p>
                                    <p className="text-xs text-cyan-300/70">1 day ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Study Goals */}
                <ScrollReveal delay={0.3} width="100%">
                    <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 backdrop-blur border-2 border-purple-300/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                                <Target className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Study Goals</h3>
                                <p className="text-purple-300 text-xs">This week's targets</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-white">Study Hours</span>
                                    <span className="text-sm text-purple-400 font-bold">18/25 hrs</span>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all" style={{ width: '72%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-white">Tasks Completed</span>
                                    <span className="text-sm text-blue-400 font-bold">12/15</span>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all" style={{ width: '80%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-white">Resources Read</span>
                                    <span className="text-sm text-green-400 font-bold">8/10</span>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all" style={{ width: '80%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Smart Reminders */}
                <ScrollReveal delay={0.4} width="100%">
                    <div className="group rounded-2xl border-2 border-blue-300/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02] hover:border-blue-400/50 transition-all duration-300 h-full">
                        <div className="flex flex-col space-y-1.5 p-6 border-b border-blue-300/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                                    <Bell className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">Smart Reminders</h3>
                                    <p className="text-sm text-blue-300/80">Upcoming sessions</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 rounded-xl border border-blue-300/20 bg-blue-500/5 p-4 hover:bg-blue-500/10 hover:scale-[1.02] transition-all">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold shadow-lg">
                                        14:00
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Group Study: Linear Algebra</p>
                                        <p className="text-xs text-blue-300/70">Starts in 45 minutes</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 rounded-xl border border-blue-300/20 bg-blue-500/5 p-4 hover:bg-blue-500/10 hover:scale-[1.02] transition-all">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white font-bold shadow-lg">
                                        16:30
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Break Time</p>
                                        <p className="text-xs text-blue-300/70">Scheduled rest</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* To-Do List */}
                <div className="md:col-span-2">
                    <ScrollReveal delay={0.5} width="100%">
                        <div className="group rounded-2xl border-2 border-cyan-300/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur shadow-xl hover:shadow-2xl hover:shadow-cyan-500/30 hover:scale-[1.02] hover:border-cyan-400/50 transition-all duration-300 h-full">
                            <div className="flex flex-col space-y-1.5 p-6 border-b border-cyan-300/20">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
                                        <CheckSquare className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">To-Do List</h3>
                                        <p className="text-sm text-cyan-300/80">Manage your tasks</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <form onSubmit={addTodo} className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Add a new task..."
                                        className="flex-1 h-11 rounded-xl border-2 border-cyan-300/30 bg-cyan-500/5 px-4 py-2 text-sm text-white placeholder:text-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                        value={newTodo}
                                        onChange={(e) => setNewTodo(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white h-11 px-6 transition-all hover:scale-105 shadow-lg shadow-cyan-500/30"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </form>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {todos.map((todo, index) => (
                                        <div
                                            key={todo.id}
                                            className="flex items-center gap-3 rounded-xl border border-cyan-300/20 bg-cyan-500/5 p-3 hover:bg-cyan-500/10 transition-all animate-slide-in-right"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={todo.completed}
                                                onChange={() => toggleTodo(todo.id)}
                                                className="h-5 w-5 rounded border-cyan-400 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                                            />
                                            <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-cyan-300/50' : 'text-white'}`}>
                                                {todo.text}
                                            </span>
                                            <button
                                                onClick={() => deleteTodo(todo.id)}
                                                className="text-red-400 hover:text-red-300 hover:scale-110 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Quick Stats */}
                <ScrollReveal delay={0.6} width="100%">
                    <div className="group rounded-2xl border-2 border-sky-300/30 bg-gradient-to-br from-sky-500/10 to-blue-500/10 backdrop-blur shadow-xl hover:shadow-2xl hover:shadow-sky-500/30 hover:scale-[1.02] hover:border-sky-400/50 transition-all duration-300 h-full">
                        <div className="flex flex-col space-y-1.5 p-6 border-b border-sky-300/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-sky-500/20 group-hover:bg-sky-500/30 transition-colors">
                                    <TrendingUp className="h-5 w-5 text-sky-400 group-hover:scale-110 transition-transform" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">Quick Stats</h3>
                                    <p className="text-sm text-sky-300/80">Your progress</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-sky-500/10 border border-sky-300/20 hover:scale-105 transition-all">
                                <div className="flex items-center gap-3">
                                    <Target className="w-5 h-5 text-sky-400" />
                                    <span className="text-sm text-white">Tasks Completed</span>
                                </div>
                                <span className="text-2xl font-bold text-sky-400">{todos.filter(t => t.completed).length}/{todos.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-sky-500/10 border border-sky-300/20 hover:scale-105 transition-all">
                                <div className="flex items-center gap-3">
                                    <Flame className="w-5 h-5 text-orange-400" />
                                    <span className="text-sm text-white">Current Streak</span>
                                </div>
                                <span className="text-2xl font-bold text-orange-400">{streak} days</span>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </AnimatedWrapper>
    );
}
