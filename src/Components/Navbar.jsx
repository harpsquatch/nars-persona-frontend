import { useState } from "react";
import { Loader2 } from "lucide-react";
import NavIcon from "../assets/NavIcon.png";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MenuIcon from "../assets/menu-icon.png";
import XIcon from "../assets/x-icon.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Show loading animation
    setIsLoggingOut(true);
    
    // First, clear all tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('remember_token');
    localStorage.removeItem('rememberedEmail');
    
    // Add a delay to show the loading animation
    setTimeout(() => {
      // Then redirect to the login page
      window.location.href = '/';
    }, 1000); // Slightly longer delay for a visible transition
  };

  // Animation variants
  const loaderVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const menuItemVariants = {
    hover: { 
      scale: 1.05, 
      transition: { duration: 0.2 } 
    },
    tap: { 
      scale: 0.95, 
      transition: { duration: 0.1 } 
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div 
            className="fixed inset-0 bg-[#1E1E1E] flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              variants={loaderVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation Bar - Static position */}
      <nav className={`bg-[#1E1E1E] text-white p-5 flex justify-between items-center relative z-[10000] 
        ${isOpen ? 'border-b border-white' : ''}`}>
        <div className="flex items-center h-9">
          <img 
            src={NavIcon} 
            alt="Logo" 
            className="h-full object-contain" 
          />
        </div>

        <motion.button
          className="block z-[10000] text-white"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <img 
            src={isOpen ? XIcon : MenuIcon}
            alt={isOpen ? "Close" : "Menu"} 
            className="w-7 h-5 object-contain"
          />
        </motion.button>
      </nav>

      {/* Menu Overlay */}
      <motion.div
        className={`fixed top-0 left-0 w-full h-screen bg-[#1E1E1E] flex items-center justify-center z-[9999]
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        initial={false}
        animate={{ 
          x: isOpen ? 0 : "-100%",
          transition: { 
            duration: 0.3,
            ease: "easeInOut"
          }
        }}
      >
        {/* Centered Logout Button */}
        <motion.button
          onClick={handleLogout}
          className="text-[30px] text-white cursor-pointer hover:underline font-['ABC_Favorit_Expanded']"
          variants={menuItemVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Logout
        </motion.button>
      </motion.div>
    </>
  );
}

export default Navbar;
