import { useState } from "react";
import ChatInput from "../../components/chat/ChatInput";
import ChatMessage from "../../components/chat/ChatMessage";
import ChatSideBar from "../../components/SideBar/chatSideBar/ChatSideBar";
// استيراد مكون Navbar الخاص بك

function ChatPage() {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (message) => {
    setMessages([...messages, { text: message, isUser: true }]);
    console.log("Message sent:", message);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* إضافة Navbar هنا */}

      <div className="flex flex-1 overflow-hidden">
        {/*"Chat Side Bar "*/}
        <ChatSideBar />
        <div className="w-full flex flex-col justify-between items-center p-4">
          {/* منطقة عرض الرسائل */}
          <div
            className={`flex-1 w-full overflow-y-auto mb-4 ${
              messages.length === 0 ? "flex justify-center items-center" : ""
            }`}
          >
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg.text}
                  isUser={msg.isUser}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">No messages yet.</p>
            )}
          </div>

          {/* منطقة الإدخال مع العنوان */}
          <div
            className={`flex flex-col items-center ${
              messages.length === 0
                ? "fixed top-1/2 transform -translate-y-1/2"
                : ""
            }`}
          >
            {messages.length === 0 && (
              <h2 className="text-3xl font-medium mb-4">
                What can I help with?
              </h2>
            )}

            <div className="p-4 bg-[#F4F6FF] rounded-[50px] shadow-sm w-[750px] h-[120px] flex justify-center items-center gap-2">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
