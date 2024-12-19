import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import MarkdownIt from 'markdown-it';
import { maybeShowApiKeyBanner } from './gemini-api-banner';
import './style.css';

// Replace with your actual API key
let API_KEY = 'AIzaSyAcBuhZc1E1vo54RuqP_EZKBPd4tv8N_rE'; // Replace with your key

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');
const fileInput = document.getElementById('fileInput'); //Get the file input

form.onsubmit = async (ev) => {
    ev.preventDefault();
    output.textContent = 'Generating...';

    try {
        const file = fileInput.files[0];

        if (!file) { // Check if a file was selected
            output.textContent = "Please select an image.";
            return; // Stop execution if no file
        }

        const imageBase64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file); // Read after setting event handlers
        });

        let contents = [
            {
                role: 'user',
                parts: [
                    { inline_data: { mime_type: file.type, data: imageBase64 } }, // Get mimetype from the file
                    { text: promptInput.value }
                ]
            }
        ];

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                },
            ],
        });

        const result = await model.generateContentStream({ contents });

        let buffer = [];
        let md = new MarkdownIt();
        for await (let response of result.stream) {
            buffer.push(response.text());
            output.innerHTML = md.render(buffer.join(''));
        }
    } catch (e) {
        output.innerHTML = `<div style="color: red;">Error: ${e.message}</div>`; // Display error message
        console.error("Error:", e); // Log the error to the console for debugging
    }
};

maybeShowApiKeyBanner(API_KEY);