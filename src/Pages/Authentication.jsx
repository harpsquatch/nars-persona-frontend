import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Main.png";
import LoginImage from "../assets/login.png";
import { Loader2 } from 'lucide-react'; 
import { authService } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Grid } from '../Components/Grid';
import { H2, Body2, H3 } from '../Components/atoms/Typography';
import eyeShow from '../assets/eye-show.png';
import eyeHide from '../assets/eye-hide.png';
import loadingSpinner from '../assets/spinner-black.png';
import check from '../assets/check.png';



function Authentication() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.3
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
    }
  };

  const loaderVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const errorVariants = {
    initial: { opacity: 0, y: -10, height: 0 },
    animate: { 
      opacity: 1, 
      y: 0, 
      height: "auto",
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      height: 0,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  // Check for saved credentials on component mount
  useEffect(() => {
    // Check if we have a remember token
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedToken = localStorage.getItem('remember_token');
    
    if (rememberedEmail && rememberedToken) {
      // Auto-login with remember token
      attemptTokenLogin(rememberedEmail, rememberedToken);
    }
  }, []);

  const attemptTokenLogin = async (email, token) => {
    try {
      setIsLoading(true);
      // Call the token login endpoint
      const data = await authService.loginWithToken(email, token);
      
      // Store the new token and remember token
      localStorage.setItem('token', data.access_token);
      
      // Store user ID if available (as a string in localStorage, but it's an integer)
      if (data.user && data.user.id) {
        localStorage.setItem('user_id', String(data.user.id));
      }
      
      if (data.remember_token) {
        localStorage.setItem('remember_token', data.remember_token);
        localStorage.setItem('rememberedEmail', email);
      }
      
      // Redirect to archetype page
      window.location.href = '/ConsultantInfo';
    } catch (error) {
      // If token login fails, clear remembered credentials
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('remember_token');
      setIsLoading(false);
      
      // Pre-fill the email field for convenience
      if (email) {
        setFormData(prev => ({
          ...prev,
          email: email
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
    
    // Clear email error when user starts typing in the email field
    if (name === 'email') {
      setEmailError("");
    }
    
    // Always clear the main error when user changes any field
    setError("");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError("Invalid email. Please try again.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Check if email is valid before submitting
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError("Invalid email. Please try again.");
      return; // Don't submit if email is invalid
    }
    
    setIsLoading(true);
    
    const minDelay = 2000;
    const maxDelay = 4000;
    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    const startTime = Date.now();

    try {
      const data = await authService.login(
        formData.email, 
        formData.password, 
        formData.remember
      );
      
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < randomDelay) {
        await new Promise(resolve => setTimeout(resolve, randomDelay - elapsedTime));
      }
      
      localStorage.setItem('token', data.access_token);
      
      // Store user ID if available (as a string in localStorage, but it's an integer)
      if (data.user && data.user.id) {
        localStorage.setItem('user_id', String(data.user.id));
      }
      
      if (formData.remember && data.remember_token) {
        localStorage.setItem('remember_token', data.remember_token);
        localStorage.setItem('rememberedEmail', formData.email);
      }
      
      setTimeout(() => {
        window.location.href = '/ConsultantInfo';
      }, 500);
      
    } catch (error) {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < randomDelay) {
        await new Promise(resolve => setTimeout(resolve, randomDelay - elapsedTime));
      }
      
      setError(error.message || "Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  // Add this to your existing useEffect or create a new one at the top of your component
  useEffect(() => {
    const attemptTokenLogin = async () => {
      const rememberedEmail = localStorage.getItem('rememberedEmail');
      const rememberToken = localStorage.getItem('remember_token');
      
      if (rememberedEmail && rememberToken) {
        setIsLoading(true);
        
        try {
          // Attempt to login with the stored token
          const data = await authService.loginWithToken(rememberedEmail, rememberToken);
          
          // If successful, store the new token and redirect
          localStorage.setItem('token', data.access_token);
          
          // Store user ID if available (as a string in localStorage, but it's an integer)
          if (data.user && data.user.id) {
            localStorage.setItem('user_id', String(data.user.id));
          }
          
          // Update remember token if a new one was provided
          if (data.remember_token) {
            localStorage.setItem('remember_token', data.remember_token);
          }
          
          // Redirect to the main page
          window.location.href = '/Consultant';
        } catch (error) {
          console.error('Auto-login failed:', error);
          // Clear invalid tokens
          localStorage.removeItem('remember_token');
          localStorage.removeItem('rememberedEmail');
          setIsLoading(false);
        }
      }
    };
    
    // Only attempt token login if user is not already logged in
    if (!authService.isAuthenticated()) {
      attemptTokenLogin();
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div 
          key="loading"
          className="min-h-screen bg-white flex flex-col items-center justify-center px-4"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
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
                alt="Loading"
                className="w-8 h-8 animate-spin"
              />
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="login"
          className="min-h-screen bg-white"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
        >
          {/* Main Container with max-width 1200px */}
          <div className="w-full mx-auto h-screen flex flex-col md:flex-row">
            {/* Left Container - Image (50% width) */}
            <div className="hidden lg:block w-full md:w-1/2 relative overflow-hidden">
              <img 
                src={LoginImage} 
                alt="NARS" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Container - Login Form (50% width) */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 md:px-12 lg:px-20 py-12 min-h-screen lg:min-h-0">
              <div className="w-full max-w-[450px]">
                {/* NARS PERSONA Logo */}
                <motion.div 
                  className="mb-12 flex justify-center"
                  variants={itemVariants}
                >
                  <img 
                    src={Logo} 
                    alt="NARS PERSONA" 
                    className="h-20 object-contain" 
                  />
                </motion.div>

                {/* Login Form */}
                <motion.form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    variants={itemVariants}
                    className="mb-8"
                  >
                    <H3 className="text-[#1E1E1E]">
                      LOGIN
                    </H3>
                  </motion.div>

                  {/* Email Input */}
                  <motion.div variants={itemVariants}>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleEmailBlur}
                      className={`w-full h-[50px] py-3 px-4 border ${
                        emailError || error ? 'border-red-500' : 'border-gray-300'
                      } rounded-none outline-none transition-colors focus:border-[#1E1E1E] bg-white`}
                      placeholder="Email"
                      style={{ 
                        fontSize: '14px',
                        color: '#1E1E1E'
                      }}
                    />
                    {emailError && (
                      <Body2 className="text-red-500 mt-2">
                        Invalid email. Please try again.
                      </Body2>
                    )}
                  </motion.div>

                  {/* Password Input */}
                  <motion.div 
                    className="relative"
                    variants={itemVariants}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full h-[50px] py-3 px-4 border ${
                        error ? 'border-red-500' : 'border-gray-300'
                      } rounded-none outline-none transition-colors focus:border-[#1E1E1E] bg-white`}
                      placeholder="Password"
                      style={{ 
                        fontSize: '14px',
                        color: '#1E1E1E'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <img 
                        src={showPassword ? eyeHide : eyeShow} 
                        alt="toggle password visibility"
                        className="w-5 h-5 object-contain"
                      />
                    </button>
                  </motion.div>

                  {/* Remember Me Checkbox */}
                  <motion.div 
                    className="flex items-center"
                    variants={itemVariants}
                  >
                    <input
                      type="checkbox"
                      id="remember"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                      className="h-4 w-4 appearance-none border border-gray-400 rounded-sm 
                        checked:bg-[#1E1E1E] checked:border-[#1E1E1E] 
                        focus:outline-none cursor-pointer"
                      style={{ 
                        backgroundImage: formData.remember ? `url(${check})` : 'none',
                        backgroundSize: '12px',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                    <label 
                      htmlFor="remember"
                      className="ml-2 cursor-pointer select-none"
                    >
                      <Body2 className="text-gray-600">
                        Remember credentials for next login
                      </Body2>
                    </label>
                  </motion.div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Body2 className="text-red-500">
                        Invalid email or password. Please try again.
                      </Body2>
                    </motion.div>
                  )}

                  {/* Login Button */}
                  <motion.button
                    type="submit"
                    className="w-full h-[50px] bg-[#1E1E1E] text-white rounded-none hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    disabled={isLoading}
                    variants={itemVariants}
                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                    whileTap={{ scale: isLoading ? 1 : 0.99 }}
                  >
                    {isLoading ? 'LOADING...' : 'LOGIN'}
                  </motion.button>

                  {/* New user signup link */}
                  <motion.div 
                    className="text-center mt-6"
                    variants={itemVariants}
                  >
                    <Body2 className="text-gray-600">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/StartTestPage')}
                        className="text-[#1E1E1E] font-light underline hover:text-gray-700 transition-colors"
                      >
                        <strong>TALK TO OUR AI CONSULTANT</strong>
                      </button>
                    </Body2>
                  </motion.div>
                </motion.form>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Authentication;
