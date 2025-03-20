import { GoPlus } from "react-icons/go";
import agentIconButton from "/public/images/icons/agentIconButton.svg";
function AgentPage() {
  return (
    <div>
      <div className="px-3">
        <div className="flex justify-between items-center mt-5">
          <div className="flex flex-col gap-2">
            <h2 className="text-[#09101D] text-[40px] font-bold">Agents</h2>
            <p className="text-[#858C94] text-[18px] font-medium leading-[16px]">
              Agents Are Pre-Built AI Assistants For Specific Tasks{" "}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <button className="flex bg-gradient-to-r rounded-[48px] text-white cursor-pointer from-[#2E5AAC] gap-2 items-center pe-5 ps-4 py-1.5 to-[#132546]">
              <GoPlus size={20} />
              Create AI Agent
            </button>
            <button className="flex border border-[#132546] rounded-[48px] text-[#132546] cursor-pointer font-medium gap-2 items-center pe-5 ps-4 py-1.5">
              <img loading="lazy" src={agentIconButton} alt="agentIconButton" />{" "}
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
            <div className="w-full">
              <input
                type="text"
                placeholder="Search"
                className="border border-[#A5ABB3] h-[56px] p-2 rounded-[184px] w-[75%]"
              />
            </div>
            <div>
              <h2 className="text-[#09101D] text-[32px] font-semibold">Tech</h2>
              <div className="flex gap-2">
                <div className="bg-white border-[#DADEE3] border-2 h-[100px] p-4 rounded-[18px] w-[494px]">
                  <div></div>
                  <div>
                    <img src="" alt="" />
                    <h3>pro coder</h3>
                    <p>
                      Help you write code without overexplain things too much
                      using only its internal knowledge and treat like a.....
                    </p>
                  </div>
                  <div>
                    <button>chat now</button>
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

export default AgentPage;
