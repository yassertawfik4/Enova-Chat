import { GoDotFill, GoPlus } from "react-icons/go";
import agentIconButton from "/public/images/icons/agentIconButton.svg";
import copyIcon from "/public/images/icons/Copyicon.png";
import trashIcon from "/public/images/icons/trashIcon.png";
import pinIcon from "/public/images/icons/pinIcon.png";
import shareIcon from "/public/images/icons/shareIcon.png";
import penIcon from "/public/images/icons/pen.png";
import agentImage from "/public/images/agentImage.png";
import agentmenuIcon from "/public/images/icons/agentMenue.png";
import agentmenu2Icon from "/public/images/icons/agentmenue2.png";
import { useEffect, useState } from "react";
import { RiPushpinFill } from "react-icons/ri";
import axiosInstance from "../../api/axiosInstance";
import personImage from "/public/images/persone.png";
function AgentPage() {
  const [addNewAgent, setAddNewAgent] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [getEnabiledModels, setGetEnabiledModels] = useState([]);

  const [agentForm, setAgentForm] = useState({
    title: "",
    description: "",
    content: "",
    tags: [],
  });
  const [errors, setErrors] = useState({});
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
  useEffect(() => {
    handleGetAllModels();
  }, []);
  return (
    <div>
      {addNewAgent ? (
        <div className="px-3">
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
                onClick={() => setAddNewAgent(false)}
                className="flex border border-[#132546] text-center text-[16px] rounded-[48px] text-[#132546] cursor-pointer font-medium gap-2 items-center px-5 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              <div>
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
                    Describe what the AI agent does for the user. This is for
                    the user's information only and will NOT be included in the
                    agent's system instruction.
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
                    help you orgnize your aI agents. you can assign an AI agent
                    to multiple categories .
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
                    This will be used as the system instruction for the AI
                    agent.
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
                    htmlFor="overrideToggle"
                    className={`relative block cursor-pointer h-8 w-14 rounded-full transition-colors 
    ${isToggled ? "bg-[#2E5AAC]" : "bg-gray-300"}`}
                  >
                    <input
                      type="checkbox"
                      id="overrideToggle"
                      className="peer sr-only"
                      checked={isToggled}
                      onChange={() => setIsToggled((prev) => !prev)}
                    />
                    <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6"></span>
                  </label>

                  {/* Toggle Description */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="overrideToggle"
                      className="text-[#132546] font-semibold text-[16px] cursor-pointer"
                    >
                      Override system instructions
                    </label>
                    <label
                      htmlFor="overrideToggle"
                      className="text-[14px] text-[#6D7580] leading-[20px] max-w-[480px]"
                    >
                      By default, the AI agent's instruction will be appended to
                      the app's default system instruction (set in the model
                      settings popup). Check this box if you want to skip the
                      previous system instruction for this AI agent.
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h2>Base model</h2>
                {/* Custom Toggle */}
                <div className="flex flex-col gap-2 my-8">
                  <h2>Model & parameters</h2>
                  <div className="flex items-start gap-4 mt-3">
                    {/* Toggle Switch */}

                    <label
                      htmlFor="overrideToggle"
                      className={`relative block cursor-pointer h-8 w-14 rounded-full transition-colors 
    ${isToggled ? "bg-[#2E5AAC]" : "bg-gray-300"}`}
                    >
                      <input
                        type="checkbox"
                        id="overrideToggle"
                        className="peer sr-only"
                        checked={isToggled}
                        onChange={() => setIsToggled((prev) => !prev)}
                      />
                      <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6"></span>
                    </label>

                    {/* Toggle Description */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="overrideToggle"
                        className="text-[#132546] font-semibold text-[16px] cursor-pointer"
                      >
                        Assign a specific model to this AI agent
                      </label>
                      <label
                        htmlFor="overrideToggle"
                        className="text-[14px] text-[#6D7580] leading-[20px] max-w-[480px]"
                      >
                        Users can't change the model when using this AI agent.
                      </label>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <select className="border border-[#A5ABB3] bg-white text-[#09101D] text-[16px] font-medium h-[48px] px-4 py-2 rounded-[24px] w-full outline-none appearance-none">
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
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="px-3">
          <div className="flex justify-between items-center mt-5">
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="text-[#09101D] text-[40px] font-bold">Agents</h2>
              <p className="text-[#858C94] text-[18px] font-medium leading-[16px]">
                Agents Are Pre-Built AI Assistants For Specific Tasks{" "}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setAddNewAgent(true)}
                className="flex bg-gradient-to-r rounded-[48px] text-white cursor-pointer from-[#2E5AAC] gap-2 items-center pe-5 ps-4 py-1.5 to-[#132546]"
              >
                <GoPlus size={20} />
                Create AI Agent
              </button>
              <button className="flex border border-[#132546] rounded-[48px] text-[#132546] cursor-pointer font-medium gap-2 items-center pe-5 ps-4 py-1.5">
                <img
                  loading="lazy"
                  src={agentIconButton}
                  alt="agentIconButton"
                />{" "}
                Create Agent
              </button>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <div className="bg-[#F4F6FF] h-[calc(100vh-100px)] p-8 rounded-[24px] w-[198px] sticky top-0">
              <ul className="flex flex-col text-[18px] font-medium gap-8 leading-[16px]">
                <li className="cursor-pointer">Tech</li>
                <li className="cursor-pointer">Desgin</li>
                <li className="cursor-pointer">Marketing </li>
                <li className="cursor-pointer">Sales</li>
              </ul>
            </div>
            <div className="flex flex-col w-full gap-10">
              <div className="w-full flex gap-6 items-center">
                <div className="w-[100%] ">
                  <input
                    type="text"
                    placeholder="Search"
                    className="border border-[#A5ABB3] h-[56px] p-2 rounded-[184px] w-full outline-none"
                  />
                </div>
                <div className="flex gap-6 w-[20%] items-center">
                  <div className="w-[50%]">
                    <select className="border border-[#394452] h-[56px] p-2 rounded-[184px] w-full outline-none">
                      <option value="Tech">Tech</option>
                      <option value="Desgin">Desgin</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>
                  <div className="flex gap-8 items-center">
                    <div className="bg-[#F4F6FF] rounded-[24px] p-2 w-[40px] h-[40px]">
                      <img
                        className="cursor-pointer  w-[24px] h-[24px]"
                        src={agentmenuIcon}
                        alt="agentmenuIcon"
                      />
                    </div>
                    <div className="p-2 w-[40px] h-[40px]">
                      <img
                        className="cursor-pointer  w-[24px] h-[24px]"
                        src={agentmenu2Icon}
                        alt="agentmenu2Icon"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[#09101D] text-[32px] font-semibold mb-6">
                  Tech
                </h2>
                <div className="flex gap-8">
                  <div className="bg-white border-[#DADEE3] border-2 p-4.5 rounded-[24px]">
                    <div className="flex justify-end gap-2">
                      <img
                        src={copyIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="copyIcon"
                      />
                      <img
                        src={trashIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="trashIcon"
                      />
                      <img
                        src={penIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="penIcon"
                      />
                      <img
                        src={shareIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="shareIcon"
                      />
                      <img
                        src={pinIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="pinIcon"
                      />
                    </div>
                    <div className="flex flex-col gap-2 my-2">
                      <img
                        className="w-[48px] h-[48px]"
                        src={agentImage}
                        alt="agentImage"
                      />
                      <h3 className="text-[20px] font-bold text-[#09101D]">
                        pro coder
                      </h3>
                      <p className="text-[#858C94] text-[14px] font-normal mb-3">
                        Help you write code without overexplain things too much
                        using only its internal knowledge and treat like a.....
                      </p>
                    </div>
                    <div className="flex justify-end items-end w-full">
                      <button className="bg-[#132546] text-white cursor-pointer py-1 px-4 rounded-[24px]">
                        chat now
                      </button>
                    </div>
                  </div>
                  <div className="bg-white border-[#DADEE3] border-2 p-4.5 rounded-[24px]">
                    <div className="flex justify-end gap-2">
                      <img
                        src={copyIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="copyIcon"
                      />
                      <img
                        src={trashIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="trashIcon"
                      />
                      <img
                        src={penIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="penIcon"
                      />
                      <img
                        src={shareIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="shareIcon"
                      />
                      <img
                        src={pinIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="pinIcon"
                      />
                    </div>
                    <div className="flex flex-col gap-2 my-2">
                      <img
                        className="w-[48px] h-[48px]"
                        src={agentImage}
                        alt="agentImage"
                      />
                      <h3 className="text-[20px] font-bold text-[#09101D]">
                        pro coder
                      </h3>
                      <p className="text-[#858C94] text-[14px] font-normal mb-3">
                        Help you write code without overexplain things too much
                        using only its internal knowledge and treat like a.....
                      </p>
                    </div>
                    <div className="flex justify-end items-end w-full">
                      <button className="bg-[#132546] text-white cursor-pointer py-1 px-4 rounded-[24px]">
                        chat now
                      </button>
                    </div>
                  </div>
                  <div className="bg-white border-[#DADEE3] border-2 p-4.5 rounded-[24px]">
                    <div className="flex justify-end gap-2">
                      <img
                        src={copyIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="copyIcon"
                      />
                      <img
                        src={trashIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="trashIcon"
                      />
                      <img
                        src={penIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="penIcon"
                      />
                      <img
                        src={shareIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="shareIcon"
                      />
                      <img
                        src={pinIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="pinIcon"
                      />
                    </div>
                    <div className="flex flex-col gap-2 my-2">
                      <img
                        className="w-[48px] h-[48px]"
                        src={agentImage}
                        alt="agentImage"
                      />
                      <h3 className="text-[20px] font-bold text-[#09101D]">
                        pro coder
                      </h3>
                      <p className="text-[#858C94] text-[14px] font-normal mb-3">
                        Help you write code without overexplain things too much
                        using only its internal knowledge and treat like a.....
                      </p>
                    </div>
                    <div className="flex justify-end items-end w-full">
                      <button className="bg-[#132546] text-white cursor-pointer py-1 px-4 rounded-[24px]">
                        chat now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-[#09101D] text-[32px] font-semibold mb-6">
                  Desgin
                </h2>
                <div className="flex gap-8">
                  <div className="bg-white border-[#DADEE3] border-2 p-4.5 rounded-[24px]">
                    <div className="flex justify-end gap-2">
                      <img
                        src={copyIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="copyIcon"
                      />
                      <img
                        src={trashIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="trashIcon"
                      />
                      <img
                        src={penIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="penIcon"
                      />
                      <img
                        src={shareIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="shareIcon"
                      />
                      <img
                        src={pinIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="pinIcon"
                      />
                    </div>
                    <div className="flex flex-col gap-2 my-2">
                      <img
                        className="w-[48px] h-[48px]"
                        src={agentImage}
                        alt="agentImage"
                      />
                      <h3 className="text-[20px] font-bold text-[#09101D]">
                        pro coder
                      </h3>
                      <p className="text-[#858C94] text-[14px] font-normal mb-3">
                        Help you write code without overexplain things too much
                        using only its internal knowledge and treat like a.....
                      </p>
                    </div>
                    <div className="flex justify-end items-end w-full">
                      <button className="bg-[#132546] text-white cursor-pointer py-1 px-4 rounded-[24px]">
                        chat now
                      </button>
                    </div>
                  </div>
                  <div className="bg-white border-[#DADEE3] border-2 p-4.5 rounded-[24px]">
                    <div className="flex justify-end gap-2">
                      <img
                        src={copyIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="copyIcon"
                      />
                      <img
                        src={trashIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="trashIcon"
                      />
                      <img
                        src={penIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="penIcon"
                      />
                      <img
                        src={shareIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="shareIcon"
                      />
                      <img
                        src={pinIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="pinIcon"
                      />
                    </div>
                    <div className="flex flex-col gap-2 my-2">
                      <img
                        className="w-[48px] h-[48px]"
                        src={agentImage}
                        alt="agentImage"
                      />
                      <h3 className="text-[20px] font-bold text-[#09101D]">
                        pro coder
                      </h3>
                      <p className="text-[#858C94] text-[14px] font-normal mb-3">
                        Help you write code without overexplain things too much
                        using only its internal knowledge and treat like a.....
                      </p>
                    </div>
                    <div className="flex justify-end items-end w-full">
                      <button className="bg-[#132546] text-white cursor-pointer py-1 px-4 rounded-[24px]">
                        chat now
                      </button>
                    </div>
                  </div>
                  <div className="bg-white border-[#DADEE3] border-2 p-4.5 rounded-[24px]">
                    <div className="flex justify-end gap-2">
                      <img
                        src={copyIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="copyIcon"
                      />
                      <img
                        src={trashIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="trashIcon"
                      />
                      <img
                        src={penIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="penIcon"
                      />
                      <img
                        src={shareIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="shareIcon"
                      />
                      <img
                        src={pinIcon}
                        className="cursor-pointer shadow-sm w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="pinIcon"
                      />
                    </div>
                    <div className="flex flex-col gap-2 my-2">
                      <img
                        className="w-[48px] h-[48px]"
                        src={agentImage}
                        alt="agentImage"
                      />
                      <h3 className="text-[20px] font-bold text-[#09101D]">
                        pro coder
                      </h3>
                      <p className="text-[#858C94] text-[14px] font-normal mb-3">
                        Help you write code without overexplain things too much
                        using only its internal knowledge and treat like a.....
                      </p>
                    </div>
                    <div className="flex justify-end items-end w-full">
                      <button className="bg-[#132546] text-white cursor-pointer py-1 px-4 rounded-[24px]">
                        chat now
                      </button>
                    </div>
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

export default AgentPage;
