import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import { Loader2 } from 'lucide-react';
import Logo from "../../assets/Main.png";
import { motion, AnimatePresence } from "framer-motion";
import TickIcon from "../../assets/tick.png";
import { Grid } from "../../Components/Grid";
import { API_BASE_URL } from '../../services/api';
import DOMPurify from 'dompurify';
import truncate from "truncate-html";

// Helper function to parse image URLs (imported from LookDetails.jsx)
const parseImageUrls = (imageData) => {
  if (!imageData) return ["https://via.placeholder.com/140x200"];
  
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
  
  return ["https://via.placeholder.com/140x200"];
};

// Add this helper function after the imports
const formatTextWithSpacing = (text) => {
  if (!text) return "Loading description...";

  const safeHTML = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ['i', 'em', 'strong', 'b', 'br', 'p'],
    ALLOWED_ATTR: ['class', 'style']
  });

  return (
    <div
      className="text-[#1E1E1E] leading-relaxed text-[18px] md:text-base lg:text-lg space-y-4"
      dangerouslySetInnerHTML={{ __html: safeHTML }}
    />
  );
};

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

// First, add this Skeleton component near the top of the file
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-100 rounded-[2px] ${className}`} />
);

export default function ConsultantInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFilters, setActiveFilters] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [archetypeData, setArchetypeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [makeupData, setMakeupData] = useState([]);
  const [hasFeedback, setHasFeedback] = useState(false);
  // ANIMATION FEATURE: State for triggering the shuffle animation
  const [animationKey, setAnimationKey] = useState(0);

  // Get consultation data from location state
  const consultation = location.state || {};

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

  const contentVariants = {
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

  useEffect(() => {
    const fetchArchetypeData = async () => {
      try {
        setLoading(true);
        
        // Get the consultation ID from location state or localStorage
        const consultationId = consultation.id || localStorage.getItem('consultation_id');
        
        // Make sure to parse the ID as an integer when retrieving from localStorage
        const parsedConsultationId = consultationId ? parseInt(consultationId, 10) : null;
        
        console.log("ConsultantInfo: Consultation ID:", parsedConsultationId);
        console.log("ConsultantInfo: consultation state:", consultation);
        
        if (!parsedConsultationId) {
          console.error("No consultation ID found");
          setLoading(false);
          return;
        }
        
        // Fetch consultation details if not already available
        let consultationDetails = consultation;
        if (!consultation.result) {
          const token = localStorage.getItem('token');
          console.log("Fetching consultation details with token:", token ? "Token exists" : "No token");
          
          const response = await axios.get(
            `${API_BASE_URL}/consultations/${parsedConsultationId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          console.log("Consultation details response:", response.data);
          consultationDetails = response.data;
        }
        
        // Get the archetype ID and name from the consultation result
        const archetypeId = consultationDetails.result?.archetype_id;
        // For archetype IDs, do NOT parse as integer since they are UUIDs (strings)
        const archetypeName = consultationDetails.result?.archetype;
        
        console.log("Archetype ID from result:", archetypeId);
        console.log("Archetype name from result:", archetypeName);
        
        // If we don't have an ID but have a name, we need to fetch the ID first
        if (!archetypeId && archetypeName) {
          console.log("No archetype ID found, but name is available:", archetypeName);
          console.log("Fetching all archetypes to find the ID by name");
          
          try {
            const token = localStorage.getItem('token');
            const archetypesResponse = await axios.get(
              `${API_BASE_URL}/archetypes`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            
            console.log("All archetypes response:", archetypesResponse.data);
            
            // Find the archetype with matching name
            const matchingArchetype = archetypesResponse.data.find(
              archetype => archetype.name === archetypeName
            );
            
            if (matchingArchetype) {
              console.log("Found matching archetype:", matchingArchetype);
              
              // Now fetch the archetype details using the ID (keep as string for UUID)
              const response = await axios.get(
                `${API_BASE_URL}/archetypes/${matchingArchetype.id}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );
              
              console.log("Archetype data response:", response.data);
              
              // Format the archetype data
              const archetypeDataResponse = response.data;
              const formattedArchetypeData = {
                id: archetypeDataResponse.id,
                name: archetypeDataResponse.name || archetypeName || "Your Archetype",
                short_description: archetypeDataResponse.description || "This is your personalized makeup archetype.",
                long_description: archetypeDataResponse.long_description || ""
              };
              
              console.log("Formatted archetype data:", formattedArchetypeData);
              setArchetypeData(formattedArchetypeData);
              
              // Fetch makeup looks for this archetype using ID (keep as string for UUID)
              console.log("Fetching makeup looks for ID:", matchingArchetype.id);
              
              const looksResponse = await axios.get(
                `${API_BASE_URL}/archetypes/${matchingArchetype.id}/looks`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );
              
              console.log("Makeup looks response:", looksResponse.data);
              setMakeupData(looksResponse.data);
              console.log("makeupData categories:", looksResponse.data.map(item => item.category));
              setLoading(false);
            } else {
              console.error("No matching archetype found for name:", archetypeName);
              setLoading(false);
            }
          } catch (error) {
            console.error("Error fetching archetypes:", error);
            setLoading(false);
          }
        } else if (archetypeId) {
          // We have the ID, proceed as before (keep as string for UUID)
          try {
            const token = localStorage.getItem('token');
            console.log("Fetching archetype data for ID:", archetypeId);
            
            const response = await axios.get(
              `${API_BASE_URL}/archetypes/${archetypeId}`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            
            console.log("Archetype data response:", response.data);
            
            // Format the archetype data
            const archetypeDataResponse = response.data;
            const formattedArchetypeData = {
              id: archetypeDataResponse.id,
              name: archetypeDataResponse.name || archetypeName || "Your Archetype",
              short_description: archetypeDataResponse.description || "This is your personalized makeup archetype.",
              long_description: archetypeDataResponse.long_description || ""
            };
            
            console.log("Formatted archetype data:", formattedArchetypeData);
            setArchetypeData(formattedArchetypeData);
            
            // Fetch makeup looks for this archetype using ID (keep as string for UUID)
            console.log("Fetching makeup looks for ID:", archetypeId);
            
            const looksResponse = await axios.get(
              `${API_BASE_URL}/archetypes/${archetypeId}/looks`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            
            console.log("Makeup looks response:", looksResponse.data);
            setMakeupData(looksResponse.data);
            console.log("makeupData categories:", looksResponse.data.map(item => item.category));
            setLoading(false);
          } catch (error) {
            console.error("Error fetching archetype data:", error);
            setLoading(false);
          }
        } else {
          console.error("No archetype ID or name found in consultation result");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching archetype data:", error);
        setLoading(false);
      }
    };

    fetchArchetypeData();
  }, [consultation]);

  useEffect(() => {
    const checkFeedbackStatus = async () => {
      try {
        const consultationId = consultation.id;
        if (!consultationId) {
          setHasFeedback(false);
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          setHasFeedback(false);
          return;
        }

        try {
          const response = await axios.get(
            `${API_BASE_URL}/consultations/${consultationId}/feedback`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          // If we get a successful response with data, set hasFeedback to true
          setHasFeedback(true);
        } catch (err) {
          // If we get a 404 or any error, set hasFeedback to false
          setHasFeedback(false);
        }
      } catch (error) {
        console.error("Error in checkFeedbackStatus:", error);
        setHasFeedback(false);
      }
    };
    
    checkFeedbackStatus();
  }, [consultation]);

  const setFilter = (filter) => {
    setActiveFilters(prev => {
      // If filter is already selected, remove it
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter);
      } 
      // Otherwise add it to the array
      else {
        return [...prev, filter];
      }
    });
    setAnimationKey(prev => prev + 1);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const filteredData = useMemo(() => {
    if (!makeupData) return [];
    
    // Create a copy of the data to work with
    let data = [...makeupData];
    
    // Apply filters if any are active
    if (activeFilters.length > 0) {
      data = data.map((section) => ({
        ...section,
        looks: section.looks.filter((look) => {
          // Parse the makeup categories for this look
          const lookCategories = parseMakeupCategories(look.makeup_category);
          // Changed from every to some - Include look if ANY active filter matches (OR logic)
          return activeFilters.some(filter => lookCategories.includes(filter));
        }),
      })).filter((section) => section.looks.length > 0);
    }
    
    // Define the desired order of categories
    const categoryOrder = ["Giorno", "Sera", "Occasioni Speciali"];
    
    // Sort the data based on the predefined order
    data.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.category);
      const indexB = categoryOrder.indexOf(b.category);
      const posA = indexA === -1 ? 999 : indexA;
      const posB = indexB === -1 ? 999 : indexB;
      return posA - posB;
    });
    
    return data;
  }, [activeFilters, makeupData]);

  const handleLookClick = (look) => {
    navigate('/LookDetails', { state: { lookData: look } });
  };

  // Update the filter buttons section to show all unique categories
  const [availableFilters, setAvailableFilters] = useState(["Labbra", "Occhi", "Fondo"]);

  // Add this useEffect to dynamically generate available filters
  useEffect(() => {
    if (makeupData) {
      const uniqueCategories = new Set();
      
      makeupData.forEach(section => {
        section.looks.forEach(look => {
          const categories = parseMakeupCategories(look.makeup_category);
          categories.forEach(category => uniqueCategories.add(category));
        });
      });
      
      setAvailableFilters(Array.from(uniqueCategories));
    }
  }, [makeupData]);

  return (
    <>
      <Navbar />
      <motion.div 
        className="min-h-screen bg-white"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className="flex justify-center w-full">
          <Grid>
            <div className="col-span-4 md:col-span-6 px-0 md:px-0">
              <div className="flex-grow pt-15">
                <motion.header 
                  className="mb-10 flex justify-between items-center"
                  variants={contentVariants}
                >
                  <motion.button
                    className="text-[15px] flex items-center md:text-sm lg:text-base"
                    onClick={() => navigate("/ConsultantMain")}
                    whileHover={{ scale: 1.05 }}
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
                  <motion.p 
                    className="text-[15px] text-right font-bold text-[#8F8F8F] md:text-sm lg:text-base"
                    variants={contentVariants}
                  >
                    {consultation.date || "Oggi"}
                  </motion.p>
                </motion.header>

                <motion.section 
                  className="mb-16"
                  variants={contentVariants}
                >
                  {loading ? (
                    <>
                      <Skeleton className="h-12 w-3/4 mb-6" /> {/* Title skeleton */}
                      <Skeleton className="h-4 w-full mb-3" /> {/* Description line 1 */}
                      <Skeleton className="h-4 w-5/6 mb-3" /> {/* Description line 2 */}
                      <Skeleton className="h-4 w-4/6" /> {/* Description line 3 */}
                    </>
                  ) : (
                    <>
                      <motion.h1 
                        className="text-3xl md:text-5xl font-bold mb-6"
                        variants={contentVariants}
                      >
                        {archetypeData?.name || "Archetype Name"}
                      </motion.h1>
                      
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={isExpanded ? "expanded" : "collapsed"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 text-[18px] md:text-base lg:text-lg"
                        >
                          <motion.div
                            variants={contentVariants}
                            initial={{ height: "auto" }}
                            animate={{ height: "auto" }}
                            className="overflow-hidden"
                          >
                            {/* Mobile view */}
                            <span className="md:hidden">
                              {isExpanded 
                                ? formatTextWithSpacing(archetypeData?.short_description + 
                                    (archetypeData?.long_description ? ` ${archetypeData.long_description}` : ''))
                                : (formatTextWithSpacing(truncate(archetypeData?.short_description, 250, { keepWhitespaces: true })) || "Loading description...")}
                            </span>
                            
                            {/* Desktop view */}
                            <span className="hidden md:inline">
                              {formatTextWithSpacing(archetypeData?.short_description + 
                                (archetypeData?.long_description ? ` ${archetypeData.long_description}` : ''))}
                            </span>
                          </motion.div>
                        </motion.div>
                      </AnimatePresence>
                      
                      <div className="flex justify-center md:hidden">
                        <motion.button
                          onClick={toggleExpand}
                          className="mt-6 flex items-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isExpanded ? (
                            <>
                              <span className="underline font-bold">mostra meno</span>
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4 ml-1" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M5 15l7-7 7 7" 
                                />
                              </svg>
                            </>
                          ) : (
                            <>
                              <span className="underline font-bold">scopri di più</span>
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4 ml-1" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M19 9l-7 7-7-7" 
                                />
                              </svg>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </>
                  )}
                </motion.section>

                <motion.section 
                  className="mb-6"
                  variants={contentVariants}
                >
                  <div className="md:flex md:flex-row md:justify-between md:items-center flex-col mb-2 md:mb-10">
                    {loading ? (
                      <>
                        <Skeleton className="h-8 w-48 mb-6 md:mb-0" /> {/* Title skeleton */}
                        <div className="flex gap-4">
                          <Skeleton className="h-8 w-20" /> {/* Filter button skeleton */}
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="">
                          <motion.h2 
                            className="font-semibold text-3xl md:font-bold mb-6 md:mb-0 lg:text-4xl"
                            variants={contentVariants}
                          >
                            I look per te
                          </motion.h2>
                        </div>
                        {/*<div className="md:flex md:flex-row md:items-center md:gap-5">
                          <motion.h4 
                            className="text-[16px] md:text-xs lg:text-sm font-bold text-left mb-2 md:mb-0"
                            variants={contentVariants}
                          >
                            Filtri
                          </motion.h4>

                          <div className="flex flex-wrap gap-4 md:gap-2 md:flex-nowrap md:mt-1 items-center">
                            {availableFilters.map((filter) => (
                              <motion.button
                                key={filter}
                                className={`px-4 py-1 border border-[#1E1E1E] rounded-[2px] text-[16px] md:text-xs lg:text-sm font-bold w-auto md:w-auto ${
                                  activeFilters.includes(filter)
                                    ? "bg-[#1E1E1E] text-white"
                                    : "bg-white"
                                } flex items-center justify-center min-w-[80px]`}
                                onClick={() => setFilter(filter)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                variants={contentVariants}
                              >
                                <span>{filter}</span>
                                {activeFilters.includes(filter) && (
                                  <img 
                                    src={TickIcon} 
                                    alt="Selected" 
                                    className="ml-2 w-3 h-3 md:w-4 md:h-4"
                                  />
                                )}
                              </motion.button>
                            ))}
                          </div>
                        </div>*/}
                      </>
                    )}
                  </div>
                </motion.section>

                <motion.div 
                  className="overflow-visible w-screen -ml-[6vw] md:-ml-[4vw]"
                >
                  {loading ? (
                    // Skeleton for look categories
                    Array(3).fill(null).map((_, index) => (
                      <motion.section key={index} className="mb-6 md:mb-10 md:mt-2">
                        <Skeleton className="h-6 w-48 mb-3 ml-[6vw] md:ml-[4vw]" /> {/* Category title */}
                        <div className="flex overflow-x-hidden space-x-6 md:space-x-5 lg:space-x-7 pb-4 pl-[6vw] md:pl-[4vw]">
                          {/* Look card skeletons */}
                          {Array(4).fill(null).map((_, idx) => (
                            <div key={idx} className="flex-shrink-0 w-[140px] md:w-[180px]">
                              <Skeleton className="w-[160px] h-[200px] md:w-[170px] md:h-[220px] lg:w-[220px] lg:h-[270px] mb-3" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                          ))}
                        </div>
                      </motion.section>
                    ))
                  ) : (
                    filteredData && filteredData.map((section, index) => (
                      <motion.section 
                        key={index} 
                        className="mb-6 md:mb-10 md:mt-2"
                      > 
                        <h3 className="text-[21px] md:text-[21px] font-bold mb-3 pl-[6vw] md:pl-[4vw]">
                          Make-up {section.category.toLowerCase()}
                        </h3>
                        <div className="flex overflow-x-auto space-x-6 md:space-x-5 lg:space-x-7 pb-4 pl-[6vw] md:pl-[4vw]">
                          {section.looks.map((look, idx) => (
                            <motion.div
                              key={idx}
                              className="flex-shrink-0 w-[140px] md:w-[180px] flex flex-col justify-start items-start cursor-pointer"
                              onClick={() => handleLookClick(look)}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.1 + (idx * 0.05) }}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <img
                                src={parseImageUrls(look.image_url)[0]}
                                alt={look.name}
                                className="w-[160px] h-[200px] md:w-[170px] md:h-[220px] lg:w-[220px] lg:h-[270px] object-cover rounded-[2px]"
                              />
                              <p className="text-left mt-3 font-helvetica font-[18px] md:text-base lg:text-lg leading-[21.6px] tracking-[0px]">
                                {look.name}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.section>
                    ))
                  )}
                </motion.div>
              </div>

              <motion.section 
                className="pt-4 pb-10"
                variants={contentVariants}
              >
                {loading ? (
                  <div className="text-center md:text-left md:flex md:flex-row md:items-center md:justify-between md:gap-[12%]">
                    <div>
                      <Skeleton className="h-8 w-64 mb-4" /> {/* Title skeleton */}
                      <Skeleton className="h-4 w-48 mb-4" /> {/* Subtitle skeleton */}
                    </div>
                    <Skeleton className="h-12 w-full md:w-[270px]" /> {/* Button skeleton */}
                  </div>
                ) : (
                  <div className="text-center md:text-left md:flex md:flex-row md:items-center md:justify-between md:gap-[12%]">
                    <div className="md:flex md:flex-col md:gap-[7px]">
                      <div>
                        <motion.h4 
                          className="text-3xl font-bold mb-4 md:mb-0 mx-auto md:mx-0 md:whitespace-nowrap lg:text-4xl"
                          variants={contentVariants}
                        >
                          {hasFeedback ? "Grazie per il tuo feedback!": "Com'è andata?"}
                        </motion.h4>
                      </div>
                      <div>
                        <motion.p 
                          className="text-[18px] mb:text-base mb-4 md:mb-0 max-w-[250px] md:max-w-none mx-auto md:mx-0 lg:text-[18px]"
                          variants={contentVariants}
                        >
                          {hasFeedback 
                            ? "Puoi sempre aggiungere dettagli o modificarlo"
                            : (
                              <>
                                Aiutaci a capire come migliorare <i>NARS Persona</i>
                              </>
                            )
                          }
                        </motion.p>
                      </div>
                    </div>
                    
                    <motion.button 
                      className="mt-4 px-10 py-3 bg-[#1E1E1E] font-semibold text-white rounded-[2px] md:mt-0 w-full md:w-[270px] text-lg md:text-base shadow-md hover:shadow-lg transition-all duration-300"
                      onClick={() => {
                        const consultationId = consultation.id || localStorage.getItem('consultation_id');
                        // Parse as integer if needed for the URL
                        const parsedConsultationId = consultationId ? parseInt(consultationId, 10) : null;
                        navigate(`/Feedback?consultationId=${parsedConsultationId}`);
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      variants={contentVariants}
                    >
                      {hasFeedback ? "Modifica feedback" : "Lascia un feedback"}
                    </motion.button>
                  </div>
                )}
              </motion.section>
            </div>
          </Grid>
        </div>
      </motion.div>
    </>
  );
}
