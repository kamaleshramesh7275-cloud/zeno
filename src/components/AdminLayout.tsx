import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export function AdminLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ top: '10%', left: '10%' }} />
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ bottom: '10%', right: '10%', animationDelay: '1s' }} />
                <div className="absolute w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animationDelay: '2s' }} />
            </div>

            {/* Top Navigation Bar */}
            <nav className="relative z-10 border-b border-violet-300/20 bg-black/20 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg shadow-lg shadow-violet-500/30" />
                            <div>
                                <h1 className="text-xl font-bold text-white">ZENO Admin</h1>
                                <p className="text-xs text-violet-300">Platform Management</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 border border-red-400/20 hover:border-red-400/40 transition-all hover:scale-105"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto p-6">
                <Outlet />
            </main>
        </div>
    );
}
