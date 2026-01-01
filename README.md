# Nuntia

Nuntia is a production-grade, local-first RSS aggregator and intelligence platform built with Next.js. It provides users with a unified interface for tracking information from diverse sources while maintaining strict data privacy through local processing and local AI integration.

## Overview

Unlike traditional cloud-based RSS readers, Nuntia prioritizes user sovereignty. All story processing, topic detection, and AI-driven summarization occur either within the user's browser or on their local machine. By integrating with Ollama, Nuntia offers sophisticated intelligence reports without transmitting sensitive reading habits to third-party AI providers.

## Key Features

### User-Specific Content Management
Integrated with Firebase Authentication, ensuring that feed subscriptions, reading history, and generated reports are isolated per user.

### Intelligent Topic Detection
Automatic categorization of stories into over 20 pre-defined technical and business topics using a sub-second heuristic engine.

### Local AI Daily Digest
Generates comprehensive intelligence briefings using local LLMs (via Ollama). Users can select from various models (e.g., Llama 3.2) to summarize the last 24 hours of news.

### Information Density Optimized UI
A high-performance dashboard featuring:
- Compact story cards with metadata analysis (reading time, word count, author).
- Sub-second UI updates via custom event-based synchronization.
- Filterable topic chips and advanced search capabilities.
- Dark-mode optimized glassmorphism design.

### Export Capabilities
Production-standard PDF generation for AI-summarized reports using jsPDF.

## Technology Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Vanilla CSS (Glassmorphism design system)
- Firebase Client SDK (Authentication)

### Backend and Database
- Next.js Server Actions
- Drizzle ORM
- SQLite (local storage)
- Firebase Admin SDK (Authentication verification)

### Intelligence Layer
- Ollama API (Local LLM orchestration)
- RSS Parser (Server-side feed processing)

## Prerequisites

- Node.js 18.x or higher
- Ollama (for AI features)
- Firebase Project (for Authentication)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nuntia.git
cd nuntia
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a .env file in the root directory and populate it with your Firebase credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Database Initialization

Nuntia uses Drizzle ORM with SQLite. Initialize the database schema with:

```bash
npm run db:push
```

### 5. AI Setup (Optional)

To enable the Daily Intelligence Digest, ensure Ollama is running and download a supported model:

```bash
ollama serve
ollama pull llama3.2:1b
```

### 6. Run the Application

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Architecture and Privacy

Nuntia follows a "Privacy by Design" philosophy:
- Feed Data: Stored in a local SQLite database.
- AI Summarization: Executed on the local CPU/GPU via Ollama.
- Authentication: Handled securely via Firebase identity platform.
- Content Parsing: Performed server-side to bypass CORS while keeping the data within the application boundary.

## Maintenance and Scripts

- npm run dev: Start development server.
- npm run build: Build the production application.
- npm run db:push: Sync schema changes with the local database.
- npm run db:studio: Open Drizzle Studio to inspect local data.

## License

Copyright (c) 2024 Nuntia. All rights reserved.
Licensed under the MIT License.
