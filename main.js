import Groq from 'groq-sdk';
import MarkdownIt from 'markdown-it';
import './style.css';

// ─── API Key ──────────────────────────────────────────────────
let API_KEY = import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('groq_api_key');

// ─── DOM ──────────────────────────────────────────────────────
const form            = document.getElementById('analysisForm');
const promptInput     = document.getElementById('promptInput');
const output          = document.getElementById('output');
const fileInput       = document.getElementById('fileInput');
const imagePreview    = document.getElementById('imagePreview');
const previewContainer= document.getElementById('previewContainer');
const fileBadge       = document.getElementById('fileBadge');
const fileName        = document.getElementById('fileName');
const fileClear       = document.getElementById('fileClear');
const uploadZone      = document.getElementById('uploadZone');
const loadingIndicator= document.getElementById('loadingIndicator');
const copyBtn         = document.getElementById('copyBtn');
const analyzeBtn      = document.getElementById('analyzeBtn');
const apiKeyContainer = document.getElementById('apiKeyContainer');
const apiKeyInput     = document.getElementById('apiKeyInput');
const saveApiKeyBtn   = document.getElementById('saveApiKeyBtn');
const aboutLink       = document.getElementById('aboutLink');
const aboutModal      = document.getElementById('aboutModal');
const closeAbout      = document.getElementById('closeAbout');

const md = new MarkdownIt({ linkify: true, typographer: true, breaks: true });

// ─── Upload / Preview ─────────────────────────────────────────
uploadZone.addEventListener('dragover',  (e) => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', ()  => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
        fileInput.files = e.dataTransfer.files;
        loadPreview(file);
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    file ? loadPreview(file) : clearPreview();
});

fileClear.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.value = '';
    clearPreview();
});

function loadPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        previewContainer.querySelector('.preview-placeholder').style.display = 'none';
        fileName.textContent = file.name;
        uploadZone.classList.add('has-file');
    };
    reader.readAsDataURL(file);
}

function clearPreview() {
    imagePreview.src = '#';
    imagePreview.style.display = 'none';
    previewContainer.querySelector('.preview-placeholder').style.display = 'flex';
    fileName.textContent = '';
    uploadZone.classList.remove('has-file');
}

// ─── Suggestion Chips ─────────────────────────────────────────
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        promptInput.value = chip.dataset.prompt;
        promptInput.focus();
    });
});

// ─── Copy ─────────────────────────────────────────────────────
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(output.innerText).then(() => {
        const orig = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.classList.add('copied');
        setTimeout(() => { copyBtn.innerHTML = orig; copyBtn.classList.remove('copied'); }, 2000);
    });
});

// ─── Modals ───────────────────────────────────────────────────
aboutLink.addEventListener('click', () => { aboutModal.style.display = 'flex'; });
closeAbout.addEventListener('click', () => { aboutModal.style.display = 'none'; });
window.addEventListener('click', (e) => {
    if (e.target === aboutModal) aboutModal.style.display = 'none';
    if (e.target === apiKeyContainer) apiKeyContainer.style.display = 'none';
});

// ─── Form Submit ──────────────────────────────────────────────
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) { showError('Please select an image first.'); return; }
    if (!API_KEY) { apiKeyContainer.style.display = 'flex'; return; }

    setLoading(true);
    output.innerHTML = '';

    try {
        const base64  = await readAsBase64(file);
        const prompt  = promptInput.value.trim() || 'Describe this image in detail.';

        const groq   = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });
        const stream = await groq.chat.completions.create({
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            messages: [{
                role: 'user',
                content: [
                    { type: 'image_url', image_url: { url: `data:${file.type};base64,${base64}` } },
                    { type: 'text', text: prompt },
                ],
            }],
            stream: true,
        });

        let buffer = '';
        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || '';
            if (delta) {
                buffer += delta;
                output.innerHTML = md.render(buffer);
                output.scrollTop = output.scrollHeight;
            }
        }
    } catch (err) {
        showError(err.message);
        if (err.message.includes('401') || err.message.toLowerCase().includes('api key')) {
            apiKeyContainer.style.display = 'flex';
        }
    } finally {
        setLoading(false);
    }
});

// ─── Keyboard Shortcut ────────────────────────────────────────
promptInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') form.dispatchEvent(new Event('submit'));
});

// ─── API Key Save ─────────────────────────────────────────────
saveApiKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
        localStorage.setItem('groq_api_key', key);
        API_KEY = key;
        apiKeyContainer.style.display = 'none';
    }
});

if (!API_KEY) apiKeyContainer.style.display = 'flex';

// ─── Helpers ──────────────────────────────────────────────────
function readAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function showError(msg) {
    output.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-circle"></i> ${msg}</div>`;
}

function setLoading(on) {
    loadingIndicator.style.display = on ? 'flex' : 'none';
    analyzeBtn.disabled = on;
    copyBtn.style.visibility = on ? 'hidden' : 'visible';
}
