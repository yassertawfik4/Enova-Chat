import { Route, Routes } from "react-router";
import "./App.css";
import AuthFormPage from "./pages/user/AuthFormPage/AuthFormPage";
import ForgetPassword from "./pages/user/forgetPassword/ForgetPassword";
import ResetPassword from "./pages/user/resetPassword/ResetPassword";
import ChatPage from "./pages/chatpage/ChatPage";
import { SideLinks } from "./components/SideBar/SideLinks";
import { useLocation } from "react-router";
import AgentPage from "./pages/agent/AgentPage";
import ChatSideBar from "./components/SideBar/chatSideBar/ChatSideBar";
import ProtectedRoute from "./routes/ProtectedRoute";
import PromptPage from "./pages/prompt/PromptPage";
import PluginPage from "./pages/plugin/PluginPage";
import ModelsPage from "./pages/models/ModelsPage";
import SettingsPage from "./pages/settings/SettingsPage";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");
  const isChatRoute =
    location.pathname === "/" || location.pathname.startsWith("/chat");

  return (
    <div className="flex w-full px-2 py-2">
      {!isAuthPage && (
        <div className="flex">
          <SideLinks />
          {isChatRoute && <ChatSideBar />}{" "}
          {/* Render ChatSideBar only on the chat page */}
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
};

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/auth" element={<AuthFormPage />} />
        <Route path="/auth/forgetPassword" element={<ForgetPassword />} />
        <Route path="/auth/reset-Password" element={<ResetPassword />} />
        {/* حماية الصفحة */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ChatPage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
          <Route path="/agents" element={<AgentPage />} />
          <Route path="/prompts" element={<PromptPage />} />
          <Route
            path="/prompts"
            element={
              <div>
                <h1>Prompts Page</h1>
              </div>
            }
          />
          <Route path="/plugins" element={<PluginPage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </AppLayout>
  );
}

export default App;
