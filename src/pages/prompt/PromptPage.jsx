import { useEffect, useRef, useState } from "react";
import { GoDotFill, GoPencil, GoPlus } from "react-icons/go";
import { CiStar } from "react-icons/ci";
import { IoMdSettings } from "react-icons/io";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import axiosInstance from "../../api/axiosInstance";

// Icon imports (kept from original code)
import agentIconButton from "/public/images/icons/agentIconButton.svg";
import copyIcon from "/public/images/icons/Copyicon.png";
import trashIcon from "/public/images/icons/trashIcon.png";
import penIcon from "/public/images/icons/pen.png";
import starIcon from "/public/images/icons/star.png";
import agentmenuIcon from "/public/images/icons/agentMenue.png";
import agentmenu2Icon from "/public/images/icons/agentmenue2.png";
import filterIcon from "/public/images/icons/promptIconeFilter.png";

function PromptPage() {
  const [isaddPrompt, setIsAddPrompt] = useState(false);
  const [openTips, setOpenTips] = useState([]);
  const [showTipsSection, setShowTipsSection] = useState(false);
  const [myPrompts, setMyPrompts] = useState([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const deleteTimeoutRef = useRef(null);

  // New state for form inputs with improved validation
  const [grideOne, setGrideOne] = useState(true);
  const [promptForm, setPromptForm] = useState({
    title: "",
    description: "",
    content: "",
    tags: [],
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Handle input changes with validation
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

  // Handle tags input
  const handleTagsChange = (e) => {
    const tagArray = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    setPromptForm((prev) => ({
      ...prev,
      tags: tagArray,
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!promptForm.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!promptForm.content.trim()) {
      newErrors.content = "Prompt content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axiosInstance.post("Prompt/Create", promptForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessUsertoken")}`,
        },
      });

      console.log(response.data);
      setPromptForm({
        title: "",
        description: "",
        content: "",
        tags: [],
      });
      handleMyPrompts();
      setIsAddPrompt(false);
    } catch (error) {
      console.error("Error creating prompt:", error);
      alert("Failed to create prompt");
    }
  };

  // Existing toggle functions
  const toggleTip = (tipId) => {
    setOpenTips((prev) =>
      prev.includes(tipId)
        ? prev.filter((id) => id !== tipId)
        : [...prev, tipId]
    );
  };

  const toggleTipsSection = () => {
    setShowTipsSection(!showTipsSection);
  };
  // Fetch my Prompt
  const handleMyPrompts = async () => {
    try {
      const response = await axiosInstance.get("Prompt/GetMyPrompts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessUsertoken")}`,
        },
      });
      console.log(response.data);
      setMyPrompts(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  // handle Delete Prompt
  const handleDeletePrompt = async (promptId) => {
    try {
      const response = await axiosInstance.delete(`Prompt/${promptId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessUsertoken")}`,
        },
      });
      console.log(response.data);
      handleMyPrompts();
    } catch (error) {
      console.log(error);
    }
  };
  const handleisdelete = (promptId) => {
    setDeleteConfirmId(promptId);

    // Clear any existing timeout
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
    }

    // Set timeout to reset after 2 seconds
    deleteTimeoutRef.current = setTimeout(() => {
      setDeleteConfirmId(null);
    }, 2000);
  };
  useEffect(() => {
    handleMyPrompts();
  }, []);
  return (
    <div>
      {isaddPrompt ? (
        <div className="px-3">
          <div className="flex justify-between items-center mt-5">
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="text-[#09101D] text-[24px] font-bold flex items-center gap-2">
                My Prompt{" "}
                <span className="cursor-pointer">
                  <CiStar size={25} className="text-[#09101D]" />
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
                onClick={() => handleSubmit()}
                className="flex bg-gradient-to-r text-[16px] font-medium rounded-[48px] text-white cursor-pointer from-[#2E5AAC] gap-2 items-center pe-5 ps-4 py-2 to-[#132546]"
              >
                <GoPlus size={20} />
                Add Prompt
              </button>
              <button
                type="button"
                onClick={() => setIsAddPrompt(false)}
                className="flex border border-[#132546] text-center text-[16px] rounded-[48px] text-[#132546] cursor-pointer font-medium gap-2 items-center px-5 py-2"
              >
                Cancel
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="">
                <h2 className="text-[#6D7580] text-start text-[16px] font-bold flex items-center gap-2">
                  <span>
                    <GoPencil />
                  </span>
                  Prompt Details
                </h2>

                {/* Title Input */}
                <div className="flex flex-col gap-2 my-5">
                  <label className="font-semibold text-[16px] text-[#132546]">
                    Title{" "}
                    <span className="text-[#B40808] font-semibold text-[18px]">
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={promptForm.title}
                    onChange={handleInputChange}
                    placeholder="E.g., Domain Names 'Inspirations'"
                    className={`border h-[48px] py-3 px-5 rounded-[24px] w-full outline-none 
                      ${errors.title ? "border-red-500" : "border-[#A5ABB3]"}`}
                    required
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm ml-3">{errors.title}</p>
                  )}
                </div>

                {/* Description Input */}
                <div className="flex flex-col gap-2 my-5">
                  <label className="font-semibold text-[16px] text-[#132546]">
                    Description{" "}
                  </label>
                  <p className="text-[16px] text-[#6D7580]">
                    Describe what the prompt does for the user.
                  </p>
                  <textarea
                    name="description"
                    value={promptForm.description}
                    onChange={handleInputChange}
                    placeholder="Enter a detailed description"
                    className="border border-[#A5ABB3] h-[96px] py-3 px-5 rounded-[24px] w-full outline-none"
                  />
                </div>

                {/* Content Input */}
                <div className="flex flex-col gap-2 my-5">
                  <label className="font-semibold text-[16px] text-[#132546]">
                    Prompt{" "}
                    <span className="text-[#B40808] font-semibold text-[18px]">
                      *
                    </span>
                  </label>
                  <p className="text-[16px] text-[#6D7580]">
                    {
                      " Use {{field 1}} {{field 2}} {{or anything}} to indicate the fill in the blank part."
                    }
                  </p>
                  <textarea
                    name="content"
                    value={promptForm.content}
                    onChange={handleInputChange}
                    placeholder="Enter your prompt here"
                    className={`border h-[268px] py-3 px-5 rounded-[24px] w-full outline-none 
                      ${
                        errors.content ? "border-red-500" : "border-[#A5ABB3]"
                      }`}
                    required
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm ml-3">
                      {errors.content}
                    </p>
                  )}
                </div>
              </div>

              <div className="">
                <h2 className="text-[#6D7580] text-[16px] font-bold flex items-center gap-2">
                  <span>
                    <IoMdSettings />
                  </span>
                  Settings & Tips
                </h2>

                {/* Tags Input */}
                <div className="flex flex-col gap-2 my-5">
                  <label className="font-semibold text-[16px] text-[#132546]">
                    Tags{" "}
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={promptForm.tags.join(", ")}
                    onChange={handleTagsChange}
                    placeholder="E.g., Domain Names, Inspirations"
                    className="border border-[#A5ABB3] h-[48px] py-3 px-5 rounded-[24px] w-full outline-none"
                  />
                </div>

                {/* Tips Section */}
                <div className="flex flex-col gap-2 my-5">
                  <div
                    className="cursor-pointer p-3"
                    onClick={toggleTipsSection}
                  >
                    <div className="flex items-center">
                      {showTipsSection ? (
                        <FiChevronUp
                          className="text-[#132546] mr-2"
                          size={25}
                        />
                      ) : (
                        <FiChevronDown
                          className="text-[#132546] mr-2"
                          size={25}
                        />
                      )}
                      <label className="font-semibold text-[18px] text-[#2C3A4B] cursor-pointer leading-[20px]">
                        Tips
                      </label>
                    </div>
                  </div>

                  {showTipsSection && (
                    <div className="flex flex-col gap-2 p-2 mt-2">
                      {/* Queue Tips */}
                      <div
                        className="cursor-pointer p-2 mb-1"
                        onClick={() => toggleTip("queue")}
                      >
                        <div className="flex justify-between items-center bg-[#F4F6FF] p-4 rounded-[24px]">
                          <h3 className="font-medium text-[#2C3A4B] text-[16px]">
                            How to Use Queue for Prompt Chaining
                          </h3>
                          {openTips.includes("queue") ? (
                            <FiChevronUp className="text-[#132546] mr-2" />
                          ) : (
                            <FiChevronDown className="text-[#132546] mr-2" />
                          )}
                        </div>

                        {openTips.includes("queue") && (
                          <div className="mt-2 pl-6">
                            <ul className="list-disc pl-6 text-[#132546] text-[14px] font-medium flex flex-col gap-6">
                              <li>
                                Use ---- (four dashes) to separate different
                                sections of a queue
                              </li>
                              <li>
                                Example:
                                <div className="pl-4 mt-1 border-l-2 border-gray-300 text-gray-700">
                                  <p>Task 1: Complete the report</p>
                                  <p>----</p>
                                  <p>Task 2: Schedule a meeting</p>
                                </div>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Best Practices */}
                      <div
                        className="cursor-pointer p-2 mb-1"
                        onClick={() => toggleTip("practices")}
                      >
                        <div className="flex justify-between items-center bg-[#F4F6FF] p-4 rounded-[24px]">
                          <h3 className="font-medium text-[#2C3A4B] text-[16px]">
                            How To Mention AI Agents
                          </h3>
                          {openTips.includes("practices") ? (
                            <FiChevronUp className="text-[#132546] mr-2" />
                          ) : (
                            <FiChevronDown className="text-[#132546] mr-2" />
                          )}
                        </div>

                        {openTips.includes("practices") && (
                          <div className="mt-2 pl-6">
                            <ul className="list-disc pl-6 text-[#132546] text-[14px] font-medium flex flex-col gap-6">
                              <li>
                                Use @[Agent Name] to add a specific AI agent
                                into the conversation.
                              </li>
                              <li>Example:</li>
                              <p className="pl-4 mt-1 border-l-2 border-gray-300 text-gray-700">
                                Hey @[Marketing Expert], can you help create a
                                business plan for this quarter?
                              </p>
                              <li>
                                You can mention multiple agents using queue
                                syntax:
                              </li>
                              <div className="pl-4 mt-1 border-l-2 border-gray-300 text-gray-700">
                                <p>
                                  @[Research Analyst], what is the recent data
                                  on smartphone sales?
                                </p>
                                <p>----</p>
                                <p>
                                  @[Marketing Expert], based on the data,
                                  propose a marketing strategy.
                                </p>
                              </div>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Variables */}
                      <div
                        className="cursor-pointer p-2 mb-1"
                        onClick={() => toggleTip("variables")}
                      >
                        <div className="flex justify-between items-center bg-[#F4F6FF] p-4 rounded-[24px]">
                          <h3 className="font-medium text-[#2C3A4B] text-[16px]">
                            Template Variables
                          </h3>
                          {openTips.includes("variables") ? (
                            <FiChevronUp className="text-[#132546] mr-2" />
                          ) : (
                            <FiChevronDown className="text-[#132546] mr-2" />
                          )}
                        </div>

                        {openTips.includes("variables") && (
                          <div className="mt-2 pl-6">
                            <ul className="list-disc pl-6 text-[#132546] text-[14px] font-medium flex flex-col gap-6">
                              <li>
                                Use double curly braces to create variables:{" "}
                                {"{{"}variable{"}}"}
                              </li>
                              <li>
                                Make variable names descriptive: {"{{"}
                                company_name{"}}"}
                              </li>
                              <li>
                                You can include default values or instructions
                                in variable names
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="px-3">
          <div className="flex justify-between items-center mt-5">
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="text-[#09101D] text-[24px] font-bold">
                Prompt Library
              </h2>
              <p className="text-[#858C94] text-[14px] font-normal ">
                Prompts are message templates that you can quickly fill in to
                use in chat, work with AI agents, or build your workflow.
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setIsAddPrompt(true)}
                className="flex bg-gradient-to-r text-[16px] font-medium rounded-[48px] text-white cursor-pointer from-[#2E5AAC] gap-2 items-center pe-5 ps-4 py-2 to-[#132546]"
              >
                <GoPlus size={20} />
                Add Prompt
              </button>
              <button className="flex border border-[#132546] text-[16px] rounded-[48px] text-[#132546] cursor-pointer font-medium gap-2 items-center pe-5 ps-4 py-2">
                <img
                  loading="lazy"
                  src={agentIconButton}
                  alt="agentIconButton"
                />{" "}
                Browse Prompts
              </button>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <div className="flex flex-col w-full gap-10">
              <div className="w-full flex gap-2 items-center">
                <div className="w-[100%] ">
                  <input
                    type="text"
                    placeholder="Search"
                    className="border border-[#A5ABB3] h-[56px] p-2 rounded-[184px] w-full outline-none"
                  />
                </div>
                <div className="flex gap-4 w-[45%] items-center">
                  <div className="w-[38%]">
                    <button className="border flex gap-1 text-[16px] font-normal items-center cursor-pointer text-[#132546s] border-[#DADEE3] h-[56px] p-2 rounded-[184px] w-full outline-none">
                      <img src={filterIcon} alt="filterIcon" />
                      Filter by tags
                    </button>
                  </div>
                  <div className="w-[30%]">
                    <select className="cursor-pointer border text-center border-[#394452] h-[56px] p-2 rounded-[184px] w-full outline-none">
                      <option value="Tech">Tech</option>
                      <option value="Desgin">Desgin</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>
                  <div className="flex gap-4 items-center transition-all duration-300  ease-in-out">
                    <div
                      onClick={() => setGrideOne(true)}
                      className={` cursor-pointer p-2 w-[40px] h-[40px] transition-all duration-300  ease-in-out ${
                        grideOne ? "bg-[#F4F6FF] rounded-[24px]" : "bg-white"
                      }`}
                    >
                      <img
                        className="cursor-pointer w-[24px] h-[24px]"
                        src={agentmenuIcon}
                        alt="agentmenuIcon"
                      />
                    </div>
                    <div
                      onClick={() => setGrideOne(false)}
                      className={` cursor-pointer p-2 w-[40px] h-[40px] transition-all duration-300  ease-in-out ${
                        grideOne ? "bg-white" : "bg-[#F4F6FF] rounded-[24px]"
                      }`}
                    >
                      <img
                        className="cursor-pointer  w-[24px] h-[24px]"
                        src={agentmenu2Icon}
                        alt="agentmenu2Icon"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="transition-all duration-300 ease-in-out">
                <div
                  className={`grid ${
                    grideOne ? "grid-cols-2" : "grid-cols-1"
                  } gap-8 transition-all duration-300 ease-in-out`}
                >
                  {myPrompts.length === 0 ? (
                    <div className="col-span-full text-center text-[#6D7580] text-[16px] font-medium py-10">
                      You have no saved prompts. Tap{" "}
                      <span
                        className="text-[#2E5AAC] font-semibold cursor-pointer"
                        onClick={() => setIsAddPrompt(true)}
                      >
                        You have no saved prompts. Tap {"Add Prompt"} to add a
                        new prompt.
                      </span>{" "}
                    </div>
                  ) : (
                    myPrompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className="bg-white border-[#132546] border-t-0 border-r-0 border-5 p-4.5 rounded-[24px] w-full h-[203px] transition-all duration-300 ease-in-out"
                      >
                        <div className="flex flex-col gap-2 my-2">
                          <h3 className="text-[20px] font-bold text-[#09101D]">
                            {prompt.title}
                          </h3>
                          <p className="text-[#858C94] text-[14px] font-normal mb-3 border-b border-[#EBEEF2] pb-3">
                            {prompt.description}
                          </p>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 transition-all duration-300 ease-in-out">
                            {/* Star Icon */}
                            <div className="relative group transition-all duration-300 ease-in-out">
                              <img
                                src={starIcon}
                                className="cursor-pointer w-[28px] h-[28px] p-1 rounded-[8px]"
                                alt="starIcon"
                              />
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#132546] text-white text-[12px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-10">
                                Favorite
                              </div>
                            </div>

                            {/* Copy Icon */}
                            <div className="relative group">
                              <img
                                src={copyIcon}
                                className="cursor-pointer w-[28px] h-[28px] p-1 rounded-[8px]"
                                alt="copyIcon"
                              />
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#132546] text-white text-[12px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-10">
                                Copy
                              </div>
                            </div>

                            {/* Edit Icon */}
                            <div className="relative group">
                              <img
                                src={penIcon}
                                className="cursor-pointer w-[28px] h-[28px] p-1 rounded-[8px]"
                                alt="penIcon"
                              />
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#132546] text-white text-[12px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-10">
                                Edit
                              </div>
                            </div>

                            {/* Delete Icon or Confirm */}
                            {deleteConfirmId === prompt.id ? (
                              <span
                                onClick={() => {
                                  handleDeletePrompt(prompt.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="cursor-pointer text-red-600 font-semibold"
                              >
                                Sure?
                              </span>
                            ) : (
                              <div className="relative group">
                                <img
                                  src={trashIcon}
                                  onClick={() => handleisdelete(prompt.id)}
                                  className="cursor-pointer w-[28px] h-[28px] p-1 rounded-[8px]"
                                  alt="trashIcon"
                                />
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#132546] text-white text-[12px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-10">
                                  Delete
                                </div>
                              </div>
                            )}
                          </div>

                          <button className="bg-[#132546] text-white cursor-pointer py-1 px-4 rounded-[24px]">
                            chat now
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PromptPage;
