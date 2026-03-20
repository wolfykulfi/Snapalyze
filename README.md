# Snapalyze — AI Image Analysis

> Upload any image. Ask anything. Get instant AI-powered insights — for free.

Snapalyze uses **Llama 4 Scout** via **Groq** to analyse images at blazing speed with no cost. Simply upload an image, give it instructions, and get rich markdown-formatted results in seconds.

---

## Features

- **Vision AI** — Powered by Meta's Llama 4 Scout model via Groq's ultra-fast inference
- **Streaming responses** — Results appear word-by-word in real time
- **Drag & drop upload** — Drop images directly onto the upload zone
- **Prompt suggestions** — One-click chips for common analysis tasks
- **Markdown output** — Responses rendered with full markdown support
- **Copy to clipboard** — Copy results with one click
- **Local API key storage** — Key saved in browser localStorage, never sent anywhere else
- **Fully responsive** — Works on desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build tool | [Vite](https://vitejs.dev/) |
| AI inference | [Groq](https://groq.com/) |
| Vision model | Llama 4 Scout (`meta-llama/llama-4-scout-17b-16e-instruct`) |
| Markdown | [markdown-it](https://github.com/markdown-it/markdown-it) |
| Icons | [Font Awesome 6](https://fontawesome.com/) |
| Font | [Inter](https://fonts.google.com/specimen/Inter) |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/wolfykulfi/Snapalyze.git
cd Snapalyze
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get a free Groq API key

Sign up at [console.groq.com](https://console.groq.com/keys) — it's free, no credit card required.

### 4. Add your API key

Create a `.env` file in the root:

```env
VITE_GROQ_API_KEY=gsk_your_key_here
```

Or just enter it directly in the app when prompted — it'll be saved to your browser.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Usage

1. Drag & drop an image onto the upload zone, or click to browse
2. Type your instructions — or click a suggestion chip
3. Hit **Analyze Image** (or press `Ctrl + Enter`)
4. Watch the AI response stream in real time
5. Copy the result with the copy button

### Example prompts

- *Describe everything you see in this image in detail*
- *Identify and list all objects*
- *What emotions or mood does this image convey?*
- *Extract any visible text*
- *Analyze the colors, composition, and visual style*

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build locally
```

---

## Privacy

Images are converted to base64 in your browser and sent directly to Groq's API for inference. They are **not stored** on any server. Your API key is kept only in your browser's `localStorage`.

---

## License

MIT
