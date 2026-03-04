# Mabi Recipes

A clean, mobile-first recipe app with AI-assisted recipe creation and editing.

## Features

- Browse, search and filter recipes by category
- View full recipe detail with checkable ingredients and steps
- Add and edit recipes with AI-powered text improvements and recipe generation
- EN/DE language switch
- Data persisted server-side in SQLite

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) for persistence
- [Claude Haiku](https://www.anthropic.com/) for AI features

## Getting Started

Copy `.env.example` to `.env` and fill in your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_DEFAULT_LANG=en
```

Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker

Build and run with Docker Compose:

```bash
docker compose up --build
```

The SQLite database is persisted in a named Docker volume (`sqlite_data`). Pass your API key via environment variable or a `.env` file:

```bash
ANTHROPIC_API_KEY=sk-ant-... docker compose up
```

To rebuild after code changes:

```bash
docker compose build --no-cache
docker compose up
```

## Build

```bash
npm run build
npm start
```
