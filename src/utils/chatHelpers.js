// utils/chatHelpers.js
import * as signalR from "@microsoft/signalr";
import axiosInstance from "../api/axiosInstance";

export const startNewChatWithMessage = async ({ message, token, navigate }) => {
  try {
    const res = await axiosInstance.post(
      "Chat/Create",
      { modelId: "27d07a41-874c-4e83-8d9a-57434a5054fa" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const newChatId = res?.data;
    if (!newChatId || typeof newChatId !== "string") {
      console.error("❌ Invalid chatId returned:", res);
      return null;
    }

    // ✅ انتقل للشات الجديد
    navigate(`/chat/${newChatId}`);

    // ✅ استنى شوية لضمان ان الصفحة تعمل JoinChatSession
    setTimeout(() => {
      if (window.sendMessageAfterCreate) {
        window.sendMessageAfterCreate(newChatId, message);
      } else {
        console.warn("❌ sendMessageAfterCreate not available");
      }
    }, 300); // ممكن تزودها لو بتلاحظ تأخير أحيانًا

    return newChatId;
  } catch (err) {
    console.error("❌ Failed to start new chat:", err);
    return null;
  }
};
