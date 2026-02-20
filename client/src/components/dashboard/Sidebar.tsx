'use client';

import { useRouter } from 'next/navigation';

export interface SidebarProps {
    tab: string;
    setTab: (t: string) => void;
    tabs: { id: string; label: string; icon: string }[];
    user: any;
    logout: () => void;
}

export function Sidebar({ tab, setTab, tabs, user, logout }: SidebarProps) {
    return (
        <div style={{
            width: 240, minHeight: '100vh', background: 'rgba(10,14,26,0.95)',
            borderRight: '1px solid rgba(99,179,237,0.1)', display: 'flex', flexDirection: 'column',
            padding: '20px 12px', backdropFilter: 'blur(12px)', position: 'sticky', top: 0
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px', marginBottom: 32 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>🛡️</div>
                <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }} className="gradient-text">MedSafe</span>
            </div>
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {tabs.map(item => (
                    <button key={item.id} className={`nav-link ${tab === item.id ? 'active' : ''}`}
                        style={{
                            width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                            padding: '10px 12px', borderRadius: 8, transition: 'all 0.2s',
                            color: tab === item.id ? '#fff' : '#94a3b8',
                            backgroundColor: tab === item.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                            display: 'flex', alignItems: 'center', gap: 12
                        }}
                        onClick={() => setTab(item.id)}>
                        <span style={{ fontSize: 16 }}>{item.icon}</span>
                        <span style={{ fontWeight: 500 }}>{item.label}</span>
                    </button>
                ))}
            </nav>
            <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(99,179,237,0.1)' }}>
                <div style={{ padding: '12px 10px', borderRadius: 10, background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)', marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{user?.email?.split('@')[0]}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</div>
                </div>
                <button onClick={logout} className="nav-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px' }}>
                    <span>🚪</span><span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}
