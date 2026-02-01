import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import { Loader2 } from 'lucide-react';
import Logo from "../../assets/Main.png";
import { motion, AnimatePresence } from "framer-motion";
import { Grid } from "../../Components/Grid";

// 🔹 All data stored here for easy modification
const lookDetails = {
  title: "Bold Lip",
  author: "François Nars, Founder & Creative Director",
  tags: ["15 min • Facile", "Labbra", "6 prodotti"],
  images: [
    "https://images.pexels.com/photos/3373723/pexels-photo-3373723.jpeg",
    "https://images.pexels.com/photos/3373730/pexels-photo-3373730.jpeg",
  ],
  steps: [
    {
      step: 1,
      title: "Idrata le labbra",
      description:
        "Le labbra dovrebbero essere ben idratate per supportare le texture opache.",
    },
    {
      step: 2,
      title: "Crea contorno e forma",
      description:
        "Utilizza una matita labbra dello stesso colore o di una tonalità più scura.",
    },
    {
      step: 3,
      title: "Determina l'effetto",
      description:
        "Sperimenta con diversi prodotti per ottenere il risultato desiderato.",
    },
    {
      step: 4,
      title: "Aggiungi dimensione",
      description:
        "Utilizza gloss o rossetti con finitura lucida per un effetto 3D.",
    },
    {
      step: 5,
      title: "Sfuma i bordi",
      description:
        "Usa un pennellino per perfezionare il contorno delle labbra.",
    },
  ],
  products: [
    {
      name: "Light Reflecting Foundation",
      image:
        "https://images.pexels.com/photos/3373730/pexels-photo-3373730.jpeg",
    },
    {
      name: "Blush",
      image:
        "https://images.pexels.com/photos/3373741/pexels-photo-3373741.jpeg",
    },
    {
      name: "Climax Mascara",
      image:
        "https://images.pexels.com/photos/3373750/pexels-photo-3373750.jpeg",
    },
    {
      name: "Exhibit Lipstick",
      image:
        "https://images.pexels.com/photos/3373760/pexels-photo-3373760.jpeg",
    },
  ],
  artistAdvice: [
    {
      title: "Consiglio dell'artista",
      content: `Un Bold Lip è intenso e d'impatto sia nel colore che nella forma.
      L'impressione cromatica è ricca, satura e profonda. La forma e l'effetto
      sono precisi e applicati con maestria. Le Bold Lips si distinguono come il
      punto focale del look.`,
    },
  ],
};

// Add this near the top of your file, after the imports
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Add this helper function near the top of the file
const parseMakeupCategories = (categoryString) => {
  if (!categoryString) return [];
  
  // If it's already an array, return it
  if (Array.isArray(categoryString)) return categoryString;
  
  // If it's a string, split by commas and clean up
  if (typeof categoryString === 'string') {
    return categoryString.split(',').map(cat => cat.trim());
  }
  
  return [];
};

export default function LookDetails() {
  const { lookId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentImage, setCurrentImage] = useState(0);
  const [lookTitle, setLookTitle] = useState("Bold Lip");
  const [artistInstruction, setArtistInstruction] = useState("");
  const [artistInstructionTitle, setArtistInstructionTitle] = useState("");
  const [tags, setTags] = useState(lookDetails.tags);
  const [lookImages, setLookImages] = useState(lookDetails.images);
  const [lookSteps, setLookSteps] = useState(lookDetails.steps);
  const [lookProducts, setLookProducts] = useState(lookDetails.products);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const autoSlideTimerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Simplify the handleDotClick function - just change the image
  const handleDotClick = (index) => {
    setCurrentImage(index);
  };

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    // Only process swipe if we have multiple images and a significant swipe distance
    if (lookImages.length > 1 && Math.abs(touchStart - touchEnd) > 50) {
      if (touchStart - touchEnd > 50) {
        // Swipe left - go to next image
        setCurrentImage((prevIndex) => 
          prevIndex === lookImages.length - 1 ? 0 : prevIndex + 1
        );
      }
      
      if (touchStart - touchEnd < -50) {
        // Swipe right - go to previous image
        setCurrentImage((prevIndex) => 
          prevIndex === 0 ? lookImages.length - 1 : prevIndex - 1
        );
      }
    }
    
    // Reset touch values
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Helper function to parse image URLs
  const parseImageUrls = (imageData) => {
    if (!imageData) return [];
    
    // If imageData is already an array, return it
    if (Array.isArray(imageData)) return imageData;
    
    // If imageData is a string but might be a comma-separated list
    if (typeof imageData === 'string') {
      // Check if it contains commas
      if (imageData.includes(',')) {
        return imageData.split(',').map(url => url.trim());
      }
      // Single URL string
      return [imageData];
    }
    
    return [];
  };

  // Check if we have look data from navigation state
  useEffect(() => {
    // If we have look data from navigation state, use it
    if (location.state && location.state.lookData) {
      console.log("Look data from navigation:", location.state.lookData);
      const lookData = location.state.lookData;
      
      // Update the title from the navigation data
      if (lookData.name) {
        setLookTitle(lookData.name);
        console.log("Setting title from navigation:", lookData.name);
      }
      
      // Update artist instruction and title if available
      if (lookData.artist_instruction) {
        setArtistInstruction(lookData.artist_instruction);
        console.log("Setting artist instruction from navigation:", lookData.artist_instruction);
        
        // If there's a title for the artist instruction, use it
        if (lookData.artist_instruction_title) {
          setArtistInstructionTitle(lookData.artist_instruction_title);
          console.log("Setting artist instruction title from navigation:", lookData.artist_instruction_title);
        }
      }
      
      // Generate tags from look data
      const newTags = [];
      
      // Add application time and expertise level tag if both exist
      if (lookData.application_time && lookData.expertise_required) {
        newTags.push(`${lookData.application_time} min • ${lookData.expertise_required}`);
      } else if (lookData.application_time) {
        newTags.push(`${lookData.application_time} min`);
      } else if (lookData.expertise_required) {
        newTags.push(lookData.expertise_required);
      }
      
      // Parse and add makeup categories
      const categories = parseMakeupCategories(lookData.makeup_category);
      if (categories.length > 0) {
        newTags.push(...categories);
      }
      
      // Add products count tag
      if (lookData.products && Array.isArray(lookData.products)) {
        newTags.push(`${lookData.products.length} prodotti`);
      }
      
      // If we have tags, update the state
      if (newTags.length > 0) {
        setTags(newTags);
        console.log("Setting tags from navigation:", newTags);
      }
      
      // Update images if available
      if (lookData.image_url) {
        const parsedImages = parseImageUrls(lookData.image_url);
        setLookImages(parsedImages);
        console.log("Setting images from navigation:", parsedImages);
      }
      
      // Update steps if available
      if (lookData.instructions) {
        try {
          let instructions;
          
          // Check if instructions is already an object or needs to be parsed
          if (typeof lookData.instructions === 'string') {
            instructions = JSON.parse(lookData.instructions);
          } else {
            instructions = lookData.instructions;
          }
          
          // Map the instructions to our steps format - simplified version
          if (Array.isArray(instructions)) {
            const formattedSteps = instructions.map((section) => ({
              label: section.label,
              instructions: section.instructions.map((instruction, index) => ({
                step: index + 1,
                description: instruction,
              })),
              // No separate title field
            }));
            
            setLookSteps(formattedSteps);
          }
        } catch (err) {
          console.error("Error parsing instructions:", err);
        }
      }
      
      // Update products if available
      if (lookData.products && Array.isArray(lookData.products)) {
        const formattedProducts = lookData.products.map(product => ({
          name: product.name || "Product Name",
          image: product.image_url || "https://via.placeholder.com/150"
        }));
        
        setLookProducts(formattedProducts);
        console.log("Setting products from navigation:", formattedProducts);
      }
      
      // Set loading to false when data is processed
      setLoading(false);
    } 
    // Otherwise fetch from API using lookId
    else if (lookId) {
      const fetchLookData = async () => {
        try {
          setLoading(true); // Set loading to true before fetching
          const token = localStorage.getItem('token');
          
          // For Look IDs, do NOT parse as integer since they are UUIDs (strings)
          // Use the lookId directly in the API call
          const response = await axios.get(
            `${API_BASE_URL}/looks/${lookId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          console.log("Fetched look data:", response.data);
          const lookData = response.data;
          
          // Update the title from API data
          if (lookData.name) {
            setLookTitle(lookData.name);
            console.log("Setting title from API:", lookData.name);
          }
          
          // Update artist instruction and title if available
          if (lookData.artist_instruction) {
            setArtistInstruction(lookData.artist_instruction);
            console.log("Setting artist instruction from API:", lookData.artist_instruction);
            
            // If there's a title for the artist instruction, use it
            if (lookData.artist_instruction_title) {
              setArtistInstructionTitle(lookData.artist_instruction_title);
              console.log("Setting artist instruction title from API:", lookData.artist_instruction_title);
            }
          }
          
          // Generate tags from look data
          const newTags = [];
          
          // Add application time and expertise level tag if both exist
          if (lookData.application_time && lookData.expertise_required) {
            newTags.push(`${lookData.application_time} min • ${lookData.expertise_required}`);
          } else if (lookData.application_time) {
            newTags.push(`${lookData.application_time} min`);
          } else if (lookData.expertise_required) {
            newTags.push(lookData.expertise_required);
          }
          
          // Parse and add makeup categories
          const categories = parseMakeupCategories(lookData.makeup_category);
          if (categories.length > 0) {
            newTags.push(...categories);
          }
          
          // Add products count tag
          if (lookData.products && Array.isArray(lookData.products)) {
            newTags.push(`${lookData.products.length} prodotti`);
          }
          
          // If we have tags, update the state
          if (newTags.length > 0) {
            setTags(newTags);
            console.log("Setting tags from API:", newTags);
          }
          
          // Update images if available
          if (lookData.image_url) {
            const parsedImages = parseImageUrls(lookData.image_url);
            setLookImages(parsedImages);
            console.log("Setting images from API:", parsedImages);
          }
          
          // Update steps if available
          if (lookData.instructions) {
            try {
              let instructions;
              
              // Check if instructions is already an object or needs to be parsed
              if (typeof lookData.instructions === 'string') {
                instructions = JSON.parse(lookData.instructions);
              } else {
                instructions = lookData.instructions;
              }
              
              // Map the instructions to our steps format - simplified version
              if (Array.isArray(instructions)) {
                const formattedSteps = instructions.map((section) => ({
                  label: section.label,
                  instructions: section.instructions.map((instruction, index) => ({
                    step: index + 1,
                    description: instruction,
                  })),
                  // No separate title field
                }));
                
                setLookSteps(formattedSteps);
              }
            } catch (err) {
              console.error("Error parsing instructions:", err);
            }
          }
          
          // Update products if available
          if (lookData.products && Array.isArray(lookData.products)) {
            const formattedProducts = lookData.products.map(product => ({
              name: product.name || "Product Name",
              image: product.image_url || "https://via.placeholder.com/150"
            }));
            
            setLookProducts(formattedProducts);
            console.log("Setting products from API:", formattedProducts);
          }
          
          // Set loading to false when data is fetched
          setLoading(false);
        } catch (err) {
          console.error("Error fetching look data:", err);
          setLoading(false); // Also set loading to false on error
        }
      };

      fetchLookData();
    } else {
      // If no data from navigation or lookId, just use default data
      setLoading(false);
    }
  }, [lookId, location.state]);

  // Add this useEffect for auto-sliding
  useEffect(() => {
    // Only start auto-slide if we have more than one image
    if (lookImages.length > 1) {
      const timer = setTimeout(() => {
        setCurrentImage((prevIndex) => 
          prevIndex === lookImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change slide every 5 seconds
      
      // Clean up timer on component unmount or when currentImage changes
      return () => clearTimeout(timer);
    }
  }, [currentImage, lookImages.length]);

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
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
        duration: 0.3
      }
    }
  };

  const imageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const staggerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const tagVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const loaderVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.3
      }
    }
  };

  // Update the artistAdvice array creation with the title
  const artistAdvice = artistInstruction 
    ? [{ title: artistInstructionTitle, content: artistInstruction }] 
    : lookDetails.artistAdvice;

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={loaderVariants}
          className="min-h-screen bg-white"
        >
          <Navbar />
          <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8 text-center flex flex-col items-center justify-center">
              <motion.div 
                className="flex justify-center items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <img src={Logo} alt="Logo" />
              </motion.div>
              <motion.div 
                className="mt-8 flex justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Loader2 className="w-8 h-8 animate-spin text-[#1E1E1E]" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="min-h-screen bg-white"
        >
          <Navbar />
          <div className="flex justify-center w-full">
            <Grid>
              <div className="col-span-4 md:col-span-6 px-0 md:px-0">
                {/* 🔹 Back Button with increased top and bottom spacing - updated to match ConsultantInfo.jsx */}
                <motion.button 
                  onClick={handleBack} 
                  className="text-[15px] my-8 md:my-8 flex items-center"
                  variants={contentVariants}
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 19l-7-7 7-7" 
                    />
                  </svg>
                  Indietro
                </motion.button>
                
                <div className="grid md:grid-cols-6 gap-[26px] mb-[8px]">
                  {/* Image section - ensure it spans 4 columns on mobile */}
                  <div className="col-span-4 md:col-span-3">
                    <motion.div 
                      className="w-full flex flex-col items-center md:items-start"
                      variants={contentVariants}
                    >
                      {/* Image container */}
                      <motion.div 
                        className="relative w-full md:max-w-none h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        variants={imageVariants}
                      >
                        {lookImages.map((image, index) => (
                          <motion.img
                            key={index}
                            src={image}
                            alt={`${lookTitle} - Image ${index + 1}`}
                            className={`absolute top-0 left-0 rounded-[2px] w-full h-full object-cover transition-all duration-500 ${
                              currentImage === index ? "z-10" : "z-0"
                            }`}
                            style={{
                              transform: `translateX(${(index - currentImage) * 100}%)`,
                              transition: 'transform 0.5s ease-out'
                            }}
                          />
                        ))}
                      </motion.div>
                      
                      {/* Image dots/carousel indicators - only show if multiple images */}
                      {lookImages.length > 1 && (
                        <motion.div 
                          className="relative mt-[10px] flex justify-center items-center gap-[3px] mx-auto z-20 w-full"
                          variants={contentVariants}
                        >
                          {lookImages.map((_, index) => (
                            <motion.button
                              key={index}
                              className={`w-1 h-1 rounded-full ${
                                currentImage === index ? "bg-[#8E8E8E]" : "bg-gray-300"
                              }`}
                              onClick={() => handleDotClick(index)}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  </div>

                  {/* Content section - 3 columns */}
                  <div className="col-span-full md:col-span-3">
                    <motion.div 
                      className="flex flex-col justify-end h-full md:h-[500px] lg:h-[600px] w-full gap-[48px] md:gap-[40px]"
                      variants={contentVariants}
                    >
                      {/* Top content group */}
                      <div className="flex flex-col gap-1">
                        {/* Title and Author */}
                        <motion.div className="flex flex-col" variants={itemVariants}>
                          <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold mt-4">
                            {lookTitle}
                          </h1>
                          {location.state?.lookData?.author && (
                            <p className="text-[#8F8F8F] text-[16px] md:text-sm lg:text-base mt-2 md:mt-1 font-bold">
                              {location.state.lookData.author}
                            </p>
                          )}
                        </motion.div>

                        {/* Tags */}
                        {/*<motion.div 
                          className="flex flex-wrap -ml-[5px] mt-4 md:mt-1"
                          variants={staggerVariants}
                        >
                          {tags.map((tag, index) => (
                            <motion.span
                              key={index}
                              className="px-5 py-[6px] md:py-[4px] m-[5px] rounded-[2px] font-bold font-helvetica tracking-[0] bg-[#1E1E1E] text-white text-[16px] md:text-sm lg:text-base leading-[19.2px]"
                              variants={tagVariants}
                              whileHover={{ scale: 1.05 }}
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </motion.div>*/}
                      </div>

                      {/* Artist Advice Section */}
                      {artistInstruction && (
                        <motion.div 
                          className="hidden md:block"
                          variants={contentVariants}
                        >
                          {artistAdvice.map((advice, index) => (
                            <motion.div
                              key={index}
                              className="bg-[#EFEFEF] p-4 md:p-6 lg:p-8 rounded-[2px]"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3, duration: 0.5 }}
                            >
                              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
                                {advice.title}
                              </h2>
                              <p className={`md:text-base lg:text-lg font-helvetica font-normal leading-[27px] tracking-[0] ${advice.title ? 'mt-2' : ''}`}>
                                {advice.content}
                              </p>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </div>
                
                {/* 🔹 Get the Look Section */}
                <motion.div
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.4 }}
                  className="mt-12 md:mt-16"
                >
                  <motion.div variants={itemVariants}>
                    <h2 className="md:text-2xl lg:text-3xl font-helvetica font-bold text-[30px] leading-[36px] tracking-[0] mb-[8%] md:mb-[4%] lg:mb-[3%]">
                      Get the look
                    </h2>
                  </motion.div>

                  {/* 🔹 Look Steps */}
                  <motion.div 
                    className="space-y-6"
                    variants={staggerVariants}
                  >
                    {lookSteps.map((section) => (
                      <motion.div
                        key={section.label}
                        className="space-y-4"
                      >
                        <h3 className="text-[18px] md:text-[18px] font-bold mb-3] uppercase">{section.label}</h3>
                        {section.instructions.map((item) => (
                          <motion.div 
                            key={item.step} 
                            className="flex"
                            variants={itemVariants}
                            whileHover={{ x: 5 }}
                          >
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center justify-center w-[27px] h-[27px] text-white bg-black rounded-[2px] text-[16px] font-medium">
                                -
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="text-[18px] md:text-base lg:text-lg font-helvetica font-normal leading-[27px] tracking-[0] -mt-[3px]">
                                {item.title ? `${item.title}. ${item.description}` : item.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* 🔹 Artist Advice Section - moved here for mobile, hidden on tablet/desktop */}
                {artistInstruction && (
                  <motion.div 
                    className="block md:hidden mt-16 w-screen h-auto -mx-[6vw]"
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.5 }}
                  >
                    {artistAdvice.map((advice, index) => (
                      <motion.div
                        key={index}
                        className="bg-[#EFEFEF] px-[5%] py-6 h-auto max-h-[300px] overflow-y-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <h2 className="text-3xl md:text-2xl font-bold mb-4">
                          {advice.title}
                        </h2>
                        <p className={`md:text-base lg:text-lg font-helvetica font-normal leading-[27px] tracking-[0] ${advice.title ? 'mt-2' : ''}`}>
                          {advice.content}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Must-have Products with increased bottom spacing */}
                <motion.div 
                  className="flex flex-col justify-center mb-10 md:mb-16 mt-16 md:mt-16"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.6 }}
                >
                  <motion.h2 
                    className="text-[30px] md:text-2xl lg:text-3xl font-bold"
                    variants={itemVariants}
                  >
                    Prodotti must have
                  </motion.h2>
                  <motion.div 
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"
                    variants={staggerVariants}
                  >
                    {lookProducts.map((product, index) => (
                      <motion.div 
                        key={index} 
                        className="text-left"
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                      >
                        <motion.img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-50 md:h-62 object-contain rounded-lg"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        />
                        <p className="mt-2 md:text-base lg:text-lg font-helvetica font-light text-[16px] leading-[20px] tracking-[0]">
                          {product.name}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </div>
            </Grid>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
