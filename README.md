# PaperMind AI - Research Paper Chatbot

An intelligent research paper chatbot powered by Google Gemini AI. Ask questions about research papers (PDFs, text files, or markdown) and get precise, context-aware answers directly from the document.

## Features

- 📄 **Multi-format Support**: Upload PDFs, TXT, or Markdown files
- 🤖 **AI-Powered Analysis**: Uses Google Gemini API for intelligent responses
- 💬 **Interactive Chat Interface**: Clean, intuitive chat UI for asking questions
- 📚 **Smart Context Management**: Maintains document context throughout the conversation
- ⚡ **Real-time Processing**: Get instant answers based on your research paper
- 🎯 **Suggested Questions**: Dynamic suggestions based on the loaded paper

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Python (HTTP server) or Node.js
- **AI**: Google Gemini API
- **Libraries**: 
  - PDF.js (PDF parsing)
  - Marked.js (Markdown parsing)
  - Lucide Icons (UI icons)

## Getting Started

### Prerequisites

- Python 3.7+ or Node.js 14+
- Google Gemini API key (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/research-chatbot.git
cd research-chatbot
```

2. Install dependencies (if using Node.js):
```bash
npm install
```

### Running the Application

#### Using Python (Recommended):
```bash
python3 server.py
```

#### Using Node.js:
```bash
npm start
```

The application will start at `http://localhost:3000`

### Usage

1. Open the application in your browser
2. Enter your Google Gemini API key in the sidebar
3. Upload a research paper (PDF, TXT, or MD) or load the demo paper
4. Start asking questions about the paper!

## File Structure

```
.
├── index.html              # Main HTML interface
├── app.js                  # Frontend logic & chat handling
├── styles.css              # UI styling
├── server.py               # Python backend server
├── server.js               # Node.js backend server (alternative)
├── package.json            # Node.js dependencies
├── neuro_symbolic_landing.md  # Demo research paper
└── README.md              # This file
```

## API Endpoints

- `GET /` - Serves the main application
- `GET /api/health` - Health check endpoint
- `POST /api/chat` - Chat endpoint for processing questions

## Configuration

The server runs on port 3000 by default. To use a different port:

```bash
# Python
PORT=5000 python3 server.py

# Node.js
PORT=5000 npm start
```

## Security Notes

- Your Gemini API key is processed client-side and never stored
- Documents are kept in memory during the session
- For production deployment, consider using HTTPS and additional security measures

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues, please check:
1. Your Gemini API key is valid
2. The server is running on the correct port
3. Your browser supports ES6+ JavaScript features

---
## 🎥 Project Demo

https://github.com/user-attachments/assets/027fc8c0-64c8-4cfb-91f4-a6097f9e7df0

Built with ❤️ for researchers and students
