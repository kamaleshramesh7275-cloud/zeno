import React, { createContext, useContext, useState, useEffect } from 'react';

interface AnnouncementContextType {
    announcement: string | null;
    sendAnnouncement: (message: string) => void;
    clearAnnouncement: () => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export function AnnouncementProvider({ children }: { children: React.ReactNode }) {
    const [announcement, setAnnouncement] = useState<string | null>(() => {
        return localStorage.getItem('global_announcement');
    });

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'global_announcement') {
                setAnnouncement(e.newValue);
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const sendAnnouncement = (message: string) => {
        setAnnouncement(message);
        localStorage.setItem('global_announcement', message);
    };

    const clearAnnouncement = () => {
        setAnnouncement(null);
        localStorage.removeItem('global_announcement');
    };

    return (
        <AnnouncementContext.Provider value={{ announcement, sendAnnouncement, clearAnnouncement }}>
            {children}
        </AnnouncementContext.Provider>
    );
}

export function useAnnouncement() {
    const context = useContext(AnnouncementContext);
    if (context === undefined) {
        throw new Error('useAnnouncement must be used within an AnnouncementProvider');
    }
    return context;
}
