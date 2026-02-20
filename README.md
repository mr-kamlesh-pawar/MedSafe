
# MedSafe - Advanced Drug Safety Monitoring System

MedSafe is a comprehensive platform for monitoring Adverse Drug Reactions (ADR) using machine learning and rule-based logic. It features role-based access for Clinicians, Pharmacists, Admins, and Patients.

## Features

*   **Role-Based Dashboards**: tailored views for different user types.
*   **Risk Assessment**: Check drug interactions with ML-powered risk scoring.
*   **Alternatives Recommendation**: Suggest safer drug alternatives.
*   **Patient Management**: Create and manage patient profiles.
*   **Admin Analytics**: View system usage stats and audit logs.
*   **Secure Authentication**: JWT-based login with session management.

## Rapid Setup

1.  **Start Servers**: Run `.\start_all.ps1` from the project root.
2.  **Access App**: Open [http://localhost:3000](http://localhost:3000).

## Credentials (For Testing)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Clinician** | `dr@medsafe.com` | `test1234` |
| **Pharmacist** | `pharm@medsafe.com` | `test1234` |
| **Admin** | `admin@medsafe.com` | `test1234` |
| **Patient** | `patient@medsafe.com` | `test1234` |

## Tech Stack

*   **Frontend**: Next.js 16, Tailwind CSS, Recharts
*   **Backend**: Flask, MongoDB, Scikit-learn, SHAP
*   **Database**: MongoDB (Local)

## License

MIT
