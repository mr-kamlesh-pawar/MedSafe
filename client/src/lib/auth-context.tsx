'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    email: string;
    role: string;
    _id?: string;
    patient_record_id?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, role: string, email: string, userId?: string, patientRecordId?: string) => void;
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
        const savedUserId = localStorage.getItem('medsafe_user_id') || undefined;
        const savedPatientId = localStorage.getItem('medsafe_patient_record_id') || undefined;

        if (savedToken && savedRole && savedEmail) {
            setToken(savedToken);
            setUser({ email: savedEmail, role: savedRole, _id: savedUserId, patient_record_id: savedPatientId });
        }
    }, []);

    const login = (newToken: string, role: string, email: string, userId?: string, patientRecordId?: string) => {
        localStorage.setItem('medsafe_token', newToken);
        localStorage.setItem('medsafe_role', role);
        localStorage.setItem('medsafe_email', email);
        if (userId) localStorage.setItem('medsafe_user_id', userId);
        if (patientRecordId) localStorage.setItem('medsafe_patient_record_id', patientRecordId);
        
        setToken(newToken);
        setUser({ email, role, _id: userId, patient_record_id: patientRecordId });
    };

    const logout = () => {
        localStorage.removeItem('medsafe_token');
        localStorage.removeItem('medsafe_role');
        localStorage.removeItem('medsafe_email');
        localStorage.removeItem('medsafe_user_id');
        localStorage.removeItem('medsafe_patient_record_id');
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
