'use client';

import { useState } from 'react';
import { api, AssessmentResult, Alternative } from '@/lib/api';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { RiskReport } from './RiskReport';

function getRiskColor(level: string) {
    const m: Record<string, string> = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444', Critical: '#dc2626' };
    return m[level] || '#94a3b8';
}

function getRiskIcon(level: string) {
    return { Low: '✅', Medium: '⚠️', High: '🔴', Critical: '🚨' }[level] || '○';
}

export function AssessTab({ onResult, role }: { onResult: (r: AssessmentResult, drug: string, age: number, gender: string) => void, role: string }) {
    const [form, setForm] = useState({ age: '', gender: 'male', creatinine: '', liver_enzymes: '', current_medications: '', allergies: '', medical_history: '', drug_id: '' });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [alternatives, setAlternatives] = useState<Alternative[]>([]);
    const [overrideReason, setOverrideReason] = useState('');
    const [drugSuggestions, setDrugSuggestions] = useState<string[]>([]);
    const [showReport, setShowReport] = useState(false);

    const handleDrugSearch = async (val: string) => {
        setForm({ ...form, drug_id: val });
        if (val.length > 1) {
            try {
                const res = await api.drugs.search(val);
                setDrugSuggestions(res);
            } catch (e) {
                console.error("Search failed", e);
            }
        } else {
            setDrugSuggestions([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setAlternatives([]);

        try {
            const medications = form.current_medications.split(',').map(s => s.trim()).filter(Boolean);

            const res = await api.assess({
                age: parseInt(form.age || '0'),
                gender: form.gender,
                creatinine: form.creatinine ? parseFloat(form.creatinine) : undefined,
                current_medications: medications,
                allergies: form.allergies.split(',').map(s => s.trim()).filter(Boolean),
            }, form.drug_id);

            setResult(res);
            onResult(res, form.drug_id, parseInt(form.age || '0'), form.gender);

            if (res.risk_level !== 'Low') {
                try {
                    const altRes = await api.alternatives(form.drug_id);
                    setAlternatives(altRes.alternatives);
                } catch (e) {
                    console.error("Failed to fetch alternatives", e);
                }
            }
        } catch (e: any) {
            alert(e.message || "Analysis failed");
        } finally {
            setLoading(false);
        }
    };

    const handleOverride = async () => {
        if (!overrideReason) return alert('Please provide a reason');
        try {
            await api.override({
                drug_id: form.drug_id,
                risk_level: result!.risk_level,
                reason: overrideReason
            });
            alert('Override logged successfully');
            setOverrideReason('');
        } catch (e) { alert('Failed to log override'); }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 24, transition: 'all 0.4s ease' }}>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="glass-card" style={{ padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                <h3 style={{ marginBottom: 20, fontSize: 18, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 10 }}>Patient Assessment</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                        <label className="medsafe-label">Age</label>
                        <input className="medsafe-input" type="number" placeholder="e.g. 45" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required />
                    </div>
                    <div>
                        <label className="medsafe-label">Gender</label>
                        <select className="medsafe-select" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginBottom: 16, position: 'relative' }}>
                    <label className="medsafe-label">Drug to Prescribe</label>
                    <input className="medsafe-input" value={form.drug_id} onChange={e => handleDrugSearch(e.target.value)} required placeholder="Search drug..." autoComplete="off" />
                    {drugSuggestions.length > 0 && (
                        <div style={{
                            background: '#1a2540', border: '1px solid #334155', borderRadius: 8,
                            position: 'absolute', width: '100%', zIndex: 50, marginTop: 4,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)', overflow: 'hidden'
                        }}>
                            {drugSuggestions.map(d => (
                                <div key={d}
                                    onClick={() => { setForm({ ...form, drug_id: d }); setDrugSuggestions([]); }}
                                    style={{ padding: '10px 12px', cursor: 'pointer', fontSize: 14, borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    {d}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label className="medsafe-label">Current Medications (Comma separated)</label>
                    <input className="medsafe-input" value={form.current_medications} onChange={e => setForm({ ...form, current_medications: e.target.value })} placeholder="e.g. Aspirin, Lisinopril" />
                </div>

                <button className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: 16 }} disabled={loading}>
                    {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <span className="spinner"></span> Analyzing...
                        </span>
                    ) : 'Run Risk Assessment'}
                </button>
            </form>

            {/* Results Panel */}
            {result && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'slide-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>

                    {/* Main Risk Card */}
                    <div className="glass-card" style={{
                        padding: 24, borderRadius: 12,
                        border: `1px solid ${getRiskColor(result.risk_level)}`,
                        background: `linear-gradient(145deg, ${getRiskColor(result.risk_level)}15, rgba(10,14,26,0.8))`
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: 13, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', marginBottom: 4 }}>Risk Assessment Result</div>
                                <div style={{ fontSize: 32, fontWeight: 800, color: getRiskColor(result.risk_level), display: 'flex', alignItems: 'center', gap: 12 }}>
                                    {getRiskIcon(result.risk_level)} {result.risk_level} Risk
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 36, fontWeight: 700, color: '#fff' }}>{Math.round(result.risk_score * 100)}%</div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Confidence Score</div>
                            </div>
                        </div>

                        {result.recommendation && (
                            <div style={{ marginTop: 16, padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8, borderLeft: `4px solid ${getRiskColor(result.risk_level)}` }}>
                                <strong style={{ color: '#fff', display: 'block', marginBottom: 4 }}>Recommendation:</strong>
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{result.recommendation}</span>
                            </div>
                        )}
                    </div>

                    <button className="btn-secondary" onClick={() => setShowReport(true)} style={{ width: '100%', padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <span>📄</span> Generate Clinical Report
                    </button>

                    {/* SHAP Chart */}
                    <div className="glass-card" style={{ padding: 24, borderRadius: 12 }}>
                        <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>Feature Contribution (SHAP)</h4>
                        <div style={{ height: 200, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={result.shap_values} layout="vertical" margin={{ left: 40, right: 30 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="feature" width={100} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                        {result.shap_values.map((s, i) => (
                                            <Cell key={i} fill={s.value > 0 ? '#ef4444' : '#10b981'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }}></span> Increases Risk</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%' }}></span> Decreases Risk</div>
                        </div>
                    </div>

                    {/* Alternatives */}
                    {alternatives.length > 0 && (
                        <div className="glass-card" style={{ padding: 24, borderRadius: 12 }}>
                            <h4 style={{ marginBottom: 12 }}>Safer Alternatives</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {alternatives.map((a, i) => (
                                    <div key={i} style={{
                                        padding: 12, background: 'rgba(16,185,129,0.05)',
                                        border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8,
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <span style={{ fontWeight: 600, color: '#10b981' }}>{a.name}</span>
                                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{a.risk_reduction}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Override Section (Clinician Only) */}
                    {result.risk_level !== 'Low' && role === 'clinician' && (
                        <div className="glass-card" style={{ padding: 24, borderRadius: 12, border: '1px solid rgba(245,158,11,0.3)' }}>
                            <h4 style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                ⚠️ Override Decision
                            </h4>
                            <textarea
                                className="medsafe-input"
                                style={{ minHeight: 80, resize: 'vertical', fontSize: 14 }}
                                placeholder="Clinical justification for proceeding despite risk..."
                                value={overrideReason}
                                onChange={e => setOverrideReason(e.target.value)}
                            />
                            <button className="btn-danger" style={{ marginTop: 12, width: '100%' }} onClick={handleOverride}>
                                Log Override & Proceed
                            </button>
                        </div>
                    )}

                </div>
            )}

            {showReport && result && (
                <RiskReport
                    data={result}
                    patientDetails={{
                        age: parseInt(form.age),
                        gender: form.gender,
                        drug_id: form.drug_id,
                        current_medications: form.current_medications.split(',').filter(Boolean)
                    }}
                    onClose={() => setShowReport(false)}
                />
            )}
        </div>
    );
}
