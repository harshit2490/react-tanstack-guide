# TanStack Query — React Data Fetching Demo

A robust data fetching and state management application built with **React**, **Vite**, **TanStack Query v5**, and **Tailwind CSS v4**. This project demonstrates traditional vs React Query fetching, mutations, infinite scrolling, and advanced caching strategies.

## ✨ Features

- 🔄 **Data Fetching** — Comparison between traditional `useEffect` fetching and `useQuery`
- ✏️ **Mutations** — Create, update, and delete operations with `useMutation`
- 📜 **Infinite Scrolling** — Dynamic data loading on scroll using `useInfiniteQuery` and `react-intersection-observer`
- 🛣️ **Routing** — Client-side navigation handled by `react-router-dom`
- 🎨 **Tailwind CSS v4** — Utility-first styling with a modern design
- ⚡ **Vite** — Blazing fast dev server and build tool

## 🛠️ Tech Stack

| Technology | Version |
|---|---|
| React | ^18.3.1 |
| Vite | ^8.1.0 |
| @tanstack/react-query | ^5.56.2 |
| react-router-dom | ^7.18.0 |
| Tailwind CSS | ^4.3.1 |
| axios | ^1.7.7 |

## 📦 Installation

Make sure you have **Node.js** (v18 or above) and **npm** installed.

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/tanstack-query.git
   cd tanstack-query
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
tanstack-query/
├── public/             # Static assets
├── src/
│   ├── api/            # API fetching functions (axios)
│   ├── components/     # UI components (Layout, UI wrappers)
│   ├── pages/          # Pages (FetchOld, FetchRQ, InfiniteScroll, etc.)
│   ├── App.jsx         # Main application with routing & QueryClient
│   └── index.css       # Global styles (Tailwind)
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 📄 License

MIT
