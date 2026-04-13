import React, { createContext, useContext, useState, useEffect } from 'react';

interface StreakContextType {
    streak: number;
    lastStudyDate: string | null;
    studiedDays: number[];
    trackStudy: () => void;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export function StreakProvider({ children }: { children: React.ReactNode }) {
    const [streak, setStreak] = useState<number>(() => {
        const saved = localStorage.getItem('study_streak');
        return saved ? parseInt(saved, 10) : 0;
    });

    const [lastStudyDate, setLastStudyDate] = useState<string | null>(() => {
        return localStorage.getItem('last_study_date');
    });

    const [studiedDays, setStudiedDays] = useState<number[]>(() => {
        const saved = localStorage.getItem('studied_days');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const today = new Date().toDateString();
        
        if (lastStudyDate) {
            const lastDate = new Date(lastStudyDate);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 1) {
                // Streak broken
                setStreak(0);
                localStorage.setItem('study_streak', '0');
            }
        }
    }, [lastStudyDate]);

    const trackStudy = () => {
        const today = new Date();
        const dateString = today.toDateString();
        const dayOfMonth = today.getDate();

        if (lastStudyDate === dateString) return; // Already tracked today

        let newStreak = streak;
        if (lastStudyDate) {
            const lastDate = new Date(lastStudyDate);
            const diffTime = Math.abs(today.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                newStreak += 1;
            } else {
                newStreak = 1;
            }
        } else {
            newStreak = 1;
        }

        setStreak(newStreak);
        setLastStudyDate(dateString);
        
        const newStudiedDays = Array.from(new Set([...studiedDays, dayOfMonth]));
        setStudiedDays(newStudiedDays);

        localStorage.setItem('study_streak', newStreak.toString());
        localStorage.setItem('last_study_date', dateString);
        localStorage.setItem('studied_days', JSON.stringify(newStudiedDays));
    };

    return (
        <StreakContext.Provider value={{ streak, lastStudyDate, studiedDays, trackStudy }}>
            {children}
        </StreakContext.Provider>
    );
}

export function useStreak() {
    const context = useContext(StreakContext);
    if (context === undefined) {
        throw new Error('useStreak must be used within a StreakProvider');
    }
    return context;
}
