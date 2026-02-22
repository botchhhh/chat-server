import { useState, useRef, useEffect } from "react";
import ChatForm from "./ChatForm";
import AiChatBotIcon from "./components/AiChatBotIcon";
import ChatMessage from "./components/ChatMessage";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const chatBodyRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  const generateBotResponse = async (history) => {
    if (!history?.length) return;

    try {
      const lastMessage = history[history.length - 1].text;

      // Add "thinking..." message (replace existing one if any)
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "thinking..."),
        { role: "model", text: "thinking..." },
      ]);

      // Send message to backend (uses proxy if set in package.json)
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: lastMessage }),
      });

      const data = await response.json();

      // Replace "thinking..." with actual reply
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        { role: "model", text: data.reply },
      ]);
    } catch (error) {
      console.error(error);

      // Replace "thinking..." with error message
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        { role: "model", text: "Error generating response" },
      ]);
    }
  };

  return (
    <div className="container">
      <div className="aichat-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <AiChatBotIcon />
            <h2 className="logo-text">Aichat</h2>
          </div>
          <button className="material-symbols-outlined">keyboard_arrow_down</button>
        </div>

        {/* Chatbot Body */}
        <div className="chat-body" ref={chatBodyRef}>
          {/* Default bot greeting */}
          {chatHistory.length === 0 && (
            <div className="message bot-message">
              <AiChatBotIcon />
              <p className="message-text">
                Hey there! <br /> How can I help you today?
              </p>
            </div>
          )}

          {/* Render chat messages */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Chat input */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default App;