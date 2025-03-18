// SideLinks.jsx - Simplified version without the conditional check
import { CiSettings } from "react-icons/ci";
import { HiOutlinePuzzlePiece } from "react-icons/hi2";
import {
  IoChatbubbleEllipsesOutline,
  IoHardwareChipOutline,
} from "react-icons/io5";
import { PiBookBookmark } from "react-icons/pi";
import { VscRobot } from "react-icons/vsc";
import { NavLink } from "react-router";

export const SideLinks = () => {
  const links = [
    {
      name: "Chat",
      path: "/",
      icon: <IoChatbubbleEllipsesOutline size={20} />,
    },
    {
      name: "Agents",
      path: "/agents",
      icon: <VscRobot size={20} />,
    },
    {
      name: "Prompts",
      path: "/prompts",
      icon: <PiBookBookmark size={20} />,
    },
    {
      name: "Plugins",
      path: "/plugins",
      icon: <HiOutlinePuzzlePiece size={20} />,
    },
    {
      name: "Models",
      path: "/models",
      icon: <IoHardwareChipOutline size={20} />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <CiSettings size={20} />,
    },
  ];

  return (
    <div className="bg-[#112546] h-screen w-[72px] py-2 flex justify-center rounded-[50px] sticky top-0 left-0">
      <ul className="flex flex-col gap-2">
        {links.map((link, index) => (
          <li key={index} className="">
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `flex justify-center items-center flex-col gap-1 w-[60px] h-[60px] ${
                  isActive
                    ? "bg-white text-black rounded-[48px] "
                    : "text-white"
                }`
              }
            >
              <span>{link.icon}</span>
              <span className="text-xs">{link.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
