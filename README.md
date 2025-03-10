# Snapalyze - AI Image Analysis Tool

Snapalyze is a web application that uses Google's Gemini AI to analyze and provide detailed descriptions of images. Simply upload an image, provide instructions for analysis, and get AI-generated insights about your image.



## Features

- **Image Analysis**: Upload any image and get AI-powered analysis and descriptions
- **Custom Instructions**: Specify exactly what you want to know about the image
- **Quick Suggestions**: Use pre-defined prompt suggestions for common analysis tasks
- **Markdown Support**: Results are rendered with full markdown support for rich formatting
- **Copy to Clipboard**: Easily copy analysis results with one click
- **Responsive Design**: Works on desktop and mobile devices
- **User-Friendly Interface**: Modern, intuitive UI with real-time feedback

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- A Google Gemini API key (get one at [Google AI Studio](https://ai.google.dev/))

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/snapalyze.git
   cd snapalyze
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Add your Gemini API key:
   Open `main.js` and replace the placeholder API key with your own:
   ```javascript
   let API_KEY = 'YOUR_API_KEY_HERE';
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to the URL shown in your terminal (typically http://localhost:5173)

## Usage

1. Click the upload area or drag and drop an image file
2. Enter instructions for how you want the image analyzed (or use a suggestion chip)
3. Click "Analyze Image" and wait for the results
4. View the detailed analysis provided by the AI
5. Use the copy button to copy the results to your clipboard

## Example Prompts

- "Describe everything you see in this image"
- "Identify all objects in this image"
- "What's unusual or interesting about this image?"
- "Analyze the composition and visual elements of this photograph"
- "What emotions does this image convey?"
- "Identify any text visible in this image"
- "Describe the setting and time period of this image"

## Technologies Used

- [Vite](https://vitejs.dev/) - Frontend build tool
- [Google Gemini API](https://ai.google.dev/) - AI image analysis
- [Markdown-it](https://github.com/markdown-it/markdown-it) - Markdown rendering
- [Font Awesome](https://fontawesome.com/) - Icons


## Acknowledgments

- Google Gemini API for providing the AI capabilities
- The open-source community for the amazing tools and libraries

## Privacy Notice

Snapalyze processes images client-side and sends them to Google's Gemini API for analysis. Images are not stored permanently on any server. Please review Google's privacy policy for information on how they handle data sent to their API.
