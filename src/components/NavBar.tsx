
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Menu, 
  X,
  Home,
  Utensils,
  ClipboardList,
  Wallet
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavItemProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  isMobile?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon, onClick, isMobile = false }) => {
  const baseClasses = "flex items-center gap-2 transition-colors";
  const desktopClasses = "px-4 py-2 hover:text-turmeric-500";
  const mobileClasses = "px-4 py-3 hover:bg-muted rounded-md text-lg";
  
  const classes = isMobile 
    ? `${baseClasses} ${mobileClasses}` 
    : `${baseClasses} ${desktopClasses}`;
  
  return (
    <Link to={to} className={classes} onClick={onClick}>
      {icon}
      {label}
    </Link>
  );
};

export const NavBar: React.FC = () => {
  const { isAuthenticated, user, logout, cart } = useApp();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navItems = [
    { to: '/', label: 'Home', icon: <Home size={20} /> },
    { to: '/menu', label: 'Menu', icon: <Utensils size={20} /> },
    { to: '/orders', label: 'My Orders', icon: <ClipboardList size={20} /> },
    { to: '/wallet', label: 'Wallet', icon: <Wallet size={20} /> },
  ];
  
  // Add admin or staff specific routes
  if (user?.role === 'admin') {
    navItems.push(
      { to: '/admin/dashboard', label: 'Admin Dashboard', icon: null }
    );
  } else if (user?.role === 'cafeteria_staff') {
    navItems.push(
      { to: '/staff/orders', label: 'Manage Orders', icon: null }
    );
  }
  
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="cafeteria-container flex items-center justify-between py-4">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2">
          <Utensils className="h-8 w-8 text-turmeric-600" />
          <span className="font-bold text-xl">Smart Cafeteria</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <NavItem 
              key={item.to} 
              to={item.to} 
              label={item.label} 
              icon={item.icon} 
            />
          ))}
        </div>
        
        {/* Right side icons */}
        <div className="flex items-center gap-2">
          {/* Cart button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 px-1.5 bg-turmeric-500 text-white" 
                variant="default"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
          
          {/* User dropdown */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user.name} 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem className="flex justify-between">
                  <span>Role:</span> 
                  <Badge variant="outline" className="capitalize">
                    {user?.role.replace('_', ' ')}
                  </Badge>
                </DropdownMenuItem>
                {user?.walletBalance !== undefined && (
                  <DropdownMenuItem className="flex justify-between">
                    <span>Wallet:</span> 
                    <Badge variant="outline">₹{user.walletBalance}</Badge>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/wallet')}>
                  Wallet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/orders')}>
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
          
          {/* Mobile menu button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] p-0">
              <div className="flex flex-col h-full p-4">
                <div className="flex items-center justify-between mb-8 pb-4 border-b">
                  <Link 
                    to="/" 
                    className="flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Utensils className="h-6 w-6 text-turmeric-600" />
                    <span className="font-bold">Smart Cafeteria</span>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex flex-col space-y-1">
                  {navItems.map((item) => (
                    <NavItem 
                      key={item.to} 
                      to={item.to} 
                      label={item.label} 
                      icon={item.icon} 
                      isMobile={true}
                      onClick={() => setIsMenuOpen(false)}
                    />
                  ))}
                </div>
                
                <div className="mt-auto pt-4 border-t">
                  {isAuthenticated ? (
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center gap-3">
                        {user?.profileImageUrl ? (
                          <img 
                            src={user.profileImageUrl} 
                            alt={user.name} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Button 
                        onClick={() => {
                          navigate('/login');
                          setIsMenuOpen(false);
                        }}
                      >
                        Login
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          navigate('/register');
                          setIsMenuOpen(false);
                        }}
                      >
                        Register
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
