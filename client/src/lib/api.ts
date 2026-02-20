const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('medsafe_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
    return data as T;
}

export interface LoginResponse {
    token: string;
    role: string;
}

export interface AssessmentResult {
    risk_score: number;
    risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
    interactions: string[];
    shap_values: { feature: string; value: number; contribution?: string }[];
    recommendation?: string;
}

export interface Alternative {
    name: string;
    risk_reduction: string;
}

export const api = {
    auth: {
        login: (email: string, password: string) =>
            request<LoginResponse>('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            }),
        register: (username: string, email: string, password: string, role: string) =>
            request<{ message: string; user_id: string }>('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password, role }),
            }),
    },
    assess: (patientData: Record<string, unknown>, drugId: string) =>
        request<AssessmentResult>('/api/assess', {
            method: 'POST',
            body: JSON.stringify({ patient_data: patientData, drug_id: drugId }),
        }),
    override: (data: { drug_id: string; risk_level: string; reason: string; patient_id?: string }) =>
        request<{ message: string }>('/api/assess/override', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    alternatives: (drugId: string) =>
        request<{ alternatives: Alternative[] }>(`/api/alternatives/${drugId}`),
    patient: {
        get: (patientId: string) => request<Record<string, unknown>>(`/api/patient/${patientId}`),
        create: (data: Record<string, unknown>) => request<{ message: string; patient_id: string }>('/api/patients', { method: 'POST', body: JSON.stringify(data) }),
        list: () => request<Record<string, unknown>[]>('/api/patients'),
    },
    drugs: {
        search: (query: string) => request<string[]>(`/api/drugs/search?q=${encodeURIComponent(query)}`),
    },
    admin: {
        stats: () => request<{ metrics: Record<string, number>; logs: Record<string, unknown>[] }>('/api/admin/stats'),
    },
    health: () =>
        request<{ message: string }>('/'),
};
