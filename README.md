# PharmaPhonics — UK Paramedic Medication Study App

A client-side React + TypeScript + Vite + Tailwind CSS flashcard study app designed for UK paramedics and student paramedics to practice UK BNF / rINN and JRCALC medication pronunciations, drug classes, and clinical indications using **Google Cloud Text-to-Speech (`en-GB-Neural2-B`)**.

## Core Features

1. **UK BNF / rINN & JRCALC Medication Database (`src/data/medications.json`)**:
   - Strictly uses UK BNF / rINN nomenclature (e.g., *Paracetamol*, *Salbutamol*, *Furosemide*, *Adrenaline*, *Chlorphenamine*, *Glyceryl Trinitrate*).
   - Supports an optional `ssml` field for medical terms requiring explicit phonetic or syllabic SSML synthesis (`<speak>...</speak>`).
2. **Google Cloud Text-to-Speech Integration (`src/services/googleTtsService.ts`)**:
   - Calls `https://texttospeech.googleapis.com/v1/text:synthesize` using the British English neural voice `en-GB-Neural2-B`.
   - Sends `input: { ssml }` when a medication defines an `ssml` field, or `input: { text: name }` otherwise.
   - Includes in-memory session caching and `1.0x Normal` / `0.75x Slow` speaking rate support.
3. **Instant Search & Formulary Filtering (`src/components/SearchAndFilter.tsx`)**:
   - Real-time client-side filtering across drug name, syllabic phonetic spelling, pharmacological class, and clinical indications, plus quick formulary filters (`All Drugs`, `JRCALC Pre-Hospital`, `NHS Community`, `Dual (Both)`).
4. **Mobile- & Tablet-Responsive Flashcard UI (`src/components/MedicationCard.tsx`)**:
   - Features a loading spinner state on the **Listen** button while fetching audio from Google Cloud TTS, and switches between a 2-column Flashcard Grid and a Single-Card Focused Deck Mode.

## Setting Up Your Google Cloud TTS API Key

1. Create a `.env.local` file in the project root directory (`/Users/henrymaxfleminger/Documents/Antigravity Projects/PharmaPhonics/.env.local`) — you can copy `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
2. Add your Google Cloud Text-to-Speech API key to `.env.local`:
   ```env
   VITE_GOOGLE_TTS_API_KEY=AIzaSyYourActualGoogleCloudTtsApiKey
   ```
   *(Note: `.env.local` is automatically ignored by Git via `*.local` in `.gitignore` so your key will never be committed.)*

## Running the App

```bash
npm install
npm run dev
```
