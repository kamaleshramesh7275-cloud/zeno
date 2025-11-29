import React, { useState } from 'react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight } from 'lucide-react';

export function Login() {
    const [email, setEmail] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email);
        navigate('/app/dashboard');
    };

    return (
        <AnimatedWrapper className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ top: '10%', left: '10%' }} />
                <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ bottom: '10%', right: '10%', animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-md space-y-8 rounded-2xl border border-purple-300/20 bg-white/10 backdrop-blur-lg p-10 shadow-2xl relative z-10 animate-scale-up">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-purple-500/20 animate-pulse">
                            <GraduationCap className="w-12 h-12 text-purple-200" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Welcome to ZENO</h2>
                    <p className="mt-2 text-sm text-purple-200">Sign in to continue your learning journey</p>
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
                                className="block w-full rounded-lg border border-purple-300/30 bg-white/10 backdrop-blur px-4 py-3 text-sm text-white placeholder-purple-300/50 ring-offset-background focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="student@zeno.com"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="group flex w-full justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 transition-all"
                    >
                        Sign in
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
                <div className="space-y-4">
                    <p className="text-center text-sm text-purple-200/60">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-purple-300 hover:text-purple-200 transition-colors">
                            Sign up
                        </Link>
                    </p>
                    <p className="text-center text-sm text-purple-200/60">
                        <Link to="/" className="font-semibold text-indigo-300 hover:text-indigo-200 transition-colors">
                            ← Back to home
                        </Link>
                    </p>
                </div>
            </div>
        </AnimatedWrapper>
    );
}
