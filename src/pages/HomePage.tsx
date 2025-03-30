
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  Bell, 
  Filter, 
  ChevronRight, 
  Home as HomeIcon, 
  History, 
  MessageSquare, 
  User,
  Clock,
  Wallet,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { MenuCard } from '@/components/MenuCard';
import { SplashScreen } from '@/components/SplashScreen';
import { useApp } from '@/context/AppContext';
import { MobileNavBar } from '@/components/MobileNavBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { CategoryIcon } from '@/components/CategoryIcon';
import { FoodRecommendationCard } from '@/components/FoodRecommendationCard';

const HomePage = () => {
  const { menuItems, isLoading } = useApp();
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(true);
  const isMobile = useIsMobile();
  
  // Top-rated items for the featured section
  const featuredItems = menuItems
    .filter(item => item.status === 'available')
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);
  
  // Show loader for a minimum time on initial load for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (showLoader || isLoading) {
    return <Loader text="Welcome to Smart Cafeteria" />;
  }

  // Category items for the mobile view
  const categories = [
    { id: 'breakfast', name: 'Breakfast', icon: '/lovable-uploads/d23f9918-aa8f-4001-bfd2-86661da535f5.png' },
    { id: 'curry', name: 'Curry', icon: '/lovable-uploads/d23f9918-aa8f-4001-bfd2-86661da535f5.png' },
    { id: 'rice', name: 'Rice', icon: '/lovable-uploads/d23f9918-aa8f-4001-bfd2-86661da535f5.png' },
    { id: 'dessert', name: 'Dessert', icon: '/lovable-uploads/d23f9918-aa8f-4001-bfd2-86661da535f5.png' },
    { id: 'beverage', name: 'Drink', icon: '/lovable-uploads/d23f9918-aa8f-4001-bfd2-86661da535f5.png' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SplashScreen />
      
      {isMobile ? (
        <div className="px-4 py-4 mb-16">
          {/* Mobile Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Order Your Food</h1>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
                <ShoppingCart className="h-6 w-6 text-amber-500" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-6 w-6 text-amber-500" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search food, drink, desserts" 
                className="pl-10 bg-gray-100 border-none"
              />
            </div>
            <Button variant="ghost" size="icon" className="bg-gray-100">
              <Filter className="h-5 w-5 text-gray-500" />
            </Button>
          </div>

          {/* Promotional Banner */}
          <Card className="bg-amber-500 text-white border-none rounded-xl mb-6 overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Grab Our Exclusive<br />Food Discounts Now!</h2>
                <Button className="bg-black hover:bg-gray-800 text-white">
                  Order Now
                </Button>
              </div>
              <div className="w-24 h-24">
                <img 
                  src="/lovable-uploads/d23f9918-aa8f-4001-bfd2-86661da535f5.png" 
                  alt="Food" 
                  className="w-full h-full object-contain"
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Icons */}
          <div className="grid grid-cols-5 gap-2 mb-8">
            {categories.map(category => (
              <CategoryIcon 
                key={category.id}
                name={category.name}
                iconSrc={category.icon}
                onClick={() => navigate(`/menu?category=${category.id}`)}
              />
            ))}
          </div>

          {/* Recommendations Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recommended For You</h2>
              <Button variant="link" className="text-amber-500 p-0" onClick={() => navigate('/menu')}>
                See All <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {featuredItems.map(item => (
                <FoodRecommendationCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <main className="flex-grow">
          {/* Hero section */}
          <section className="relative bg-gradient-to-r from-yellow-100 to-amber-100 py-16 md:py-24">
            <div className="cafeteria-container relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6 animate-fade-in">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Smart Dining for <span className="text-turmeric-600">Smart Campus</span>
                  </h1>
                  <p className="text-lg text-gray-700">
                    Order delicious South Indian cuisine, track inventory, manage your wallet,
                    and enjoy a seamless cafeteria experience.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      size="lg" 
                      className="bg-turmeric-500 hover:bg-turmeric-600"
                      onClick={() => navigate('/menu')}
                    >
                      Explore Menu
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={() => navigate('/scanner')}
                    >
                      Scan & Order
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <img 
                    src="https://res.cloudinary.com/dj5yf0qgw/image/upload/v1629880657/south-indian/south-indian-thali_wmfcqn.jpg" 
                    alt="South Indian Thali" 
                    className="rounded-lg shadow-2xl animate-zoom-in"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white rounded-full p-4 shadow-lg hidden md:block animate-slide-in">
                    <HomeIcon className="h-10 w-10 text-turmeric-500" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-1/4 left-10 w-20 h-20 bg-curry-200 rounded-full opacity-30" />
            <div className="absolute bottom-10 right-1/4 w-12 h-12 bg-spice-200 rounded-full opacity-20" />
            <div className="absolute top-1/3 right-10 w-16 h-16 bg-turmeric-200 rounded-full opacity-40" />
          </section>
          
          {/* Features section */}
          <section className="py-16 bg-white">
            <div className="cafeteria-container">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Why Choose Smart Cafeteria?</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Experience a modern cafeteria system designed to make your dining experience
                  seamless, efficient, and enjoyable.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 rounded-full bg-turmeric-100 text-turmeric-600 mb-4">
                        <Clock className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Quick Ordering</h3>
                      <p className="text-gray-600">
                        Order food quickly and track its preparation in real-time.
                        No more waiting in long queues!
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 rounded-full bg-curry-100 text-curry-600 mb-4">
                        <Wallet className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Cashless Payments</h3>
                      <p className="text-gray-600">
                        Pay with your digital wallet, UPI, or cards.
                        Secure and convenient transactions.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 rounded-full bg-spice-100 text-spice-600 mb-4">
                        <UserCheck className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Personalized Experience</h3>
                      <p className="text-gray-600">
                        View your order history, save favorites, and get personalized recommendations.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          
          {/* Featured menu section */}
          <section className="py-16 bg-stone-50">
            <div className="cafeteria-container">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Featured Items</h2>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/menu')}
                >
                  View Full Menu
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredItems.map(item => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </section>
          
          {/* CTA section */}
          <section className="py-16 bg-gradient-to-r from-turmeric-600 to-spice-600 text-white">
            <div className="cafeteria-container text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Ordering?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Create an account or login to access all the features of our Smart Cafeteria system.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-turmeric-600 hover:bg-gray-100"
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-turmeric-600"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </div>
            </div>
          </section>
        </main>
      )}
      
      {isMobile ? <MobileNavBar /> : <Footer />}
    </div>
  );
};

export default HomePage;
