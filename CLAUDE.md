# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (Vite, typically at http://localhost:5173)
npm run build      # Production build
npm run preview    # Preview production build
```

No test suite is configured.

## API Key Setup

The Gemini API key is read from `VITE_API_KEY` environment variable or from `localStorage` (key: `gemini_api_key`). To set it via env, create a `.env` file:

```
VITE_API_KEY=your_key_here
```

If no key is found at startup, the app shows an in-page input to enter and save the key to `localStorage`.

## Architecture

This is a single-page vanilla JS app bundled with Vite. There is no framework — all logic lives in three files:

- **`main.js`** — All application logic: DOM wiring, file reading, Gemini API calls (streaming via `generateContentStream`), markdown rendering, API key management, and UI state.
- **`style.css`** — All styles.
- **`index.html`** — Shell with form, results area, and modal markup. Loads `main.js` as an ES module.
- **`gemini-api-banner.js`** — Small helper that injects a banner prompting the user to get an API key when none is set.

### Key data flow

1. User selects an image → `FileReader` reads it as base64 (`readFileAsBase64`)
2. On form submit → image base64 + prompt text sent to `gemini-1.5-flash` via `@google/generative-ai` SDK
3. Streaming response chunks accumulate in a buffer → rendered incrementally as HTML via `markdown-it`

The Gemini model used is `gemini-1.5-flash` with `BLOCK_ONLY_HIGH` safety thresholds across all harm categories.
