import { GoPlus } from "react-icons/go";
import pluginSquare from "/public/images/icons/pluginSquare.png";
import agentIconButton from "/public/images/icons/Vector.png";
import filterIcon from "/public/images/icons/add-message_18616125 2 (1).png";
import rightArrow from "/public/images/icons/right.png";
import rightArrow1 from "/public/images/icons/right (1).png";
import webSearch from "/public/images/icons/web search.png";
import azure from "/public/images/icons/azure.png";
import reader from "/public/images/icons/reader.png";
import { useState } from "react";
function PluginPage() {
  const [isAddPlugin, setIsAddPlugin] = useState(false);
  const [errors, setErrors] = useState({});

  const [promptForm, setPromptForm] = useState({
    name: "",
    description: "",
    pluginType: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPromptForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  return (
    <div>
      {isAddPlugin ? (
        <div className="px-3">
          <div className="flex justify-between items-center mt-5 sticky top-0 bg-white">
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="text-[#09101D] text-[34px] font-bold">
                Create Plugin
              </h2>
              <p className="text-[#858C94] text-[14px] font-normal ">
                Need help creating plugins? <br /> Read Developer Documentation
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setIsAddPlugin(true)}
                className="flex bg-gradient-to-r text-[16px] font-medium rounded-[48px] text-white cursor-pointer from-[#2E5AAC] gap-2 items-center pe-5 ps-4 py-2 to-[#132546]"
              >
                <GoPlus size={20} />
                Add Plugin
              </button>
              <button
                type="button"
                onClick={() => setIsAddPlugin(false)}
                className="flex border border-[#132546] text-center text-[16px] rounded-[48px] text-[#132546] cursor-pointer font-medium gap-2 items-center px-5 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="plugin"
                id="plugin1"
                className="accent-[#132546]"
              />
              <label htmlFor="plugin1" className="text-[#132546] font-medium">
                Interactive Editor
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="plugin"
                id="plugin2"
                className="accent-[#132546]"
              />
              <label htmlFor="plugin2" className="text-[#132546] font-medium">
                Another Option
              </label>
            </div>
          </div>
          <div>
            {/* Title Input */}
            <div className="flex flex-col gap-2 my-5">
              <label className="font-semibold text-[16px] text-[#132546]">
                Plugin Name{" "}
                <span className="text-[#B40808] font-semibold text-[18px]">
                  *
                </span>
                <p className="text-[16px] text-[#6D7580] py-1">
                  Recommendation: 4 words or less.
                </p>
              </label>
              <input
                type="text"
                name="name"
                value={promptForm.name}
                onChange={handleInputChange}
                placeholder="New plugin"
                className={`border h-[48px] py-3 px-5 rounded-[24px] w-full outline-none 
                ${errors.name ? "border-red-500" : "border-[#A5ABB3]"}`}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm ml-3">{errors.name}</p>
              )}
            </div>
            {/* Icon Url Input */}
            <div className="flex flex-col gap-2 my-5">
              <label className="font-semibold text-[16px] text-[#132546]">
                Icon URL{" "}
              </label>
              <p className="text-[16px] text-[#6D7580]">
                Recommendation: 128x128
              </p>
              <input
                type="text"
                name=""
                // value={promptForm.name}
                // onChange={handleInputChange}
                placeholder="https://..."
                className={`border h-[48px] py-3 px-5 rounded-[24px] w-full outline-none border-[#A5ABB3]`}
              />
            </div>
            {/* Description Input */}
            <div className="flex flex-col gap-2 my-5">
              <label className="font-semibold text-[16px] text-[#132546]">
                Overview (Markdown Supported){" "}
              </label>
              <p className="text-[16px] text-[#6D7580]">
                Describe to the users what your plugin does and how to use it
                with examples.
              </p>
              <textarea
                name="description"
                value={promptForm.description}
                onChange={handleInputChange}
                placeholder="## New Plugin

Describe your plugin here"
                className="border border-[#A5ABB3] h-[138px] py-3 px-5 rounded-[24px] w-full outline-none"
              />
            </div>

            {/* Content Input */}
            <div className="flex flex-col gap-2 my-5">
              <label className="font-semibold text-[16px] text-[#132546]">
                OpenAI Function Spec{" "}
                <span className="text-[#B40808] font-semibold text-[18px]">
                  *
                </span>
              </label>
              <p className="text-[16px] text-[#6D7580]">
                A JSON string that describes to the AI assistant what the
                function does and how to use it. Must strictly follow OpenAI's
                document about function call. See Instructions & Examples here.
              </p>
              <textarea
                name="content"
                value={promptForm.content}
                onChange={handleInputChange}
                placeholder={`{
  "name": "new_plugin_id_41602839",
  "description": "Description for the function",
  "parameters": {
    "type": "object",
    "properties": {
      "param1": {
        "type": "string",
        "description": "Description of the first parameter"
      }
    },
    "required": [
      "param1"
    ]
  }
}`}
                className={`border h-[408px] py-3 px-5 rounded-[24px] w-full outline-none 
                ${errors.content ? "border-red-500" : "border-[#A5ABB3]"}`}
                required
              />
              {errors.content && (
                <p className="text-red-500 text-sm ml-3">{errors.content}</p>
              )}
            </div>
            {/* User Settings */}
            <div className="flex flex-col gap-2 my-5">
              <label className="font-semibold text-[16px] text-[#132546]">
                User Settings (JSON, Optional)
                <span className="text-[#B40808] font-semibold text-[18px]">
                  *
                </span>
              </label>
              <p className="text-[16px] text-[#6D7580]">
                User-specific settings that will be passed to the plugin when it
                is called. Must be a valid JSON. See Example JSON and
                instruction here.
              </p>
              <textarea
                name="content"
                value={promptForm.content}
                onChange={handleInputChange}
                placeholder={`[
  {
    "name": "variableName1",
    "label": "Variable Name 1",
    "description": "This value will be provided by the user and passed to the plugin function when called",
    "required": true
  },
  {
    "name": "varibaleName2",
    "label": "Variable Name 2",
    "description": "This value will be provided by the user and passed to the plugin function when called",
    "type": "password",
    "required": true
  }
]`}
                className={`border h-[408px] py-3 px-5 rounded-[24px] w-full outline-none 
                ${errors.content ? "border-red-500" : "border-[#A5ABB3]"}`}
                required
              />
              {errors.content && (
                <p className="text-red-500 text-sm ml-3">{errors.content}</p>
              )}
            </div>
            <div className="pt-3 pb-6">
              <h2 className="font-semibold text-[16px] text-[#132546]">
                Plugin Context
              </h2>
              <p className="text-[16px] text-[#6D7580] pt-1 pb-3">
                This can be used to provide advanced instructions to the AI.
                This works in combination with the plugin's spec function
                description, you can use this to provide more detailed prompts
                or add real-time data even before the plugin is run. Plugin
                context will be added to the AI's context (system prompt) when
                the plugin is enabled for the conversation, even if the AI
                decide not to run the plugin.
              </p>
              <p className="text-[16px] text-[#6D7580]">
                Create dynamic context with variables or retrieve from an API
                and inject into the system prompt. This can be used to add live
                information to the AI or implement Retrieval-Augmented
                Generation (RAG) from your own data sources (e.g., vector store
                database).
              </p>
            </div>
            <div>
              <h2 className="">Add Context</h2>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-3 py-2 flex gap-3">
          <div className="">
            <div className="bg-[#F4F6FF] h-[calc(100vh-100px)] p-6 rounded-[24px] w-[226px] sticky top-0">
              <div className="flex items-center gap-2 mb-10 bg-white rounded-[24px] p-2.5 border border-[#132546] cursor-pointer">
                <img src={pluginSquare} alt="pluginSquare" />
                <h2 className="text-[18px] font-medium">Plugin Store</h2>
              </div>
              <div className="flex items-center gap-2 mb-7 border-b justify-start border-[#9098A1] pb-4">
                <img src={rightArrow} alt="rightArrow" />
                <h2 className="text-[18px] font-medium">Installed</h2>
              </div>
              <ul className="flex flex-col  font-medium gap-8 leading-[16px]">
                <li className="cursor-pointer text-[15px] flex items-center gap-2 justify-start">
                  <img src={webSearch} alt="webSearch" />
                  Web Search
                </li>
                <li className="cursor-pointer text-[15px] flex items-center gap-2 justify-start">
                  <img src={azure} alt="webSearch" />
                  Azure AI Search
                </li>
                <li className="cursor-pointer text-[15px] flex items-center gap-2 justify-start">
                  <img src={reader} alt="webSearch" />
                  Web Page Reader
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center mt-5">
              <div className="flex flex-col gap-2 mb-6">
                <h2 className="text-[#09101D] text-[34px] font-bold">
                  Plugins
                </h2>
                <p className="text-[#858C94] text-[16px] font-normal ">
                  Extends the capabilities of the AI with custom functions and
                  workflows.
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setIsAddPlugin(true)}
                  className="flex bg-gradient-to-r text-[16px] font-medium rounded-[48px] text-white cursor-pointer from-[#2E5AAC] gap-2 items-center pe-5 ps-4 py-1.5 to-[#132546]"
                >
                  <GoPlus className="font-extrabold" size={20} />
                  Create Plugin
                </button>
                <button className="flex border border-[#132546] text-[16px] rounded-[48px] text-[#132546] cursor-pointer font-medium gap-2 items-center pe-5 ps-4 py-1.5">
                  <img
                    loading="lazy"
                    src={agentIconButton}
                    alt="agentIconButton"
                  />
                  Import
                </button>
              </div>
            </div>
            <div className="w-[100%] flex gap-12">
              <input
                type="text"
                placeholder="Search"
                className="border border-[#A5ABB3] h-[56px] p-2 rounded-[184px] w-full outline-none"
              />
              <div className="w-[23%]">
                <button className="border text-[#2E5AAC] flex gap-1 text-[16px] font-normal items-center cursor-pointer border-[#DADEE3] h-[56px] p-2 rounded-[184px] w-full outline-none">
                  <img src={filterIcon} alt="filterIcon" />
                  Select multiple plugins
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-10">
              <div className="bg-white border-[#132546] border-t-0 border-r-0 border-5 w-full  p-4.5 rounded-[24px] h-auto">
                <div className="flex gap-2 my-2">
                  <div>
                    <img
                      className="w-[40px] h-[40px]"
                      src={webSearch}
                      alt="webSearch"
                    />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold text-[#09101D]">
                      Web Search
                    </h3>
                    <p className="text-[#858C94] text-[14px] font-normal mb-3 pb-3">
                      Search for information from the internet in
                      real-time using Google Search.
                    </p>
                  </div>
                  <div>
                    <img src={rightArrow1} alt="rightArrow" />
                  </div>
                </div>
              </div>
              <div className="bg-white border-[#132546] border-t-0 border-r-0 border-5 w-full  p-4.5 rounded-[24px] h-auto">
                <div className="flex gap-2 my-2">
                  <div>
                    <img
                      className="w-[40px] h-[40px]"
                      src={azure}
                      alt="azure"
                    />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold text-[#09101D]">
                      Azure AI Search
                    </h3>
                    <p className="text-[#858C94] text-[14px] font-normal mb-3 pb-3">
                      Search the internal training data for relevant
                      information. When the user ask you something you don't
                      know...
                    </p>
                  </div>
                  <div>
                    <img src={rightArrow1} alt="rightArrow" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PluginPage;
