import { useEffect, useState } from "react";
import { GoDotFill, GoPlus } from "react-icons/go";
import { RiPushpinFill } from "react-icons/ri";
import personImage from "/public/images/persone.png";
import axiosInstance from "../../api/axiosInstance";
import { FiUpload } from "react-icons/fi";
import { SafetySlider } from "../../components/SafetySlider";

function CreateAgent() {
  const [agentForm, setAgentForm] = useState({
    name: "",
    description: "",
    systemPrompt: "",
    aiModelId: "",
    iconUrl: "",
    profilePictureUrl: "",
    categories: [],
    assignCustomModelParameters: false,
    temperature: 1,
    topP: 0.8,
    topK: 40,
    maxTokens: 4000,
    enableThinking: true,
    reasoningEffort: 85,
    promptCaching: false,
    stopSequences: ["STOP", "END"],
    contextLimit: "8k",
    presencePenalty: 0.1,
    frequencyPenalty: 0.1,
    safetySettings:
      '{"harm_category_safety_settings":{"harassment":{"threshold":"block_medium_and_above"}}}',
  });
  const [selectedModel, setSelectedModel] = useState("");
  const [getEnabiledModels, setGetEnabiledModels] = useState([]);

  // Toggle states
  const [overrideSystemInstruction, setOverrideSystemInstruction] =
    useState(false);
  const [assignSpecificModel, setAssignSpecificModel] = useState(false);
  const [customModelParameters, setCustomModelParameters] = useState(false);
  const [skillPlugin, setSkillPlugin] = useState(false);

  const [getEnabelCustomModel, setGetEnabelCustomModel] = useState(false);
  const [promptCaching, setPromptCaching] = useState(false);
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState("");
  const defaultSafetySettings = {
    harassment: 2,
    hateSpeech: 2,
    sexuallyExplicit: 2,
    dangerous: 2,
  };
  const [safetySettings, setSafetySettings] = useState(defaultSafetySettings);
  const [showSafetySliders, setShowSafetySliders] = useState(false);
  const toggleSafetySettings = () => {
    if (showSafetySliders) {
      setSafetySettings(defaultSafetySettings); // Reset to default
      setShowSafetySliders(false);
    } else {
      setShowSafetySliders(true); // Show sliders
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };
  const messageArray = [
    {
      message: "All Previous Messages",
      value: "0",
    },
    ...Array.from({ length: 100 }, (_, i) => ({
      message: `Last ${i + 1} message${i + 1 > 1 ? "s" : ""}`,
      value: String(i + 1),
    })),
  ];
  useEffect(() => {
    handleGetAllModels();
  }, []);
  const handleGetAllModels = async () => {
    try {
      const response = await axiosInstance.get(`AiModel/EnabledModels`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessUsertoken")}`,
        },
      });
      console.log(response.data);
      setGetEnabiledModels(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAgentForm((prev) => ({
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
  const validateForm = () => {
    const newErrors = {};

    if (!agentForm.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!agentForm.content.trim()) {
      newErrors.content = "Prompt content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // const response = await axiosInstance.post("Prompt/Create", agentForm, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("accessUsertoken")}`,
      //   },
      // });
      // console.log(response.data);
      // setAgentForm({
      //   title: "",
      //   description: "",
      //   content: "",
      //   tags: [],
      // });
      // handleMyPrompts();
      // setIsAddPrompt(false);
    } catch (error) {
      console.error("Error creating prompt:", error);
      alert("Failed to create prompt");
    }
  };
  return (
    <div className="px-5">
      <div className="flex justify-between items-center mt-5">
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-[#09101D] text-[24px] font-medium flex items-center gap-2">
            New AI Agent
            <span className="cursor-pointer">
              <RiPushpinFill size={25} className="text-[#09101D]" />
            </span>
          </h2>
          <p className="text-[#6D7580] text-[14px] font-normal flex items-center justify-center gap-1 w-fit">
            <span className="font-bold flex items-center justify-center">
              <GoDotFill className="text-[#6D7580]" size={15} />
            </span>
            Draft
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            // onClick={() => handleSubmit()}
            className="flex border border-[#132546] text-center text-[16px] rounded-[48px] text-[#132546] cursor-pointer font-medium gap-2 items-center px-5 py-2"
          >
            <GoPlus size={20} />
            Save
          </button>
          <button
            type="button"
            // onClick={() => setAddNewAgent(false)}
            className="flex border border-[#132546] text-center text-[16px] rounded-[48px] text-[#132546] cursor-pointer font-medium gap-2 items-center px-5 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-10">
          <div className="">
            <h2>General information</h2>
            {/* Title Input */}
            <div className="flex flex-col gap-2 my-8">
              <label className="font-semibold text-[16px] text-[#132546]">
                Title{" "}
                <span className="text-[#B40808] font-semibold text-[18px]">
                  *
                </span>
              </label>
              <input
                type="text"
                name="title"
                value={agentForm.title}
                onChange={handleInputChange}
                placeholder="e.g. life coach"
                className={`border h-[48px] py-3 px-5 rounded-[24px] w-full outline-none 
                      ${errors.title ? "border-red-500" : "border-[#A5ABB3]"}`}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm ml-3">{errors.title}</p>
              )}
            </div>
            {/* Description Input */}
            <div className="flex flex-col gap-2 my-8">
              <label className="font-semibold text-[16px] text-[#132546]">
                Description{" "}
              </label>
              <p className="text-[16px] text-[#6D7580]">
                Describe what the AI agent does for the user. This is for the
                user's information only and will NOT be included in the agent's
                system instruction.
              </p>
              <input
                type="text"
                name="description"
                value={agentForm.description}
                onChange={handleInputChange}
                placeholder="e.g. life coah who can help you set and achive personal and proessional goals ."
                className="border border-[#A5ABB3] h-[48px] py-3 px-5 rounded-[24px] w-full outline-none"
              />
            </div>
            {/* categories Input */}
            <div className="flex flex-col gap-2 my-8">
              <label className="font-semibold text-[16px] text-[#132546]">
                categories ( optional ){" "}
                <span className="text-[#B40808] font-semibold text-[18px]">
                  *
                </span>
              </label>
              <p className="text-[16px] text-[#6D7580]">
                help you orgnize your aI agents. you can assign an AI agent to
                multiple categories .
              </p>
              <input
                type="text"
                name="title"
                value={agentForm.title}
                onChange={handleInputChange}
                placeholder="Enter Your categories or create new one"
                className={`border h-[48px] py-3 px-5 rounded-[24px] w-full outline-none 
                     ${errors.title ? "border-red-500" : "border-[#A5ABB3]"}`}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm ml-3">{errors.title}</p>
              )}
            </div>
            {/* Icons Input */}
            <div className="flex flex-col gap-2 my-8">
              <div className="flex gap-2 ">
                <div>
                  <img src={personImage} alt="personImage" />
                </div>
                <div>
                  <label className="font-semibold text-[16px] text-[#132546]">
                    porfile picture
                  </label>
                  <p className="text-[16px] text-[#6D7580]">
                    enter the AI agent’s porfile picture
                  </p>
                </div>
              </div>

              <input
                type="text"
                name="title"
                value={agentForm.title}
                onChange={handleInputChange}
                placeholder="https://"
                className={`border h-[48px] py-3 px-5 rounded-[24px] w-full outline-none 
                     ${errors.title ? "border-red-500" : "border-[#A5ABB3]"}`}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm ml-3">{errors.title}</p>
              )}
            </div>
            {/* System instruction* Input */}
            <div className="flex flex-col gap-2 my-8">
              <label className="font-semibold text-[16px] text-[#132546]">
                System instruction
                <span className="text-[#B40808] font-semibold text-[18px]">
                  *
                </span>
              </label>
              <p className="text-[16px] text-[#6D7580]">
                This will be used as the system instruction for the AI agent.
              </p>
              <textarea
                name="Systeminstruction"
                value={agentForm.title}
                onChange={handleInputChange}
                placeholder="e.g. life coah who can help you set and achive personal and proessional goals ."
                className={`border h-[268px] py-3 px-5 rounded-[24px] w-full outline-none 
                     ${errors.title ? "border-red-500" : "border-[#A5ABB3]"}`}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm ml-3">{errors.title}</p>
              )}
            </div>
            {/* Custom Toggle */}
            <div className="flex items-start gap-4 my-8">
              {/* Toggle Switch */}
              <label
                htmlFor="overrideSystemInstructionToggle"
                className={`relative block cursor-pointer h-8 w-14 rounded-full transition-colors 
                ${overrideSystemInstruction ? "bg-[#2E5AAC]" : "bg-gray-300"}`}
              >
                <input
                  type="checkbox"
                  id="overrideSystemInstructionToggle"
                  className="peer sr-only"
                  checked={overrideSystemInstruction}
                  onChange={() => setOverrideSystemInstruction((prev) => !prev)}
                />
                <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6"></span>
              </label>

              {/* Toggle Description */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="overrideSystemInstructionToggle"
                  className="text-[#132546] font-semibold text-[16px] cursor-pointer"
                >
                  Override system instructions
                </label>
                <label
                  htmlFor="overrideSystemInstructionToggle"
                  className="text-[14px] text-[#6D7580] leading-[20px] max-w-[480px]"
                >
                  By default, the AI agent's instruction will be appended to the
                  app's default system instruction (set in the model settings
                  popup). Check this box if you want to skip the previous system
                  instruction for this AI agent.
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 ">
            <div>
              <h2 className="text-[18px] font-semibold text-[#6D7580]">
                Base model
              </h2>
              {/* Custom Toggle */}
              <div className="flex flex-col gap-2 mt-5">
                <details className="group">
                  <summary className="flex items-center gap-3 cursor-pointer list-none">
                    <svg
                      className="w-5 h-5 text-[#132546] transition-transform duration-200 group-open:rotate-90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <h2 className="text-[18px] font-semibold text-[#132546] my-3">
                      Model & parameters
                    </h2>
                  </summary>

                  <div className="flex items-start gap-4 my-4">
                    {/* Toggle Switch */}
                    <label
                      htmlFor="assignSpecificModelToggle"
                      className={`relative block cursor-pointer h-8 w-14 rounded-full transition-colors 
                    ${assignSpecificModel ? "bg-[#2E5AAC]" : "bg-gray-300"}`}
                    >
                      <input
                        type="checkbox"
                        id="assignSpecificModelToggle"
                        className="peer sr-only"
                        checked={assignSpecificModel}
                        onChange={() => setAssignSpecificModel((prev) => !prev)}
                      />
                      <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6"></span>
                    </label>

                    {/* Toggle Description */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="assignSpecificModelToggle"
                        className="text-[#132546] font-semibold text-[16px] cursor-pointer"
                      >
                        Assign a specific model to this AI agent
                      </label>
                      <label
                        htmlFor="assignSpecificModelToggle"
                        className="text-[14px] text-[#6D7580] leading-[20px] max-w-[480px]"
                      >
                        Users can't change the model when using this AI agent.
                      </label>
                    </div>
                  </div>
                  {assignSpecificModel && (
                    <div>
                      <div className="w-full ">
                        <select className="border my-2 border-[#A5ABB3] bg-white text-[#09101D] text-[16px] font-medium h-[52px] px-4 py-2 rounded-[24px] w-full outline-none appearance-none">
                          {getEnabiledModels.map((model) => (
                            <option
                              value={model.name}
                              key={model.modelId}
                              className="text-[#09101D] bg-white hover:bg-gray-100 px-2 py-1"
                            >
                              {model.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-4 flex gap-2 items-center">
                        <label
                          htmlFor="getEnabelCustomModel"
                          className={`relative block cursor-pointer h-8 w-14 rounded-full transition-colors 
                          ${
                            getEnabelCustomModel
                              ? "bg-[#2E5AAC]"
                              : "bg-gray-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="getEnabelCustomModel"
                            className="peer sr-only"
                            checked={getEnabelCustomModel}
                            onChange={() =>
                              setGetEnabelCustomModel((prev) => !prev)
                            }
                          />
                          <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6"></span>
                        </label>

                        {/* Toggle Description */}
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor="getEnabelCustomModel"
                            className="text-[#132546] font-semibold text-[16px] cursor-pointer"
                          >
                            Assign custom model parameters for this AI agent
                          </label>
                        </div>
                      </div>
                      {getEnabelCustomModel && (
                        <div className="border-l ps-5 border-[#A5ABB3]">
                          <div className="my-3">
                            <h2>
                              Context Limit: (All){" "}
                              <span className="text-[#2E5AAC] cursor-pointer">
                                (Reset to default)
                              </span>
                            </h2>
                            <p className="text-[#6D7580] text-[16px] font-normal my-4 w-[532px]">
                              Upload documents to help the AI agent understand
                              your domain knowledge better. The documents will
                              be included directly to the model's system
                              instruction.
                            </p>
                          </div>
                          <div>
                            <select className="border border-[#A5ABB3] bg-white text-[#09101D] text-[16px] font-medium h-[48px] px-4 py-2 rounded-[24px] w-full outline-none appearance-none">
                              {messageArray.map((model) => (
                                <option
                                  value={model.value}
                                  key={model.value}
                                  className="text-[#09101D] bg-white hover:bg-gray-100 px-2 py-1"
                                >
                                  {model.message}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <h2>
                              Temperature: DEFAULT{" "}
                              <span className="text-[#2E5AAC]">(change)</span>
                              <p className="text-[#6D7580] text-[16px] font-normal my-4 w-[532px]">
                                Higher values like 0.8 will make the output more
                                random, while lower values like 0.2 will make it
                                more focused and deterministic.
                              </p>
                            </h2>
                          </div>
                          <div>
                            <h2>
                              Presence Penalty: DEFAULT{" "}
                              <span className="text-[#2E5AAC]">(change)</span>
                            </h2>
                            <p className="text-[#6D7580] text-[16px] font-normal my-4 w-[532px]">
                              How much to penalize new tokens based on whether
                              they appear in the text so far. Increases the
                              model's likelihood to talk about new topics.
                            </p>
                          </div>
                          <div>
                            <h2>
                              Frequency Penalty:DEFAULT{" "}
                              <span className="text-[#2E5AAC]">(change)</span>
                            </h2>
                            <p className="text-[#6D7580] text-[16px] font-normal my-4 w-[532px]">
                              How much to penalize new tokens based on their
                              existing frequency in the text so far. Decreases
                              the model's likelihood to repeat the same line
                              verbatim.
                            </p>
                          </div>
                          <div>
                            <h2>
                              Top P:DEFAULT{" "}
                              <span className="text-[#2E5AAC]">(change)</span>
                            </h2>
                            <p className="text-[#6D7580] text-[16px] font-normal my-4 w-[532px]">
                              An alternative to sampling with temperature,
                              called nucleus sampling, where the model considers
                              the results of the tokens with top_p probability
                              mass. So 0.1 means only the tokens comprising the
                              top 10% probability mass are considered.
                            </p>
                          </div>
                          <div>
                            <h2>
                              Top K: DEFAULT{" "}
                              <span className="text-[#2E5AAC]">(change)</span>
                            </h2>
                            <p className="text-[#6D7580] text-[16px] font-normal my-4 w-[532px]">
                              Only sample from the top K options for each
                              subsequent token. Used to remove "long tail" low
                              probability responses. Min: 0
                            </p>
                          </div>
                          <div>
                            <h2>
                              Max Tokens: DEFAULT{" "}
                              <span className="text-[#2E5AAC]">(change)</span>
                            </h2>
                            <p className="text-[#6D7580] text-[16px] font-normal my-4 w-[532px]">
                              The maximum number of tokens to generate before
                              stopping.
                            </p>
                          </div>
                          <div>
                            <h2 className="text-[18px] font-semibold text-[#132546]">
                              Safety Settings (Gemini Only): Custom{" "}
                              <span
                                className="text-[#2E5AAC] cursor-pointer"
                                onClick={toggleSafetySettings}
                              >
                                {showSafetySliders
                                  ? "(Reset to default)"
                                  : "(Change)"}
                              </span>
                            </h2>
                            <p className="text-[#6D7580] text-[16px] font-normal my-4 w-[532px]">
                              Content is blocked based on the probability that
                              it is harmful.
                            </p>

                            {showSafetySliders && (
                              <div>
                                <SafetySlider
                                  label="Harassment"
                                  name="harassment"
                                  value={safetySettings.harassment}
                                  onChange={(name, val) => {
                                    console.log(`${name} changed to: ${val}`);
                                    setSafetySettings((prev) => ({
                                      ...prev,
                                      [name]: val,
                                    }));
                                  }}
                                />
                                <SafetySlider
                                  label="Hate Speech"
                                  name="hateSpeech"
                                  value={safetySettings.hateSpeech}
                                  onChange={(name, val) =>
                                    setSafetySettings((prev) => ({
                                      ...prev,
                                      [name]: val,
                                    }))
                                  }
                                />
                                <SafetySlider
                                  label="Sexually Explicit"
                                  name="sexuallyExplicit"
                                  value={safetySettings.sexuallyExplicit}
                                  onChange={(name, val) =>
                                    setSafetySettings((prev) => ({
                                      ...prev,
                                      [name]: val,
                                    }))
                                  }
                                />
                                <SafetySlider
                                  label="Dangerous"
                                  name="dangerous"
                                  value={safetySettings.dangerous}
                                  onChange={(name, val) =>
                                    setSafetySettings((prev) => ({
                                      ...prev,
                                      [name]: val,
                                    }))
                                  }
                                />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2>Prompt Caching</h2>
                              <label
                                htmlFor="promptCaching"
                                className={`relative block cursor-pointer h-8 w-14 rounded-full transition-colors 
                          ${promptCaching ? "bg-[#2E5AAC]" : "bg-gray-300"}`}
                              >
                                <input
                                  type="checkbox"
                                  id="promptCaching"
                                  className="peer sr-only"
                                  checked={promptCaching}
                                  onChange={() =>
                                    setPromptCaching((prev) => !prev)
                                  }
                                />
                                <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6"></span>
                              </label>
                            </div>
                            <p className="text-[#6D7580] text-[16px] font-normal my-4 w-[532px]">
                              Prompt caching helps save token costs for long
                              conversations. Enabling this will incur additional
                              tokens when initiating the cache for the first
                              time, but it can save many more tokens later,
                              especially for long conversations. Not all models
                              support caching, and some models require a minimum
                              number of tokens for caching to be initiated.
                              Please check with your AI model provider for more
                              information.
                            </p>
                            <div>
                              <h2>
                                Reasoning Effort (Reasoning models only):
                                DEFAULT{" "}
                                <span className="text-[#2E5AAC]">(change)</span>
                              </h2>
                              <p className="text-[#6D7580] text-[16px] font-normal my-4 w-[532px]">
                                Constrains effort on reasoning for reasoning
                                models. Reducing reasoning effort can result in
                                faster responses and fewer tokens used on
                                reasoning in a response.
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2>Custom Model Parameters</h2>
                              <label
                                htmlFor="customModelParameters"
                                className={`relative block cursor-pointer h-8 w-14 rounded-full transition-colors 
                          ${
                            customModelParameters
                              ? "bg-[#2E5AAC]"
                              : "bg-gray-300"
                          }`}
                              >
                                <input
                                  type="checkbox"
                                  id="customModelParameters"
                                  className="peer sr-only"
                                  checked={customModelParameters}
                                  onChange={() =>
                                    setCustomModelParameters((prev) => !prev)
                                  }
                                />
                                <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6"></span>
                              </label>
                            </div>
                            <p className="text-[#6D7580] text-[16px] font-normal my-4 w-[532px]">
                              Prompt caching helps save token costs for long
                              conversations. Enabling this will incur additional
                              tokens when initiating the cache for the first
                              time, but it can save many more tokens later,
                              especially for long conversations. Not all models
                              support caching, and some models require a minimum
                              number of tokens for caching to be initiated.
                              Please check with your AI model provider for more
                              information.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </details>
              </div>
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-[#6D7580]">
                Skills
              </h2>
              <details className="group my-8">
                <summary className="flex items-center gap-3 cursor-pointer list-none">
                  <svg
                    className="w-5 h-5 text-[#132546] transition-transform duration-200 group-open:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <h2 className="text-[18px] font-semibold text-[#132546]">
                    Plugins
                  </h2>
                </summary>
                <div className="flex items-start gap-4 mt-4">
                  {/* Toggle Switch */}
                  <label
                    htmlFor="skillPlugin"
                    className={`relative block cursor-pointer h-8 w-14 rounded-full transition-colors 
                    ${skillPlugin ? "bg-[#2E5AAC]" : "bg-gray-300"}`}
                  >
                    <input
                      type="checkbox"
                      id="skillPlugin"
                      className="peer sr-only"
                      checked={skillPlugin}
                      onChange={() => setSkillPlugin((prev) => !prev)}
                    />
                    <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6"></span>
                  </label>

                  {/* Toggle Description */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="skillPlugin"
                      className="text-[#132546] font-semibold text-[16px] cursor-pointer"
                    >
                      Assign plugins for this AI agent
                    </label>
                    <label
                      htmlFor="skillPlugin"
                      className="text-[14px] text-[#6D7580] leading-[20px] max-w-[480px]"
                    >
                      Users can't change the plugins when using this AI agent.
                    </label>
                  </div>
                </div>
                {/* Plugins Fetch all plugins here*/}
              </details>
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-[#6D7580]">
                knowledge
              </h2>
              <details className="group my-8">
                <summary className="flex items-center gap-3 cursor-pointer list-none">
                  <svg
                    className="w-5 h-5 text-[#132546] transition-transform duration-200 group-open:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <h2 className="text-[18px] font-semibold text-[#132546]">
                    Training Files
                  </h2>
                </summary>
                <div>
                  <p className="text-[16px] text-[#6D7580] mt-10 mb-2">
                    Upload documents to help the AI agent understand your domain
                    knowledge better. The documents will be included directly to
                    the model's system instruction.
                  </p>
                  <span className="text-[#B40808] my-4">
                    To add training files, you must assign a model for this AI
                    agent first.
                  </span>
                  <div className="flex flex-col gap-2 my-4">
                    {/* Label as Button */}
                    <label
                      htmlFor="fileInput"
                      className="flex items-center gap-2 px-4 py-2 font-semibold text-[18px] rounded-lg cursor-pointer w-fit transition"
                    >
                      <FiUpload className="text-xl " />
                      Select Files
                    </label>

                    {/* Hidden Input */}
                    <input
                      type="file"
                      id="fileInput"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {/* File Name */}
                    {fileName && (
                      <span className="text-sm text-[#6D7580] font-medium">
                        Selected file: {fileName}
                      </span>
                    )}
                  </div>
                </div>
              </details>
            </div>
            <div className="">
              <h2 className="text-[18px] font-semibold text-[#6D7580]">
                Chat experience
              </h2>
              <details className="group my-8">
                <summary className="flex items-center gap-3 cursor-pointer list-none">
                  <svg
                    className="w-5 h-5 text-[#132546] transition-transform duration-200 group-open:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <h2 className="text-[18px] font-semibold text-[#132546]">
                    Welcome message
                  </h2>
                </summary>
                <h2 className="my-4">
                  The first message to send to the user when start a new chat.
                </h2>
                <input
                  type="text"
                  name="welcomeMessage"
                  value={agentForm.title}
                  onChange={handleInputChange}
                  placeholder="e.g. life coach"
                  className={`border h-[48px] py-3 px-5 rounded-[24px] w-full outline-none 
                      ${errors.title ? "border-red-500" : "border-[#A5ABB3]"}`}
                  required
                />
              </details>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateAgent;
