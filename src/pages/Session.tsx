import { useState, useEffect } from 'react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';
import { useParams } from 'react-router-dom';
import { Play, Pause, RotateCcw, MessageSquare } from 'lucide-react';

export function Session() {
    const { id } = useParams();
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
    const [isActive, setIsActive] = useState(false);
    const [sessionType] = useState('Focus');

    useEffect(() => {
        let interval: number;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            alert('Session completed!');
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(25 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <AnimatedWrapper className="grid h-[calc(100vh-4rem)] gap-6 lg:grid-cols-3 animate-fade-in">
            {/* Main Study Area */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex h-full flex-col items-center justify-center space-y-8 rounded-xl border bg-card p-10 text-card-foreground shadow">
                    <div className="space-y-2 text-center">
                        <h2 className="text-2xl font-bold">Study Session #{id}</h2>
                        <p className="text-muted-foreground">{sessionType} Mode</p>
                    </div>

                    <div className={`font-mono text-9xl font-bold tracking-tighter tabular-nums transition-all ${isActive ? 'animate-pulse-slow text-primary' : ''}`}>
                        {formatTime(timeLeft)}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTimer}
                            className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90"
                        >
                            {isActive ? <Pause className="h-8 w-8" /> : <Play className="ml-1 h-8 w-8" />}
                        </button>
                        <button
                            onClick={resetTimer}
                            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-input bg-background shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <RotateCcw className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Session Chat */}
            <div className="flex flex-col rounded-xl border bg-card text-card-foreground shadow">
                <div className="flex items-center gap-2 border-b p-4">
                    <MessageSquare className="h-4 w-4" />
                    <h3 className="font-semibold">Session Chat</h3>
                </div>
                <div className="flex flex-1 items-center justify-center p-4 text-sm text-muted-foreground">
                    No messages yet. Start the conversation!
                </div>
                <div className="border-t p-4">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </div>
        </AnimatedWrapper>
    );
}
