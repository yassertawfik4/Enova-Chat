import { memo } from "react";
import ReactMarkdown from "react-markdown";
import modelImage from "/public/images/image.png";

// مؤشر الكتابة (محسن بالذاكرة)
const TypingIndicator = memo(() => (
  <div className="flex h-full items-center space-x-1 py-2">
    <div className="bg-gray-400 h-2 rounded-full w-2 animate-bounce"></div>
    <div className="bg-gray-400 h-2 rounded-full w-2 animate-bounce delay-100"></div>
    <div className="bg-gray-400 h-2 rounded-full w-2 animate-bounce delay-200"></div>
  </div>
));

// مكونات Markdown المخصصة
const getMarkdownComponents = (isUser = false) => ({
  p: ({ children }) => (
    <p
      className={`text-base leading-relaxed mb-4 last:mb-0 ${
        isUser ? "text-white" : "text-gray-800"
      }`}
    >
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className={`font-semibold ${isUser ? "text-white" : "text-gray-900"}`}>
      {children}
    </strong>
  ),
  code: ({ children }) => (
    <code
      className={`px-1.5 py-0.5 rounded text-sm font-mono ${
        isUser
          ? "bg-white/20 text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre
      className={`p-3 rounded-md my-3 overflow-x-auto text-sm font-mono ${
        isUser ? "bg-white/20 text-white" : "bg-gray-100"
      }`}
    >
      {children}
    </pre>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className={`underline transition-colors ${
        isUser
          ? "text-blue-200 hover:text-white"
          : "text-blue-600 hover:text-blue-800"
      }`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="mb-1">{children}</li>,
  h1: ({ children }) => (
    <h1 className={`text-2xl font-bold mb-3 mt-4 ${isUser ? "text-white" : ""}`}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className={`text-xl font-bold mb-2 mt-4 ${isUser ? "text-white" : ""}`}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className={`text-lg font-bold mb-2 mt-3 ${isUser ? "text-white" : ""}`}>
      {children}
    </h3>
  ),
  blockquote: ({ children }) => (
    <blockquote
      className={`border-l-4 pl-4 py-1 italic my-3 ${
        isUser
          ? "border-white/40 text-white/80"
          : "border-gray-300 text-gray-700"
      }`}
    >
      {children}
    </blockquote>
  ),
});

// مكون الرسالة
const ChatMessage = ({ message, isUser, isStreaming }) => {
  return (
    <div className="w-full py-2">
      <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-2xl rounded-2xl transition-all duration-200 ${
            isUser
              ? "bg-[#132546] text-white rounded-tr-sm"
              : "bg-white rounded-tl-sm  border-gray-100"
          }`}
        >
          {!isUser ? (
            <div className="flex p-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden mr-3 mt-1 border border-gray-200">
                <img
                  src={modelImage}
                  alt="AI Model"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                { !message ? (
                  <TypingIndicator />
                ) : (
                  <ReactMarkdown key={message} components={getMarkdownComponents(false)}>
                    {message || ""}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3">
              <ReactMarkdown key={message} components={getMarkdownComponents(true)}>
                {message || ""}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;