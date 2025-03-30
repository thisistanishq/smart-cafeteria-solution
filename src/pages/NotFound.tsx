
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div 
        className="max-w-md w-full text-center"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          <div className="inline-block p-5 bg-red-50 rounded-full mb-4">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-6xl font-bold text-[#15187C] mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="space-y-4"
        >
          <Button 
            className="w-full bg-[#15187C] hover:bg-[#0e105a]"
            onClick={() => navigate('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </motion.div>

        <motion.p 
          variants={itemVariants} 
          className="mt-8 text-sm text-gray-500"
        >
          If you believe this is an error, please contact support.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;
