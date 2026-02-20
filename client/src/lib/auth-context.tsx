'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, role: string, email: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('medsafe_token');
        const savedRole = localStorage.getItem('medsafe_role');
        const savedEmail = localStorage.getItem('medsafe_email');
        if (savedToken && savedRole && savedEmail) {
            setToken(savedToken);
            setUser({ email: savedEmail, role: savedRole });
        }
    }, []);

    const login = (newToken: string, role: string, email: string) => {
        localStorage.setItem('medsafe_token', newToken);
        localStorage.setItem('medsafe_role', role);
        localStorage.setItem('medsafe_email', email);
        setToken(newToken);
        setUser({ email, role });
    };

    const logout = () => {
        localStorage.removeItem('medsafe_token');
        localStorage.removeItem('medsafe_role');
        localStorage.removeItem('medsafe_email');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
