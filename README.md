# 🚀 Landr – AI Job Prep Platform

Landr is a **full-stack AI-powered job preparation platform** designed to help candidates practice interviews, refine resumes, and receive real-time feedback. By combining **LLMs, emotion AI, and secure infrastructure**, Landr empowers users to become interview-ready with personalized insights.

**🌐 Live Demo:** [Access Landr](https://landr-web.vercel.app/)  
**🎬 Project Walkthrough:** [Watch on YouTube](https://youtube.com/your-video-link)

---

## ✅ Core Features

- 🤖 **AI-Powered Interview Practice** – Role-specific interview questions generated via Gemini API.
- 📝 **Resume Feedback** – Automated suggestions to improve clarity, structure, and role alignment.
- 🎤 **Real-Time Emotion & Tone Analysis** – Hume AI tracks delivery across 100+ practice sessions.
- 🔐 **Secure Authentication** – Clerk-based user auth & role management for 500+ user profiles.
- 🛡 **Fraud & Abuse Protection** – Arcjet integration blocking 1,000+ malicious requests.
- 📊 **Progress Tracking** – Monitor performance across multiple mock interviews.
- ⚡ **Scalable & Reliable** – 99.9% uptime with robust API integrations and PostgreSQL persistence.

---

## 🛠 Tech Stack

### **Client (Frontend)**

- ⚛️ **Next.js** – React-based framework with server and client rendering
- 🎨 **TailwindCSS, Shadcn UI, Lucide Icons** – Modern and responsive UI components
- 🔔 **Sonner** – In-app notifications
- 📡 **Axios** – API requests and data fetching

### **Server (Backend)**

- ⚡ **Next.js** – Lightweight backend framework
- 🗄 **PostgreSQL + Drizzle ORM** – Relational database with schema management
- 🛡 **Arcjet** – Security & request protection
- 🔐 **Clerk** – Authentication, authorization, and session management
- 🧠 **Gemini API** – Role-specific interview question generation
- 🎤 **Hume AI** – Emotion and tone analysis for real-time interview feedback

---

## 🚀 Installation & Running Locally

Follow these steps to set up and run **Landr**:

```bash
# Clone the repository

git clone https://github.com/devadarshh/landr.git

# Navigate into the project directory

cd landr

# Install dependencies

npm install

# Duplicate .env.example and rename it to .env

cp .env.example .env

#  Start the development server

npm run dev

```

## 📸 Screenshots

### Landing Page I

![Landing Page I](assets/screenshots/landing_page.png)

### Landing Page II

![Landing Page II](assets/screenshots/landing_page_2.png)

### Job Description

![Job Dashboard](assets/screenshots/job_description.png)

### Job Dashboard

![Job Dashboard](assets/screenshots/dashboard.png)

### Job Interview Page

![Job Interview Page](assets/screenshots/interview_page.png)

### Technical Interview Question

![Job Interview Page](assets/screenshots/question.png)

### Resume Analysis Page

![Job Interview Page](assets/screenshots/resume-analysis.png)

### Light Mode Page

![Light Mode Page](assets/screenshots/Light_mode.png)

## 📄 License

This project is licensed under a **Custom Personal Use License** — you may view and learn from the code, but **commercial use, redistribution, or claiming authorship is strictly prohibited**.
See the full [LICENSE](./LICENSE) for details.
