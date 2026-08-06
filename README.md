# 🧘 Mental Wellness Journal

A beautiful, privacy-first mental wellness journal and mood tracking application. Track your emotions, write daily reflections, and gain insights into your emotional patterns — all stored securely in your browser.

🔗 **Live Demo:** [https://mental-wellness-journal-tau.vercel.app](https://mental-wellness-journal-tau.vercel.app)

---

## About The Project

Mental Wellness Journal is a full-featured web application designed to support daily mental health practices. It combines a rich-text journaling experience with mood tracking, emotional analytics, and mindfulness features — wrapped in a distinctive Neo-Brutalist UI with claymorphic cards, bold typography, and smooth animations.

Everything runs client-side. Your journal entries, mood logs, and preferences are stored in `localStorage` — nothing is ever sent to a server.

### What You Can Do

- **Write journal entries** with a rich text editor (bold, italic, lists, blockquotes), tag them, and associate a mood with each entry
- **Track your mood** multiple times per day with timestamps and optional notes across 9 emotional states
- **View analytics** — 7-day and 30-day mood trend charts, weekly averages, and emotional flow visualizations
- **Browse a calendar** showing which days have journal entries and mood check-ins
- **Read daily quotes** pulled from the ZenQuotes API (with offline fallbacks) and save your favorites
- **Switch themes** between Light and Dark mode
- **Customize settings** — set your display name, font size, and manage your data

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Animations | Framer Motion |
| Charts | Recharts |
| Rich Text Editor | React Quill New |
| Calendar | React Calendar |
| Routing | React Router DOM v7 |
| Icons | React Icons (Heroicons) |
| Deployment | Vercel |

---

## Pages

| Page | Description |
|---|---|
| **Dashboard** | Welcome greeting, today's mood check-in, quick-write button, daily quote card, calendar widget, weekly mood chart, and recent journal entries |
| **Journal** | Full journal management — create/edit/view entries with the rich text editor, search and filter entries by mood, tag entries |
| **Analytics** | Mood trend visualizations (7-day and 30-day area charts), weekly mood averages, mood distribution data |
| **Settings** | Theme toggle (light/dark), display name, font size preferences, favorite quotes management, and data reset |

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm**

### Installation

```bash
# Clone the repository
git clone https://github.com/prakash8264/Mental-Wellness-Journal.git

# Navigate into the project
cd Mental-Wellness-Journal

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check with TypeScript and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
├── components/
│   ├── Buttons/           # Reusable button component
│   ├── CalendarWidget/    # Monthly calendar with mood/entry indicators
│   ├── Charts/            # Weekly mood trend chart (Recharts)
│   ├── EmptyState/        # Placeholder for empty lists
│   ├── Inputs/            # Tag input with suggestions
│   ├── JournalCard/       # Journal entry preview card
│   ├── Layout/            # App shell with sidebar + navbar
│   ├── Modal/             # Reusable modal overlay
│   ├── MoodCard/          # Daily mood check-in card
│   ├── MoodLogger/        # Mood logging modal (time, note, mood)
│   ├── MoodSelector/      # Emoji-based mood picker grid
│   ├── Navbar/            # Top navigation bar (desktop)
│   ├── Navigation/        # Bottom navigation bar (mobile)
│   ├── QuoteCard/         # Daily inspirational quote display
│   └── Sidebar/           # Side navigation (desktop)
├── constants/             # Routes, mood definitions, fallback quotes
├── context/               # React Context (journal state, theme)
├── hooks/                 # Custom hooks (useJournal, useMood, useQuotes, useTheme)
├── pages/                 # Dashboard, Journal, Analytics, Settings
├── services/              # localStorage service, quote API service
├── types/                 # TypeScript interfaces and type definitions
├── utils/                 # Date formatting, mood calculation helpers
├── App.tsx                # Router configuration
├── index.css              # Design tokens, theme variables, global styles
└── main.tsx               # Application entry point
```

---

## Features In Detail

### 🎭 Mood Tracking
Log moods from a 9-point spectrum: Happy, Excited, Calm, Neutral, Sad, Depressed, Angry, Anxious, and Stressed. Each mood has a unique emoji, color, and numeric score (1–10) used for analytics calculations. You can log multiple moods per day with timestamps and notes.

### 📖 Rich Text Journal
Write entries using a WYSIWYG editor with formatting options. Each entry tracks word count, character count, and reading time. Entries can be tagged with custom labels or suggested tags like Mindfulness, Gratitude, Self-Care, Reflection, Work, Growth, and Peace.

### 📊 Emotional Analytics
Visualize your emotional patterns over 7-day and 30-day windows using interactive area charts. See your weekly mood averages and track how your emotional state changes throughout the week.

### 🎨 Neo-Brutalist Design
The UI uses a claymorphic design system with bold 3px borders, 3D box shadows, rounded corners, and a carefully curated color palette. Supports both a warm cream light theme and a deep dark theme with smooth transitions powered by Framer Motion.

### 💡 Daily Quotes
Fetches inspirational quotes from the ZenQuotes API with graceful offline fallback. Save your favorite quotes and manage them from the Settings page.

---

## Deployment

The app is deployed on [Vercel](https://vercel.com). To deploy your own:

1. Push to GitHub
2. Import the repo in Vercel
3. Vercel auto-detects Vite and deploys

---

## License

This project is open source and available under the [MIT License](LICENSE).
