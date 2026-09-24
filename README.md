# PC Care with AI

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**PC Care with AI** is an intelligent, automated computer diagnostic and optimization web platform designed for everyday Windows users. It automatically analyzes system bottlenecks (CPU load, memory pressure, disk junk, background tasks, startup overload), explains the root cause in simple language using AI, and executes or guides safe one-click fixes.

---

## 🌟 Key Features

* **🛡️ Real-Time System Telemetry:** Live monitoring of CPU utilization, RAM consumption, system drive space, and process activity.
* **⚡ Multi-Stage Automated Health Scan:** Deep inspection across processor threads, physical memory caches, storage clutter, and startup programs.
* **🧠 AI-Powered Root-Cause Diagnosis:** Translates complex technical data into plain-language diagnostic reports with severity ratings (`low`, `medium`, `high`, `critical`).
* **🔧 Safe Auto-Fix Engine ("Fix Now"):** One-click cleanup of cache files, temporary logs, and performance reclamation without risking critical system files.
* **📖 Guided Solutions ("How to Fix"):** Step-by-step instructions for user-controlled adjustments (disabling unnecessary startup apps, etc.).
* **🔒 Enterprise Security & Isolation:** Full user authentication with Supabase Auth and PostgreSQL **Row Level Security (RLS)** ensuring users only access their own private scans.
* **📜 Complete Audit History:** Searchable, filterable scan history saved in a live PostgreSQL database.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons |
| **Design System** | Dark Cyber-Diagnostic Theme (`#0B0F17`, Neon Green `#10B981`, Gold `#F59E0B`) |
| **Backend & Database** | Supabase, PostgreSQL 17 |
| **Authentication** | Supabase Auth (JWT, email/password) |
| **Security** | Row Level Security (RLS) on all tables |
| **Deployment** | GitHub + Vercel Production Hosting |

---

## 🗄️ Database Architecture (PostgreSQL)

The database consists of **5 relational tables** protected with RLS:

1. **`profiles`**: User profile linked 1:1 with `auth.users` via foreign key cascade.
2. **`scans`**: Individual diagnostic scan records with health scores and timestamps.
3. **`scan_results`**: Granular system metrics (CPU %, RAM %, Disk %, process counts, JSONB telemetry).
4. **`recommendations`**: Detected issues, category, AI explanation, severity, and suggested action.
5. **`fix_actions`**: Audit log of automated and guided fixes with status tracking.

---

## 🚀 Getting Started Locally

### 1. Prerequisites
* Node.js (v18 or higher)
* npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/ghaznatamoin-sketch/pc-care-with-ai.git
cd "PC Care with AI"

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://ippyfvmakfauuyltybhl.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Production Build
```bash
npm run build
```

---

## 🌐 Deploy to Vercel

1. Push your repository to GitHub:
   ```bash
   git push -u origin main
   ```
2. In your [Vercel Dashboard](https://vercel.com):
   * Click **Add New Project** -> **Import Git Repository**.
   * Select `pc-care-with-ai`.
   * Framework Preset: **Vite**.
   * Root Directory: `./`.
   * Add Environment Variables:
     * `VITE_SUPABASE_URL` = `https://ippyfvmakfauuyltybhl.supabase.co`
     * `VITE_SUPABASE_ANON_KEY` = `your_supabase_anon_key`
   * Click **Deploy**.

---

## 📄 License
MIT License. Created for the PC Care with AI Project.
