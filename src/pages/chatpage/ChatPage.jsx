import { useState, useEffect, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import ChatInput from "../../components/chat/ChatInput";
import ChatMessage from "../../components/chat/ChatMessage";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [connection, setConnection] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  // مرجع لآخر معرف رسالة تم استلامها
  const lastMessageIdRef = useRef("");
  // تتبع ما إذا كانت هذه أول قطعة في الرسالة
  const isFirstChunkRef = useRef(true);
  // أضف مرجع للتتبع وقت التحميل
  const loadTimeRef = useRef(Date.now());

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTk1YTkxNC01ODc4LTdkMDQtYjE5NS1lODdlYmFlZGU3NzciLCJlbWFpbCI6Inlhc3NlcjFAbWFpbC5jb20iLCJuYW1lIjoieWFzc29yc3d4IiwianRpIjoiZGRlNzYxNTktMmQ0Yi00NjYyLWFiYzItNGQ2MTE3ZjdmYzdiIiwiYXVkIjpbIlN3YWdnZXJVSSIsIlN3YWdnZXJVSSJdLCJuYmYiOjE3NDI0MzUyNjUsImV4cCI6MTc0MzA0MDA2NSwiaWF0IjoxNzQyNDM1MjY1LCJpc3MiOiJJbnRlcm5zaGlwLVBsYXRmb3JtIn0.8F_tRBZ00HkA71adeI1VF_ZUZt_XL5sU4wqknF_kfIQ";
  // const chatId = "0e3905bc-ebc4-4061-801c-18faf42a1ebf";
  const { chatId } = useParams();
  console.log(chatId);

  // إضافة وظيفة لمسح الرسائل
  const clearMessages = useCallback(() => {
    setMessages([]);
    setIsStreaming(false);
    lastMessageIdRef.current = "";
    isFirstChunkRef.current = true;
  }, []);

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
        if (chatId) {
          return newConnection.invoke("JoinChatSession", chatId);
        }
      })
      .then(() => {
        if (chatId) {
          console.log("✅ Joined chat session:", chatId);
        }
      })
      .catch((err) => console.error("❌ Connection failed: ", err));

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [chatId]);

  useEffect(() => {
    if (!connection) return;

    // معالجة استلام جزء من الرسالة
    const handleReceiveMessageChunk = (messageId, chunk) => {
      console.log("📩 Received chunk:", messageId, chunk);

      // تأكد من أن محتوى القطعة صالح وليست فارغة
      const chunkContent = chunk || "";
      if (!chunkContent.trim()) {
        console.log("Skipping empty chunk");
        return;
      }

      setIsStreaming(true);

      // إذا كان معرف الرسالة مختلفًا عن آخر معرف تم استلامه
      // فهذا يعني أنها رسالة جديدة
      if (messageId !== lastMessageIdRef.current) {
        lastMessageIdRef.current = messageId;

        setMessages((prev) => {
          // ابحث عن رسالة معلقة فارغة لاستبدالها
          const pendingIndex = prev.findIndex(
            (msg) =>
              !msg.isUser && !msg.complete && msg.id.startsWith("ai-pending-")
          );

          if (pendingIndex >= 0) {
            const updatedMessages = [...prev];
            updatedMessages[pendingIndex] = {
              id: messageId,
              text: chunkContent,
              isUser: false,
              complete: false,
            };
            return updatedMessages;
          } else {
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
      } else {
        // إضافة محتوى إلى رسالة موجودة بنفس المعرف
        setMessages((prev) => {
          const messageIndex = prev.findIndex((msg) => msg.id === messageId);

          if (messageIndex >= 0) {
            const updatedMessages = [...prev];
            const currentText = updatedMessages[messageIndex].text;

            // تجنب التكرار مع ضمان عرض الرسالة فوراً
            // نتحقق فقط من التكرار إذا كانت القطعة أطول من حرف واحد
            // لتجنب التأثير على الأداء عند عرض الرسالة حرفاً بحرف
            if (chunkContent.length > 3 && currentText.endsWith(chunkContent)) {
              console.log("Skipping duplicate chunk:", chunkContent);
            } else {
              updatedMessages[messageIndex] = {
                ...updatedMessages[messageIndex],
                text: currentText + chunkContent,
              };
            }

            return updatedMessages;
          }

          return prev;
        });
      }
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

  // تعديل دالة handleSendMessage
  const handleSendMessage = async (message) => {
    try {
      // إضافة رسالة المستخدم إلى الواجهة فوراً
      const userMessageId = `user-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: userMessageId,
          text: message,
          isUser: true,
          complete: true,
        },
      ]);

      // إضافة رسالة معلقة للذكاء الاصطناعي
      const pendingMessageId = `ai-pending-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: pendingMessageId,
          text: "",
          isUser: false,
          complete: false,
        },
      ]);

      setIsStreaming(true);

      console.log("Current chatId:", chatId);

      // الخطوة 1: تحديد إذا كنا بحاجة لإنشاء محادثة جديدة أم لا
      if (chatId) {
        console.log("Sending message to existing chat:", chatId);

        // نحن في محادثة موجودة - استخدم API لإرسال رسالة إلى الشات الحالي
        await connection.invoke("SendMessage", chatId, message);
      } else {
        console.log("Creating new chat with message:", message);

        // الخطوة 1: إنشاء محادثة جديدة أولاً
        const createResponse = await axiosInstance.post(
          "Chat/Create",
          { modelId: "9eee9813-6413-4947-9828-23e5719051f7" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response from creating new chat:", createResponse);

        // تحقق من الاستجابة
        if (createResponse.data) {
          console.log("Response data:", createResponse.data);

          // تحقق من تنسيق الاستجابة
          const newChatId =
            createResponse.data.id ||
            createResponse.data.chatId ||
            createResponse.data;

          if (newChatId) {
            console.log("New chat created with ID:", newChatId);

            // الخطوة 2: الآن أرسل الرسالة إلى المحادثة الجديدة
            if (
              connection &&
              connection.state === signalR.HubConnectionState.Connected
            ) {
              await connection.invoke("SendMessage", newChatId, message);
            } else {
              // استخدام HTTP إذا لم يكن اتصال SignalR متاحاً
              await axiosInstance.post(
                `Chat/${newChatId}/message`,
                { message },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            }

            // انتقل إلى المحادثة الجديدة
            navigate(`/chat/${newChatId}`);

            // تحديث قائمة المحادثات في الشريط الجانبي
            if (window.refreshChatSidebar) {
              window.refreshChatSidebar();
            }
          } else {
            throw new Error("Failed to extract chat ID from response");
          }
        } else {
          throw new Error("No data in response");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // طباعة تفاصيل الخطأ للتصحيح
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }

      // إزالة الرسالة المعلقة في حالة حدوث خطأ
      setMessages((prev) =>
        prev.filter((msg) => !msg.id.includes("ai-pending-"))
      );

      setIsStreaming(false);
    }
  };

  //fetch chat Id hestiory

  const getChatbyId = async () => {
    try {
      const response = await axiosInstance.get(`Chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        // Load chat messages
        if (response.data.messages && response.data.messages.length > 0) {
          const formattedMessages = response.data.messages.map((msg) => ({
            id: msg.id,
            text: msg.content,
            isUser: !msg.isFromAi,
            complete: true,
          }));

          setMessages(formattedMessages);
        }
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // تعديل useEffect المسؤول عن التعامل مع تغيير chatId
  useEffect(() => {
    // إعادة تعيين مرجع وقت التحميل عند كل تغيير في chatId
    loadTimeRef.current = Date.now();

    // مسح الرسائل بغض النظر عن وجود chatId
    clearMessages();

    // إذا كان هناك معرف محادثة، قم بتحميل محتواها
    if (chatId) {
      getChatbyId();
    }
  }, [chatId, clearMessages]);

  // إضافة useEffect جديد للتعامل مع الصفحة الرئيسية
  useEffect(() => {
    // التحقق إذا كنا في الصفحة الرئيسية (/)
    if (window.location.pathname === "/") {
      // تأكد من مسح الرسائل عند تحميل الصفحة الرئيسية
      clearMessages();
    }
  }, [window.location.pathname, clearMessages]);

  // في بداية تشغيل المكون، أضف دالة تحديث عامة
  useEffect(() => {
    // إتاحة وظيفة مسح الرسائل كدالة عامة للاستدعاء من أي مكان
    window.refreshChatPage = () => {
      clearMessages();
    };

    // التحقق من وحدة تخزين الجلسة
    const shouldClear = sessionStorage.getItem("clearChat");
    if (shouldClear === "true") {
      clearMessages();
      sessionStorage.removeItem("clearChat");
    }

    return () => {
      // إزالة الوظيفة العامة عند إلغاء تحميل المكون
      delete window.refreshChatPage;
    };
  }, [clearMessages]);

  // Add a function to stop the stream
  const stopStreamingResponse = () => {
    if (connection) {
      // Call the SignalR method to stop streaming
      connection.invoke("StopGenerating").catch((err) => {
        console.error("Error stopping generation:", err);
      });

      // Also update local state to reflect stopped streaming
      setIsStreaming(false);

      // Find the incomplete message and mark it as complete
      setMessages((prev) => {
        const updatedMessages = [...prev];
        const streamingMessageIndex = updatedMessages.findIndex(
          (msg) => !msg.complete && !msg.isUser
        );

        if (streamingMessageIndex !== -1) {
          updatedMessages[streamingMessageIndex].complete = true;
          // Optionally append a note that generation was stopped
          // updatedMessages[streamingMessageIndex].text += " [Generation stopped]";
        }

        return updatedMessages;
      });
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
            className={`flex-1 w-full pb-40 ${
              messages.length === 0 ? "flex justify-center items-center" : ""
            }`}
          >
            {messages.length > 0 &&
              messages
                .filter(
                  (msg) =>
                    (msg.text && msg.text.trim() !== "") ||
                    (!msg.text && !msg.isUser && !msg.complete)
                )
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
            className={`w-full flex flex-col items-center bg-white pb-10 pt- px-10 ${
              messages.length === 0
                ? "fixed top-1/2 transform -translate-y-1/2"
                : "fixed bottom-0"
            } max-w-[calc(100vw-450px)] z-10`}
          >
            {messages.length === 0 && (
              <h2 className="text-3xl font-medium mb-4">
                What can I help with?
              </h2>
            )}
            <div className="flex bg-[#F4F6FF] h-[120px] justify-center p-4 rounded-[50px] shadow-sm w-[750px] backdrop-blur-sm backdrop-filter gap-2 items-center">
              <ChatInput
                onSendMessage={handleSendMessage}
                isStreaming={isStreaming}
                onStopStream={stopStreamingResponse}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-5 w-full px-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          isStreaming={isStreaming}
          onStopStream={stopStreamingResponse}
        />
      </div>
    </div>
  );
}

export default ChatPage;
