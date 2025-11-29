import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    educationLevel?: string;
    major?: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string) => Promise<void>;
    register: (name: string, email: string, educationLevel: string, major: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string) => {
        // Mock login - in reality would check password
        // For demo, we just simulate a delay and set user if exists in "db" (localstorage mock)
        // But to make it easy, we'll just create a session for the email if "registered"
        // actually let's just simulate success for any email for now or check against a stored list

        // Simple mock: just create a user object
        const mockUser: User = {
            id: '1',
            name: 'Test User',
            email: email,
            educationLevel: 'Undergraduate',
            major: 'Computer Science',
            avatar: 'https://github.com/shadcn.png'
        };

        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
    };

    const register = async (name: string, email: string, educationLevel: string, major: string) => {
        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            educationLevel,
            major,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
