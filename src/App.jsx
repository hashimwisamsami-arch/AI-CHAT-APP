import { useState, useEffect, useRef } from "react";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [aiReady, setAiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const cheackReady = setInterval(() => {
      if (
        window.puter &&
        window.puter.ai &&
        typeof window.puter.chat === "function"
      ) {
        setAiReady(true);
        clearInterval(cheackReady);
      }
    }, 300);
    return () => clearInterval(cheackReady);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  const addMessages = (msg, isUser) => {
    setMessages((prev) => [
      ...prev,
      { content: msg, isUser, id: Date.now() + Math.random() },
    ]);
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message) return;
    if (!aiReady) {
      addMessages("⏳ AI service is still loading. Please wait...", false);
      return;
    }
    addMessages(message, true);
    setInputValue("");
    setIsLoading(true);
    try {
      const response = await window.puter.ai.chat(message);
      const replay =
        typeof response === "string"
          ? response
          : response.message?.content || "🤖 No replay received";
      addMessages(replay, false);
    } catch (error) {
      addMessages(
        `❌ Error:${error.message || "something went wrong."}`,
        false,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handelKeyPress = (e) => {
    if (e.key === "Enter" || !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-sky-900 via-slate-950 to-emerald-900 flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-6xl sm:text-7xl font-light bg-linear-to-r from-emerald-400 via-sky-300 to-blue-500 bg-clip-text text-transparent text-center h-20">
        AI Chat App
      </h1>
    </div>
  );
};

export default App;
