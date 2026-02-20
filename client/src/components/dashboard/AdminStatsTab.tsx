'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

export function AdminStatsTab() {
    const [stats, setStats] = useState<{ metrics: any, logs: any[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.admin.stats().then(res => {
            setStats(res);
            setLoading(false);
        }).catch(e => {
            console.error(e);
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner"></div> Loading Analytics...</div>
    );

    if (!stats) return <div style={{ color: '#ef4444' }}>Failed to load stats. Check connection.</div>;

    return (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, letterSpacing: '-0.02em' }}>System Analytics</h2>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
                {Object.entries(stats.metrics).map(([k, v]) => (
                    <div key={k} className="glass-card" style={{ padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))' }}>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{k.replace(/_/g, ' ')}</div>
                        <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{String(v)}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                {/* Recent Audit Logs */}
                <div className="glass-card" style={{ padding: 24, borderRadius: 16 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: '50%' }}></span> Recent Activity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {stats.logs.map((log: any, i) => (
                            <div key={log._id || i} style={{
                                padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                transition: 'background 0.2s'
                            }}>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0', marginBottom: 4 }}>
                                        <span style={{
                                            display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                                            background: log.action === 'OVERRIDE_RISK' ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)',
                                            color: log.action === 'OVERRIDE_RISK' ? '#ef4444' : '#3b82f6', marginRight: 8
                                        }}>
                                            {log.action}
                                        </span>
                                        User {log.user_id ? log.user_id.substring(0, 6) : 'System'}
                                    </div>
                                    {log.details && (
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                            {log.details.drug_id && `Drug: ${log.details.drug_id}`}
                                            {log.details.risk_level && ` • Risk: ${log.details.risk_level}`}
                                        </div>
                                    )}
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
                                    {new Date(log.timestamp).toLocaleDateString()}<br />
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                        {stats.logs.length === 0 && <div style={{ padding: 20, color: 'var(--text-muted)', textAlign: 'center' }}>No recent activity found.</div>}
                    </div>
                </div>

                {/* Quick Actions / Summary */}
                <div className="glass-card" style={{ padding: 24, borderRadius: 16, height: 'fit-content' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>System Status</h3>

                    <div style={{ marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                            <span>Server Status</span>
                            <span style={{ color: '#10b981' }}>Online</span>
                        </div>
                        <div style={{ width: '100%', height: 6, background: 'rgba(16,185,129,0.2)', borderRadius: 3 }}>
                            <div style={{ width: '100%', height: '100%', background: '#10b981', borderRadius: 3 }}></div>
                        </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                            <span>Database Connection</span>
                            <span style={{ color: '#10b981' }}>Healthy</span>
                        </div>
                        <div style={{ width: '100%', height: 6, background: 'rgba(16,185,129,0.2)', borderRadius: 3 }}>
                            <div style={{ width: '100%', height: '100%', background: '#10b981', borderRadius: 3 }}></div>
                        </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                            <span>ML Model Status</span>
                            <span style={{ color: '#f59e0b' }}>Mock Mode</span>
                        </div>
                        <div style={{ width: '100%', height: 6, background: 'rgba(245,158,11,0.2)', borderRadius: 3 }}>
                            <div style={{ width: '100%', height: '100%', background: '#f59e0b', borderRadius: 3 }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
