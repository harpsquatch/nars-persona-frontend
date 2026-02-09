import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConsultantDataPage from "./ConsultantDataPage";
import ConsultantNone from "./ConsultantNone";
import Navbar from "../../Components/Navbar";
import { consultationService, API_BASE_URL } from "../../services/api";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Briefcase, Heart, PartyPopper, Calendar, Sparkles, Zap } from "lucide-react";

const ConsultantMain = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [generatingContext, setGeneratingContext] = useState(null);

  useEffect(() => {
    // Fetch consultations for the current user
    const fetchConsultations = async () => {
      try {
        const userConsultations = await consultationService.getUserConsultations();
        
        // Transform consultations into the format expected by the component
        const formattedConsultations = await Promise.all(userConsultations.map(async (consultation) => {
          // Format the date from the consultation
          const consultDate = new Date(consultation.timestamp);
          const dateStr = formatDate(consultDate);
          
          // Get the archetype name from the result if available
          let title = "Consultation";
          if (consultation.result && consultation.result.archetype) {
            title = consultation.result.archetype;
          }
          
          // Ensure consultation ID is an integer
          const consultationId = typeof consultation.id === 'string' 
            ? parseInt(consultation.id, 10) 
            : consultation.id;
          
          // Check if feedback exists for this consultation
          let hasFeedback = localStorage.getItem(`feedback_submitted_${consultationId}`) === 'true';
          
          if (!hasFeedback) {
            try {
              const token = localStorage.getItem('token');
              if (token) {
                const response = await axios.get(
                  `${API_BASE_URL}/consultations/${consultationId}/feedback`,
                  {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  }
                );
                
                // Check if response has meaningful feedback data
                if (response.data && 
                    typeof response.data === 'object' && 
                    Object.keys(response.data).length > 0 &&
                    (response.data.rating || response.data.comment)) {
                  hasFeedback = true;
                  localStorage.setItem(`feedback_submitted_${consultationId}`, 'true');
                }
              }
            } catch (err) {
              // Don't log 404s as they're expected when no feedback exists
              if (!err.response || err.response.status !== 404) {
                console.error("Error checking feedback status:", err);
              }
              // Keep hasFeedback as false
              hasFeedback = false;
              localStorage.removeItem(`feedback_submitted_${consultationId}`);
            }
          }
          
          // Make sure to preserve the archetype_id as a string if it exists in the result
          let result = consultation.result;
          if (result && result.archetype_id && typeof result.archetype_id === 'number') {
            // Convert archetype_id to string if it's a number
            result = {
              ...result,
              archetype_id: String(result.archetype_id)
            };
          }
          
          return {
            id: consultationId, // Use the parsed integer ID
            date: dateStr,
            title: title,
            status: consultation.status,
            result: result, // Use the potentially modified result
            answers: consultation.answers,
            hasFeedback: hasFeedback
          };
        }));
        
        setConsultations(formattedConsultations);
      } catch (error) {
        console.error("Error fetching consultations:", error);
        setConsultations([]);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    fetchConsultations();
  }, []);

  // Helper function to format dates in a user-friendly way
  const formatDate = (date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format time
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    
    // Check if date is today, yesterday, or earlier
    if (date.toDateString() === now.toDateString()) {
      return `Today · ${timeStr}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday · ${timeStr}`;
    } else {
      // Format as MM/DD/YYYY for older dates
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year} · ${timeStr}`;
    }
  };

  // Quick Context buttons configuration
  const quickContexts = [
    { label: "Office", icon: Briefcase, context: "office" },
    { label: "Date", icon: Heart, context: "date" },
    { label: "Party", icon: PartyPopper, context: "party" },
    { label: "Everyday", icon: Calendar, context: "everyday" },
    { label: "Wedding", icon: Sparkles, context: "wedding" },
    { label: "Custom", icon: Zap, context: "custom" }
  ];

  // Handle quick context generation
  const handleQuickContext = async (context) => {
    setGeneratingContext(context);
    
    try {
      // Get user's latest consultation to base the recommendation on
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      
      if (!userId) {
        navigate("/");
        return;
      }

      const consultationsResponse = await axios.get(
        `${API_BASE_URL}/consultations?user_id=${userId}&latest=true`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const latestConsultation = consultationsResponse.data.length > 0 ? consultationsResponse.data[0] : null;

      if (!latestConsultation || !latestConsultation.result) {
        // No consultation found, redirect to quiz
        navigate("/StartTestPage");
        return;
      }

      // Navigate to the archetype page with the context parameter
      navigate("/ConsultantInfo", { 
        state: { 
          context: context,
          consultation: latestConsultation
        } 
      });
    } catch (error) {
      console.error("Error generating context recommendation:", error);
    } finally {
      setGeneratingContext(null);
    }
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  // Animation variants for loading spinner
  const spinnerVariants = {
    initial: { opacity: 0, scale: 0.9 },
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
      scale: 0.9,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white px-6 py-6 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          {/* Quick Context Row */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-4">Get a look for</h2>
            <div className="flex flex-wrap gap-3">
              {quickContexts.map((ctx) => {
                const Icon = ctx.icon;
                const isGenerating = generatingContext === ctx.context;
                
                return (
                  <motion.button
                    key={ctx.context}
                    onClick={() => handleQuickContext(ctx.context)}
                    disabled={isGenerating || loading}
                    className={`
                      flex items-center gap-2 px-4 py-3 rounded-full 
                      bg-[#F5F5F5] hover:bg-[#1E1E1E] hover:text-white
                      text-[#1E1E1E] font-semibold text-sm md:text-base
                      transition-all duration-300 
                      ${isGenerating ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                  >
                    {isGenerating ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Icon size={18} />
                    )}
                    <span>{ctx.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                className="min-h-[60vh] flex flex-col items-center justify-center"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={spinnerVariants}
              >
              </motion.div>
            ) : consultations.length > 0 ? (
              <motion.div
                key="data"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                <ConsultantDataPage consultations={consultations} />
              </motion.div>
            ) : (
              <motion.div
                key="none"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                <ConsultantNone />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default ConsultantMain;
