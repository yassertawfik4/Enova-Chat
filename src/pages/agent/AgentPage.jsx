import { GoPlus } from "react-icons/go";
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
import axiosInstance from "../../api/axiosInstance";
import starIcon from "/public/images/icons/star.png";
import CreateAgent from "./CreateAgent";
function AgentPage() {
  const [addNewAgent, setAddNewAgent] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  // const deleteTimeoutRef = useRef(null);

  const [agentForm, setAgentForm] = useState({
    title: "",
    description: "",
    content: "",
    tags: [],
  });

  const [errors, setErrors] = useState({});

  
  // const handleMyPrompts = async () => {
  //   try {
  //     const response = await axiosInstance.get("Prompt/GetMyPrompts", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("accessUsertoken")}`,
  //       },
  //     });
  //     console.log(response.data);
  //     setMyPrompts(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // handle Delete Prompt
  const handleDeletePrompt = async (promptId) => {
    try {
      const response = await axiosInstance.delete(`Prompt/${promptId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessUsertoken")}`,
        },
      });
      console.log(response.data);
      // handleMyPrompts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {addNewAgent ? (
        <CreateAgent />
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
            <div className="flex flex-col w-full gap-10">
              <div className="w-full flex gap-6 items-center">
                <div className="w-[70%] ">
                  <input
                    type="text"
                    placeholder="Search"
                    className="border border-[#A5ABB3] h-[56px] p-2 rounded-[184px] w-full outline-none"
                  />
                </div>
                <div className="flex gap-6 w-[30%] items-center">
                  <div className="w-[100%]">
                    <select className="border  text-center border-[#394452] h-[56px] p-2 rounded-[184px] w-full outline-none">
                      <option value="Tech">Tech</option>
                      <option value="Desgin">Desgin</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>
                  <div className="w-[70%]">
                    <select className="border text-center border-[#394452] h-[56px] p-2 rounded-[184px] w-full outline-none">
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
                  <div className="bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.10)] border-[#2E5AAC]  border-t-0 border-r-0 border-3 p-4.5 rounded-[24px]">
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
                              // onClick={() => handleisdelete(prompt.id)}
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
