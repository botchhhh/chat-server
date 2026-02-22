import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    inputRef.current.value = "";

    // Add user's message
    setChatHistory((history) => {
      const updatedHistory = [...history, { role: "user", text: userMessage }];

      // Simulate thinking message
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev.filter((msg) => msg.text !== "thinking...."),
          { role: "model", text: "thinking...." },
        ]);

        // Generate bot response with latest updated history
        generateBotResponse(updatedHistory);
      }, 300); // slightly faster response simulation

      return updatedHistory;
    });
  };

  return (
    <form className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message...."
        className="message-input"
        required
      />
      <button type="submit" className="material-symbols-outlined">
        keyboard_arrow_up
      </button>
    </form>
  );
};

export default ChatForm;