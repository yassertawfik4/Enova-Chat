import React, { useEffect, useState } from "react";
import modelImage from "/public/images/image.png";

const ChatMessage = ({ message, isUser, isStreaming }) => {
  const TypingIndicator = () => (
    <div className="flex h-full items-center space-x-1">
      <div className="bg-gray-400 h-2 rounded-full w-2 animate-bounce"></div>
      <div className="bg-gray-400 h-2 rounded-full w-2 animate-bounce delay-100"></div>
      <div className="bg-gray-400 h-2 rounded-full w-2 animate-bounce delay-200"></div>
    </div>
  );

  return (
    <div className={`flex my-4  ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-3/4 rounded-lg px-4 py-2 ${
          isUser ? "bg-[#132546] text-white" : "bg-white"
        }`}
      >
        {/* For non-user messages, show either typing indicator or message */}
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
              {/* Always show typing indicator when streaming but no content yet */}
              {isStreaming && !message ? (
                <TypingIndicator />
              ) : (
                /* Otherwise show the message text */
                <span className="">{message}</span>
              )}

              {/* Show blinking cursor ONLY when actively streaming and not when complete */}
            </div>
          </div>
        )}

        {/* For user messages, always show the message */}
        {isUser && <div>{message}</div>}
      </div>
    </div>
  );
};

export default ChatMessage;
