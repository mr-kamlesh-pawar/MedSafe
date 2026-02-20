'use client';

export interface HistoryItem {
    id: string;
    drug_id: string;
    risk_level: string;
    risk_score: number;
    timestamp: string;
    patient_age: number;
    patient_gender: string;
}

export function HistoryTab({ history }: { history: HistoryItem[] }) {
    if (history.length === 0) {
        return (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center', borderRadius: 16 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>No Assessment History</h3>
                <p style={{ color: 'var(--text-muted)' }}>As you perform risk checks, they will appear here.</p>
            </div>
        );
    }

    return (
        <div className="glass-card" style={{ padding: 24, borderRadius: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Session History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {history.map((h, i) => (
                    <div key={h.id || i} style={{
                        padding: 16, background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        transition: 'transform 0.2s, background 0.2s'
                    }}
                        className="hover:scale-[1.01] hover:bg-white/5"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: h.risk_level === 'Critical' ? '#ef4444' : h.risk_level === 'High' ? '#ef4444' : h.risk_level === 'Medium' ? '#f59e0b' : '#10b981',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff'
                            }}>
                                {h.risk_level === 'Critical' ? '!' : h.risk_level === 'Low' ? '✓' : '⚠'}
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 15 }}>{h.drug_id}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                    Patient: {h.patient_age}y / {h.patient_gender} • Score: {Math.round(h.risk_score * 100)}%
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-muted)' }}>
                            {new Date(h.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
