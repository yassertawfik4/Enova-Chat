import { useEffect, useState } from "react";
import aiIcone from "/public/images/icons/AiIcon.png";
import axiosInstance from "../../api/axiosInstance";
import actionAi from "/public/images/icons/ActionModel.png";
import layerAi from "/public/images/icons/LayerModel.png";
import modelAi from "/public/images/icons/ModelAi.png";
import gptImage from "/public/images/icons/gptimage.png";
function ModelsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [getAllModels, setGetAllModels] = useState([]);
  const tabs = ["All", "Anthropic", "OpenAi", "Google"];
  const selectedModelDetails = {
    modelId: "O3-Mini",
    provider: "OpenAI",
    contextLength: "200,000",
    apiType: "Openai",
    pluginsSupported: "Yes",
    visionSupported: "No",
    streamingSupported: "Yes",
    systemRoleSupported: "Yes",
    promptCachingSupported: "Yes",
  };
  const handelAllModels = async () => {
    try {
      const response = await axiosInstance.get("AiModel/GetAll", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessUsertoken")}`,
        },
      });
      setGetAllModels(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handelAllModels();
  }, []);

  const toggleModelStatus = async (id) => {
    // Optimistically update UI
    const updatedModels = getAllModels.map((model) =>
      model.modelId === id ? { ...model, isEnabled: !model.isEnabled } : model
    );
    setGetAllModels(updatedModels);

    // Call backend to update status
    try {
      const response = await axiosInstance.patch(
        `AiModel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessUsertoken")}`,
          },
        }
      );
      console.log("Toggle success:", response.data);
    } catch (error) {
      console.error("Toggle failed:", error);

      // Revert change if API fails
      const revertedModels = getAllModels.map((model) =>
        model.modelId === id ? { ...model, isEnabled: !model.isEnabled } : model
      );
      setGetAllModels(revertedModels);
    }
  };

  return (
    <div className="px-3">
      <div className="flex justify-between items-center mt-5">
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-[#09101D] text-[40px] font-bold">Models</h2>
          <p className="text-[#858C94] text-[18px] font-normal">
            Manage your models and add custom models
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-10">
        <div>
          <div className="flex gap-2 items-center pb-4">
            <img src={aiIcone} alt="aiIcone" />
            <h2 className="font-medium text-[24px] text-[#132546] ">
              Global Settings
            </h2>
          </div>

          <div className="bg-[#F4F6FF] rounded-[24px] p-4 h-[708px] ">
            <div>
              <input
                type="search"
                placeholder="Search"
                className="rounded-[184px] outline-none bg-white border border-[#DADEE3] p-2 w-full px-3"
              />
            </div>

            <div className="py-4">
              <ul className="flex gap-10">
                {tabs.map((tab, index) => (
                  <li
                    key={index}
                    onClick={() => setActiveTab(tab)}
                    className={`font-medium text-[16px] text-[#132546] rounded-[10px] p-1 cursor-pointer ${
                      activeTab === tab ? "bg-[#D6E8FF]" : ""
                    }`}
                  >
                    {tab}
                  </li>
                ))}
              </ul>

              <div className="py-4 space-y-3 ">
                {getAllModels.map((model) => (
                  <div
                    key={model.modelId}
                    className="flex justify-between items-center p-3"
                  >
                    <div className="flex gap-2 items-center">
                      <div>
                        <img
                          className="w-[44px] h-[44px] cursor-pointer"
                          src={gptImage}
                          alt="gptImage"
                        />
                      </div>
                      <div>
                        <h2 className="text-[#132546] font-normal text-[14px] cursor-pointer">
                          {model.name}
                        </h2>
                        <div className="flex gap-2 items-center">
                          <img src={actionAi} alt="actionAi" />
                          <img src={layerAi} alt="layerAi" />
                          <img src={modelAi} alt="modelAi" />
                          <p className="text-[12px] text-[#858C94] font-normal">
                            200K
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Custom Toggle */}
                    <label
                      htmlFor={`toggle-${model.modelId}`}
                      className={`relative block cursor-pointer h-8 w-14 rounded-full transition-colors ${
                        model.isEnabled ? "bg-[#132546]" : "bg-[#DADEE3]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`toggle-${model.modelId}`}
                        className="peer sr-only"
                        checked={model.isEnabled}
                        onChange={() => toggleModelStatus(model.modelId)}
                      />
                      <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6"></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 w-full">
          <div className="flex gap-2 items-center">
            <img src={gptImage} alt="gptImage" />
            <h2 className="text-[28px] text-[#132546] font-semibold">
              O3 Mini
            </h2>
          </div>
          <div className="flex gap-2 my-5">
            <button className="text-[#132546] py-2 px-4 font-semibold text-[24px] border-b-3 cursor-pointer border-[#132546]">
              Overview
            </button>
            <button className="text-[#132546] py-2 px-4 font-semibold cursor-pointer text-[24px]">
              Parameters
            </button>
          </div>
          <div>
            <p className="text-[#6D7580] text-[16px] font-normal">
              The new cost-efficient reasoning model that’s optimized for
              coding, math, and science
            </p>
          </div>
          <div className="mt-4 bg-white p-4 rounded-xl  space-y-2 w-[454px]">
            {Object.entries(selectedModelDetails).map(([key, value]) => (
              <div key={key} className="flex justify-between  pb-1">
                <span className="font-semibold text-[#09101D]">{key}</span>
                <span className="text-[#2E5AAC] font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelsPage;
