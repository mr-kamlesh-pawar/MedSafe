# 🛡️ MedSafe — Clinical ADR Risk Intelligence Platform

AI-powered drug adverse reaction (ADR) risk assessment system with role-based dashboards for Clinicians, Pharmacists, Admins, and Patients.

---

## 📋 Prerequisites — Install These First

| Tool | Download Link | Why |
|------|--------------|-----|
| **Node.js 18+** | https://nodejs.org | Runs the Next.js frontend |
| **Python 3.10+** | https://python.org/downloads | Runs the Flask backend |
| **MongoDB Community** | https://www.mongodb.com/try/download/community | Database |
| **Git** | https://git-scm.com/downloads | Clone the repo |

> ✅ After installing each one, verify in a terminal:
> ```bash
> node -v       # should show v18 or higher
> python --version  # should show 3.10 or higher
> mongod --version  # should show 7.x or similar
> git --version
> ```

---

## 🚀 Step-by-Step Setup

### Step 1 — Clone the Repository

Open a terminal (PowerShell / Command Prompt / Terminal) and run:

```bash
git clone https://github.com/mr-kamlesh-pawar/MedSafe.git
cd MedSafe
```

---

### Step 2 — Start MongoDB

MongoDB must be running before the backend starts.

**Windows:**
```bash
# Option A — Start as a service (if installed as service)
net start MongoDB

# Option B — Run manually
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**macOS / Linux:**
```bash
brew services start mongodb-community   # macOS with Homebrew
# OR
sudo systemctl start mongod             # Linux
```

> MongoDB runs on port **27017** by default. Leave this terminal open or run as a service.

---

### Step 3 — Set Up the Backend (Flask)

Open a **new terminal** window:

```bash
# 1. Go into the server folder
cd MedSafe/server

# 2. Create a Python virtual environment
python -m venv venv

# 3. Activate it
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# 4. Install all dependencies
pip install -r requirements.txt

# 5. The .env file is already included. Contents:
#    MONGO_URI=mongodb://localhost:27017/medsafe
#    SECRET_KEY=dev_secret_key
#    PORT=5000

# 6. Seed the database with test users
python seed_users.py

# 7. Start the backend server
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

> 🟢 **Leave this terminal open.** Backend runs on **http://localhost:5000**

---

### Step 4 — Set Up the Frontend (Next.js)

Open another **new terminal** window:

```bash
# 1. Go into the client folder
cd MedSafe/client

# 2. Install Node dependencies
npm install

# 3. The .env.local file is already included. Contents:
#    NEXT_PUBLIC_API_URL=http://localhost:5000

# 4. Start the frontend dev server
npm run dev
```

You should see:
```
▲ Next.js 15.x
- Local: http://localhost:3000
```

> 🟢 **Leave this terminal open.** Frontend runs on **http://localhost:3000**

---

### Step 5 — Open the App

Open your browser and go to:

```
http://localhost:3000
```

---

## 🔑 Test Credentials

Use these to log in immediately (seeded by `seed_users.py`):

| Role | Email | Password |
|------|-------|----------|
| **Clinician** | `dr@medsafe.com` | `test1234` |
| **Pharmacist** | `pharmacist@medsafe.com` | `test1234` |
| **Admin** | `admin@medsafe.com` | `test1234` |
| **Patient** | `patient@medsafe.com` | `test1234` |

---

## 📁 Project Structure

```
MedSafe/
├── client/                  # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Login page
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx    # Main dashboard (role-based)
│   │   │   └── globals.css     # Global styles
│   │   ├── components/
│   │   │   └── dashboard/
│   │   │       ├── Sidebar.tsx
│   │   │       ├── AssessTab.tsx    # Risk assessment + report
│   │   │       ├── PatientsTab.tsx
│   │   │       ├── AdminStatsTab.tsx
│   │   │       ├── HistoryTab.tsx
│   │   │       └── RiskReport.tsx   # Printable PDF report
│   │   └── lib/
│   │       ├── api.ts          # All API calls
│   │       └── auth-context.tsx # JWT auth context
│   └── .env.local             # NEXT_PUBLIC_API_URL
│
├── server/                  # Flask Backend
│   ├── app.py              # Flask app entry point
│   ├── routes.py           # API endpoints
│   ├── auth.py             # JWT authentication
│   ├── models.py           # MongoDB models
│   ├── ml_service.py       # AI risk engine + SHAP
│   ├── seed_users.py       # DB seeder script
│   ├── requirements.txt    # Python dependencies
│   └── .env                # MONGO_URI, SECRET_KEY
│
└── README.md
```

---

## ✨ Features

- 🔐 **JWT Authentication** with role-based access control
- 🤖 **AI Risk Assessment** — ML model scores ADR risk (Low / Medium / High / Critical)
- 🧬 **SHAP Explainability** — Bar chart showing which factors drive the risk
- 💊 **Drug Interaction Engine** — Rule-based checks (e.g. Aspirin + Warfarin → Critical)
- 💊 **Drug Alternatives** — Suggests safer substitutes when risk is high
- 📄 **Clinical Report** — Printable / PDF-exportable A4 report after assessment
- ⚠️ **Override Workflow** — Clinicians can log a clinical justification to override risk
- 👥 **Patient Registry** — Create and list patient records
- 📊 **Admin Analytics** — System metrics, audit logs, health status
- 🔍 **Drug Autocomplete** — Live search while typing drug name

---

## 🧪 Testing Risk Assessment

Go to **Risk Assessment** tab after logging in as a Clinician.

| Test Case | Drug | Current Meds | Expected Result |
|-----------|------|-------------|-----------------|
| Critical interaction | `Warfarin` | `Aspirin` | 🚨 CRITICAL |
| Critical interaction | `Lisinopril` | `Ibuprofen` | 🚨 CRITICAL |
| ML prediction | `Amoxicillin` | *(empty)* | ✅ LOW |
| High-risk elderly | `Aspirin` | *(empty)*, age 75 | Random ML score |

---

## 🛑 Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| `mongod: command not found` | MongoDB not installed or not in PATH. Reinstall from mongodb.com |
| `pip install` fails on `shap` or `xgboost` | Run `pip install --upgrade pip` first, then retry |
| Frontend shows "Network Error" | Make sure Flask server is running on port 5000 |
| Login says "Invalid credentials" | Run `python seed_users.py` from the `server/` folder first |
| Port 3000 already in use | Run `npm run dev -- -p 3001` and update `.env.local` |
| `ModuleNotFoundError: flask` | Make sure your venv is activated before running `python app.py` |

---

## 🔧 Environment Variables Reference

**`client/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**`server/.env`**
```env
MONGO_URI=mongodb://localhost:27017/medsafe
SECRET_KEY=dev_secret_key
PORT=5000
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 18, TypeScript |
| Styling | Vanilla CSS + Tailwind CSS |
| Charts | Recharts |
| Backend | Flask, Python 3.10+ |
| Database | MongoDB (via PyMongo) |
| Auth | JWT (PyJWT + bcrypt) |
| AI/ML | Scikit-learn, SHAP, XGBoost |
| HTTP | Fetch API |
