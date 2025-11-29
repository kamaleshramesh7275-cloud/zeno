import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
    const location = useLocation();
    const isPomodoroPage = location.pathname === '/app/pomodoro';

    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
            {/* Subtle radial gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-950/20 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-950/10 via-transparent to-transparent pointer-events-none" />

            {!isPomodoroPage && <Sidebar />}
            <main className="relative flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
}
