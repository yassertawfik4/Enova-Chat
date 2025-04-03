import { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { LuKeyRound } from "react-icons/lu";
import gptImage from "/public/images/image.png";
import claudeImage from "/public/images/clude.png";
import gminiImage from "/public/images/gemini.png";
import axiosInstance from "../../api/axiosInstance";

function SettingsPage() {
  const [isApiKey, setIsApiKey] = useState(false);
  const [errors, setErrors] = useState({});

  const [apiKeys, setApiKeys] = useState({
    openai: "",
    anthropic: "",
    gemini: "",
  });

  const handleInputChange = (e, type) => {
    const { value } = e.target;
    setApiKeys((prev) => ({
      ...prev,
      [type]: value,
    }));
  };
  const handleSubmit = async (type) => {
    const apiKey = apiKeys[type];

    // ✅ الـ IDs الحقيقية لكل مزود (بدّلهم بالقيم الصحيحة لو متوفرة عندك)
    const providerMap = {
      openai: "2a255a5b-1762-4b89-a77d-0434c762c757",
      anthropic: "11111111-2222-3333-4444-555555555555",
      gemini: "99999999-aaaa-bbbb-cccc-dddddddddddd", 
    };

    // ✅ تحقق من صحة المفتاح
    if (!apiKey || apiKey.length < 10 || !apiKey.startsWith("sk-")) {
      alert("Please enter a valid API key.");
      return;
    }

    try {
      const payload = {
        aiProviderId: providerMap[type],
        apiKey: apiKey,
      };

      const response = await axiosInstance.post(`UserApiKey/Create`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessUsertoken")}`,
        },
      });

      console.log(`${type} API key saved successfully`, response.data);
      alert("API Key saved successfully!");
    } catch (error) {
      console.error(`Error saving ${type} API key:`, error);
      alert("Failed to save API key. Please try again.");
    }
  };
  return (
    <div className="px-3 flex">
      <div className="bg-[#F4F6FF] h-screen w-[198px] rounded-[24px] py-8 px-4">
        <div className="flex flex-col gap-8">
          <button
            onClick={() => setIsApiKey(true)}
            className={`text-[18px] text-[#132546] font-medium cursor-pointer flex gap-2.5 rounded-[24px] p-2.5 items-center ${
              isApiKey ? "bg-[#FFFFFF] shadow " : ""
            }`}
          >
            <LuKeyRound size={24} />
            API Keys
          </button>
          <button
            onClick={() => setIsApiKey(false)}
            className={`text-[18px] text-[#132546] font-medium cursor-pointer flex gap-2.5 rounded-[24px] p-2.5 items-center ${
              isApiKey ? "" : "bg-[#FFFFFF] shadow "
            }`}
          >
            <IoMdSettings size={24} />
            General
          </button>
        </div>
      </div>
      <div className="px-5 py-4">
        <div>
          <h2 className="text-[#09101D] text-[24px] font-bold">API Keys</h2>
          <p className="text-[#6D7580] text-[16px] font-normal">
            By default, your API Key is stored locally on your browser and never
            sent anywhere else.
          </p>
        </div>
        <form>
          <div className="my-5">
            <label className="font-semibold text-[18px] text-[#132546]">
              OpenAI API Key:{" "}
              <span className="text-blue-600 cursor-pointer underline">
                (Get API key here)
              </span>
            </label>
            <div className="flex gap-2 items-center my-5">
              <img
                className="w-[56px] h-[56px]"
                src={gptImage}
                alt="gptImage"
              />
              <input
                type="text"
                value={apiKeys.openai}
                onChange={(e) => handleInputChange(e, "openai")}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
                className="border h-[48px] py-3 px-5 rounded-[24px] w-full outline-none border-[#A5ABB3]"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit("openai");
                }}
                disabled={
                  !apiKeys.openai ||
                  apiKeys.openai.length < 10 ||
                  !apiKeys.openai.startsWith("sk-")
                }
                className={`flex text-[16px] font-medium rounded-[48px] text-white items-center pe-5 ps-4 py-2
    ${
      !apiKeys.openai ||
      apiKeys.openai.length < 10 ||
      !apiKeys.openai.startsWith("sk-")
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-[#2E5AAC] to-[#132546] cursor-pointer"
    }`}
              >
                Save
              </button>
            </div>
          </div>
          <div className="my-7">
            <label className="font-semibold text-[18px] text-[#132546]">
              Anthropic API Key:{" "}
              <span className="text-blue-600 cursor-pointer underline">
                (Get API key here)
              </span>
            </label>
            <div className="flex gap-2 items-center my-5">
              <img
                className="w-[56px] h-[56px]"
                src={claudeImage}
                alt="gptImage"
              />
              <input
                type="text"
                name="title"
                value={apiKeys.anthropic}
                onChange={(e) => handleInputChange(e, "anthropic")}
                placeholder="Sk-xxxxxxxxxxxxxxxxxxxxxx"
                className={`border h-[48px] py-3 px-5 rounded-[24px] w-full outline-none 
                      ${errors.title ? "border-red-500" : "border-[#A5ABB3]"}`}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm ml-3">{errors.title}</p>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit("anthropic");
                }}
                disabled={
                  !apiKeys.anthropic ||
                  apiKeys.anthropic.length < 10 ||
                  !apiKeys.anthropic.startsWith("sk-")
                }
                className={`flex text-[16px] font-medium rounded-[48px] text-white items-center pe-5 ps-4 py-2
    ${
      !apiKeys.anthropic ||
      apiKeys.anthropic.length < 10 ||
      !apiKeys.anthropic.startsWith("sk-")
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-[#2E5AAC] to-[#132546] cursor-pointer"
    }`}
              >
                Save
              </button>
            </div>
          </div>
          <div className="my-7">
            <label className="font-semibold text-[18px] text-[#132546]">
              Google Gemini API Key:{" "}
              <span className="text-blue-600 cursor-pointer underline">
                (Get API key here)
              </span>
            </label>
            <div className="flex gap-2 items-center my-5">
              <img
                className="w-[56px] h-[56px]"
                src={gminiImage}
                alt="geminiImage"
              />
              <input
                type="text"
                value={apiKeys.gemini}
                onChange={(e) => handleInputChange(e, "gemini")}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
                className="border h-[48px] py-3 px-5 rounded-[24px] w-full outline-none border-[#A5ABB3]"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit("gemini");
                }}
                disabled={
                  !apiKeys.gemini ||
                  apiKeys.gemini.length < 10 ||
                  !apiKeys.gemini.startsWith("sk-")
                }
                className={`flex text-[16px] font-medium rounded-[48px] text-white items-center pe-5 ps-4 py-2
    ${
      !apiKeys.gemini ||
      apiKeys.gemini.length < 10 ||
      !apiKeys.gemini.startsWith("sk-")
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-[#2E5AAC] to-[#132546] cursor-pointer"
    }`}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsPage;
