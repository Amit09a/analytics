# 📊 ADmyBRAND Insights – AI-Powered Analytics Dashboard

A modern, visually stunning and interactive analytics dashboard built using Next.js 14+, Tailwind CSS, and `shadcn/ui`, designed for digital marketing agencies to visualize KPIs with style and performance.

---

## 🚀 Live Demo

[🔗 View Deployed Project](https://analytics-git-main-amit09as-projects.vercel.app)

---

## 🎯 Features

- 🔢 Metric Cards (Revenue, Users, Conversions, Growth %)
- 📈 Interactive Charts (Line, Bar, Donut/Pie)
- 🗃️ Data Table with sorting, filtering, and pagination
- 🌙 Light/Dark Mode toggle
- 📅 Advanced filters with date ranges
- 🔁 Simulated real-time updates
- 📤 Export to CSV/PDF
- 🧊 Skeleton loaders & micro-interactions

---

## 🧰 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/docs) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com)
- **Charts**: [Recharts](https://recharts.org), [React Chart.js 2](https://react-chartjs-2.js.org)
- **Export**: [`papaparse`](https://www.papaparse.com/), [`jspdf`](https://github.com/parallax/jsPDF)
- **Icons**: [Lucide](https://lucide.dev)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

---

## 📦 Dependencies

```bash
npm install next react react-dom tailwindcss class-variance-authority lucide-react
npm install @radix-ui/react-popover @radix-ui/react-dropdown-menu
npm install recharts react-chartjs-2 chart.js papaparse jspdf
npm install framer-motion
🧠 AI Tools Used
ChatGPT – Architecture, component planning, debugging

GitHub Copilot – Inline code suggestions & refactorings

v0.dev – UI component drafts using Tailwind + shadcn/ui

Cursor IDE – Smart edits, type hints, code reorganizing

🗂 Folder Structure
bash
Copy
Edit
/app
  /dashboard
    page.tsx           # Main dashboard page
    /components
      ChartCard.tsx
      MetricCard.tsx
      DataTable.tsx
      ExportDropdown.tsx
      SkeletonLoader.tsx
/lib
  /utils
    mockData.ts        # Sample chart/table data
    formatters.ts
    dateRanges.ts
/styles
  globals.css
  tailwind.config.js
🛠️ Local Setup
bash
Copy
Edit
# 1. Clone the repo
git clone https://github.com/your-username/admybrand-insights.git
cd admybrand-insights

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev

# 4. Open in browser
http://localhost:3000
📁 Scripts
json
Copy
Edit
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "format": "prettier --write ."
}
📄 License
MIT © 2025 — Amit 
