import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAnnouncement } from '../context/AnnouncementContext';
import { Bell, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Layout() {
    const location = useLocation();
    const isPomodoroPage = location.pathname === '/app/pomodoro';
    const { announcement } = useAnnouncement();
    const [dismissedAnnouncement, setDismissedAnnouncement] = useState<string | null>(null);

    // Reset dismissed state if a new announcement comes in
    useEffect(() => {
        if (announcement && announcement !== dismissedAnnouncement) {
            setDismissedAnnouncement(null);
        }
    }, [announcement]);

    const showAnnouncement = announcement && announcement !== dismissedAnnouncement;

    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
            {/* Subtle radial gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-950/20 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-950/10 via-transparent to-transparent pointer-events-none" />

            {!isPomodoroPage && <Sidebar />}
            <main className="relative flex-1 overflow-y-auto flex flex-col">
                {showAnnouncement && (
                    <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 flex items-center justify-between shadow-lg z-50 animate-slide-down shrink-0">
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 animate-pulse" />
                            <span className="font-medium">Admin Announcement:</span>
                            <span>{announcement}</span>
                        </div>
                        <button 
                            onClick={() => setDismissedAnnouncement(announcement)}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="p-8 flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
