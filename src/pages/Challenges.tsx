import { useState, useEffect } from 'react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';
import { ScrollReveal } from '../components/ScrollReveal';
import { Target, Check, Coins, Calendar, RefreshCw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Challenge {
    id: number;
    text: string;
    reward: number;
    completed: boolean;
    icon: any;
}

const CHALLENGE_POOL = [
    { text: 'Complete a 25-minute study session', reward: 50, icon: Target },
    { text: 'Post a message in Global Chat', reward: 20, icon: Trophy },
    { text: 'Upload a new resource', reward: 100, icon: RefreshCw },
    { text: 'Find a study partner', reward: 75, icon: Target },
    { text: 'Update your profile bio', reward: 30, icon: Trophy },
    { text: 'Check your stats on Dashboard', reward: 10, icon: Target },
    { text: 'Browse the Rewards Store', reward: 15, icon: Coins },
    { text: 'Complete 3 tasks in To-Do list', reward: 60, icon: Check },
];

export function Challenges() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [coins, setCoins] = useState(parseInt(localStorage.getItem('userCoins') || '0'));
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const today = new Date().toDateString();
        const storedDate = localStorage.getItem('challengeDate');
        const storedChallenges = localStorage.getItem('dailyChallenges');

        if (storedDate !== today || !storedChallenges) {
            // Generate new challenges
            const newChallenges = [];
            const pool = [...CHALLENGE_POOL];
            for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * pool.length);
                const challenge = pool.splice(randomIndex, 1)[0];
                newChallenges.push({
                    id: i + 1,
                    ...challenge,
                    completed: false
                });
            }
            setChallenges(newChallenges);
            localStorage.setItem('dailyChallenges', JSON.stringify(newChallenges));
            localStorage.setItem('challengeDate', today);
        } else {
            setChallenges(JSON.parse(storedChallenges));
        }
    }, []);

    useEffect(() => {
        const completedCount = challenges.filter(c => c.completed).length;
        setProgress((completedCount / challenges.length) * 100);
    }, [challenges]);

    const handleClaim = (id: number) => {
        const challenge = challenges.find(c => c.id === id);
        if (challenge && !challenge.completed) {
            const newCoins = coins + challenge.reward;
            setCoins(newCoins);
            localStorage.setItem('userCoins', newCoins.toString());

            const newChallenges = challenges.map(c =>
                c.id === id ? { ...c, completed: true } : c
            );
            setChallenges(newChallenges);
            localStorage.setItem('dailyChallenges', JSON.stringify(newChallenges));

            // Trigger confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    return (
        <AnimatedWrapper className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl p-8 border border-pink-300/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/50 animate-pulse">
                            <Target className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                                Daily Challenges
                            </h1>
                            <p className="text-pink-200/80 mt-2 text-lg flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-pink-500/20 min-w-[200px]">
                        <p className="text-sm text-pink-300 mb-1">Your Balance</p>
                        <div className="flex items-center gap-2">
                            <Coins className="w-6 h-6 text-yellow-400" />
                            <span className="text-3xl font-bold text-white">{coins}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <ScrollReveal delay={0.1} width="100%">
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300 font-medium">Daily Progress</span>
                        <span className="text-pink-400 font-bold">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </ScrollReveal>

            {/* Challenges Grid */}
            <div className="grid gap-6">
                {challenges.map((challenge, index) => {
                    // We need to map the icon name back to the component since we can't store components in localStorage
                    // But for this simple implementation, we re-generated icons or just mapped them. 
                    // Actually, storing 'icon' in localStorage won't work well. 
                    // Let's fix the icon rendering. We'll just pick an icon based on the text or ID for now to be safe, 
                    // or just use a default one if it's lost.
                    // A better way is to not store the icon in state/localStorage, but just the ID, and look up the static data.
                    // But since we are randomizing, let's just use a generic icon map or switch.

                    // Re-mapping for display (simple hack for now to avoid complex state refactor)
                    let DisplayIcon = Target;
                    if (challenge.text.includes('Chat')) DisplayIcon = Trophy;
                    if (challenge.text.includes('Resource')) DisplayIcon = RefreshCw;
                    if (challenge.text.includes('Store')) DisplayIcon = Coins;
                    if (challenge.text.includes('To-Do')) DisplayIcon = Check;

                    return (
                        <ScrollReveal key={challenge.id} delay={0.2 + (index * 0.1)} width="100%">
                            <div className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${challenge.completed
                                    ? 'bg-green-500/10 border-green-500/30'
                                    : 'bg-slate-800/50 border-slate-700/50 hover:border-pink-500/30 hover:bg-slate-800/80'
                                }`}>
                                <div className="p-6 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${challenge.completed ? 'bg-green-500/20 text-green-400' : 'bg-pink-500/20 text-pink-400'
                                            }`}>
                                            <DisplayIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold ${challenge.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                                                {challenge.text}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm text-slate-400">Reward:</span>
                                                <span className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                                                    <Coins className="w-3 h-3" />
                                                    {challenge.reward}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleClaim(challenge.id)}
                                        disabled={challenge.completed}
                                        className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 ${challenge.completed
                                                ? 'bg-green-500/20 text-green-400 cursor-default'
                                                : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-lg hover:shadow-pink-500/30 hover:scale-105'
                                            }`}
                                    >
                                        {challenge.completed ? (
                                            <>
                                                <Check className="w-5 h-5" />
                                                Completed
                                            </>
                                        ) : (
                                            <>
                                                Claim Reward
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </ScrollReveal>
                    );
                })}
            </div>
        </AnimatedWrapper>
    );
}
