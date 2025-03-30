
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AnimatePresence } from "framer-motion";
import { ChatBot } from "@/components/ChatBot";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import ItemDetail from "./pages/ItemDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Wallet from "./pages/Wallet";
import StaffOrders from "./pages/StaffOrders";
import MenuManagement from "./pages/MenuManagement";
import AdminDashboard from "./pages/Admin/Dashboard";
import Scanner from "./pages/Scanner";
import NotFound from "./pages/NotFound";

// Install required dependencies
import 'framer-motion';
import '@react-three/fiber';
import '@react-three/drei';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/:id" element={<ItemDetail />} />
              <Route path="/cart" element={<Cart />} />
              
              {/* User Routes */}
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/scanner" element={<Scanner />} />
              
              {/* Staff Routes */}
              <Route path="/staff/orders" element={<StaffOrders />} />
              <Route path="/staff/menu" element={<MenuManagement />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          <ChatBot />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
