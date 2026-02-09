import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Grid } from "../../Components/Grid";
import { H2, H3, Body2 } from "../../Components/atoms/Typography";
import { SubmitButton } from "../../Components/atoms";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Feedback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [consultationId, setConsultationId] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState({
    satisfied: "",
    purchased: "",
    notes: "",
  });

  // Extract consultation ID from URL params or localStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let id = params.get('consultationId') || localStorage.getItem('consultation_id');
    
    // Parse the ID as an integer since Consultation uses integer IDs
    if (id) {
      id = parseInt(id, 10);
      setConsultationId(id);
      console.log("Using consultation ID:", id);
      
      // Call fetchExistingFeedback here
      fetchExistingFeedback(id);
    } else {
      setError("No consultation ID provided");
      console.error("No consultation ID found in URL or localStorage");
    }
  }, [location]);
  
  // Fetch existing feedback if available
  const fetchExistingFeedback = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await axios.get(
        `${API_BASE_URL}/consultations/${id}/feedback`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // If feedback exists, populate the form
      if (response.data) {
        console.log("Existing feedback found:", response.data);
        setFeedback({
          satisfied: response.data.is_satisfied ? "Si" : "No",
          purchased: response.data.has_purchased ? "Si" : "No",
          notes: response.data.notes || ""
        });
        setIsEditing(true);
      }
    } catch (err) {
      // 404 is expected if no feedback exists yet
      if (err.response && err.response.status !== 404) {
        console.error("Error fetching existing feedback:", err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!consultationId) {
      setError("No consultation ID provided");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      console.log(`${isEditing ? "Updating" : "Submitting"} feedback for consultation:`, consultationId);
      console.log("Feedback data:", {
        is_satisfied: feedback.satisfied === "Si",
        has_purchased: feedback.purchased === "Si",
        notes: feedback.notes.trim()
      });
      
      const response = await axios.post(
        `${API_BASE_URL}/consultations/${consultationId}/feedback`,
        {
          is_satisfied: feedback.satisfied === "Si",
          has_purchased: feedback.purchased === "Si",
          notes: feedback.notes.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log("Feedback submission successful:", response.data);
      localStorage.setItem(`feedback_submitted_${consultationId}`, 'true');

      // Navigate back to ConsultantInfo instead of ConsultantMain
      try {
        // First try to fetch the consultation data
        const consultationResponse = await axios.get(
          `${API_BASE_URL}/consultations/${consultationId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Process the consultation data to ensure proper ID handling
        const consultationData = consultationResponse.data;
        
        // If the consultation result contains an archetype_id, ensure it's a string
        if (consultationData.result && consultationData.result.archetype_id && 
            typeof consultationData.result.archetype_id === 'number') {
          consultationData.result.archetype_id = String(consultationData.result.archetype_id);
        }
        
        // Navigate with the consultation data in state
        navigate('/ConsultantInfo', { 
          state: consultationData 
        });
      } catch (err) {
        // If fetching fails, navigate with just the ID as a query parameter
        navigate(`/ConsultantInfo?consultationId=${consultationId}`);
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(err.response?.data?.error || err.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const formItemVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const errorVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-white"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Add a style tag to override the default focus styles */}
      <style jsx>{`
        input[type="radio"]:focus {
          outline: none;
          box-shadow: 0 0 0 2px #1E1E1E;
        }
        
        /* Remove default browser outline */
        input[type="radio"] {
          appearance: none;
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border: 1px solid #1E1E1E;
          border-radius: 50%;
          outline: none;
          transition: all 0.2s ease;
        }
        
        /* Custom checked style */
        input[type="radio"]:checked {
          background-color: #1E1E1E;
          border: 1px solid #1E1E1E;
          box-shadow: inset 0 0 0 1px white;
        }
        
        /* Custom focus style */
        input[type="radio"]:focus {
          box-shadow: 0 0 0 2px rgba(30, 30, 30, 0.3), inset 0 0 0 3px white;
        }
        
        /* Remove all focus styles from textarea */
        textarea:focus {
          outline: none !important;
          box-shadow: none !important;
          border-color: #1E1E1E !important;
          ring: 0 !important;
        }
      `}</style>

      {/* Header */}
      <div className="bg-[#000000] text-white flex items-center justify-between p-5 h-[75px] lg:h-[85px]">
        <H2 className="text-white">
        {isEditing ? "EDIT FEEDBACK" : "LEAVE FEEDBACK"}
        </H2>
        <motion.button 
          onClick={() => navigate(-1)} 
          className="text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={24} className="lg:w-7 lg:h-7" />
        </motion.button>
      </div>

      {/* Center the grid container */}
      <div className="flex justify-center w-full flex-grow overflow-y-auto">
        <Grid>
          {/* Main content - spans 4 columns and centered */}
          <div className="col-span-4 md:col-start-2 md:col-span-4 flex flex-col py-8 lg:py-10 pb-12">
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
                  variants={errorVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Body2 className="text-red-700">
                    {error}
                  </Body2>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Question 1 */}
            <motion.div variants={formItemVariants} className="mb-10 lg:mb-12">
              <Body2 className="mb-5 lg:mb-6">
                <strong>Are you satisfied with the test result?</strong>
              </Body2>
              <div className="flex items-center space-x-4">
                <motion.label 
                  className="flex items-center space-x-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="satisfied"
                    value="Yes"
                    checked={feedback.satisfied === "Yes" || feedback.satisfied === "Si"}
                    onChange={handleChange}
                    className="focus:outline-none focus:ring-1 focus:ring-[#1E1E1E]"
                  />
                  <Body2>Yes</Body2>
                </motion.label>
                <motion.label 
                  className="flex items-center space-x-1 relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="satisfied"
                    value="No"
                    checked={feedback.satisfied === "No"}
                    onChange={handleChange}
                    className="focus:outline-none focus:ring-1 focus:ring-[#1E1E1E]"
                  />
                  <Body2>No</Body2>
                </motion.label>
              </div>
            </motion.div>

            {/* Question 2 */}
            <motion.div variants={formItemVariants} className="mb-10 lg:mb-12">
              <Body2 className="mb-5 lg:mb-6">
                <strong>Did you purchase products for the recommended looks?</strong>
              </Body2>
              <div className="flex items-center space-x-4">
                <motion.label 
                  className="flex items-center space-x-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="purchased"
                    value="Yes"
                    checked={feedback.purchased === "Yes" || feedback.purchased === "Si"}
                    onChange={handleChange}
                    className="focus:outline-none focus:ring-1 focus:ring-[#1E1E1E]"
                  />
                  <Body2>Yes</Body2>
                </motion.label>
                <motion.label 
                  className="flex items-center space-x-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="purchased"
                    value="No"
                    checked={feedback.purchased === "No"}
                    onChange={handleChange}
                    className="focus:outline-none focus:ring-1 focus:ring-[#1E1E1E]"
                  />
                  <Body2>No</Body2>
                </motion.label>
              </div>
            </motion.div>

            {/* Notes */}
            <motion.div variants={formItemVariants} className="mb-10 lg:mb-12">
              <H3 className="mb-5 lg:mb-6">
                NOTES
              </H3>
              <motion.textarea
                name="notes"
                className="w-full border-2 border-[#1E1E1E] rounded-[2px] p-4 lg:p-6 h-[250px] lg:h-[300px] focus:outline-none focus:ring-0 focus:border-[#1E1E1E] text-base md:text-base lg:text-lg font-light leading-[21.6px]"
                placeholder="Add comments or notes about the consultation that can help improve NARS Persona"
                value={feedback.notes}
                onChange={handleChange}
                rows={6}
                whileFocus={{ boxShadow: "none" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              className="mb-8"
              variants={formItemVariants}
            >
              <SubmitButton
                onClick={handleSubmit}
                disabled={!feedback.satisfied || !feedback.purchased || loading}
                loading={loading}
                isEditing={isEditing}
              />
            </motion.div>
          </div>
        </Grid>
      </div>
    </motion.div>
  );
}
