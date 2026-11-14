# PharmaPhonics — UK Paramedic Medication Study App

A React + TypeScript + Vite + Tailwind CSS UK medication nomenclature and pronunciation study app powered by the **live OpenPrescribing BNF API** and **Google Cloud Text-to-Speech (`en-GB-Neural2-B`)**.

## Core Features

1. **Live OpenPrescribing BNF Search (`src/services/openPrescribingService.ts`)**:
   - Queries `https://openprescribing.net/api/1.0/bnf/?format=json&q={searchTerm}` in real time for official UK BNF nomenclature (`name`) and BNF codes (`id`).
2. **400ms Debounced Search (`src/hooks/useDebounce.ts`)**:
   - Applies a **400ms debounce** on user input and only triggers an API call when the trimmed search query is **> 2 characters** (`3+` characters), preventing rate-limiting and cancelling stale in-flight requests via `AbortController`.
3. **Streamlined BNF Flashcard UI & Loading Skeletons (`src/components/MedicationCard.tsx`)**:
   - Displays each medication's official BNF `name` prominently with its BNF `id` code as a subtitle.
   - Displays subtle loading skeleton cards (`MedicationCardSkeleton`) and an inline search spinner while fetching from OpenPrescribing.
4. **Google Cloud Text-to-Speech Integration (`src/services/googleTtsService.ts`)**:
   - Passes the fetched OpenPrescribing `name` string directly to `https://texttospeech.googleapis.com/v1/text:synthesize` using the British English neural voice `en-GB-Neural2-B`.

## Setting Up Your Google Cloud TTS API Key

1. Copy `.env.example` to `.env.local` in the project root:
   ```bash
   cp .env.example .env.local
   ```
2. Add your Google Cloud Text-to-Speech API key:
   ```env
   VITE_GOOGLE_TTS_API_KEY=AIzaSyYourActualGoogleCloudTtsApiKey
   ```

## Running the App

```bash
npm install
npm run dev
```
