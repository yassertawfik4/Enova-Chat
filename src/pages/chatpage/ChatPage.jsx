import { useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import ChatInput from "../../components/chat/ChatInput";
import ChatMessage from "../../components/chat/ChatMessage";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [connection, setConnection] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  // مرجع لآخر معرف رسالة تم استلامها
  const lastMessageIdRef = useRef("");
  // تتبع ما إذا كانت هذه أول قطعة في الرسالة
  const isFirstChunkRef = useRef(true);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTk1YTkxNC01ODc4LTdkMDQtYjE5NS1lODdlYmFlZGU3NzciLCJlbWFpbCI6Inlhc3NlcjFAbWFpbC5jb20iLCJuYW1lIjoieWFzc29yc3d4IiwianRpIjoiNTUwYjg0NGEtYTE3NC00OTZlLWIwODktMjhiNmJkMGRhZmVjIiwiYXVkIjpbIlN3YWdnZXJVSSIsIlN3YWdnZXJVSSJdLCJuYmYiOjE3NDIzNTQ3OTMsImV4cCI6MTc0Mjk1OTU5MywiaWF0IjoxNzQyMzU0NzkzLCJpc3MiOiJJbnRlcm5zaGlwLVBsYXRmb3JtIn0.jmkngrifuiQLw27YwZG9XoAsqAhuj9motxDmZyqEwh4";
  const chatId = "0e3905bc-ebc4-4061-801c-18faf42a1ebf";

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5067/chatHub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection
      .start()
      .then(() => {
        console.log("✅ Connected to SignalR Hub");
        return newConnection.invoke("JoinChatSession", chatId);
      })
      .then(() => {
        console.log("✅ Joined chat session:", chatId);
      })
      .catch((err) => console.error("❌ Connection failed: ", err));

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!connection) return;

    // تحسين معالجة قطع الرسائل المستلمة
    const handleReceiveMessageChunk = (messageId, chunk) => {
      // سجل في الكونسول معلومات عن القطعة
      console.log("📩 Received chunk:", messageId, chunk);

      // إذا كان معرف الرسالة مختلفًا عن آخر معرف تم استلامه
      // فهذا يعني أنها رسالة جديدة
      if (messageId !== lastMessageIdRef.current) {
        lastMessageIdRef.current = messageId;
        isFirstChunkRef.current = true;
      }

      // تجاهل القطعة الأولى التي قد تحتوي على رسالة المستخدم
      if (isFirstChunkRef.current) {
        isFirstChunkRef.current = false;

        // تحقق مما إذا كانت القطعة تحتوي على نص رسالة المستخدم
        // وإذا كان الأمر كذلك، قم بتخطي هذه القطعة
        const lastUserMessage = messages.findLast((msg) => msg.isUser)?.text;
        if (lastUserMessage && chunk.includes(lastUserMessage)) {
          console.log("Skipping first chunk that contains user message");
          return;
        }
      }

      // تأكد من أن محتوى القطعة صالح وليست فارغة
      const chunkContent = chunk || "";
      if (!chunkContent.trim()) {
        console.log("Skipping empty chunk");
        return;
      }

      setIsStreaming(true);

      // تحديث رسائل المحادثة بشكل أكثر كفاءة باستخدام وظيفة الحالة المحدثة
      setMessages((prev) => {
        // Find any pending message (with empty text)
        const pendingMessageIndex = prev.findIndex(
          (msg) =>
            !msg.isUser &&
            !msg.complete &&
            msg.text === "" &&
            msg.id.startsWith("ai-pending-")
        );

        // ابحث عن رسالة بنفس المعرف
        const messageIndex = prev.findIndex((msg) => msg.id === messageId);

        if (messageIndex >= 0) {
          // تحديث رسالة موجودة
          const updatedMessages = [...prev];
          updatedMessages[messageIndex].text += chunkContent;
          return updatedMessages;
        } else if (pendingMessageIndex >= 0) {
          // Replace the pending message with the actual message
          const updatedMessages = [...prev];
          updatedMessages[pendingMessageIndex] = {
            id: messageId,
            text: chunkContent,
            isUser: false,
            complete: false,
          };
          return updatedMessages;
        } else {
          // إنشاء رسالة جديدة فقط إذا كان المحتوى غير فارغ
          return [
            ...prev,
            {
              id: messageId,
              text: chunkContent,
              isUser: false,
              complete: false,
            },
          ];
        }
      });
    };

    // تحسين معالجة نهاية بث الرسالة
    const handleEndMessageStream = (messageId) => {
      console.log("🏁 Finished streaming message:", messageId);

      setMessages((prev) => {
        const updatedMessages = [...prev];
        const index = updatedMessages.findIndex((msg) => msg.id === messageId);

        if (index !== -1) {
          // وضع علامة على الرسالة كمكتملة
          updatedMessages[index].complete = true;

          // تنظيف محتمل للرسالة (إزالة النصوص المتكررة أو السطور الفارغة)
          updatedMessages[index].text = updatedMessages[index].text.trim();

          // إذا كان المحتوى فارغًا بعد التنظيف، قم بإزالة الرسالة
          if (!updatedMessages[index].text) {
            return updatedMessages.filter((_, i) => i !== index);
          }
        }

        return updatedMessages;
      });

      setIsStreaming(false);
      // إعادة تعيين مؤشر القطع الأولى للرسالة التالية
      isFirstChunkRef.current = true;
    };

    // تحسين معالجة الرسائل الكاملة
    const handleReceiveMessage = (message) => {
      console.log("📩 Received complete message:", message);

      // معالجة رسائل النموذج فقط، وليس رسائل المستخدم
      if (!message.isFromUser) {
        let messageContent = message.content || "";

        // التحقق من وجود رسالة للمستخدم وحذفها
        const lastUserMessage = messages.findLast((msg) => msg.isUser)?.text;
        if (lastUserMessage && messageContent.includes(lastUserMessage)) {
          messageContent = messageContent.replace(lastUserMessage, "").trim();
        }

        // تجاهل الرسائل الفارغة
        if (!messageContent.trim()) {
          console.log("Skipping empty message");
          return;
        }

        // تحديث حالة الرسائل بشكل أكثر كفاءة
        setMessages((prev) => {
          // Find any pending message
          const pendingMessageIndex = prev.findIndex(
            (msg) =>
              !msg.isUser && !msg.complete && msg.id.startsWith("ai-pending-")
          );

          const existingMessageIndex = prev.findIndex(
            (msg) => msg.id === message.id
          );

          if (existingMessageIndex >= 0) {
            // تحديث رسالة موجودة
            const updatedMessages = [...prev];
            updatedMessages[existingMessageIndex].text = messageContent;
            updatedMessages[existingMessageIndex].complete = true;
            return updatedMessages;
          } else if (pendingMessageIndex >= 0) {
            // Replace the pending message with the complete message
            const updatedMessages = [...prev];
            updatedMessages[pendingMessageIndex] = {
              id: message.id,
              text: messageContent,
              isUser: false,
              complete: true,
            };
            return updatedMessages;
          } else {
            // إضافة رسالة جديدة فقط إذا كان المحتوى غير فارغ
            return [
              ...prev,
              {
                id: message.id,
                text: messageContent,
                isUser: false,
                complete: true,
              },
            ];
          }
        });
      }

      setIsStreaming(false);
    };

    // معالجة الأخطاء
    const handleReceiveError = (error) => {
      console.error("❌ Received error:", error);

      // Remove any pending messages when an error occurs
      setMessages((prev) =>
        prev.filter(
          (msg) => !(msg.id.startsWith("ai-pending-") && !msg.complete)
        )
      );

      setIsStreaming(false);
    };

    // تسجيل معالجات الأحداث
    connection.on("ReceiveMessageChunk", handleReceiveMessageChunk);
    connection.on("EndMessageStream", handleEndMessageStream);
    connection.on("ReceiveMessage", handleReceiveMessage);
    connection.on("ReceiveError", handleReceiveError);

    // وظيفة التنظيف
    return () => {
      connection.off("ReceiveMessageChunk", handleReceiveMessageChunk);
      connection.off("EndMessageStream", handleEndMessageStream);
      connection.off("ReceiveMessage", handleReceiveMessage);
      connection.off("ReceiveError", handleReceiveError);
    };
  }, [connection, messages]);

  const handleSendMessage = async (message) => {
    if (message.trim() === "" || !connection) return;

    // إنشاء معرف مؤقت لرسالة المستخدم
    const userMessageId = `user-${Date.now()}`;

    // إضافة رسالة المستخدم إلى واجهة المستخدم فورًا
    setMessages((prev) => [
      ...prev,
      { id: userMessageId, text: message, isUser: true, complete: true },
    ]);

    // Create an empty AI message with streaming state immediately
    // This will show the typing indicator right away
    const pendingAiMessageId = `ai-pending-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: pendingAiMessageId, text: "", isUser: false, complete: false },
    ]);

    // Set streaming state to true
    setIsStreaming(true);

    try {
      // إرسال الرسالة إلى الخادم
      await connection.invoke("SendMessage", chatId, message);
      console.log("📤 Sent message:", message);

      // When the actual response starts coming in through the SignalR events,
      // the handlers will either update this pending message or replace it

      // إعادة تعيين مؤشر القطع الأولى للرسالة التالية
      isFirstChunkRef.current = true;
    } catch (error) {
      console.error("❌ Error sending message:", error);
      // In case of error, remove the pending message
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== pendingAiMessageId)
      );
      setIsStreaming(false);
    }
  };

  return (
    <div
      className={`flex flex-col ${
        messages.length < 0 ? "h-screen" : "h-auto"
      } overflow-hidden`}
    >
      {" "}
      {/* نمنع الـ scroll الخارجي */}
      <div className="flex flex-1 overflow-hidden">
        {/* الشريط الجانبي */}
        <div className="flex flex-col justify-between p-4 w-full items-center">
          {/* منطقة عرض الرسائل */}
          <div
            className={`flex-1 w-full  mb-32 ${
              messages.length === 0 ? "flex justify-center items-center" : ""
            }`}
          >
            {messages.length > 0 &&
              messages
                .filter(
                  (msg) =>
                    (msg.text && msg.text.trim() !== "") ||
                    (!msg.text && !msg.isUser && !msg.complete)
                ) // Allow empty non-user messages that are not complete (typing indicator)
                .map((msg, index) => (
                  <ChatMessage
                    key={`${msg.id}-${index}`}
                    message={msg.text || ""}
                    isUser={msg.isUser}
                    isStreaming={!msg.complete && !msg.isUser && isStreaming}
                  />
                ))}
            <div ref={messagesEndRef} />
          </div>

          {/* منطقة الإدخال مع العنوان */}
          <div
            className={`w-full flex flex-col items-center ${
              messages.length === 0
                ? "fixed top-1/2 transform -translate-y-1/2"
                : "fixed bottom-5"
            }`}
          >
            {messages.length === 0 && (
              <h2 className="text-3xl font-medium mb-4">
                What can I help with?
              </h2>
            )}
            <div className="flex bg-[#F4F6FF] h-[120px] justify-center p-4 rounded-[50px] shadow-sm w-[750px] gap-2 items-center">
              <ChatInput
                onSendMessage={handleSendMessage}
                disabled={isStreaming}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
