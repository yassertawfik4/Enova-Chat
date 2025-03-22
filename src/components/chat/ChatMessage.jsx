import React, { useEffect, useState, useRef } from "react";
import modelImage from "/public/images/image.png";
import { IoMdCloseCircleOutline } from "react-icons/io";

const ChatMessage = ({ message, isUser, isStreaming, onStopStream }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textToTypeRef = useRef("");
  const charIndexRef = useRef(0);
  const typingSpeedRef = useRef(20); // milliseconds per character

  // Typing animation effect
  useEffect(() => {
    if (isUser) {
      // For user messages, display immediately
      setDisplayedText(message);
      return;
    }

    // For AI messages
    if (message !== textToTypeRef.current) {
      // If new content has been received
      const newTextToType = message.substring(displayedText.length);
      textToTypeRef.current = message;
      
      if (!isTyping && newTextToType) {
        // Start typing animation if not already typing
        setIsTyping(true);
        charIndexRef.current = displayedText.length;
        typeNextChar();
      }
    }
  }, [message, isUser, displayedText, isTyping]);

  // Function to type one character at a time
  const typeNextChar = () => {
    if (charIndexRef.current < textToTypeRef.current.length) {
      setDisplayedText(textToTypeRef.current.substring(0, charIndexRef.current + 1));
      charIndexRef.current++;
      
      // Schedule the next character
      setTimeout(typeNextChar, typingSpeedRef.current);
    } else {
      // Done typing
      setIsTyping(false);
    }
  };

  const TypingIndicator = () => (
    <div className="flex h-full items-center space-x-1">
      <div className="bg-gray-400 h-2 rounded-full w-2 animate-bounce"></div>
      <div className="bg-gray-400 h-2 rounded-full w-2 animate-bounce delay-100"></div>
      <div className="bg-gray-400 h-2 rounded-full w-2 animate-bounce delay-200"></div>
    </div>
  );

  return (
    <div
      className={`flex my-4 w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-3/4 py-2 px-8 cursor-pointer rounded-[30px] hover:bg-[#d5dbe6] ${
          isUser ? "bg-[#132546] text-white" : "bg-white"
        } relative`}
      >
        {/* For non-user messages, show either typing indicator or animated message */}
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
              {/* Show typing indicator when there's no content yet and is streaming */}
              {isStreaming && !message ? (
                <TypingIndicator />
              ) : (
                /* Otherwise show the animated text */
                <span>{displayedText}</span>
              )}

              {/* Only show typing cursor at the end when actively typing */}
              {(isTyping || isStreaming) && displayedText && (
                <span className="inline-block w-2 h-4 bg-gray-600 ml-1 animate-pulse"></span>
              )}

              {/* Stop button for streaming */}
              {isStreaming && onStopStream && (
                <button
                  onClick={onStopStream}
                  className="flex bg-red-500 justify-center p-1 rounded-full text-white hover:bg-red-600 items-center ml-3 transition-colors"
                  title="Stop generating"
                >
                  <IoMdCloseCircleOutline size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* For user messages, always show the full message immediately */}
        {isUser && <div>{message}</div>}
      </div>
    </div>
  );
};

export default ChatMessage;