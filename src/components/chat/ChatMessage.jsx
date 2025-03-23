import React, { useEffect, useState } from "react";
import modelImage from "/public/images/image.png";
import { IoMdCloseCircleOutline } from "react-icons/io";

const TypingIndicator = () => (
  <div className="flex h-full items-center space-x-1">
    <div className="bg-gray-400 h-2 rounded-full w-2 animate-bounce"></div>
    <div className="bg-gray-400 h-2 rounded-full w-2 animate-bounce delay-100"></div>
    <div className="bg-gray-400 h-2 rounded-full w-2 animate-bounce delay-200"></div>
  </div>
);

const ChatMessage = ({ message, isUser, isStreaming }) => {
  // الاحتفاظ فقط بمتغير واحد للنص المعروض
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // التعامل مع رسائل المستخدم - عرضها مباشرة
    if (isUser) {
      setDisplayedText(message);
      return;
    }

    // التعامل مع رسائل الذكاء الاصطناعي - عرضها مباشرة أيضًا
    setDisplayedText(message || "");
    
  }, [message, isUser, isStreaming]);

  return (
    <div
      className={`flex my-4 w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-3/4 py-2 px-8 cursor-pointer rounded-[30px] hover:bg-[#d5dbe6] transition-colors duration-200 ${
          isUser ? "bg-[#132546] text-white" : "bg-white"
        } relative`}
      >
        {!isUser && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 h-10 rounded-full w-10 overflow-hidden">
              <img
                src={modelImage}
                alt="AI Model"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 items-center min-h-10">
              {isStreaming && !message ? (
                <TypingIndicator />
              ) : (
                <span>{displayedText}</span>
              )}
            </div>
          </div>
        )}

        {isUser && <div>{message}</div>}
      </div>
    </div>
  );
};

export default ChatMessage;