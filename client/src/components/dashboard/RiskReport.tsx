'use client';

import { AssessmentResult } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from 'recharts';

interface RiskReportProps {
    data: AssessmentResult;
    patientDetails: {
        age: number;
        gender: string;
        drug_id: string;
        current_medications: string[];
    };
    onClose: () => void;
}

export function RiskReport({ data, patientDetails, onClose }: RiskReportProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="report-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.8)', zIndex: 5000, display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <div className="printable-report" style={{
                background: 'white', color: 'black', width: '210mm', minHeight: '297mm', // A4 size
                padding: '20mm', boxSizing: 'border-box', overflowY: 'auto',
                position: 'relative', borderRadius: 4, display: 'flex', flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{ borderBottom: '2px solid #334155', paddingBottom: 20, marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>MedSafe Risk Assessment Report</h1>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: 13 }}>Generated on {new Date().toLocaleString()}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#3b82f6' }}>MedSafe AI</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>Clinical Decision Support System</div>
                    </div>
                </div>

                {/* Patient & Drug Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 30 }}>
                    <div style={{ background: '#f8fafc', padding: 15, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: 14, textTransform: 'uppercase', color: '#64748b', margin: '0 0 10px 0', fontWeight: 600 }}>Patient Details</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px', fontSize: 14 }}>
                            <strong>Age:</strong> <span>{patientDetails.age} years</span>
                            <strong>Gender:</strong> <span style={{ textTransform: 'capitalize' }}>{patientDetails.gender}</span>
                            <strong>Current Meds:</strong> <span>{patientDetails.current_medications.join(', ') || 'None'}</span>
                        </div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: 15, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: 14, textTransform: 'uppercase', color: '#64748b', margin: '0 0 10px 0', fontWeight: 600 }}>Prescription Check</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px', fontSize: 14 }}>
                            <strong>Target Drug:</strong> <span style={{ fontWeight: 700, fontSize: 15 }}>{patientDetails.drug_id}</span>
                            <strong>Assessment ID:</strong> <span style={{ fontFamily: 'monospace' }}>{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                {/* Risk Result */}
                <div style={{ marginBottom: 30, padding: 20, borderRadius: 8, border: `2px solid ${data.risk_level === 'Low' ? '#10b981' : data.risk_level === 'Medium' ? '#f59e0b' : '#ef4444'}`, background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: 18, color: '#334155' }}>Risk Analysis Result</h2>
                            <div style={{ fontSize: 42, fontWeight: 800, color: data.risk_level === 'Low' ? '#10b981' : data.risk_level === 'Medium' ? '#f59e0b' : '#ef4444', lineHeight: 1.2 }}>
                                {data.risk_level.toUpperCase()}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 32, fontWeight: 700 }}>{Math.round(data.risk_score * 100)}%</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>Confidence Score</div>
                        </div>
                    </div>
                    {data.recommendation && (
                        <div style={{ marginTop: 15, paddingTop: 15, borderTop: '1px solid #e2e8f0' }}>
                            <strong>Clinical Recommendation:</strong>
                            <p style={{ margin: '4px 0 0 0', color: '#334155' }}>{data.recommendation}</p>
                        </div>
                    )}
                </div>

                {/* Detailed Analysis (SHAP) */}
                <div style={{ marginBottom: 30 }}>
                    <h3 style={{ fontSize: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 8, marginBottom: 15 }}>Detailed Risk Factors (AI Explainer)</h3>
                    <div style={{ height: 200, width: '100%', marginBottom: 10 }}>
                        {/* Recharts might handle SVG print, but sometimes canvas is safer. SVG usually works well in modern browsers print. */}
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.shap_values} layout="vertical" margin={{ left: 50, right: 30 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="feature" width={100} tick={{ fill: '#334155', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Bar dataKey="value" barSize={15}>
                                    {data.shap_values.map((s, i) => (
                                        <Cell key={i} fill={s.value > 0 ? '#ef4444' : '#10b981'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b' }}>
                        * This chart shows contribution of each factor. Red bars increase risk, Green bars decrease it.
                    </p>
                </div>

                {/* Disclaimer / Signature */}
                <div style={{ marginTop: 'auto', borderTop: '1px solid #94a3b8', paddingTop: 20, fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
                    <p><strong>Disclaimer:</strong> This report is generated by an automated Clinical Decision Support System (CDSS) specifically for use by qualified healthcare professionals. It does not replace professional clinical judgment.</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
                        <div>
                            <div style={{ borderTop: '1px solid #000', width: 200, paddingTop: 4 }}>Clinician Signature</div>
                        </div>
                        <div>
                            <div style={{ borderTop: '1px solid #000', width: 200, paddingTop: 4 }}>Date</div>
                        </div>
                    </div>
                </div>

                {/* Actions (Hidden in Print) */}
                <div className="no-print" style={{ position: 'absolute', top: 20, right: -60, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button onClick={handlePrint} style={{
                        background: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '50%',
                        width: 48, height: 48, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} title="Print Report">
                        🖨️
                    </button>
                    <button onClick={onClose} style={{
                        background: '#ef4444', color: 'white', border: 'none', padding: '12px', borderRadius: '50%',
                        width: 48, height: 48, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} title="Close">
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}
