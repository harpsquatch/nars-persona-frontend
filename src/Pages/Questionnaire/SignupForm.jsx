import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../assets/Main.png";
import { Grid } from "../../Components/Grid";
import eyeShow from '../../assets/eye-show.png';
import eyeHide from '../../assets/eye-hide.png';
import loadingSpinner from '../../assets/spinner-black.png';
import check from '../../assets/check.png';
import { authService } from "../../services/api";

export default function SignupForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const answers = location.state?.answers || {};
  
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
    
    if (name === 'email') {
      setEmailError("");
    }
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
    
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError("Invalid email. Please try again.");
      return;
    }
    
    setIsLoading(true);

    try {
      console.log('Signup with answers:', answers);
      console.log('Answers type:', typeof answers, 'Keys:', Object.keys(answers));
      
      const data = await authService.signup(
        formData.email,
        formData.password,
        answers,
        formData.remember
      );
      
      // Store token
      localStorage.setItem('token', data.access_token);
      
      if (data.user && data.user.id) {
        localStorage.setItem('user_id', String(data.user.id));
      }
      
      if (formData.remember && data.remember_token) {
        localStorage.setItem('remember_token', data.remember_token);
        localStorage.setItem('rememberedEmail', formData.email);
      }
      
      // Store consultation ID
      if (data.consultation_id) {
        localStorage.setItem('consultation_id', data.consultation_id);
      }
      
      // Navigate to results
      setTimeout(() => {
        navigate("/ConsultantInfo", { 
          state: { 
            id: data.consultation_id,
            result: data.result
          } 
        });
      }, 500);
      
    } catch (error) {
      setError(error.message || "Signup failed. Please try again.");
      setIsLoading(false);
    }
  };

  if (!answers || Object.keys(answers).length === 0) {
    navigate('/StartTestPage');
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div 
          key="loading"
          className="min-h-screen bg-white flex flex-col items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-full max-w-md space-y-8 text-center flex flex-col items-center justify-center">
            <motion.div className="flex justify-center items-center">
              <img src={Logo} alt="Logo" className="w-[175px]" />
            </motion.div>
            <motion.div className="mt-8 flex justify-center items-center">
              <img 
                src={loadingSpinner}
                className="w-8 h-8 animate-spin"
                alt="Loading"
              />
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="content"
          className="min-h-screen bg-white flex flex-col"
          initial="initial"
          animate="animate"
          variants={pageVariants}
        >
          <div className="flex justify-center items-center w-full flex-grow">
            <Grid>
              <div className="col-span-4 md:col-start-2 md:col-span-4 flex flex-col justify-center py-8 lg:py-10">
                <motion.div 
                  className="flex justify-center mb-8"
                  variants={itemVariants}
                >
                  <img src={Logo} alt="Logo" className="w-[175px]" />
                </motion.div>

                <motion.h2 
                  className="text-2xl md:text-3xl font-bold text-center mb-2"
                  variants={itemVariants}
                >
                  Create Your Account
                </motion.h2>

                <motion.p 
                  className="text-gray-600 text-center mb-8"
                  variants={itemVariants}
                >
                  Almost done! Create your account to see your results.
                </motion.p>

                <motion.form 
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <motion.div variants={itemVariants}>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleEmailBlur}
                      className={`w-full h-[55px] md:h-[45px] lg:h-[60px] py-2 px-3 border rounded-[2px] outline-none transition-colors
                        ${emailError ? 'border-red-500' : 'border-[#1E1E1E]'}
                      `}
                      placeholder="Email"
                      required
                      style={{ fontSize: '16px' }}
                    />
                    {emailError && (
                      <p className="text-red-500 text-[16px] mt-1 text-left">
                        {emailError}
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
                      required
                      style={{ fontSize: '16px' }}
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
                      className="ml-2 text-gray-800 text-[15px] cursor-pointer"
                    >
                      Remember me for next login
                    </label>
                  </motion.div>

                  <motion.button
                    type="submit"
                    className="w-full h-[55px] md:h-[45px] lg:h-[60px] bg-[#1E1E1E] text-white py-2 rounded-[2px] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    disabled={isLoading}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </motion.button>

                  {error && (
                    <p className="text-red-500 text-[16px] mt-1 text-center">
                      {error}
                    </p>
                  )}

                  <motion.div 
                    className="text-center mt-6"
                    variants={itemVariants}
                  >
                    <p className="text-gray-600 text-sm">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-[#1E1E1E] font-semibold underline hover:text-gray-700 transition-colors"
                      >
                        Log in
                      </button>
                    </p>
                  </motion.div>
                </motion.form>
              </div>
            </Grid>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

