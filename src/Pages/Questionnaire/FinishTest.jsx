import React, { useState } from "react";
import { X } from "lucide-react";
import lookImage from "../../assets/StartTestIcon.png"; // Replace with actual image path
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/Main.png";
import { Loader2 } from 'lucide-react'; 
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../Components/Navbar"; // Import Navbar component
import { Grid } from "../../Components/Grid"; // Add this import
import loadingSpinner from '../../assets/spinner-black.png';
import axios from "axios";
import { API_BASE_URL } from "../../services/api";
import { H2, H3, Body2 } from "../../Components/atoms/Typography";
import SubmitButton from "../../Components/atoms/SubmitButton";

export default function FinishTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const answers = location.state?.answers || [];
  const consultationData = location.state?.consultationData;
  const aesthetics = location.state?.aesthetics;
  const lifestyle = location.state?.lifestyle;
  
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Try to signup
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        email: email,
        password: password,
        answers: answers,
        aesthetics: aesthetics,
        lifestyle: lifestyle
      });
      
      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      
      // Show loading and navigate
      setShowSignup(false);
      setLoading(true);
      
      setTimeout(() => {
        navigate("/ConsultantInfo");
      }, 2000);
      
    } catch (error) {
      setIsSubmitting(false);
      
      if (error.response?.status === 409 || error.response?.data?.message?.includes("already exists")) {
        setError("You already have a NARS Persona Account. Please login instead.");
      } else {
        setError(error.response?.data?.message || "Error creating account. Please try again.");
      }
      console.error('Signup error:', error);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.15
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const imageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut",
        delay: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut",
        delay: 0.5
      }
    },
    exit: { 
      opacity: 0, 
      y: 10,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    },
    hover: { 
      scale: 1.03,
      transition: { 
        duration: 0.2
      }
    },
    tap: { 
      scale: 0.98,
      transition: { 
        duration: 0.1
      }
    }
  };

  const loaderVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  // Navbar animation variants
  const navbarVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      {/* Remove the Navbar from loading state */}
      {/* {loading && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={navbarVariants}
        >
          <Navbar />
        </motion.div>
      )} */}
      
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            className="min-h-screen bg-white flex flex-col items-center justify-center px-4"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={loaderVariants}
          >
            <div className="w-full max-w-md space-y-8 text-center flex flex-col items-center justify-center">
              <motion.div 
                className="flex justify-center items-center"
                variants={itemVariants}
              >
                <img src={Logo} alt="Logo" className="w-[175px]" />
              </motion.div>
              <motion.div 
                className="mt-8 flex justify-center items-center"
                variants={loaderVariants}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: { delay: 0.3 }
                }}
              >
                <img 
                  src={loadingSpinner}
                  className="w-8 h-8 animate-spin"
                />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            className="flex flex-col min-h-screen bg-white"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
          >
            {/* Header */}
            <div className="flex items-center p-[14px] gap-3">
              <motion.button 
                className="p-2" 
                onClick={() => navigate("/")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} color="#1E1E1E" />
              </motion.button>
            </div>

            {/* Center the grid container */}
            <div className="flex justify-center items-start w-full flex-grow overflow-y-auto py-8">
              <Grid>
                {/* Main content - spans 4 columns */}
                <div className="col-span-4 md:col-start-2 md:col-span-4 flex flex-col items-center p-0">
                  {/* Title */}
                  {showSignup && (
                    <>
                      <motion.div variants={itemVariants}>
                        <H2 className="text-center mb-4">CREATE YOUR ACCOUNT</H2>
                      </motion.div>
                      
                      {/* Description */}
                      <motion.div 
                        className="w-full text-center mb-6"
                        variants={itemVariants}
                      >
                        <Body2 className="text-[#8F8F8F]">
                          Your profile is ready! Create an account to save your results.
                        </Body2>
                      </motion.div>
                    </>
                  )}

                  {/* Image */}
                  {showSignup && (
                    <motion.div 
                      className="flex justify-center w-full mb-6"
                      variants={imageVariants}
                    >
                      <img
                        src={lookImage}
                        alt="Look Finder"
                        className="w-[720px] h-[200px] object-contain md:w-[720px] md:h-[300px]"
                      />
                    </motion.div>
                  )}
                  
                  {/* Signup Form */}
                  {showSignup && (
                    <motion.div 
                      className="w-full max-w-md px-6"
                      variants={itemVariants}
                    >
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setError("");
                            }}
                            className={`w-full h-[50px] py-3 px-4 border ${
                              error ? 'border-red-500' : 'border-gray-300'
                            } rounded-none outline-none transition-colors focus:border-[#1E1E1E] bg-white`}
                            placeholder="Email"
                            style={{ 
                              fontSize: '14px',
                              color: '#1E1E1E'
                            }}
                          />
                        </div>
                        
                        <div>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setError("");
                            }}
                            className={`w-full h-[50px] py-3 px-4 border ${
                              error ? 'border-red-500' : 'border-gray-300'
                            } rounded-none outline-none transition-colors focus:border-[#1E1E1E] bg-white`}
                            placeholder="Password"
                            style={{ 
                              fontSize: '14px',
                              color: '#1E1E1E'
                            }}
                          />
                        </div>
                        
                        <div>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setError("");
                            }}
                            className={`w-full h-[50px] py-3 px-4 border ${
                              error ? 'border-red-500' : 'border-gray-300'
                            } rounded-none outline-none transition-colors focus:border-[#1E1E1E] bg-white`}
                            placeholder="Confirm Password"
                            style={{ 
                              fontSize: '14px',
                              color: '#1E1E1E'
                            }}
                          />
                        </div>
                        
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-red-50 border border-red-200 rounded-[2px]"
                          >
                            <Body2 className="text-red-600">{error}</Body2>
                          </motion.div>
                        )}
                        
                        <SubmitButton
                          onClick={handleSignup}
                          disabled={isSubmitting}
                          loading={isSubmitting}
                          text={isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                        />
                        
                        <div className="text-center mt-4">
                          <Body2 className="text-[#8F8F8F]">
                            Already have an account?{' '}
                            <button
                              onClick={() => navigate('/login')}
                              className="text-black underline"
                            >
                              Login
                            </button>
                          </Body2>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </div>
              </Grid>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
