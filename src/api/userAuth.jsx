import axiosInstance from "./axiosInstance";

// Centralized token management
const getAuthToken = () => localStorage.getItem("accessUsertoken");

export const userLogin = async (email, password) => {
  try {
    const response = await axiosInstance.post("Identity/Login", {
      email,
      password,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

export const userRegister = async (email, username, password) => {
  try {
    const response = await axiosInstance.post("Identity/Register", {
      email,
      username,
      password,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error(
      "Registration failed:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

export const userLogout = async () => {
  const token = getAuthToken();
  if (!token) {
    return { success: false, error: "No authentication token found" };
  }

  try {
    const response = await axiosInstance.post(
      "Identity/Logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

export const forgetPassword = async (email) => {
  try {
    const response = await axiosInstance.post("Identity/ForgotPassword", {
      email,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.log("forget password", error);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

export const resetPassword = async (email, resetCode, newPassword) => {
  try {
    const response = await axiosInstance.post("Identity/ResetPassword", {
      email,
      resetCode,
      newPassword,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console("reset password", error);
  }
};
export const userGoogleLogin = async () => {
  try {
    const response = await axiosInstance.get("Identity/google-login");
    return { success: true, data: response.data };
  } catch (error) {
    console.log("forget password", error);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};
