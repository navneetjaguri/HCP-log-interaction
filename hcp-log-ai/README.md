# HCP Log AI — MedSync Interaction Logger

An AI-powered Healthcare Professional (HCP) interaction logging application built for pharmaceutical sales representatives. MedSync combines a structured interaction form with **Aura**, an AI sales assistant that auto-populates form fields through natural conversation, enabling faster and smarter post-call documentation.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Requirements](#backend-requirements)
- [Usage](#usage)
- [State Management](#state-management)
- [Component Reference](#component-reference)
- [Running Tests](#running-tests)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## Overview

MedSync is a CRM-style tool designed for pharma sales reps to log and track their interactions with Healthcare Professionals (HCPs) — doctors, specialists, pharmacists, and hospital buyers. The core innovation is a **bidirectional AI chat assistant (Aura)** that reads the current form state, understands natural language input, and automatically fills in form fields via a Python backend agent.

**The typical workflow:**
1. Sales rep opens the "Log Interaction" page.
2. Rep chats with Aura: _"I just met with Dr. Patel this morning. It was a positive meeting about CardioMax."_
3. Aura parses the conversation, calls the backend, and auto-populates: HCP name, date, sentiment, topics discussed.
4. Rep reviews the form, makes final edits, and submits.

---

## Features

- 🧠 **AI Form Sync** — Aura chat automatically fills interaction form fields via the backend AI agent.
- 💬 **Conversational Logging** — Natural language input instead of manual data entry.
- ⚡ **Real-time Sync Indicator** — Animated "Synced at HH:MM:SS" badge whenever the AI updates the form.
- 📋 **Structured Interaction Form** — Captures all key sales interaction data:
  - HCP name & interaction type (Meeting / Call / Email)
  - Date, time, and attendees
  - Topics discussed
  - Materials shared & samples distributed
  - HCP sentiment (Positive / Neutral / Negative)
  - Key outcomes & follow-up actions
- 🎨 **Premium Glassmorphism UI** — Backdrop blur cards, gradient headers, smooth Framer Motion animations.
- 🔄 **Chat Reset** — Clear conversation history with a single button.
- 📱 **Responsive Layout** — Adapts to desktop-first 12-column grid with sticky sidebar AI panel.

---

## Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                        Browser (Next.js)                       │
│                                                               │
│  ┌───────────────────────┐    ┌──────────────────────────┐   │
│  │    InteractionForm     │    │        AIChat (Aura)      │   │
│  │  (Redux-connected)    │◄───│  POST /chat → Backend     │   │
│  │                       │    │  Dispatches updateForm    │   │
│  └───────────────────────┘    └──────────────────────────┘   │
│              ▲                                                 │
│              │ Redux Store (interactionSlice)                  │
└──────────────┼────────────────────────────────────────────────┘
               │
      ┌────────▼────────┐
      │  Python Backend  │  ← http://localhost:8000
      │  (FastAPI / AI   │
      │   Agent)         │
      │  POST /chat      │
      │  returns:        │
      │  - response (str)│
      │  - updated_form  │
      └──────────────────┘
```

The frontend sends the user's message **plus the current form state** to the backend. The backend AI agent decides which fields to update, returning both a natural language response and a partial form data object. The frontend Redux store is then patched with those updates.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| State Management | Redux Toolkit + React-Redux |
| Animations | Framer Motion |
| Icons | Lucide React |
| HTTP Client | Axios |
| Testing | Jest + React Testing Library |
| Backend (required) | Python (FastAPI recommended) at `localhost:8000` |

---

## Project Structure

```
hcp-log-ai/
├── app/
│   ├── globals.css          # Global styles and Tailwind base
│   ├── layout.tsx           # Root layout (html, body)
│   └── page.tsx             # Main page: sidebar + header + InteractionForm + AIChat
│
├── components/
│   └── interaction/
│       ├── InteractionForm.tsx  # Structured HCP interaction form (Redux-connected)
│       └── AIChat.tsx           # Aura AI chat panel (talks to backend)
│
├── store/
│   ├── store.ts             # Redux store configuration
│   └── interactionSlice.ts  # Interaction form state, actions, reducers
│
├── public/                  # Static assets
├── jest.config.js           # Jest test configuration
├── jest.setup.js            # Testing library setup
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── eslint.config.mjs        # ESLint rules
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A running **Python backend** at `http://localhost:8000` (see [Backend Requirements](#backend-requirements))

### Frontend Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd hcp-log-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Requirements

The AI Chat panel (`AIChat.tsx`) makes POST requests to:

```
POST http://localhost:8000/chat
```

**Request body:**
```json
{
  "message": "I just met Dr. Patel about CardioMax",
  "session_id": "default-session",
  "current_form_data": {
    "hcp_name": "",
    "interaction_type": "Meeting",
    "date": "",
    "time": "",
    "attendees": "",
    "topics_discussed": "",
    "materials_shared": "",
    "samples_distributed": "",
    "sentiment": "Neutral",
    "outcomes": "",
    "follow_up_actions": ""
  }
}
```

**Expected response:**
```json
{
  "response": "Got it! I've logged your meeting with Dr. Patel discussing CardioMax.",
  "updated_form_data": {
    "hcp_name": "Dr. Patel",
    "topics_discussed": "CardioMax",
    "sentiment": "Positive"
  }
}
```

> **Note:** If `updated_form_data` is empty or `{}`, no form fields are changed. Only returned keys are patched; all other fields are preserved.

You can implement the backend using FastAPI + any LLM (OpenAI, Gemini, etc.) with a tool-calling agent. The frontend works without a backend — Aura will display a connection error message instead of crashing.

---

## Usage

### Logging an Interaction Manually

Fill out the form sections directly:

| Section | Fields |
|---|---|
| **Primary Contact** | HCP Name, Interaction Type |
| **Timing & Logistics** | Date, Time, Attendees |
| **The Conversation** | Topics Discussed, Materials Shared, Samples |
| **Outcome & Sentiment** | Sentiment toggle, Key Outcomes, Next Steps |

### Using Aura (AI Assistant)

Type natural language into the Aura chat panel on the right:

- _"Met Dr. Kim at 3pm today, she was very receptive to our new oncology line."_
- _"Search for Dr. Patel's last interaction."_
- _"Update the follow-up to: send clinical trial data by Friday."_

The AI will respond conversationally and patch the relevant form fields automatically. A green **"Synced at HH:MM:SS"** badge briefly appears on the form when fields are updated.

---

## State Management

All interaction form state lives in a single Redux slice:

**`store/interactionSlice.ts`** — `InteractionFormState`:

| Field | Type | Default |
|---|---|---|
| `hcp_name` | `string` | `''` |
| `interaction_type` | `string` | `'Meeting'` |
| `date` | `string` | `''` |
| `time` | `string` | `''` |
| `attendees` | `string` | `''` |
| `topics_discussed` | `string` | `''` |
| `materials_shared` | `string` | `''` |
| `samples_distributed` | `string` | `''` |
| `sentiment` | `'Positive' \| 'Neutral' \| 'Negative'` | `'Neutral'` |
| `outcomes` | `string` | `''` |
| `follow_up_actions` | `string` | `''` |

**Available actions:**

| Action | Description |
|---|---|
| `updateField({ field, value })` | Update a single field (used by the form inputs) |
| `updateForm(partialState)` | Batch-update multiple fields (used by Aura AI) |
| `resetForm()` | Reset entire form to defaults |

---

## Component Reference

### `InteractionForm`

Located at `components/interaction/InteractionForm.tsx`.

- Reads form state from Redux via `useSelector`.
- Dispatches `updateField` on every input change.
- Shows an animated **"Synced"** badge via `useEffect` when Redux state changes.
- Sections: Primary Contact → Timing & Logistics → The Conversation → Outcome & Sentiment.

### `AIChat`

Located at `components/interaction/AIChat.tsx`.

- Maintains local message history (`useState`).
- Sends `POST /chat` with the full current form data on every user message.
- Dispatches `updateForm` with the AI's `updated_form_data` response.
- Renders messages with Framer Motion entrance animations.
- Shows a pulsing "Aura is analyzing..." indicator while the request is in flight.
- Chat can be fully reset via the reset button in the header.

---

## Running Tests

```bash
npm test
```

Uses **Jest** with **jsdom** and **React Testing Library**. Test files should be co-located with components as `*.test.tsx` or placed in a `__tests__/` directory.

To run tests in watch mode:

```bash
npm test -- --watch
```

---

## Environment Variables

Currently the backend URL is hardcoded to `http://localhost:8000`. To make it configurable, create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Then update `AIChat.tsx` to use:
```ts
const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { ... });
```

---

## Deployment

### Vercel (Recommended for Frontend)

```bash
npm run build
```

Deploy the built output via the [Vercel Platform](https://vercel.com/new). Set `NEXT_PUBLIC_API_URL` as an environment variable pointing to your deployed backend.

### Production Build Locally

```bash
npm run build
npm start
```

> The backend must be separately deployed and accessible at the configured API URL.
