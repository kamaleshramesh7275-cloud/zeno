import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Users, BookOpen, User, LogOut, Timer, ShoppingBag, Bell } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Pomodoro Timer', href: '/app/pomodoro', icon: Timer },
    { name: 'Smart Reminders', href: '/app/reminders', icon: Bell },
    { name: 'Global Chat', href: '/app/chat', icon: MessageSquare },
    { name: 'Study Partners', href: '/app/partners', icon: Users },
    { name: 'Library', href: '/app/library', icon: BookOpen },
    { name: 'Form Team', href: '/app/team', icon: Users },
    { name: 'Rewards Store', href: '/app/store', icon: ShoppingBag },
    { name: 'Profile', href: '/app/profile', icon: User },
];

export function Sidebar() {
    const location = useLocation();
    const { logout } = useAuth();

    return (
        <div className="flex h-full w-64 flex-col bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950 border-r border-purple-500/20 relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ top: '10%', left: '-20%' }} />
                <div className="absolute w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ bottom: '10%', right: '-20%', animationDelay: '1s' }} />
            </div>

            {/* Header with animation */}
            <div className="relative flex h-16 items-center px-6 border-b border-purple-500/20 bg-black/20 backdrop-blur-sm animate-slide-down">
                <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-lg mr-3 shadow-lg shadow-purple-500/30" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent animate-fade-in">
                    ZENO
                </h1>
            </div>

            {/* Navigation with staggered animations */}
            <nav className="relative flex-1 space-y-1 px-3 py-4 overflow-y-auto">
                {navigation.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                isActive
                                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white border-l-4 border-purple-400 pl-2 shadow-lg shadow-purple-500/30 backdrop-blur-sm'
                                    : 'text-purple-200/80 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-indigo-600/20 hover:text-white hover:translate-x-2 hover:shadow-md hover:shadow-purple-500/20 hover:backdrop-blur-sm',
                                'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 animate-slide-in-right relative overflow-hidden'
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Hover glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-400/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                            {/* Icon with animations */}
                            <Icon className={cn(
                                "mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300",
                                isActive
                                    ? "text-purple-300 animate-pulse drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                                    : "text-purple-300/70 group-hover:scale-110 group-hover:rotate-12 group-hover:text-purple-200 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                            )} />

                            {/* Text with slide animation */}
                            <span className="relative font-medium">
                                {item.name}
                                {isActive && (
                                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                )}
                            </span>

                            {/* Active indicator dot */}
                            {isActive && (
                                <span className="ml-auto w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                            )}

                            {/* Hover arrow */}
                            {!isActive && (
                                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-purple-300 font-bold">
                                    →
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout button with animation */}
            <div className="relative border-t border-purple-500/20 p-4 bg-black/20 backdrop-blur-sm animate-slide-up">
                <button
                    onClick={logout}
                    className="group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-300 hover:translate-x-1 relative overflow-hidden backdrop-blur-sm border border-red-500/0 hover:border-red-500/30"
                >
                    {/* Hover background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <LogOut className="mr-3 h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    <span className="font-medium">Sign out</span>

                    {/* Hover arrow */}
                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold">
                        →
                    </span>
                </button>
            </div>
        </div>
    );
}
