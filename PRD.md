# PC Care with AI — Product Requirements Document (PRD)

## 1. Product Overview
**PC Care with AI** is an intelligent computer diagnostic and optimization application designed for everyday Windows users. It addresses the common problem where computer users experience system slowdowns, high memory/CPU usage, low disk space, and sluggish startup, but lack the technical knowledge to diagnose the cause or safely resolve it.

## 2. Target Audience
* **Primary Users:** Everyday computer users, students, remote workers, and non-technical professionals who need an easy, automated way to keep their PC healthy.
* **Secondary Users:** Tech-savvy users looking for rapid PC telemetry, quick health summaries, and instant one-click maintenance tools.

## 3. Core Problem & Solution
* **Problem:** Users face sudden PC sluggishness, lag, and freezing without knowing whether the issue stems from background processes, RAM bloat, low storage, or startup overload. They often waste hours restarting, running risky scripts, or paying repair technicians unnecessarily.
* **Solution:** PC Care with AI provides an automated flow:
  Scan -> Detect -> Explain (with AI) -> Recommend -> Fix Safely -> Verify

## 4. Key Product Requirements

### 4.1 Authentication & User Management
* Email and password registration and login via Supabase Auth.
* Persistent session management with automatic state recovery.
* Multi-tenant data isolation using PostgreSQL Row Level Security (RLS).
* User profiles linked 1:1 with authenticated users.

### 4.2 System Health Scanner
* Telemetry collection:
  * **CPU Usage:** Real-time percentage calculation.
  * **RAM Usage:** Active memory usage %, used GB, and total GB.
  * **Disk Usage:** System drive percentage, free GB, and total GB.
  * **Running Processes:** Active background tasks and process count.
  * **Startup Programs:** High-impact startup item detection.
* Live animated scanning states with step-by-step progress indicators.

### 4.3 Diagnostic Engine & AI Explanations
* **Rule-based Diagnostic Layer:** Immediate threshold checks:
  * High RAM (> 80%)
  * High CPU (> 85%)
  * Low Disk Space (< 15% free)
  * Excessive Startup Items (> 8 items)
  * Heavy Background Tasks
* **AI Explanation Layer:** Translates complex technical telemetry into clear, simple language with severity ratings (low, medium, high, critical).

### 4.4 Actionable Solutions & Safe Fixes
* **Safe Automatic Fixes ('Fix Now'):** Automated actions such as cleaning temporary files, clearing browser cache, and releasing junk files without risking system files.
* **Guided Solutions ('How to Fix'):** Clear, actionable step-by-step guidance for actions requiring user discretion (e.g. disabling specific startup programs).

### 4.5 Scan History & Analytics
* Complete audit trail of past scans stored in PostgreSQL.
* Filtering by date, status (completed, failed), and severity.
* Real-time search across historical diagnostic records.
* CRUD operations allowing users to review, refresh, or remove scan records.

## 5. Technology Stack
* **Frontend:** React, TypeScript, Tailwind CSS, Lucide Icons
* **UI/UX Design System:** Dark background (#0B0F17), Neon Green primary accents (#10B981), Gold/Amber highlights (#F59E0B), Glassmorphism cards
* **Backend & Database:** Supabase, PostgreSQL 17
* **Authentication:** Supabase Auth (JWT, email/password)
* **Security:** Row Level Security (RLS) on all user data tables
* **Deployment:** GitHub repository + Vercel Production Deployment
