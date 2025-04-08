function FormToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start gap-4 my-4">
      <label
        className={`relative block cursor-pointer h-8 w-14 rounded-full transition-colors ${
          checked ? "bg-[#2E5AAC]" : "bg-gray-300"
        }`}
      >
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={onChange}
        />
        <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6" />
      </label>
      <div className="flex flex-col gap-1">
        <p className="text-[#132546] font-semibold text-[16px]">{label}</p>
        {description ? (
          <p className="text-[14px] text-[#6D7580] max-w-[480px]">
            {description}
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default FormToggle;
