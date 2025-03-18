import { ErrorMessage, Field, useFormikContext } from "formik";
import { PiEye } from "react-icons/pi";
import { useState } from "react";
import { BsFillEyeSlashFill } from "react-icons/bs";

function RegisterForm({ isValid, dirty, isSubmitting }) {
  const [showPassword, setShowPassword] = useState(false);
  const { values, setFieldValue } = useFormikContext();

  return (
    <div className="container mx-auto ">
      <div className="relative mb-5 ">
        <Field
          type="text"
          name="username"
          placeholder=" "
          className="w-full py-3.5 relative px-5 border font-semibold border-[#A5ABB3] opacity-80 rounded-[24px] mt-1 focus:outline-none focus:border-[#132546] peer"
        />

        <label
          htmlFor="username"
          className="absolute left-4 top-3 text-[#132546] text-[16px] transition-all font-medium duration-200 
        peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-[#132546] peer-placeholder-shown:top-4
        peer-focus:-top-2 peer-focus:text-[16px] peer-focus:text-[#132546] bg-white px-1
        peer-[:not(:placeholder-shown)]:-top-2.5"
        >
          User Name
        </label>

        <ErrorMessage
          name="username"
          component="span"
          className="text-red-500 text-start font-semibold ml-3 text-sm mt-1"
        />
      </div>
      <div className="relative w-full ">
        <Field
          type="email"
          name="email"
          placeholder=" "
          className="w-full py-3.5 relative px-5 border font-semibold border-[#A5ABB3] opacity-80 rounded-[24px] mt-1 focus:outline-none focus:border-[#132546] peer"
        />

        <label
          htmlFor="email"
          className="absolute left-4 top-3 text-[#132546] text-[16px] transition-all font-medium duration-200 
        peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-[#132546] peer-placeholder-shown:top-4
        peer-focus:-top-2 peer-focus:text-[16px] peer-focus:text-[#132546] bg-white px-1
        peer-[:not(:placeholder-shown)]:-top-2.5"
        >
          Email
        </label>

        <ErrorMessage
          name="email"
          component="span"
          className="text-red-500 text-start font-semibold ml-3 text-sm mt-1"
        />
      </div>

      <div className="relative my-5">
        <div className="relative">
          <Field
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder=" "
            className="w-full py-3.5 relative px-5 border font-semibold border-[#A5ABB3] opacity-80 rounded-[24px] mt-1 focus:outline-none focus:border-[#132546] peer"
          />
          <label
            htmlFor="password"
            className="absolute left-4 top-3 text-[#132546] text-[16px] transition-all font-medium duration-200 
        peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-[#132546] peer-placeholder-shown:top-4
        peer-focus:-top-2 peer-focus:text-[16px] peer-focus:text-[#132546] bg-white px-1
        peer-[:not(:placeholder-shown)]:-top-2.5"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 cursor-pointer flex items-center text-gray-500"
          >
            {showPassword ? (
              <PiEye size={20} />
            ) : (
              <BsFillEyeSlashFill size={20} />
            )}
          </button>
        </div>
        <ErrorMessage
          name="password"
          component="div"
          className="text-red-500 text-start font-semibold ml-3 text-sm mt-1"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="rememberMe"
          id="rememberMe"
          checked={values.rememberMe}
          onChange={() => setFieldValue("rememberMe", !values.rememberMe)}
          className="mr-1 w-3.5 h-3.5 accent-[#132546] cursor-pointer"
        />
        <label
          htmlFor="rememberMe"
          className="text-[14px] text-[#010318CC] font-medium cursor-pointer"
        >
          I agree to at Term,Privacy Policy and Free
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isValid || !dirty}
        className={`bg-gradient-to-r from-[#2E5AAC] to-[#132546] text-white py-3
              transition duration-300 ease-in-out rounded-[24px] font-medium 
              disabled:bg-gray-400 w-full my-5
              ${
                !isValid || !dirty
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gradient-to-r  hover:shadow-lg "
              }`}
      >
        {isSubmitting ? "Sign Up..." : "Sign Up"}
      </button>
    </div>
  );
}

export default RegisterForm;
