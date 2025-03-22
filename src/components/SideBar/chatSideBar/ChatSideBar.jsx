import logo from "/public/images/chatLogo.png";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { MdChecklistRtl } from "react-icons/md";
import { TfiFilter } from "react-icons/tfi";
import { FaSortAlphaDownAlt } from "react-icons/fa";
import chatgptLogo from "/public/images/gptimage.png";
import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { Link, useNavigate } from "react-router";
import { IoMdCloseCircleOutline } from "react-icons/io";

function ChatSideBar() {
  const [allChats, setAllChats] = useState([]);
  const navigate = useNavigate();
  
  const fetchAllChats = async () => {
    try {
      const response = await axiosInstance.get("Chat/GetAll", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessUsertoken")}`,
        },
      });
      setAllChats(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchAllChats();

    const refreshInterval = setInterval(fetchAllChats, 10000);

    return () => clearInterval(refreshInterval);
  }, []);
  
  const refreshChats = () => {
    fetchAllChats();
  };
  
  window.refreshChatSidebar = refreshChats;
  
  const handelNewChat = () => {
    sessionStorage.setItem("clearChat", "true");
    navigate("/");
    setTimeout(() => {
      if (window.refreshChatPage) {
        window.refreshChatPage();
      }
      fetchAllChats();
    }, 100);
  };
  
  const handelDeleteButton = async (e, chatId) => {
    e.preventDefault(); // Prevent navigation from Link
    e.stopPropagation(); // Prevent event bubbling
    
    try {
      const response = await axiosInstance.delete(`Chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessUsertoken")}`,
        },
      });
      
      if (response.status === 200) {
        // Immediately update the local state to remove the deleted chat
        setAllChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
        
        // If we're on the deleted chat's page, navigate to home
        const currentPath = window.location.pathname;
        if (currentPath.includes(`/chat/${chatId}`)) {
          navigate("/");
        }
        
        // Refresh the chat sidebar
        fetchAllChats();
        
        // If there's a refreshChatPage function, call it
        if (window.refreshChatPage) {
          window.refreshChatPage();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className="bg-[#F4F6FF] h-screen rounded-[48px] w-[305px] left-0 ms-2 py-2 sticky top-0 z-10">
      <div className="flex justify-center items-center py-6">
        <img src={logo} alt="" />
      </div>
      <div className="px-3">
        <div
          onClick={handelNewChat}
          className="flex bg-gradient-to-r rounded-[48px] cursor-pointer from-[#2E5AAC] items-center px-3 py-1.5 to-[#132546]"
        >
          <button className="flex text-[#FFFFFF] cursor-pointer gap-2 items-center">
            <IoChatbubbleEllipsesOutline size={24} />{" "}
            <span className="text-[16px] font-normal">New chat</span>
          </button>
        </div>
        <div className="flex items-center my-4 relative">
          <div className="text-gray-400 absolute left-3">
            <CiSearch size={24} />
          </div>
          <input
            className="bg-white border border-[#DADEE3] rounded-[48px] w-full outline-none pl-10 pr-3 py-1.5"
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
        <div className="flex flex-col bg-white h-[calc(100vh-350px)] rounded-[24px] gap-2 hover:overflow-y-scroll overflow-y-auto px-2 py-4">
          {allChats.map((chat) => (
            <Link
              key={chat.id}
              to={`/chat/${chat.id}`}
              className="flex p-2 rounded-lg cursor-pointer gap-4 hover:bg-gray-50 items-center transition-colors"
            >
              <img src={chatgptLogo} alt="" className="flex-shrink-0 h-8 w-8" />
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="text-[12px] text-gray-500 font-normal">
                  1m
                </span>
                <span className="text-[12px] font-medium max-w-full truncate">
                  {chat.title}
                </span>
              </div>
              <span
                className="cursor-pointer"
                onClick={(e) => handelDeleteButton(e, chat.id)}
              >
                <IoMdCloseCircleOutline size={20} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatSideBar;