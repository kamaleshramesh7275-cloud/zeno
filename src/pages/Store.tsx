import { useState } from 'react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';
import { ScrollReveal } from '../components/ScrollReveal';
import { Coins, Award, Crown, Star, Zap, Trophy, Target, Shield, Sparkles, Check } from 'lucide-react';

interface Title {
    id: number;
    name: string;
    description: string;
    cost: number;
    icon: any;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    color: string;
}

const TITLES: Title[] = [
    { id: 1, name: 'Study Newbie', description: 'Just getting started', cost: 0, icon: Star, rarity: 'common', color: 'text-gray-400' },
    { id: 2, name: 'Focused Scholar', description: 'Completed 10 sessions', cost: 100, icon: Target, rarity: 'common', color: 'text-blue-400' },
    { id: 3, name: 'Time Master', description: 'Mastered time management', cost: 250, icon: Zap, rarity: 'rare', color: 'text-purple-400' },
    { id: 4, name: 'Knowledge Seeker', description: 'Always learning', cost: 500, icon: Award, rarity: 'rare', color: 'text-indigo-400' },
    { id: 5, name: 'Study Champion', description: '100 hours of focus', cost: 1000, icon: Trophy, rarity: 'epic', color: 'text-yellow-400' },
    { id: 6, name: 'Elite Learner', description: 'Top 10% dedication', cost: 2000, icon: Crown, rarity: 'epic', color: 'text-orange-400' },
    { id: 7, name: 'Productivity Legend', description: 'Unstoppable focus', cost: 5000, icon: Shield, rarity: 'legendary', color: 'text-red-400' },
    { id: 8, name: 'Grandmaster', description: 'Ultimate achievement', cost: 10000, icon: Sparkles, rarity: 'legendary', color: 'text-pink-400' },
];

export function Store() {
    const [coins, setCoins] = useState(parseInt(localStorage.getItem('userCoins') || '0'));
    const [ownedTitles, setOwnedTitles] = useState<number[]>(
        JSON.parse(localStorage.getItem('ownedTitles') || '[1]')
    );
    const [selectedTitle, setSelectedTitle] = useState<number>(
        parseInt(localStorage.getItem('selectedTitle') || '1')
    );

    const purchaseTitle = (title: Title) => {
        if (coins >= title.cost && !ownedTitles.includes(title.id)) {
            const newCoins = coins - title.cost;
            const newOwnedTitles = [...ownedTitles, title.id];

            setCoins(newCoins);
            setOwnedTitles(newOwnedTitles);

            localStorage.setItem('userCoins', newCoins.toString());
            localStorage.setItem('ownedTitles', JSON.stringify(newOwnedTitles));

            alert(`🎉 Purchased "${title.name}"!`);
        } else if (ownedTitles.includes(title.id)) {
            alert('You already own this title!');
        } else {
            alert('Not enough coins!');
        }
    };

    const selectTitle = (titleId: number) => {
        if (ownedTitles.includes(titleId)) {
            setSelectedTitle(titleId);
            localStorage.setItem('selectedTitle', titleId.toString());
            alert('Title equipped!');
        }
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'border-gray-400/30 bg-gradient-to-br from-gray-500/10 to-transparent';
            case 'rare': return 'border-purple-400/30 bg-gradient-to-br from-purple-500/10 to-transparent';
            case 'epic': return 'border-yellow-400/30 bg-gradient-to-br from-yellow-500/10 to-transparent';
            case 'legendary': return 'border-pink-400/30 bg-gradient-to-br from-pink-500/10 to-transparent';
            default: return 'border-gray-400/30';
        }
    };

    const getRarityBadge = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'bg-gray-500/20 text-gray-300';
            case 'rare': return 'bg-purple-500/20 text-purple-300';
            case 'epic': return 'bg-yellow-500/20 text-yellow-300';
            case 'legendary': return 'bg-pink-500/20 text-pink-300 animate-pulse';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    return (
        <AnimatedWrapper className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl p-6 border border-purple-300/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 animate-pulse shadow-lg shadow-purple-500/50">
                            <Award className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Rewards Store 🏆
                            </h1>
                            <p className="text-muted-foreground mt-1">Exchange coins for exclusive profile titles</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl px-6 py-3">
                        <div className="flex items-center gap-2">
                            <Coins className="w-6 h-6 text-yellow-400" />
                            <div>
                                <p className="text-xs text-yellow-300/60">Your Balance</p>
                                <p className="text-2xl font-bold text-yellow-400">{coins}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Currently Equipped */}
            <ScrollReveal delay={0.1} width="100%">
                <div className="bg-gradient-to-br from-violet-500/10 to-transparent backdrop-blur border border-violet-300/20 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-violet-300 mb-4 flex items-center gap-2">
                        <Crown className="w-6 h-6 text-yellow-400" />
                        Currently Equipped
                    </h2>
                    {TITLES.filter(t => t.id === selectedTitle).map(title => {
                        const Icon = title.icon;
                        return (
                            <div key={title.id} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30">
                                <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500">
                                    <Icon className={`w-6 h-6 text-white`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-xl font-bold ${title.color}`}>{title.name}</h3>
                                    <p className="text-sm text-purple-300/60">{title.description}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-lg text-xs font-medium uppercase ${getRarityBadge(title.rarity)}`}>
                                    {title.rarity}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollReveal>

            {/* Available Titles */}
            <ScrollReveal delay={0.2} width="100%">
                <div>
                    <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        Available Titles
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {TITLES.map((title, index) => {
                            const Icon = title.icon;
                            const owned = ownedTitles.includes(title.id);
                            const equipped = selectedTitle === title.id;

                            return (
                                <div
                                    key={title.id}
                                    className={`rounded-xl border backdrop-blur p-6 hover:scale-105 transition-all duration-300 ${getRarityColor(title.rarity)} ${equipped ? 'ring-2 ring-purple-400' : ''}`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-full ${owned ? 'bg-gradient-to-br from-purple-500 to-indigo-500' : 'bg-purple-500/20'}`}>
                                            <Icon className={`w-6 h-6 ${owned ? 'text-white' : title.color}`} />
                                        </div>
                                        <div className={`px-2 py-1 rounded-lg text-xs font-medium uppercase ${getRarityBadge(title.rarity)}`}>
                                            {title.rarity}
                                        </div>
                                    </div>

                                    <h3 className={`text-lg font-bold mb-2 ${title.color}`}>{title.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{title.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Coins className="w-4 h-4" />
                                            <span className="font-bold">{title.cost}</span>
                                        </div>

                                        {owned ? (
                                            equipped ? (
                                                <button
                                                    disabled
                                                    className="px-4 py-2 rounded-lg bg-green-500/20 text-green-300 border border-green-400/30 text-sm font-medium flex items-center gap-2"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    Equipped
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => selectTitle(title.id)}
                                                    className="px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/30 hover:border-purple-400/50 text-sm font-medium transition-all hover:scale-105"
                                                >
                                                    Equip
                                                </button>
                                            )
                                        ) : (
                                            <button
                                                onClick={() => purchaseTitle(title)}
                                                disabled={coins < title.cost}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${coins >= title.cost
                                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/30'
                                                    : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                Purchase
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </ScrollReveal>
        </AnimatedWrapper>
    );
}
