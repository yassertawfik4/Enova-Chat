import { useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import ChatInput from "../../components/chat/ChatInput";
import ChatMessage from "../../components/chat/ChatMessage";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [connection, setConnection] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponseMessageId, setCurrentResponseMessageId] =
    useState(null);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const lastMessageIdRef = useRef("");
  const isFirstChunkRef = useRef(true);
  const loadTimeRef = useRef(Date.now());

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTk1ZDc5ZS1kYzMwLTcxYWItODg2NC1lNDhlYmUxN2U4MGYiLCJlbWFpbCI6Inlhc3NlcjFAbWFpbC5jb20iLCJuYW1lIjoieWFzc29yc3d4IiwianRpIjoiYjc0ODU5OGQtM2IxYi00OGUzLTg2OTAtY2RkNzY5Yjc1NTIyIiwiYXVkIjpbIlN3YWdnZXJVSSIsIlN3YWdnZXJVSSJdLCJuYmYiOjE3NDM2NzMyNDksImV4cCI6MTc0NDI3ODA0OSwiaWF0IjoxNzQzNjczMjQ5LCJpc3MiOiJJbnRlcm5zaGlwLVBsYXRmb3JtIn0.R_lrK2noNHiv1vHDpS9ed9-bFjmMvfg307E37YDZnfI";
  const { chatId } = useParams();
  console.log("Current chatId:", chatId);

  // Initialize SignalR connection
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

  // Set up SignalR event handlers
  useEffect(() => {
    if (!connection) return;

    // Handle receiving a chunk of a message
    const handleReceiveMessageChunk = (messageId, chunk) => {
      console.log("📩 Received chunk:", messageId, chunk);

      // Make sure chunk content is valid
      const chunkContent = chunk || "";
      if (!chunkContent.trim()) {
        console.log("Skipping empty chunk");
        return;
      }

      setIsStreaming(true);

      // If this is a new message ID
      if (messageId !== lastMessageIdRef.current) {
        lastMessageIdRef.current = messageId;
        isFirstChunkRef.current = true;
        setCurrentResponseMessageId(messageId);

        setMessages((prev) => {
          // Look for pending empty message to replace
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

        isFirstChunkRef.current = false;
      } else {
        // Add content to an existing message with the same ID
        setMessages((prev) => {
          const messageIndex = prev.findIndex((msg) => msg.id === messageId);

          if (messageIndex >= 0) {
            const updatedMessages = [...prev];
            const currentText = updatedMessages[messageIndex].text;

            // Avoid duplication while ensuring the message is displayed immediately
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

    // Handle end of message stream
    const handleEndMessageStream = (messageId) => {
      console.log("🏁 Finished streaming message:", messageId);

      setMessages((prev) => {
        const updatedMessages = [...prev];
        const index = updatedMessages.findIndex((msg) => msg.id === messageId);

        if (index !== -1) {
          // Mark message as complete
          updatedMessages[index].complete = true;
          updatedMessages[index].text = updatedMessages[index].text.trim();

          // Remove message if empty after cleaning
          if (!updatedMessages[index].text) {
            return updatedMessages.filter((_, i) => i !== index);
          }
        }

        return updatedMessages;
      });

      setIsStreaming(false);
      isFirstChunkRef.current = true;
    };

    // Handle receiving a complete message
    const handleReceiveMessage = (message) => {
      console.log("📩 Received complete message:", message);

      // Only process model messages, not user messages
      if (!message.isFromUser) {
        let messageContent = message.content || "";

        // Check for user message and remove it
        const lastUserMessage = messages.findLast((msg) => msg.isUser)?.text;
        if (lastUserMessage && messageContent.includes(lastUserMessage)) {
          messageContent = messageContent.replace(lastUserMessage, "").trim();
        }

        // Ignore empty messages
        if (!messageContent.trim()) {
          console.log("Skipping empty message");
          return;
        }

        // Update messages state more efficiently
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
            // Update existing message
            const updatedMessages = [...prev];
            updatedMessages[existingMessageIndex].text = messageContent;
            updatedMessages[existingMessageIndex].complete = true;
            return updatedMessages;
          } else if (pendingMessageIndex >= 0) {
            // Replace pending message with complete message
            const updatedMessages = [...prev];
            updatedMessages[pendingMessageIndex] = {
              id: message.id,
              text: messageContent,
              isUser: false,
              complete: true,
            };
            return updatedMessages;
          } else {
            // Add new message if content is not empty
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

    // Handle errors
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

    // Register event handlers
    connection.on("ReceiveMessageChunk", handleReceiveMessageChunk);
    connection.on("EndMessageStream", handleEndMessageStream);
    connection.on("ReceiveMessage", handleReceiveMessage);
    connection.on("ReceiveError", handleReceiveError);

    // Cleanup function
    return () => {
      connection.off("ReceiveMessageChunk", handleReceiveMessageChunk);
      connection.off("EndMessageStream", handleEndMessageStream);
      connection.off("ReceiveMessage", handleReceiveMessage);
      connection.off("ReceiveError", handleReceiveError);
    };
  }, [connection, messages]);

  // Improved send message function
  const handleSendMessage = async (message) => {
    try {
      // Immediately add user message to UI
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

      // Add pending AI message placeholder
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

      // Check if we're in an existing chat or need to create a new one
      if (chatId) {
        console.log("Sending message to existing chat:", chatId);

        if (
          connection &&
          connection.state === signalR.HubConnectionState.Connected
        ) {
          // Pass null for fileIds if no files are attached
          await connection.invoke("SendMessage", chatId, message, null);
        } else {
          console.error("SignalR connection not available");
          throw new Error("Unable to connect to chat server");
        }
      } else {
        console.warn("⚠️ No chatId found. Message not sent.");
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Print error details for debugging
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }

      // Remove pending message on error
      setMessages((prev) =>
        prev.filter((msg) => !msg.id.includes("ai-pending-"))
      );

      setIsStreaming(false);
    }
  };

  // Function to get chat history by ID
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
            isUser: !msg.isFromAi, // Negate isFromAi to get isUser
            complete: true,
          }));

          setMessages((prev) => {
            const existingIds = new Set(prev.map((msg) => msg.id));
            const newMessages = formattedMessages.filter(
              (msg) => !existingIds.has(msg.id)
            );
            return [...prev, ...newMessages];
          });
        }
      }
      console.log("Chat history loaded:", response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // Handle chatId changes
  useEffect(() => {
    // Reset load time reference when chatId changes
    loadTimeRef.current = Date.now();

    // Clear messages when loading new chat
    setMessages([]);
    setIsStreaming(false);
    lastMessageIdRef.current = "";
    isFirstChunkRef.current = true;

    // If there's a chatId, load its content
    if (chatId) {
      getChatbyId();
    }
  }, [chatId]);

  // Handle homepage view
  useEffect(() => {
    // Check if we're on the homepage (/)
    if (window.location.pathname === "/") {
      // Make sure to clear messages when loading homepage
      setMessages([]);
      setIsStreaming(false);
      lastMessageIdRef.current = "";
      isFirstChunkRef.current = true;
    }
  }, [window.location.pathname]);

  // Function to stop streaming response
  const stopGenerate = async () => {
    try {
      if (!currentResponseMessageId || !isStreaming) return;

      await axiosInstance.post(
        `chat/StopResponse/${currentResponseMessageId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessUsertoken")}`,
          },
        }
      );

      setIsStreaming(false);

      // حط العلامة في الرسالة بدلاً من حذفها
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === currentResponseMessageId
            ? {
                ...msg,
                text: msg.text.trim(),
                complete: true,
              }
            : msg
        )
      );

      setCurrentResponseMessageId(null);
      console.log("✋ Response stopped and message marked.");
    } catch (error) {
      console.error("❌ Error stopping response:", error);
    }
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // بعد تعريف handleSendMessage
  useEffect(() => {
    window.sendMessageAfterCreate = async (newChatId, message) => {
      navigate(`/chat/${newChatId}`);

      // 👇 استنى شوية علشان يكون حصل JoinChatSession
      setTimeout(async () => {
        if (
          connection &&
          connection.state === signalR.HubConnectionState.Connected
        ) {
          try {
            await connection.invoke("JoinChatSession", newChatId);
            console.log("✅ Joined new chat session after create:", newChatId);

            // ابعت الرسالة بعد الـ Join
            await handleSendMessage(message);
          } catch (err) {
            console.error("❌ Error joining new chat session:", err);
          }
        } else {
          console.warn("⚠️ Connection not ready to send message after create");
        }
      }, 300);
    };
  }, [navigate, connection]);
  return (
    <div
      className={`flex flex-col ${
        messages.length < 0 ? "h-screen" : "h-auto"
      } overflow-hidden`}
    >
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col justify-between p-4 w-full items-center">
          {/* Message display area */}
          <div
            className={`flex-1 w-[750px] pb-40 ${
              messages.length === 0 ? "flex justify-center items-center" : ""
            }`}
          >
            {messages.map((msg, index) => (
              <ChatMessage
                key={`${msg.id}-${index}`}
                message={msg.text || ""}
                isUser={msg.isUser}
                isStreaming={!msg.complete && !msg.isUser && isStreaming}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area with title */}
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
                stopGenerate={stopGenerate}
                // onStopStream={stopStreamingResponse}
                currentResponseMessageId={currentResponseMessageId} // 👈 ضيفه هنا
                connection={connection}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
