import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import MarkdownIt from 'markdown-it';
import { maybeShowApiKeyBanner } from './gemini-api-banner';
import './style.css';

// Replace with your actual API key
let API_KEY = 'AIzaSyAcBuhZc1E1vo54RuqP_EZKBPd4tv8N_rE'; // Replace with your key

// DOM Elements
const form = document.querySelector('#analysisForm');
const promptInput = document.querySelector('#promptInput');
const output = document.querySelector('.output');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const fileName = document.getElementById('fileName');
const loadingIndicator = document.getElementById('loadingIndicator');
const copyBtn = document.getElementById('copyBtn');
const suggestionChips = document.querySelectorAll('.suggestion-chip');
const aboutLink = document.getElementById('aboutLink');
const aboutModal = document.getElementById('aboutModal');
const closeButton = document.querySelector('.close-button');
const analyzeBtn = document.getElementById('analyzeBtn');

// Initialize markdown parser
const md = new MarkdownIt({
  linkify: true,
  typographer: true,
  breaks: true,
  html: true
});

// File input change handler
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            fileName.textContent = file.name;
        }

        reader.readAsDataURL(file);
    } else {
        imagePreview.src = "#";
        imagePreview.style.display = "none";
        fileName.textContent = "";
    }
});

// Suggestion chips click handler
suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
        promptInput.value = chip.getAttribute('data-prompt');
        promptInput.focus();
    });
});

// Copy button click handler
copyBtn.addEventListener('click', () => {
    const textToCopy = output.textContent;
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            // Show temporary success message
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
});

// Modal handlers
aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    aboutModal.style.display = 'flex';
});

closeButton.addEventListener('click', () => {
    aboutModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
        aboutModal.style.display = 'none';
    }
});

// Form submission handler
form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    
    // Validate inputs
    const file = fileInput.files[0];
    if (!file) {
        showError("Please select an image to analyze.");
        return;
    }
    
    // Show loading state
    showLoading(true);
    output.textContent = '';
    analyzeBtn.disabled = true;
    
    try {
        const imageBase64 = await readFileAsBase64(file);
        const prompt = promptInput.value.trim() || "Describe this image in detail";

        // Prepare request for Gemini API
        let contents = [
            {
                role: 'user',
                parts: [
                    { inline_data: { mime_type: file.type, data: imageBase64 } },
                    { text: prompt }
                ]
            }
        ];

        // Initialize Gemini API
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                },
            ],
        });

        // Generate content with streaming response
        const result = await model.generateContentStream({ contents });

        let buffer = [];
        for await (let response of result.stream) {
            buffer.push(response.text());
            output.innerHTML = md.render(buffer.join(''));
        }
    } catch (e) {
        showError(`Error: ${e.message}`);
        console.error("Error:", e);
    } finally {
        showLoading(false);
        analyzeBtn.disabled = false;
    }
});

// Helper functions
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function showError(message) {
    output.innerHTML = `<div style="color: var(--danger-color); padding: 10px; border-left: 4px solid var(--danger-color);">
        <i class="fas fa-exclamation-circle"></i> ${message}
    </div>`;
}

function showLoading(isLoading) {
    loadingIndicator.style.display = isLoading ? 'flex' : 'none';
}

// Check API key on load
maybeShowApiKeyBanner(API_KEY);

// Add keyboard shortcut for form submission (Ctrl+Enter)
promptInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        form.dispatchEvent(new Event('submit'));
    }
});