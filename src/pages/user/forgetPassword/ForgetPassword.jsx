import { ErrorMessage, Field, Form, Formik } from "formik";
import authImage from "/public/images/Subtract.png";
import logoauth from "/public/images/logoAuth.png";
import { forgetPassword } from "../../../api/userAuth";
import Swal from "sweetalert2";
import { Link } from "react-router";

function ForgetPassword() {
  const initailValues = {
    email: "",
  };
  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email Is Required";
    }
    if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid Email";
    }
    return errors;
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await forgetPassword(values.email);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password reset link has been sent to your email",
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
                Verify Your Identity
              </h2>
              <p className="text-[#6D7580] font-medium py-2 text-center">
                Enter your email to reset password
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
                    <div className="relative w-full">
                      {/* أيقونة البريد الإلكتروني */}

                      <Field
                        type="email"
                        name="email"
                        placeholder=" "
                        className=" py-3.5 relative px-5 w-full font-semibold border border-[#A5ABB3] opacity-80 rounded-[24px] mt-1 
                            focus:outline-none focus:border-[#004AD7] peer bg-white"
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

                      {/* رسالة الخطأ */}
                      <ErrorMessage
                        name="email"
                        component="span"
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
                    <p className="text-center font-medium">
                      Don’t have an account ?{" "}
                      <span>
                        <Link to={"/auth"} className="text-[#2E5AAC] underline">
                          Sign Up
                        </Link>
                      </span>
                    </p>
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

export default ForgetPassword;
