import React from "react";
import { X } from "lucide-react";
import lookImage from "../../assets/StartTestIcon.png"; // Replace with actual image path
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function StartTestPage() {
  const navigate = useNavigate();

  const handleStartTest = () => {
    // Navigate to the chatbot questionnaire page
    navigate('/ChatbotQuestionnaire');
  };

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
        duration: 0.5,
        ease: "easeOut",
        delay: 0.2
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
        delay: 0.4
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

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-white"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Header */}
      <div className="flex items-center p-[14px] gap-3">
        <Link to="/ConsultantInfo">
          <motion.button 
            className="p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} className="lg:w-7 lg:h-7" color="#1E1E1E" />
          </motion.button>
        </Link>
      </div>

      {/* Empty Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <motion.div 
          className="bg-[#1E1E1E] h-1 w-0"
          initial={{ width: 0 }}
          animate={{ width: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
        ></motion.div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-2 lg:p-4 max-w-md lg:max-w-lg mx-auto w-full mb-2">
        {/* Title */}
        <motion.div 
          className="w-full md:w-auto md:px-8 lg:px-10"
          variants={itemVariants}
        >
          <h2 className="text-center text-xl md:text-[24px] lg:text-[28px] my-6 lg:my-8 md:whitespace-nowrap mx-[2px]">
            <i>“Find your own way, have an open spirit and believe in your own beauty.”</i><br /><strong>François Nars</strong>
          </h2>
        </motion.div>

        {/* Image */}
        <motion.div 
          className="flex justify-center w-full mb-6"
          variants={imageVariants}
        >
          <img
            src={lookImage}
            alt="Look Finder"
            className="w-[758px] h-[260px] object-contain md:w-[1158px] md:h-[363px] lg:w-[1158px] lg:h-[420px] md:mb-14 lg:mb-16"
          />
        </motion.div>

        {/* Description */}
        <motion.div 
          className="w-full text-center mb-8 lg:mb-10"
          variants={itemVariants}
        >
          <p className="text-[#8F8F8F] text-[16px] lg:text-[18px] mb-5 lg:mb-6 mx-[8px]">
            There are no right or wrong answers: take the time you need and answer each question honestly.
          </p>
          <p className="text-[#8F8F8F] text-[16px] lg:text-[18px] mb-5 lg:mb-6 mx-[8px]">
            At the end, you'll discover a profile created just for you, with practical tips and looks designed to enhance your uniqueness.
          </p>
          <p className="text-[#8F8F8F] text-[16px] lg:text-[18px]">
            If everything is clear, let's begin!
          </p>
        </motion.div>
        
        {/* Button */}
        <div className="flex items-center justify-center w-full">
          <motion.button 
            onClick={handleStartTest}
            className="w-[320px] bg-[#1E1E1E] text-white py-2 hover:bg-[#333333] transition md:w-[260px] lg:w-[280px] h-[52px] md:h-[42px] lg:h-[48px] rounded-[2px] font-normal text-base lg:text-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Start
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}