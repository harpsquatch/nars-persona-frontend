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

export default function FinishTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const answers = location.state?.answers || [];
  const consultationData = location.state?.consultationData;
  const [loading, setLoading] = useState(false);

  // No useEffect needed - we'll use the data directly

  const handleSubmit = () => {
    setLoading(true);
    
    // Get consultation ID directly from props or localStorage
    const consultationId = consultationData?.consultation_id || 
                          consultationData?.id ||
                          localStorage.getItem('consultation_id');
    
    console.log("FinishTest: Navigating with consultation ID:", consultationId);
    
    setTimeout(() => {
      // Navigate directly to ConsultantInfo with the consultation ID
      navigate("/ConsultantInfo", { 
        state: { 
          id: consultationId,
          result: consultationData?.result
        } 
      });
    }, 3000);
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
                onClick={() => navigate("/QuestionnairePage")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} color="#1E1E1E" />
              </motion.button>
            </div>

            {/* Center the grid container */}
            <div className="flex justify-center items-center w-full flex-grow -mt-30">
              <Grid>
                {/* Main content - spans 4 columns */}
                <div className="col-span-4 md:col-start-2 md:col-span-4 flex flex-col items-center justify-center p-0">
                  {/* Title */}
                  <motion.h2 
                    className="text-center text-[30px] font-bold d:text-3xlm lg:text-4xl mb-10 md:mb-5"
                    variants={itemVariants}
                  >
                    Finito
                  </motion.h2>
                  
                  {/* Description */}
                  <motion.div 
                    className="w-full text-center mb-1 md:mb-7"
                    variants={itemVariants}
                  >
                    <p className="text-[#8F8F8F] text-[16px]">
                      Il tuo profilo è pronto
                    </p>
                    <p className="text-[#8F8F8F] text-[16px] mb-3">
                      Scopriamo insieme come valorizzare la tua unicità!
                    </p>
                  </motion.div>

                  {/* Image */}
                  <motion.div 
                    className="flex justify-center w-full mb-30"
                    variants={imageVariants}
                  >
                    <img
                      src={lookImage}
                      alt="Look Finder"
                      className="w-[170px] h-[300px] object-contain md:w-[350px] md:h-[500px] d:hm-[550px]"
                    />
                  </motion.div>
                  
                  {/* Button with adjusted container */}
                  <div className="fixed bottom-8 md:bottom-25 left-6 right-6 md:left-43 md:right-43 flex justify-center">
                    <div className="w-full px-0">
                      <motion.button 
                        onClick={handleSubmit}
                        className="w-full bg-[#1E1E1E] text-white py-2.5 hover:bg-[#333333] transition h-[50px] font-bold rounded-[2px] flex items-center justify-center text-sm md:w-[50%] md:mx-auto"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Scopri i look per te
                      </motion.button>
                    </div>
                  </div>
                </div>
              </Grid>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
