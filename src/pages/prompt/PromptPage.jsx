import { GoPlus } from "react-icons/go";
import agentIconButton from "/public/images/icons/agentIconButton.svg";
import copyIcon from "/public/images/icons/Copyicon.png";
import trashIcon from "/public/images/icons/trashIcon.png";

import penIcon from "/public/images/icons/pen.png";
import starIcon from "/public/images/icons/star.png";
import agentmenuIcon from "/public/images/icons/agentMenue.png";
import agentmenu2Icon from "/public/images/icons/agentmenue2.png";
import filterIcon from "/public/images/icons/promptIconeFilter.png";
function PromptPage() {
  return (
    <div>
      <div className="px-3">
        <div className="flex justify-between items-center mt-5">
          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-[#09101D] text-[40px] font-bold">
              Prompt Library
            </h2>
            <p className="text-[#858C94] text-[18px] font-medium leading-[16px]">
              Prompts are message templates that you can quickly fill in to use
              in chat, work with AI agents, or build your workflow.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <button className="flex bg-gradient-to-r rounded-[48px] text-white cursor-pointer from-[#2E5AAC] gap-2 items-center pe-5 ps-4 py-1.5 to-[#132546]">
              <GoPlus size={20} />
              Add Prompt
            </button>
            <button className="flex border border-[#132546] rounded-[48px] text-[#132546] cursor-pointer font-medium gap-2 items-center pe-5 ps-4 py-1.5">
              <img loading="lazy" src={agentIconButton} alt="agentIconButton" />{" "}
              Browse Prompts
            </button>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <div className="flex flex-col w-full gap-10">
            <div className="w-full flex gap-6 items-center">
              <div className="w-[100%] ">
                <input
                  type="text"
                  placeholder="Search"
                  className="border border-[#A5ABB3] h-[56px] p-2 rounded-[184px] w-full outline-none"
                />
              </div>
              <div className="flex gap-6 w-[40%] items-center">
                <div className="">
                  <button className="border flex gap-2 text-[16px] font-normal items-center cursor-pointer text-[#132546s] border-[#DADEE3] h-[56px] p-2 rounded-[184px] w-full outline-none">
                    <img src={filterIcon} alt="filterIcon" />
                    Filter by tags
                  </button>
                </div>
                <div className="">
                  <select className="cursor-pointer border border-[#394452] h-[56px] p-2 rounded-[184px] w-full outline-none">
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
              <div className="flex gap-8">
                <div className="bg-white border-[#132546] border-t-0 border-r-0 border-5  p-4.5 rounded-[24px] w-[492px] h-[203px]">
                  <div className="flex flex-col gap-2 my-2">
                    <h3 className="text-[20px] font-bold text-[#09101D]">
                      LOGO PROMPTS
                    </h3>
                    <p className="text-[#858C94] text-[14px] font-normal mb-3 border-b border-[#EBEEF2] pb-3">
                      You are a graphic designer , Tasked with creating 5
                      prompts to design a logo for a specific brand based on
                      (Brand name...
                    </p>
                  </div>
                  <div className="flex justify-between items-center ">
                    <div className="flex gap-2">
                      <img
                        src={starIcon}
                        className="cursor-pointer w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="starIcon"
                      />
                      <img
                        src={copyIcon}
                        className="cursor-pointer w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="copyIcon"
                      />
                      <img
                        src={penIcon}
                        className="cursor-pointer w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="penIcon"
                      />
                      <img
                        src={trashIcon}
                        className="cursor-pointer w-[24px] h-[24px] p-1 rounded-[8px]"
                        alt="trashIcon"
                      />
                    </div>
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
    </div>
  );
}

export default PromptPage;
