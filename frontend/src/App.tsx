import { Suspense, lazy } from "react";
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
import Contact from "./pages/Contact";
import Error from "./pages/Error";
import NotFound from "./pages/NotFound";

import AdminIndex from "./pages/admin/Index";
import AdminNotFound from "./pages/admin/NotFound";

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const ManagerLayout = lazy(() => import("./layouts/ManagerLayout"));


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Suspense fallback={<div>Chargement...</div>}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<AppPage />} />
              <Route path="/conditions" element={<Conditions />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/error" element={<Error />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route element={<ManagerLayout />}>
              <Route path="/manager/" element={<AdminIndex />} />
              <Route path="/manager/*" element={<AdminNotFound />} />
            </Route>
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
        </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
