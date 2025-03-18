import { useState } from "react";
import logoauth from "/public/images/logoAuth.png";
import authImage from "/public/images/Subtract.png";
import google from "/public/images/GoogleIcon.png";
import microsoftIcon from "/public/images/microsoftIcon.png";
import { Form, Formik } from "formik";
import {
  userGoogleLogin,
  userLogin,
  userRegister,
} from "../../../api/userAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import LoginForm from "../../../components/auth/LoginForm";
import RegisterForm from "../../../components/auth/RegisterForm";
function AuthFormPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const initailValues = {
    username: "",
    email: "",
    password: "",
  };
  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email Is Required";
    }
    if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid Email";
    }
    if (!values.password) {
      errors.password = "Password Is Required";
    }
    if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (!isLogin && !values.username) {
      errors.username = "Username is required";
    }
    return errors;
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let data;

      if (isLogin) {
        data = await userLogin(values.email, values.password);
        if (data.success) {
          localStorage.setItem("accessUsertoken", data.data);
        }
      } else {
        data = await userRegister(
          values.email,
          values.username,
          values.password
        );
        if (data.success) {
          localStorage.setItem("userId", data.data);
        }
      }

      if (data?.success) {
        navigate("/");
        Swal.fire({
          icon: "success",
          title: isLogin ? "Login Successful" : "Registration Successful",
          text: isLogin
            ? "You have logged in successfully."
            : "Your account has been created successfully.",
        });
      } else {
        throw new Error(data?.message || "Email Or Password Is Incorrect");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const response = await userGoogleLogin();

      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        window.location.href =
          "http://localhost:5067/api/Identity/google-login";
      }
    } catch (error) {
      console.error("Google login error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="py-5">
      <div className="container mx-auto px-2 flex">
        <div className="pt-5 w-[700px]">
          <div>
            <img src={logoauth} alt="" />
          </div>
          <div className="flex justify-center items-center flex-col pt-7">
            <h2 className="text-[#000000] font-semibold text-2xl">
              {isLogin ? "Welcome Back" : "Create Your Account "}
            </h2>
            <p className="text-[#6D7580] font-medium py-2">
              {isLogin
                ? "Welcome back ! please enter your details."
                : "Welcome! Sign up today and get started"}
            </p>
            <div>
              {/* buttons */}
              <div className="flex  items-center pt-10 pb-4 ">
                <button
                  onClick={() => setIsLogin(false)}
                  className={` font-semibold w-[200px] border-b-2 pb-4 cursor-pointer ${
                    !isLogin
                      ? "border-[#132546] text-[#132546]"
                      : "border-[#858C94] text-[#858C94]"
                  }`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setIsLogin(true)}
                  className={` font-semibold w-[200px] border-b-2 pb-4 cursor-pointer ${
                    isLogin
                      ? "border-[#132546] text-[#132546]"
                      : "border-[#858C94] text-[#858C94]"
                  }`}
                >
                  Log In
                </button>
              </div>
              <p className="text-center py-4 text-[#6D7580] font-medium text-sm">
                Log In With Open Account
              </p>
              {/* Google and MicroSoft */}
              <div className="flex justify-center items-center gap-8">
                <button
                  onClick={handleGoogleLogin}
                  className="border flex items-center gap-2 font-medium cursor-pointer px-16 py-2.5 rounded-[24px] border-[#A5ABB3]"
                >
                  <span>
                    <img className="w-5" src={google} alt="googleicon" />
                  </span>{" "}
                  Google
                </button>
                <button className="border flex items-center font-medium gap-2 cursor-pointer px-14 py-2.5 rounded-[24px] border-[#A5ABB3]">
                  <span>
                    <img className="w-5" src={microsoftIcon} alt="googleicon" />
                  </span>
                  MicroSoft
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 py-7">
                <hr className="flex-grow border-t border-[#9098A1]" />
                <span className="text-gray-500 font-bold">Or</span>
                <hr className="flex-grow border-t border-[#9098A1]" />
              </div>
              <div>
                <Formik
                  initialValues={initailValues}
                  validate={validate}
                  onSubmit={handleSubmit}
                >
                  {({ isValid, dirty, isSubmitting }) => (
                    <Form>
                      {isLogin ? (
                        <LoginForm
                          isSubmitting={isSubmitting}
                          isValid={isValid}
                          dirty={dirty}
                        />
                      ) : (
                        <RegisterForm
                          isSubmitting={isSubmitting}
                          isValid={isValid}
                          dirty={dirty}
                        />
                      )}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-10 ">
          <img className="h-[725px] w-full" src={authImage} alt="" />
        </div>
      </div>
    </div>
  );
}

export default AuthFormPage;
