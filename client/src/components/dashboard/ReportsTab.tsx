'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface Report {
    _id: string;
    patient_id: string;
    generated_by: string;
    drug_id: string;
    content_text: string;
    created_at: string;
    shared_with_doctors: string[];
}

interface Doctor {
    id: string;
    name: string;
    email: string;
}

export function ReportsTab({ patientId }: { patientId?: string }) {
    const { user } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [sharingReportId, setSharingReportId] = useState<string | null>(null);

    // If no patientId passed (e.g. Patient role viewing own tab), use their record ID.
    // In our simplified auth, assume patientId is user._id if role === 'patient' or linked id.
    const targetPatientId = patientId || user?.patient_record_id || user?._id;

    useEffect(() => {
        const loadDocs = async () => {
            try {
                const res = await api.reports.doctors();
                setDoctors(res);
            } catch (e) {
                console.error("Failed to load doctors", e);
            }
        };

        const loadReports = async () => {
            if (!targetPatientId) return;
            try {
                const res = await api.reports.patientReports(targetPatientId);
                setReports(res);
            } catch (e) {
                console.error("Failed to load reports", e);
            } finally {
                setLoading(false);
            }
        };

        loadDocs();
        loadReports();
    }, [targetPatientId]);

    const handleShare = async () => {
        if (!sharingReportId || !selectedDoctor) return;
        try {
            await api.reports.share(sharingReportId, selectedDoctor);
            alert("Report shared successfully with doctor.");
            setSharingReportId(null);
            // Reload reports to update shares
            const res = await api.reports.patientReports(targetPatientId as string);
            setReports(res);
        } catch (e) {
            alert("Failed to share report");
        }
    };

    const downloadTxt = (content: string, drug_id: string) => {
        const element = document.createElement("a");
        const file = new Blob([content], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `MedSafe_Report_${drug_id}.txt`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    if (loading) return <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}><span className="spinner"></span> Loading Reports...</div>;

    if (reports.length === 0) {
        return (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center', borderRadius: 16 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>No Reports Available</h3>
                <p style={{ color: 'var(--text-muted)' }}>AI-generated reports will appear here once created.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>Medical Reports</h3>
            {reports.map((report) => (
                <div key={report._id} className="glass-card" style={{ padding: 24, borderRadius: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <div>
                            <h4 style={{ margin: 0, fontSize: 16, color: '#3b82f6' }}>AI Risk Assessment: {report.drug_id}</h4>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                                Generated on {new Date(report.created_at).toLocaleString()}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => downloadTxt(report.content_text, report.drug_id)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
                                Download TXT
                            </button>
                            <button onClick={() => setSharingReportId(report._id)} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
                                Share with Doctor
                            </button>
                        </div>
                    </div>
                    
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 8, whiteSpace: 'pre-wrap', maxHeight: 300, overflowY: 'auto', fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        {report.content_text}
                    </div>

                    {report.shared_with_doctors.length > 0 && (
                        <div style={{ marginTop: 16, fontSize: 12, color: '#10b981', display: 'flex', gap: 6, alignItems: 'center' }}>
                            <span>✓ Shared with {report.shared_with_doctors.length} doctors</span>
                        </div>
                    )}
                </div>
            ))}

            {sharingReportId && (
                <div className="report-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="glass-card" style={{ padding: 30, borderRadius: 12, width: 400 }}>
                        <h3 style={{ marginBottom: 20 }}>Select Doctor</h3>
                        <select className="medsafe-select" value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} style={{ width: '100%', marginBottom: 20 }}>
                            <option value="">-- Choose a Clinician --</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                            ))}
                        </select>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                            <button onClick={() => setSharingReportId(null)} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                            <button onClick={handleShare} className="btn-primary" disabled={!selectedDoctor} style={{ padding: '8px 16px' }}>Share</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
