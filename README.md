# 🩺 MedSpeak — UK Paramedic Medication App

**MedSpeak** is a responsive React + TypeScript + Vite + Tailwind CSS study application built for UK paramedics, student paramedics, and pre-hospital clinicians (TEMT / AAP / Paramedic). It combines live **UK BNF nomenclature lookups**, **Google Gemini Clinical AI**, and **Google Cloud Text-to-Speech (British English Neural2 voice)** to help clinicians master UK medication pronunciations, drug classes, clinical indications, and on-scene primary survey considerations.

---

## ✨ Key Features

### 1. 🗂️ Quick Categories (JRCALC & UK Starter Formulary)
Browse curated UK medication lists organized for pre-hospital and community prescription history review (`src/data/quickCategories.ts`):
- **JRCALC Core Emergency (51 drugs)**: *Adenosine*, *Adrenaline*, *Alteplase*, *Amiodarone*, *Aspirin*, *Atropine Sulfate*, *Benzylpenicillin*, *Calcium Chloride*, *Chlorphenamine*, *Dexamethasone*, *Diazepam*, *Fentanyl*, *Glucagon*, *Glucose*, *Glyceryl Trinitrate*, *Hydrocortisone*, *Ipratropium Bromide*, *Ketamine*, *Levetiracetam*, *Lidocaine*, *Magnesium Sulfate*, *Methoxyflurane (Penthrox)*, *Midazolam*, *Misoprostol*, *Morphine Sulfate*, *Naloxone*, *Nitrous Oxide (Entonox)*, *Ondansetron*, *Oxygen*, *Paracetamol*, *Salbutamol*, *Sodium Chloride*, *Syntometrine*, *Tranexamic Acid*, and more.
- **High-Risk Scene Categories**:
  - **Blood Thinners**: *Apixaban*, *Rivaroxaban*, *Warfarin*, *Clopidogrel*, *Ticagrelor*, *Edoxaban*, *Dabigatran*.
  - **Beta Blockers**: *Bisoprolol*, *Atenolol*, *Propranolol*, *Metoprolol*.
- **UK "Starter Formulary" (Audi et al.) Top 100 Systemic Groups**:
  - **Cardiovascular**, **Central Nervous System**, **Analgesia**, **Endocrine**, **Gastrointestinal**, **Respiratory**, and **Infections**.
- **Mobile-First Collapsible Drawer**: Selecting a drug from any Quick Category automatically collapses the category list into a compact breadcrumb bar (`Category › Drug`) so flashcards are immediately visible on mobile screens, with a one-tap **"Show all drugs"** button to re-expand.

### 2. 🔍 Live OpenPrescribing BNF Search (400ms Debounce)
- Queries the [OpenPrescribing BNF Code API](https://openprescribing.net/api/) (`/api/1.0/bnf_code/?format=json&q={searchTerm}`) for official UK BNF nomenclature (`name`) and BNF codes (`id`).
- Uses a **400ms debounce** (`src/hooks/useDebounce.ts`) and triggers only when the search input is `> 2` characters (`3+` characters), cancelling stale in-flight requests via `AbortController`.
- Includes a comprehensive built-in UK BNF nomenclature & code fallback index (`src/data/bnfNomenclature.ts`) so searches remain fast and reliable even if upstream firewall limits occur.

### 3. 🧠 Gemini Clinical AI (`gemini-2.5-flash`)
Selecting any medication flashcard dynamically queries the Google Gemini API (`src/services/geminiClinicalService.ts`) with strict JSON output (`responseMimeType: "application/json"`) to generate:
- **Phonetic Spelling**: Syllabic British English pronunciation breakdown with stressed syllables highlighted.
- **Pharmacological Class**: UK BNF drug class.
- **On-Scene Context (`medicSummary`)**: Plain-English, pre-hospital summary explaining why a patient is prescribed the medication and what an ambulance crew needs to watch out for on scene (e.g., occult bleeding risk in head injury/trauma, masked compensatory tachycardia, postural hypotension).
- **Common Indications**: Concise bulleted list of UK clinical indications.

### 4. 🇬🇧 UK English Neural Pronunciation (`en-GB-Neural2-B`)
- Powered by the **Google Cloud Text-to-Speech REST API** (`src/services/googleTtsService.ts`) using the British English neural voice `en-GB-Neural2-B`.
- Supports **1.0x Normal** and **0.75x Slow** speaking rates, loading spinner states on every **Listen** button, and in-memory session audio caching.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons
- **APIs**:
  - [OpenPrescribing BNF API](https://openprescribing.net/api/)
  - [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash`)
  - [Google Cloud Text-to-Speech API](https://cloud.google.com/text-to-speech) (`en-GB-Neural2-B`)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd MedSpeak
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root of the project by copying `.env.example`:

```bash
cp .env.example .env.local
```

Add your API keys to `.env.local`:

```env
# Google Cloud Text-to-Speech API Key
VITE_GOOGLE_TTS_API_KEY=your_google_cloud_tts_api_key_here

# Google Gemini API Key (supports both AIza... and AQ... auth keys)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Security Note:** `.env.local` is ignored by Git via `.gitignore` (`*.local`) so your API keys will never be committed to version control.

### 3. Run the Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```text
MedSpeak/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Sticky ambulance-green header, API status badges & speed toggle
│   │   ├── SearchAndFilter.tsx     # Quick Categories bar, collapsible drug grid & debounced search bar
│   │   └── MedicationCard.tsx      # BNF flashcard with Listen button, Gemini clinical details & skeletons
│   ├── data/
│   │   ├── quickCategories.ts      # JRCALC Core Emergency, Blood Thinners, Beta Blockers & Top 100 groups
│   │   └── bnfNomenclature.ts      # UK BNF nomenclature & BNF ID fallback dataset
│   ├── hooks/
│   │   ├── useDebounce.ts          # 400ms generic debounce hook
│   │   └── useSpeechSynthesis.ts   # Audio playback state & Google Cloud TTS hook
│   ├── services/
│   │   ├── openPrescribingService.ts # OpenPrescribing BNF API client with fallback support
│   │   ├── geminiClinicalService.ts  # Gemini API client for JRCALC/BNF clinical JSON generation
│   │   └── googleTtsService.ts       # Google Cloud Text-to-Speech REST API client (en-GB-Neural2-B)
│   ├── types/
│   │   └── medication.ts           # TypeScript interfaces
│   ├── App.tsx                     # Main application state & layout
│   ├── main.tsx                    # React entry point
│   └── index.css                   # Tailwind CSS entry point
├── .env.example                    # Environment variable template
├── vite.config.ts                  # Vite configuration & dev proxy
└── tailwind.config.js              # Custom NHS & UK Ambulance colour palette
```

---

## ⚠️ Clinical Disclaimer

**MedSpeak** is an educational study tool designed to support medication nomenclature, pronunciation, and pharmacology revision. It is **not** a substitute for clinical judgement or official guidelines. Always consult the current **JRCALC Clinical Practice Guidelines**, **British National Formulary (BNF)**, and your local NHS Ambulance Trust PGDs/policies in clinical practice.
