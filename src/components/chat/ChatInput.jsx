import { Formik, Form, Field } from "formik";
import { FaArrowUpLong, FaStop } from "react-icons/fa6";
import { GoPaperclip } from "react-icons/go";
import { PiBookBookmarkLight } from "react-icons/pi";
import { useNavigate, useParams } from "react-router";
import { startNewChatWithMessage } from "../../utils/chatHelpers";
import { useEffect, useState } from "react";

const ChatInput = ({
  onSendMessage,
  connection,
  stopGenerate,
  isStreaming,
  currentResponseMessageId, // 👈 هنا كمان
}) => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessUsertoken");

  const handleSubmit = async (values, { resetForm }) => {
    const trimmedMessage = values.message.trim();
    if (!trimmedMessage) return;

    if (!chatId) {
      await startNewChatWithMessage({
        message: trimmedMessage,
        token,
        navigate,
        connection,
      });
    } else {
      onSendMessage(trimmedMessage);
    }

    resetForm();
  };
  useEffect(() => {
    console.log("🔥 isStreaming:", isStreaming);
    console.log("🆔 currentResponseMessageId:", currentResponseMessageId);
  }, [isStreaming, currentResponseMessageId]);
  return (
    <Formik initialValues={{ message: "" }} onSubmit={handleSubmit}>
      {({ values }) => (
        <Form className="flex w-full gap-2 items-center relative">
          <div className="flex flex-1 gap-2 items-center">
            <PiBookBookmarkLight
              className="cursor-pointer font-medium"
              size={23}
            />
            <GoPaperclip className="cursor-pointer" size={23} />
          </div>
          <Field
            type="text"
            name="message"
            placeholder="Type a message..."
            className="bg-white border h-[88px] p-2 rounded-[50px] w-full outline-none px-5"
          />
          {isStreaming && currentResponseMessageId ? (
            <button
              type="button"
              onClick={stopGenerate}
              className="absolute right-5 cursor-pointer bg-red-600 text-white rounded-[50px] w-[40px] h-[40px] flex justify-center items-center"
            >
              <FaStop size={20} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!values.message.trim()}
              className={`absolute right-5 cursor-pointer ${
                values.message.trim()
                  ? "bg-gradient-to-r from-[#2E5AAC] to-[#132546]"
                  : "bg-gray-300 cursor-not-allowed"
              } text-white rounded-[50px] w-[40px] h-[40px] flex justify-center items-center`}
            >
              <FaArrowUpLong size={20} />
            </button>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default ChatInput;
