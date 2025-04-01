
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AnimatePresence } from "framer-motion";
import { SmartChatBot } from "@/components/SmartChatBot";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import ItemDetail from "./pages/ItemDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Wallet from "./pages/Wallet";
import StaffOrders from "./pages/StaffOrders";
import StaffBilling from "./pages/StaffBilling";
import MenuManagement from "./pages/MenuManagement";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminLogin from "./pages/AdminLogin"; 
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
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/:id" element={<ItemDetail />} />
              
              {/* User Routes (requires authentication) */}
              <Route path="/cart" element={
                <RoleBasedRoute allowedRoles={['student', 'staff', 'cafeteria_staff', 'admin']}>
                  <Cart />
                </RoleBasedRoute>
              } />
              <Route path="/orders" element={
                <RoleBasedRoute allowedRoles={['student', 'staff', 'cafeteria_staff', 'admin']}>
                  <Orders />
                </RoleBasedRoute>
              } />
              <Route path="/orders/:id" element={
                <RoleBasedRoute allowedRoles={['student', 'staff', 'cafeteria_staff', 'admin']}>
                  <OrderDetail />
                </RoleBasedRoute>
              } />
              <Route path="/wallet" element={
                <RoleBasedRoute allowedRoles={['student', 'staff', 'cafeteria_staff', 'admin']}>
                  <Wallet />
                </RoleBasedRoute>
              } />
              <Route path="/scanner" element={
                <RoleBasedRoute allowedRoles={['student', 'staff', 'cafeteria_staff', 'admin']}>
                  <Scanner />
                </RoleBasedRoute>
              } />
              
              {/* Staff Routes */}
              <Route path="/staff/orders" element={
                <RoleBasedRoute allowedRoles={['cafeteria_staff', 'admin']}>
                  <StaffOrders />
                </RoleBasedRoute>
              } />
              <Route path="/staff/billing" element={
                <RoleBasedRoute allowedRoles={['cafeteria_staff', 'admin']}>
                  <StaffBilling />
                </RoleBasedRoute>
              } />
              <Route path="/staff/menu" element={
                <RoleBasedRoute allowedRoles={['cafeteria_staff', 'admin']}>
                  <MenuManagement />
                </RoleBasedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleBasedRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          <SmartChatBot />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
