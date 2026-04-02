'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AssessmentResult } from '@/lib/api';

// Components
import { Sidebar } from '@/components/dashboard/Sidebar';
import { AssessTab } from '@/components/dashboard/AssessTab';
import { PatientsTab } from '@/components/dashboard/PatientsTab';
import { AdminStatsTab } from '@/components/dashboard/AdminStatsTab';
import { HistoryTab, HistoryItem } from '@/components/dashboard/HistoryTab';
import { ReportsTab } from '@/components/dashboard/ReportsTab';

function Toast({ msg, type, onClose }: { msg: string; type: string; onClose: () => void }) {
    useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
    const colors: Record<string, { bg: string; border: string; color: string }> = {
        success: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', color: '#10b981' },
        error: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', color: '#ef4444' },
        info: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', color: '#3b82f6' },
    };
    return (
        <div className="toast" style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 100,
            background: '#1a1f2e', border: `1px solid ${colors[type]?.border || colors.info.border}`, color: colors[type]?.color || colors.info.color,
            padding: '12px 16px', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', gap: 12, animation: 'slide-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <span style={{ fontSize: 18 }}>{type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span style={{ fontWeight: 500 }}>{msg}</span>
            <button onClick={onClose} style={{ marginLeft: 8, background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 18, opacity: 0.6 }}>×</button>
        </div>
    );
}

export default function Dashboard() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [tab, setTab] = useState('overview');
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

    useEffect(() => {
        if (!isAuthenticated) router.push('/');
        else {
            if (user?.role === 'admin') setTab('stats');
            else if (user?.role === 'patient') setTab('reports');
            else if (user?.role === 'pharmacist') setTab('alternatives');
        }
    }, [isAuthenticated, router, user]);

    const handleNewResult = useCallback((result: AssessmentResult, drug: string, age: number, gender: string) => {
        setHistory(prev => [{
            id: Date.now().toString(),
            drug_id: drug,
            risk_level: result.risk_level,
            risk_score: result.risk_score,
            timestamp: new Date().toISOString(),
            patient_age: age,
            patient_gender: gender,
        }, ...prev]); 

        if (result.risk_level === 'High' || result.risk_level === 'Critical') {
            setToast({ msg: `Review Required: ${result.risk_level} Risk Detected`, type: 'error' });
        } else {
            setToast({ msg: 'Assessment Completed', type: 'success' });
        }
    }, []);

    if (!isAuthenticated || !user) return null;

    let tabs = [
        { id: 'overview', label: 'Overview', icon: '⬡' },
        { id: 'assess', label: 'Risk Assessment', icon: '🧬' },
        { id: 'history', label: 'History', icon: '📋' },
        { id: 'reports', label: 'Reports', icon: '📄' },
    ];

    if (user.role === 'clinician') {
        tabs = [
            { id: 'overview', label: 'Overview', icon: '⬡' },
            { id: 'assess', label: 'Risk Assessment', icon: '🧬' },
            { id: 'patients', label: 'Patients', icon: '👥' },
            { id: 'reports', label: 'Reports', icon: '📄' },
        ];
    } else if (user.role === 'pharmacist') {
        tabs = [
            { id: 'alternatives', label: 'Drug Alternatives', icon: '💊' },
            { id: 'assess', label: 'Verification', icon: '✅' },
            { id: 'history', label: 'Lookups', icon: '📋' },
        ];
    } else if (user.role === 'admin') {
        tabs = [
            { id: 'stats', label: 'System Stats', icon: '📊' },
            { id: 'users', label: 'User Management', icon: '👥' },
            { id: 'audit', label: 'Audit Logs', icon: '📝' },
        ];
    } else if (user.role === 'patient') {
        tabs = [
            { id: 'reports', label: 'My Health Reports', icon: '📄' },
            { id: 'assess', label: 'Risk Assessment', icon: '🧬' },
            { id: 'history', label: 'My History', icon: '📋' },
            { id: 'overview', label: 'Profile Overview', icon: '⬡' },
        ];
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Sidebar tab={tab} setTab={setTab} tabs={tabs} user={user} logout={() => { logout(); router.push('/'); }} />

            <main style={{ flex: 1, padding: '32px 48px', overflowX: 'hidden', maxWidth: 1600, margin: '0 auto', width: '100%' }}>
                {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>
                        {tabs.find(t => t.id === tab)?.label || 'Dashboard'}
                    </h1>
                </div>

                <div className="animate-in fade-in zoom-in-95 duration-300">
                    {tab === 'overview' && <AdminStatsTab />}
                    {tab === 'stats' && <AdminStatsTab />}
                    {tab === 'audit' && <AdminStatsTab />}
                    {tab === 'assess' && <AssessTab onResult={handleNewResult} role={user.role} />}
                    {tab === 'patients' && <PatientsTab />}
                    {tab === 'history' && <HistoryTab history={history} />}
                    {tab === 'reports' && <ReportsTab />}

                    {(tab === 'alternatives') && (
                        <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                            <h3>Drug Alternatives</h3>
                            <p>Go to "Risk Assessment" tab &rarr; Enter Drug &rarr; View Alternatives panel.</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
