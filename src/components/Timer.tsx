import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

export const Timer = ({ initialMinutes = 25 }: { initialMinutes?: number }) => {
    const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [running]);

    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const seconds = String(secondsLeft % 60).padStart(2, "0");

    const reset = () => {
        setRunning(false);
        setSecondsLeft(initialMinutes * 60);
    };

    return (
        <div className="flex flex-col items-center space-y-2 p-4 bg-purple-900/30 rounded-xl shadow-lg">
            <div className="text-4xl font-mono text-purple-200">
                {minutes}:{seconds}
            </div>
            <div className="flex gap-3">
                <button
                    onClick={() => setRunning(!running)}
                    className="p-2 rounded-full bg-purple-700 hover:bg-purple-600 transition"
                >
                    {running ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                </button>
                <button
                    onClick={reset}
                    className="p-2 rounded-full bg-purple-700 hover:bg-purple-600 transition"
                >
                    <RotateCcw className="w-5 h-5 text-white" />
                </button>
            </div>
        </div>
    );
};
