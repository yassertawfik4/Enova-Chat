import { ErrorMessage, Field, Form, Formik } from "formik";
import authImage from "/public/images/Subtract.png";
import logoauth from "/public/images/logoAuth.png";
import { resetPassword } from "../../../api/userAuth";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { PiEye } from "react-icons/pi";
import { BsFillEyeSlashFill } from "react-icons/bs";

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isValid, setIsValid] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");
  const initailValues = {
    email: email || "",
    resetCode: token || "",
    newPassword: "",
    confirmPassword: "",
  };
  const validate = (values) => {
    const errors = {};
    if (!values.newPassword) {
      errors.newPassword = "Password Is Required";
    } else if (values.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters long";
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (values.confirmPassword !== values.newPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await resetPassword(
        values.email,
        values.resetCode,
        values.newPassword
      );
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "new password has been set successfully",
        });
      }
    } catch (error) {
      console.log("forget password", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  //   useEffect(() => {
  //     if (token && email) {
  //       setIsValid(true);
  //     } else {
  //       navigate("/auth");
  //     }
  //   }, [token, email, navigate]);

  //   if (!isValid) {
  //     return null;
  //   }
  return (
    <div>
      <div className="container mx-auto px-2 flex">
        <div className="pt-8 w-[900px]">
          <div>
            <img src={logoauth} alt="" />
          </div>
          <div className="flex flex-col justify-center items-center h-full">
            <div>
              <h2 className="text-[#000000] font-semibold text-2xl text-center">
                Reset Password
              </h2>
              <p className="text-[#6D7580] font-medium py-2 text-center">
                Enter your new password
              </p>
            </div>
            <div className="w-[400px]">
              <Formik
                initialValues={initailValues}
                validate={validate}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, isValid, dirty }) => (
                  <Form className="py-10">
                    <div className="relative py-3">
                      <div className="relative">
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          placeholder=" "
                          className="w-full py-3.5 relative px-5 border font-semibold border-[#A5ABB3] opacity-80 rounded-[24px] mt-1 focus:outline-none focus:border-[#004AD7] peer"
                        />
                        <label
                          htmlFor="newPassword"
                          className="absolute left-4 top-3 text-[#132546] text-[16px] transition-all font-medium duration-200 
                          peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-[#132546] peer-placeholder-shown:top-4
                          peer-focus:-top-2 peer-focus:text-[16px] peer-focus:text-[#132546] bg-white px-1
                          peer-[:not(:placeholder-shown)]:-top-2.5"
                        >
                          New Password
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
                        name="newPassword"
                        component="div"
                        className="text-red-500 text-start font-semibold ml-3 text-sm mt-1"
                      />
                    </div>
                    <div className="relative py-3">
                      <div className="relative">
                        <Field
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder=" "
                          className="w-full py-3.5 relative px-5 border font-semibold border-[#A5ABB3] opacity-80 rounded-[24px] mt-1 focus:outline-none focus:border-[#004AD7] peer"
                        />
                        <label
                          htmlFor="confirmPassword"
                          className="absolute left-4 top-3 text-[#132546] text-[16px] transition-all font-medium duration-200 
                          peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-[#132546] peer-placeholder-shown:top-4
                          peer-focus:-top-2 peer-focus:text-[16px] peer-focus:text-[#132546] bg-white px-1
                          peer-[:not(:placeholder-shown)]:-top-2.5"
                        >
                          Confirm Password
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-3 cursor-pointer flex items-center text-gray-500"
                        >
                          {showConfirmPassword ? (
                            <PiEye size={20} />
                          ) : (
                            <BsFillEyeSlashFill size={20} />
                          )}
                        </button>
                      </div>
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-start font-semibold ml-3 text-sm mt-1"
                      />
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
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
        <div className="pt-10 ">
          <img className="h-full object-" src={authImage} alt="" />
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
