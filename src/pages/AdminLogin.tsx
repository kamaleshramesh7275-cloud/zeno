import { useState } from 'react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, ArrowRight, Lock } from 'lucide-react';

export function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Mock admin login - in production, verify admin credentials
        if (email === 'admin@zeno.com' && password === 'admin123') {
            await login(email);
            navigate('/app/admin/dashboard');
        } else {
            alert('Invalid admin credentials. Try: admin@zeno.com / admin123');
        }
    };

    return (
        <AnimatedWrapper className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-purple-950 relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ top: '15%', left: '15%' }} />
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ bottom: '15%', right: '15%', animationDelay: '1.5s' }} />
                <div className="absolute w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animationDelay: '3s' }} />
            </div>

            <div className="w-full max-w-md space-y-8 rounded-2xl border border-indigo-300/20 bg-white/10 backdrop-blur-lg p-10 shadow-2xl relative z-10 animate-scale-up">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 rounded-full bg-indigo-500/20 animate-pulse ring-4 ring-indigo-400/20">
                            <Shield className="w-12 h-12 text-indigo-200" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Admin Portal</h2>
                    <p className="mt-2 text-sm text-indigo-200">Secure access to platform management</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="transform transition-all hover:scale-[1.02]">
                            <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="block w-full rounded-lg border border-purple-300/30 bg-white/10 backdrop-blur px-4 py-3 text-sm text-white placeholder-purple-300/50 ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@zeno.com"
                            />
                        </div>
                        <div className="transform transition-all hover:scale-[1.02]">
                            <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-2 flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="block w-full rounded-lg border border-purple-300/30 bg-white/10 backdrop-blur px-4 py-3 text-sm text-white placeholder-purple-300/50 ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="group flex w-full justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-indigo-500/50 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all"
                    >
                        <Shield className="w-4 h-4" />
                        Sign in as Admin
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
                <div className="space-y-4">
                    <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-lg p-3">
                        <p className="text-xs text-indigo-200 text-center">
                            Demo: admin@zeno.com / admin123
                        </p>
                    </div>
                    <p className="text-center text-sm text-purple-200/60">
                        Not an admin?{' '}
                        <Link to="/" className="font-semibold text-indigo-300 hover:text-indigo-200 transition-colors">
                            ← Back to home
                        </Link>
                    </p>
                </div>
            </div>
        </AnimatedWrapper>
    );
}
