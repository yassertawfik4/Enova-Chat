const ChatMessage = ({ message, isUser }) => {
  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } my-2`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;