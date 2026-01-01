# Nuntia

<div align="center">

**A modern, serverless RSS aggregator with AI-powered digest generation**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://nuntia-ebon.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Live Demo](https://nuntia-ebon.vercel.app) • [Report Bug](https://github.com/ChilliRoger/nuntia/issues) • [Request Feature](https://github.com/ChilliRoger/nuntia/issues)

</div>

---

## 📖 Overview

Nuntia is a production-grade RSS aggregator that helps you stay informed without information overload. Subscribe to your favorite RSS feeds, browse stories in a beautiful interface, and let AI generate concise daily digests of your reading list.

### ✨ Key Features

- **🔐 Secure Authentication** - Email/password authentication powered by Firebase
- **📰 RSS Feed Management** - Subscribe to unlimited RSS/Atom feeds
- **🎨 Modern UI** - Clean, responsive design with dark mode glassmorphism
- **🤖 AI-Powered Digests** - Generate daily briefings using Groq's free LLM API
- **📊 Smart Organization** - Topic detection and filtering across 20+ categories
- **⚡ Serverless Architecture** - Fully deployed on Vercel for zero maintenance
- **💾 Efficient Storage** - SQLite database with Drizzle ORM
- **📱 Mobile Responsive** - Optimized for all screen sizes

---

## 🏗️ Technology Stack

### Core Framework
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router and Server Actions
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Turbopack](https://turbo.build/pack)** - Lightning-fast bundler

### Backend & Database
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM for SQL databases
- **[better-sqlite3](https://github.com/WiseLibs/better-sqlite3)** - Fast SQLite for Node.js
- **[Vercel Serverless Functions](https://vercel.com/docs/functions)** - Scalable backend

### Authentication & AI
- **[Firebase Authentication](https://firebase.google.com/docs/auth)** - User management and security
- **[Groq API](https://groq.com/)** - Free, fast LLM inference (Llama 3.3)
- **[RSS Parser](https://github.com/rbren/rss-parser)** - Feed parsing and normalization

### UI & Styling
- **CSS Modules** - Scoped styling with glassmorphism design system
- **React Context API** - Global state management
- **jsPDF** - PDF export for digests

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **pnpm**
- **Firebase Project** ([Create one](https://console.firebase.google.com/))
- **Groq API Key** ([Get free key](https://console.groq.com/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ChilliRoger/nuntia.git
cd nuntia
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Groq AI Configuration
GROQ_API_KEY=your_groq_api_key
```

4. **Initialize the database**
```bash
npm run db:push
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy the application**
```bash
vercel
```

3. **Add environment variables**

Add all environment variables from your `.env` file to Vercel:

```bash
# Firebase variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID

# Groq API
vercel env add GROQ_API_KEY
```

Select all environments (Production, Preview, Development) for each variable.

4. **Deploy to production**
```bash
vercel --prod
```

Your application will be live on Vercel!

---

## 🎯 Usage

### Managing Feeds

1. **Sign up** or **Log in** to your account
2. Click **"Feed Manager"** to open the feed management panel
3. Enter an RSS feed URL and click **"Add Feed"**
4. Your feeds will appear in the sidebar

### Reading Stories

- Browse stories in the main grid view
- Filter by topic using the topic chips
- Click on any story card to read the full article
- Stories are automatically organized by publication date

### Generating AI Digests

1. Ensure you have recent stories (last 24 hours)
2. Click **"Generate Daily Digest"** in the Digest Panel
3. Wait a few seconds while AI processes your stories
4. View your personalized briefing with:
   - Executive summary
   - Top headlines
   - Emerging trends
5. Export to PDF if needed

---

## 🏗️ Architecture

### Serverless Design

Nuntia is built for Vercel's serverless platform:

- **Database**: SQLite stored in `/tmp` directory (ephemeral but functional)
- **Functions**: Next.js Server Actions for backend operations
- **Authentication**: Firebase for secure user management
- **AI Processing**: Groq cloud API (no local resources required)

### Key Components

```
nuntia/
├── app/
│   ├── actions.ts          # Server actions (feeds, stories, digests)
│   ├── layout.tsx          # Root layout with auth provider
│   └── page.tsx            # Main dashboard
├── components/
│   ├── AuthModal.tsx       # Login/signup modal
│   ├── FeedManager.tsx     # Feed subscription UI
│   ├── StoryGrid.tsx       # Story display grid
│   ├── DigestPanel.tsx     # AI digest interface
│   └── ...
├── lib/
│   ├── auth-context.tsx    # Firebase auth context
│   ├── firebase.ts         # Firebase initialization
│   ├── db.ts              # Database setup
│   ├── ollama.ts          # Groq AI integration
│   ├── rss.ts             # RSS feed parsing
│   └── schema.ts          # Database schema
└── public/
```

---

## 🔒 Privacy & Security

- **User Data**: Stored in isolated SQLite database per deployment
- **Authentication**: Secure Firebase Auth with email/password
- **AI Processing**: Stories sent to Groq API only when generating digests
- **No Tracking**: No analytics or third-party tracking scripts
- **Open Source**: Full transparency with MIT license

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm start` | Start production server |
| `npm run db:push` | Sync database schema |
| `npm run db:studio` | Open Drizzle Studio |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🐛 Known Issues

- **Database Persistence**: Vercel's serverless environment uses ephemeral storage (`/tmp`). Data may be lost between deployments. Consider using a persistent database (Turso, PlanetScale) for production.
- **Rate Limits**: Groq free tier has rate limits. Consider implementing request queuing for heavy usage.

---

## 🗺️ Roadmap

- [ ] PostgreSQL support for persistent storage
- [ ] Mobile app (React Native)
- [ ] OPML import/export
- [ ] Multi-language support
- [ ] Collaborative feed sharing
- [ ] Advanced search with full-text indexing
- [ ] Read later functionality
- [ ] Browser extension

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Firebase](https://firebase.google.com/) - Authentication
- [Groq](https://groq.com/) - Fast AI inference
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM

---

<div align="center">

**Made with ❤️ by [ChilliRoger](https://github.com/ChilliRoger)**

[⬆ Back to Top](#nuntia)

</div>
