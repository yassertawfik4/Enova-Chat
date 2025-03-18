import logo from "/public/images/chatLogo.png";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { MdChecklistRtl } from "react-icons/md";
import { TfiFilter } from "react-icons/tfi";
import { FaSortAlphaDownAlt } from "react-icons/fa";
import chatgptLogo from "/public/images/gptimage.png";
function ChatSideBar() {
  return (
    <div className="py-2 bg-[#F4F6FF] w-[305px] h-screen rounded-[48px] ms-2">
      <div className="flex justify-center items-center py-6">
        <img src={logo} alt="" />
      </div>
      <div className="px-3">
        <div className="bg-gradient-to-r from-[#2E5AAC] to-[#132546] cursor-pointer flex px-3 py-1.5 items-center rounded-[48px] ">
          <button className="flex items-center gap-2 text-[#FFFFFF] cursor-pointer">
            <IoChatbubbleEllipsesOutline size={24} />{" "}
            <span className="text-[16px] font-normal">New chat</span>
          </button>
        </div>
        <div className="my-4 relative flex items-center">
          <div className="absolute left-3 text-gray-400">
            <CiSearch size={24} />
          </div>
          <input
            className="bg-white rounded-[48px] pl-10 pr-3 py-1.5 outline-none w-full border border-[#DADEE3]"
            type="search"
            placeholder="Search"
          />
        </div>
        <div className="flex justify-between items-center my-4">
          <span className="cursor-pointer">
            <AiOutlineFolderAdd size={20} />
          </span>
          <span className="cursor-pointer">
            <MdChecklistRtl size={20} />
          </span>
          <span className="cursor-pointer">
            <TfiFilter size={20} />
          </span>
          <span className="cursor-pointer">
            <FaSortAlphaDownAlt size={20} />
          </span>
        </div>
      </div>
      <div className="px-2">
        <div className=" bg-white rounded-[24px] h-auto py-4 px-2 flex flex-col gap-7">
          <div className="flex items-center gap-4 ">
            <img src={chatgptLogo} alt="" />
            <div className="flex flex-col">
              <span className="text-[12px] font-normal">1m</span>
              <span className="text-[12px] font-medium"> Coding Help</span>
            </div>
          </div>
          <div className="flex items-center gap-4 ">
            <img src={chatgptLogo} alt="" />
            <div className="flex flex-col">
              <span className="text-[12px] font-normal">1m</span>
              <span className="text-[12px] font-medium"> Coding Help</span>
            </div>
          </div>
          <div className="flex items-center gap-4 ">
            <img src={chatgptLogo} alt="" />
            <div className="flex flex-col">
              <span className="text-[12px] font-normal">1m</span>
              <span className="text-[12px] font-medium"> Coding Help</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatSideBar;
