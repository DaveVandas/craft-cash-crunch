import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SoundProvider } from "@/contexts/SoundContext";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Calculator from "./pages/Calculator";
import Compare from "./pages/Compare";
import Search from "./pages/Search";
import Share from "./pages/Share";
import Category from "./pages/Category";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import PaymentSuccess from "./pages/PaymentSuccess";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Quiz from "./pages/Quiz";
import Referral from "./pages/Referral";
import SideHustle from "./pages/SideHustle";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SoundProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/search" element={<Search />} />
            <Route path="/share" element={<Share />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/referral" element={<Referral />} />
            <Route path="/side-hustle" element={<SideHustle />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </SoundProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
