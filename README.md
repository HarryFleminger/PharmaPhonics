# PharmaPhonics — UK Paramedic Medication Study App

A client-side React + TypeScript + Vite + Tailwind CSS flashcard study app designed for UK paramedics and student paramedics to practice UK BNF / rINN and JRCALC medication pronunciations, drug classes, and clinical indications.

## Core Features

1. **UK BNF / rINN & JRCALC Medication Database (`src/data/medications.json`)**:
   - Strictly uses UK BNF / rINN nomenclature (e.g., *Paracetamol*, *Salbutamol*, *Furosemide*, *Adrenaline*, *Chlorphenamine*, *Glyceryl Trinitrate*).
   - Covers the most commonly prescribed NHS community drugs (*Atorvastatin*, *Amlodipine*, *Lansoprazole*, *Omeprazole*, *Ramipril*, *Bisoprolol*, *Apixaban*, *Metformin*, *Levothyroxine*, *Clopidogrel*) alongside essential pre-hospital JRCALC drugs (*Paracetamol*, *Salbutamol*, *Ipratropium Bromide*, *Furosemide*, *Ondansetron*, *Adrenaline*, *Tranexamic Acid*, *Amiodarone*).
2. **British English (`en-GB`) Pronunciation Engine (`src/hooks/useSpeechSynthesis.ts`)**:
   - Uses the native Web Speech API (`window.speechSynthesis`), strictly filtering available system voices to select `en-GB` (British English) voices and enforcing `utterance.lang = 'en-GB'`.
   - Includes a `1.0x Normal` / `0.75x Slow` pronunciation speed toggle and a voice selector when multiple British English voices are installed.
3. **Instant Search & Formulary Filtering (`src/components/SearchAndFilter.tsx`)**:
   - Real-time client-side filtering across drug name, syllabic phonetic spelling, pharmacological class, and clinical indications, plus quick formulary filters (`All Drugs`, `JRCALC Pre-Hospital`, `NHS Community`, `Dual (Both)`).
4. **Mobile- & Tablet-Responsive Flashcard UI (`src/components/MedicationCard.tsx`)**:
   - Switch between a responsive 2-column Flashcard Grid and a Single-Card Focused Deck Mode ideal for post-shift reflection on a phone or tablet.

## Getting Started

```bash
npm install
npm run dev
```
