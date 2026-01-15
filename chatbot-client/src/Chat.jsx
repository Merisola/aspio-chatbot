import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: `You can ask things like:
- How does Aspio work and what problems does it solve?
- What makes Aspio unique compared to other business platforms?
- What does booking mean in Aspio’s system?
- In what ways can Aspio improve efficiency and customer experience for my business?
- What business benefits come from using Aspio’s booking feature?
- What common questions do businesses have when starting with Aspio?`,
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sessionId = useRef(crypto.randomUUID());
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/chat", {
        message: userMessage.text,
        session_id: sessionId.current,
      });

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: res.data.response },
      ]);
    } catch (err) {
      console.error(err);
      setError("Bot is having a hard time right now.");
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Oops! Backend is offline or feeling moody." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-4 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-2 flex flex-col max-h-[375px]">
          {messages.map((msg, index) =>
            msg.role === "bot" ? (
              <div
                key={index}
                className="self-start bg-gray-200 text-gray-800 px-3 py-2 rounded-lg max-w-[70%] break-words"
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="m-0 leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside m-0">{children}</ul>
                    ),
                    li: ({ children }) => <li className="m-0">{children}</li>,
                  }}
                >
                  {typeof msg.text === "string"
                    ? msg.text.replace(/\n{2,}/g, "\n").trim()
                    : ""}
                </ReactMarkdown>
              </div>
            ) : (
              <div
                key={index}
                className="self-end bg-blue-500 text-white px-3 py-2 rounded-lg max-w-[70%] break-words"
              >
                {msg.text}
              </div>
            )
          )}

          {isLoading && (
            <div className="self-start bg-gray-200 text-gray-500 px-3 py-2 rounded-lg w-fit">
              Bot is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            placeholder="Type a message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 border rounded-lg px-3 py-2 resize-none overflow-auto max-h-32"
            style={{ height: "2.5rem" }}
          />
          <button
            type="button"
            onClick={sendMessage}
            className={`bg-blue-600 text-white px-4 rounded-lg h-10 flex-shrink-0 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            Send
          </button>
        </div>

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

        {/* Debug session ID */}
        <p className="text-xs text-gray-400 mt-2">
          Session ID: {sessionId.current}
        </p>
      </div>
    </div>
  );
}
