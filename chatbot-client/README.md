This project focuses on:
Compact message rendering
Proper Markdown handling
Clean UI with Tailwind CSS
A sane developer experience (rare, I know)

✨ Features
💬 Real-time chat UI
🤖 Bot and user message separation
📝 Markdown rendering using react-markdown
🧼 Collapsed extra blank lines from bot responses
🎨 Styled Markdown elements using Tailwind
⌨️ Auto-growing textarea
🔄 Auto-scroll to latest message
⚠️ Graceful error handling when backend misbehaves

🛠 Tech Stack

React
Tailwind CSS
react-markdown (v8+)
Fetch API
Vite

📦 Installation
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
npm run dev

🔌 Backend Requirement

This frontend expects a backend endpoint:

POST /chat

Request body:
{
  "message": "User message",
  "session_id": "uuid"
}

Response:
{
  "response": "Markdown formatted bot response"
}

🧩 Markdown Rendering Notes (Important)
Uses react-markdown v8+
No className passed directly to <ReactMarkdown> (it will crash, loudly)
Styling is applied via the components prop
Extra blank lines are collapsed before rendering to avoid spaced-out lists
This keeps Markdown readable without turning your UI into a poem written with the Enter key held down.

📁 Project Structure (Relevant Parts)
src/
 ├─ Chat.jsx
 ├─ App.jsx
 ├─ main.jsx
 └─ index.css