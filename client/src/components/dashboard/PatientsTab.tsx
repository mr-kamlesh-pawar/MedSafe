'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Patient {
    _id: string;
    name: string;
    age: number;
    gender: string;
    created_at: string;
}

export function PatientsTab() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', age: '', gender: 'Male', allergies: '', medical_history: '', current_medications: '' });

    const loadPatients = async () => {
        setLoading(true);
        try {
            const res = await api.patient.list();
            setPatients(res as unknown as Patient[]);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadPatients(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patient.create({
                ...form,
                age: parseInt(form.age),
                allergies: form.allergies.split(',').map(s => s.trim()),
                medical_history: form.medical_history.split(',').map(s => s.trim()),
                current_medications: form.current_medications.split(',').map(s => s.trim())
            });
            setShowForm(false);
            setForm({ name: '', age: '', gender: 'Male', allergies: '', medical_history: '', current_medications: '' });
            loadPatients();
        } catch (e) { alert('Failed to create patient'); }
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>Patient Management</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>View directory and register new patients</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px' }}>
                    <span>{showForm ? '✕' : '+'}</span>
                    <span>{showForm ? 'Cancel' : 'Register Patient'}</span>
                </button>
            </div>

            {showForm && (
                <div className="glass-card" style={{ padding: 24, marginBottom: 32, borderRadius: 16, animation: 'slide-in-up 0.3s ease', border: '1px solid rgba(59,130,246,0.3)' }}>
                    <h3 style={{ marginBottom: 20, fontSize: 18, fontWeight: 600 }}>New Patient Registration</h3>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div><label className="medsafe-label">Full Name</label><input className="medsafe-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. John Doe" /></div>
                        <div><label className="medsafe-label">Age</label><input className="medsafe-input" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required placeholder="e.g. 45" /></div>
                        <div><label className="medsafe-label">Gender</label><select className="medsafe-select" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}><option>Male</option><option>Female</option><option>Other</option></select></div>
                        <div><label className="medsafe-label">Known Allergies</label><input className="medsafe-input" value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} placeholder="e.g. Penicillin" /></div>
                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                            <button className="btn-primary" type="submit">Create Record</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-card" style={{ borderRadius: 16, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={{ textAlign: 'left', padding: '16px 24px', color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Name</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Age</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Gender</th>
                            <th style={{ textAlign: 'right', padding: '16px 24px', color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <tr key={i}><td colSpan={4} style={{ padding: 24 }}><div className="skeleton" style={{ height: 20, width: '100%' }}></div></td></tr>
                            ))
                        ) : patients.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No patients found. Create one to get started.</td></tr>
                        ) : (
                            patients.map(p => (
                                <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                                    <td style={{ padding: '16px 24px', fontWeight: 600, color: '#fff' }}>{p.name}</td>
                                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{p.age}</td>
                                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{p.gender}</td>
                                    <td style={{ padding: '16px 24px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>{p._id.substring(0, 8)}...</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
