import { Formik, Form, Field } from "formik";
import { FaArrowUpLong } from "react-icons/fa6";
import { GoPaperclip } from "react-icons/go";
import { PiBookBookmarkLight } from "react-icons/pi";

const ChatInput = ({ onSendMessage, isStreaming, onStopStream }) => {
  const handleSubmit = (values, { resetForm }) => {
    if (values.message.trim()) {
      onSendMessage(values.message); // إرسال الرسالة إلى المكون الأب
      resetForm(); // إعادة تعيين النموذج بعد الإرسال
    }
  };

  return (
    <Formik
      initialValues={{ message: "" }} // القيم الابتدائية للنموذج
      onSubmit={handleSubmit} // دالة الإرسال
    >
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
            className="bg-white border border-gray-300 border-none h-[88px] p-2 rounded-[50px] w-full outline-none px-5"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={onStopStream}
              className="absolute right-5 cursor-pointer bg-red-500 text-white rounded-[50px] w-[40px] h-[40px] flex justify-center items-center"
            >
              <span className="font-bold">■</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!values.message.trim()} // تعطيل الزر إذا كان الحقل فارغًا
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