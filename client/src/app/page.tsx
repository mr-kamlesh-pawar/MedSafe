'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'clinician' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await api.auth.login(form.email, form.password);
        authLogin(res.token, res.role, form.email);
        router.push('/dashboard');
      } else {
        await api.auth.register(form.username, form.email, form.password, form.role);
        setMode('login');
        setError('');
        alert('Account created! Please log in.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(15,23,42,0.7)',
    border: '1px solid rgba(148,163,184,0.2)',
    borderRadius: 8,
    color: '#f1f5f9',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: '#94a3b8',
    marginBottom: 6,
  };

  const activeTabStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px 0',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    transition: 'all 0.2s',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(59,130,246,0.35)',
  };

  const inactiveTabStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px 0',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    transition: 'all 0.2s',
    background: 'transparent',
    color: '#64748b',
  };

  const submitBtnStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 20px',
    background: loading
      ? 'rgba(59,130,246,0.6)'
      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 15,
    cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: 8,
    letterSpacing: '-0.01em',
    boxShadow: loading ? 'none' : '0 4px 12px rgba(59,130,246,0.35)',
    transition: 'opacity 0.2s, transform 0.1s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: 'inherit',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
      background: '#0f172a',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* Background decoration */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 460 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, boxShadow: '0 4px 14px rgba(59,130,246,0.4)',
            }}>🛡️</div>
            <span style={{
              fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #60a5fa, #34d399)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>MedSafe</span>
          </div>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Clinical ADR Risk Intelligence Platform</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(30,41,59,0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          padding: 36,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>

          {/* Mode Tabs */}
          <div style={{
            display: 'flex',
            gap: 6,
            background: 'rgba(15,23,42,0.6)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            padding: 4,
            marginBottom: 28,
          }}>
            <button
              id="tab-login"
              onClick={() => { setMode('login'); setError(''); }}
              style={mode === 'login' ? activeTabStyle : inactiveTabStyle}
            >
              Sign In
            </button>
            <button
              id="tab-register"
              onClick={() => { setMode('register'); setError(''); }}
              style={mode === 'register' ? activeTabStyle : inactiveTabStyle}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {mode === 'register' && (
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  id="input-username"
                  style={inputStyle}
                  type="text"
                  placeholder="Dr. Jane Smith"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                id="input-email"
                style={inputStyle}
                type="email"
                placeholder="doctor@hospital.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div style={{ position: 'relative' }}>
              <label style={labelStyle}>Password</label>
              <input
                id="input-password"
                style={{ ...inputStyle, paddingRight: 42 }}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 10, bottom: 10,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 15, padding: 0, lineHeight: 1,
                }}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>

            {mode === 'register' && (
              <div>
                <label style={labelStyle}>Role</label>
                <select
                  id="input-role"
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="clinician">Clinician</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            )}

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 8,
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                color: '#ef4444', fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                ⚠️ {error}
              </div>
            )}

            <button id="btn-submit" type="submit" disabled={loading} style={submitBtnStyle}>
              {loading ? (
                <>
                  <span style={{
                    width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    display: 'inline-block', animation: 'spin 0.7s linear infinite',
                  }} />
                  {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : (
                mode === 'login' ? '→ Sign In to MedSafe' : '→ Create Account'
              )}
            </button>
          </form>

          {/* Demo hint */}
          {mode === 'login' && (
            <div style={{
              marginTop: 20, padding: '12px 14px', borderRadius: 10,
              background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)',
            }}>
              <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
                💡 Demo — register first, then sign in using your credentials.
              </p>
              <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { role: 'Clinician', email: 'dr@medsafe.com' },
                  { role: 'Admin', email: 'admin@medsafe.com' },
                ].map(c => (
                  <div key={c.role} style={{
                    padding: '8px 10px', background: 'rgba(59,130,246,0.08)',
                    borderRadius: 8, fontSize: 11, color: '#94a3b8', lineHeight: 1.6,
                  }}>
                    <strong style={{ color: '#60a5fa' }}>{c.role}</strong><br />
                    {c.email}<br />
                    pw: <code style={{ color: '#34d399' }}>test1234</code>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer badges */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          {['🔒 JWT Secured', '🤖 AI-Powered', '📊 SHAP Explained'].map(f => (
            <span key={f} style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>{f}</span>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
