export const SafetySlider = ({ label, name, value, onChange }) => {
  const levels = ["Block None", "Few", "Some", "Most"];

  return (
    <div className="mb-6 w-full flex justify-between gap-8 items-center">
      <label className="text-[#132546] font-semibold text-[16px] block mb-2 w-[30%]">
        {label}
      </label>
      <div className="relative w-full">
        <input
          type="range"
          min={0}
          max={3}
          step={1}
          value={value}
          onChange={(e) => onChange(name, parseInt(e.target.value))}
          className="w-full h-1 bg-[#2E5AAC] rounded-lg appearance-none cursor-pointer accent-[#2E5AAC]"
        />
        <div className="flex justify-between text-sm text-[#6D7580] mt-2">
          {levels.map((lvl, i) => (
            <span
              key={i}
              className={value === i ? "text-[#2E5AAC] font-medium" : ""}
            >
              {lvl}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
