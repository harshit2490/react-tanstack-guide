# TanStack Table — React Data Table Demo

A feature-rich data table built with **React**, **Vite**, **TanStack Table v8**, and **Tailwind CSS v4**. This project demonstrates sorting, filtering, pagination, and column-level control using the headless TanStack Table library.

## ✨ Features

- 📊 **Sorting** — Click column headers to sort ascending/descending (with per-column disable support)
- 🔍 **Global Filtering** — Search across all columns instantly
- 📄 **Pagination** — Navigate through large datasets with ease
- 🎨 **Tailwind CSS v4** — Utility-first styling with a modern design
- ⚡ **Vite** — Blazing fast dev server and build tool

## 🛠️ Tech Stack

| Technology | Version |
|---|---|
| React | ^19.2.6 |
| Vite | ^8.0.12 |
| @tanstack/react-table | ^8.21.3 |
| Tailwind CSS | ^4.3.1 |
| Lucide React | ^1.21.0 |

## 📦 Installation

Make sure you have **Node.js** (v18 or above) and **npm** installed.

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/tanstack-table.git
   cd tanstack-table
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

## 🚀 Running the Dev Server

```bash
npm run dev
```

The app will start at **http://localhost:5173** by default.

## 🏗️ Build for Production

```bash
npm run build
```

The production-ready files will be output to the `dist/` folder.

## 👀 Preview Production Build

```bash
npm run preview
```

## 🧹 Linting

```bash
npm run lint
```

## 📁 Project Structure

```
tanstack-table/
├── public/             # Static assets
├── src/
│   ├── App.jsx         # Main application with table logic
│   └── sampleData.json # Sample data for the table
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 📄 License

MIT
