import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";
import AppPage from "./pages/App";
// import ProfileSetup from "./pages/ProfileSetup";
// import Profile from "./pages/Profile";
import Conditions from "./pages/Conditions";
import Error from "./pages/Error";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppPage />} />
            <Route path="/error" element={<Error />} />
            <Route path="/conditions" element={<Conditions />} />
            <Route path="*" element={<NotFound />} />
            {/*
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<AppPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile/setup" element={<ProfileSetup />} />
            <Route path="/profile" element={<Profile />} />
            */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
