import React, { useState, useEffect, useRef } from 'react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import type { Message } from '../context/ChatContext';
import { Send, User as UserIcon } from 'lucide-react';

export function GlobalChat() {
    const { user } = useAuth();
    const { messages, sendMessage } = useChat();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        sendMessage(newMessage);
        setNewMessage('');
    };

    return (
        <AnimatedWrapper className="flex h-[calc(100vh-8rem)] flex-col rounded-xl border border-purple-200/20 bg-gradient-to-br from-purple-500/5 to-transparent backdrop-blur shadow-xl animate-fade-in">
            <div className="border-b border-purple-200/20 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Global Study Chat 💬</h2>
                <p className="text-sm text-muted-foreground mt-1">Connect with students worldwide</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} animate-slide-up`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg px-4 py-3 shadow-md ${msg.isMe
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                : 'bg-gradient-to-r from-purple-100/50 to-indigo-100/50 dark:from-purple-900/30 dark:to-indigo-900/30'
                                }`}
                        >
                            {!msg.isMe && (
                                <p className="mb-1 text-xs font-semibold opacity-70">{msg.user}</p>
                            )}
                            <p className="text-sm">{msg.text}</p>
                            <p className="mt-1 text-xs opacity-50 text-right">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-purple-200/20 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex h-11 w-full rounded-lg border border-purple-300/30 bg-background/50 backdrop-blur px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:border-transparent transition-all"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-lg text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all h-11 w-11"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </form>
            </div>
        </AnimatedWrapper>
    );
}
