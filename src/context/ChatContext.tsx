import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Message {
    id: string;
    userId: string;
    user: string;
    text: string;
    timestamp: string;
    isMe: boolean;
}

interface ChatContextType {
    messages: Message[];
    sendMessage: (text: string) => void;
    clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = 'zeno_global_chat_messages';

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);

    // Initialize messages from localStorage
    useEffect(() => {
        const savedMessages = localStorage.getItem(STORAGE_KEY);
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                // Map isMe based on current user ID
                const updated = parsed.map((msg: Message) => ({
                    ...msg,
                    isMe: msg.userId === user?.id
                }));
                setMessages(updated);
            } catch (e) {
                console.error("Failed to parse chat messages", e);
            }
        }
    }, [user?.id]);

    // Listen for changes from other tabs
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY && e.newValue) {
                const parsed = JSON.parse(e.newValue);
                const updated = parsed.map((msg: Message) => ({
                    ...msg,
                    isMe: msg.userId === user?.id
                }));
                setMessages(updated);
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [user?.id]);

    const sendMessage = (text: string) => {
        if (!user) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            userId: user.id,
            user: user.name,
            text,
            timestamp: new Date().toISOString(),
            isMe: true
        };

        setMessages(prev => {
            const updated = [...prev, newMessage];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        // Simulating Zen AI response
        if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hey')) {
            setTimeout(() => {
                const zenMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    userId: 'zen_ai',
                    user: 'Zen 🤖',
                    text: `Hey ${user.name}! Welcome to the global study session. How's the progress today?`,
                    timestamp: new Date().toISOString(),
                    isMe: false
                };
                setMessages(prev => {
                    const updated = [...prev, zenMessage];
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                    return updated;
                });
            }, 1500);
        }
    };

    const clearChat = () => {
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <ChatContext.Provider value={{ messages, sendMessage, clearChat }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
