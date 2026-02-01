import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../assets/Main.png";
import { Loader2 } from 'lucide-react'; 
import { authService } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Grid } from '../Components/Grid';
import eyeShow from '../assets/eye-show.png';
import eyeHide from '../assets/eye-hide.png';
import loadingSpinner from '../assets/spinner-black.png';
import check from '../assets/check.png';



function Authentication() {
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
      
      // Redirect to main page
      window.location.href = '/Consultant';
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
      setEmailError("L'email è errata. Per favore, riprova.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Check if email is valid before submitting
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError("L'email è errata. Per favore, riprova.");
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
        window.location.href = '/Consultant';
      }, 500);
      
    } catch (error) {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < randomDelay) {
        await new Promise(resolve => setTimeout(resolve, randomDelay - elapsedTime));
      }
      
      setError("L'email o la password sono errate. Per favore, riprova.");
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
               
                className="w-8 h-8 animate-spin"
              />
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="login"
          className="min-h-screen flex items-center justify-center bg-white"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
        >
          <Grid>
            <div className="col-span-4 md:col-start-2 md:col-span-4 flex flex-col items-center justify-center pt-2 pb-24">
              <motion.div className="text-center flex items-center justify-center mb-[80px] md:mb-[150px] lg:mb-[210px]">
                <img src={Logo} alt="Logo" className="w-[224px] h-[139.74px] md:w-[180px] md:h-[120px] lg:w-[240px] lg:h-[140px] object-contain" /> 
              </motion.div>
              <motion.form onSubmit={handleSubmit} className="space-y-4 w-full mt-9">
                <motion.h2 
                  className="text-[24px] font-semibold"
                  variants={itemVariants}
                >
                  Accedi
                </motion.h2>
                <motion.div 
                  className="space-y-3 mb-3 w-full"
                  variants={itemVariants}
                >
                  <motion.div variants={itemVariants}>
                    <div className="w-full">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleEmailBlur}
                        className={`w-full h-[55px] md:h-[45px] lg:h-[60px] py-2 px-3 border rounded-[2px] outline-none transition-colors
                          ${emailError || error ? 'border-red-500' : 'border-[#1E1E1E]'}
                        `}
                        placeholder="Email"
                        style={{ 
                          fontSize: '16px', 
                          color: formData.email ? '#1E1E1E' : '#888888',
                          fontWeight: formData.email ? '500' : '400'
                        }}
                      />
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-[16px] mt-1 text-left">
                        L'<span className="font-bold">email</span> è errata. Per favore, riprova.
                      </p>
                    )}
                  </motion.div>
                  <motion.div 
                    className="relative"
                    variants={itemVariants}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full h-[55px] md:h-[45px] lg:h-[60px] py-2 px-3 border rounded-[2px] outline-none transition-colors
                        ${error ? 'border-red-500' : 'border-[#1E1E1E]'}
                      `}
                      placeholder="Password"
                      style={{ 
                        fontSize: '16px', 
                        color: formData.password ? '#1E1E1E' : '#888888',
                        fontWeight: formData.password ? '500' : '400'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <img 
                        src={showPassword ? eyeHide : eyeShow} 
                        alt="toggle password visibility"
                        className="w-[18px] h-[18px] object-contain"
                      />
                    </button>
                  </motion.div>
                </motion.div>
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
                    style={{ 
                      backgroundImage: formData.remember ? `url(${check})` : 'none',
                      backgroundSize: '14px'
                    }}
                    className="h-4 w-4 appearance-none border border-[#1E1E1E] rounded-[2px] 
                      checked:bg-[#1E1E1E] checked:border-[#1E1E1E] 
                      checked:bg-no-repeat checked:bg-center
                      accent-[#1E1E1E] focus:outline-none"
                  />
                  <label 
                    htmlFor="remember"
                    className="ml-2 text-gray-800 font-roboto font-normal text-[15px] leading-[22px] tracking-[0] cursor-pointer "
                  >
                    Ricorda le credenziali al prossimo accesso
                  </label>
                </motion.div>
                <motion.button
                  type="submit"
                  className="w-full h-[55px] md:h-[45px] lg:h-[60px]  bg-[#1E1E1E] text-white py-2 rounded-[2px] hover:bg-gray-800 transition-colors mt-1 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  disabled={isLoading}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Loading...' : 'Login'}
                </motion.button>
                {error && (
                  <p className="text-red-500 text-[16px] mt-1 text-left">
                    L'<span className="font-bold">email</span> o la <span className="font-bold">password</span> sono errate. Per favore, riprova.
                  </p>
                )}
              </motion.form>
            </div>
          </Grid>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Authentication;
