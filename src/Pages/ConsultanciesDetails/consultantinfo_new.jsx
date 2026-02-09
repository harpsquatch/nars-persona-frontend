import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import { Loader2 } from 'lucide-react';
import Logo from "../../assets/Main.png";
import { motion, AnimatePresence } from "framer-motion";
import TickIcon from "../../assets/tick.png";
import { Grid } from "../../Components/Grid";
import { API_BASE_URL, wishlistService } from '../../services/api';
import LookCard from "../../Components/LookCard";
import ArchetypeHero from "../../Components/ArchetypeHero";
import ProductCard from "../../Components/ProductCard";
import { H1, H2, H3, Body2 } from "../../Components/atoms/Typography";
import { FeedbackButton } from "../../Components/atoms";

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
  const [activeFilters, setActiveFilters] = useState([]);
  const [archetypeData, setArchetypeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [makeupData, setMakeupData] = useState([]);
  const [hasFeedback, setHasFeedback] = useState(false);
  const [consultationId, setConsultationId] = useState(null);
  const [todayLook, setTodayLook] = useState(null);
  const [inProgressLooks, setInProgressLooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  // ANIMATION FEATURE: State for triggering the shuffle animation
  const [animationKey, setAnimationKey] = useState(0);

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
        
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found, redirecting to login");
          navigate('/');
          return;
        }
        
        // Fetch user's consultations to get the latest one
        const consultationsResponse = await axios.get(
          `${API_BASE_URL}/consultations`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
        if (!consultationsResponse.data || consultationsResponse.data.length === 0) {
          console.error("No consultations found");
          setLoading(false);
          return;
        }
        
        // Get the most recent consultation
        const latestConsultation = consultationsResponse.data[0];
        setConsultationId(latestConsultation.id);
        
        const archetypeId = latestConsultation.result?.archetype_id;
        const archetypeName = latestConsultation.result?.archetype;
        
        if (archetypeId) {
          // Fetch archetype by binary representation
              const response = await axios.get(
            `${API_BASE_URL}/archetypes/by-binary/${archetypeId}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );
              
              const archetypeDataResponse = response.data;
              const formattedArchetypeData = {
                id: archetypeDataResponse.id,
                name: archetypeDataResponse.name || archetypeName || "Your Archetype",
                short_description: archetypeDataResponse.description || "This is your personalized makeup archetype.",
                long_description: archetypeDataResponse.long_description || ""
              };
              
              setArchetypeData(formattedArchetypeData);
              
          // Fetch makeup looks for this archetype
              const looksResponse = await axios.get(
            `${API_BASE_URL}/archetypes/by-binary/${archetypeId}/looks`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );
              
              setMakeupData(looksResponse.data);
          
          // Set today's look - default to first MORNING look
          const morningLooks = looksResponse.data.find(section => section.category === 'MORNING');
          if (morningLooks && morningLooks.looks.length > 0) {
            setTodayLook(morningLooks.looks[0]);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching archetype data:", error);
        setLoading(false);
      }
    };

    fetchArchetypeData();
  }, []);

  useEffect(() => {
    const checkFeedbackStatus = async () => {
      try {
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
          await axios.get(
            `${API_BASE_URL}/consultations/${consultationId}/feedback`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          setHasFeedback(true);
        } catch (err) {
          setHasFeedback(false);
        }
      } catch (error) {
        setHasFeedback(false);
      }
    };
    
    checkFeedbackStatus();
  }, [consultationId]);

  // Fetch in-progress looks (looks the user has started applying)
  useEffect(() => {
    const fetchInProgressLooks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(
          `${API_BASE_URL}/users/look-history`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        // Filter for looks that have progress:
        // 1. Has tried date OR has some completed instructions
        // 2. Not fully completed (no rating or rating < 5)
        const inProgress = response.data.filter(history => {
          const hasStarted = history.tried_at || (history.completed_instructions && history.completed_instructions.length > 0);
          const isIncomplete = !history.rating || history.rating < 5;
          return hasStarted && isIncomplete;
        });

        console.log("In-progress looks:", inProgress);

        // Get the actual look data for in-progress looks with completion percentage
        if (inProgress.length > 0 && makeupData.length > 0) {
          const lookIds = inProgress.map(h => h.look_id);
          const looks = makeupData.flatMap(section => 
            section.looks.filter(look => lookIds.includes(look.id))
          );
          
          // Add completion percentage to each look
          const looksWithProgress = looks.map(look => {
            const history = inProgress.find(h => h.look_id === look.id);
            let completionPercentage = 0;
            
            if (history && history.completed_instructions && look.instructions) {
              // Parse instructions to get total count
              let totalSteps = 0;
              try {
                const instructions = typeof look.instructions === 'string' 
                  ? JSON.parse(look.instructions) 
                  : look.instructions;
                totalSteps = Array.isArray(instructions) ? instructions.length : 0;
              } catch (err) {
                console.error("Error parsing instructions:", err);
              }
              
              if (totalSteps > 0) {
                completionPercentage = Math.round((history.completed_instructions.length / totalSteps) * 100);
              }
            }
            
            return {
              ...look,
              completionPercentage
            };
          });
          
          console.log("Filtered looks for display:", looksWithProgress);
          setInProgressLooks(looksWithProgress);
        } else {
          setInProgressLooks([]);
        }
      } catch (error) {
        console.error("Error fetching in-progress looks:", error);
      }
    };

    if (makeupData.length > 0) {
      fetchInProgressLooks();
    }
  }, [makeupData]);

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      console.log("User ID from localStorage:", userId);
      console.log("Token present:", !!token);
      
      if (!token) {
        console.log("No token found for wishlist fetch");
        return;
      }

      console.log("Fetching wishlist from API...");
      const wishlistData = await wishlistService.getWishlist();
      console.log("Wishlist API Response:", wishlistData);
      
      if (wishlistData?.items) {
        setWishlist(wishlistData.items);
        console.log("Wishlist items count:", wishlistData.items.length);
        console.log("Wishlist items:", wishlistData.items);
        
        // The items already include product details from backend
        // Extract products directly from the wishlist items
        if (wishlistData.items.length > 0) {
          const products = wishlistData.items
            .filter(item => item.product)
            .map(item => item.product);
          console.log("Products extracted from wishlist:", products);
          setWishlistProducts(products);
        } else {
          console.log("No products in wishlist");
          setWishlistProducts([]);
        }
      } else {
        console.log("No wishlist items found in response");
        setWishlistProducts([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      console.error("Error details:", error.response?.data || error.message);
      setWishlistProducts([]);
    }
  };

  useEffect(() => {
    fetchWishlist();
    
    // Refresh wishlist when page gains focus (user returns from another page)
    const handleFocus = () => {
      fetchWishlist();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

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
          // Convert lookCategories to uppercase for comparison
          const upperLookCategories = lookCategories.map(cat => cat.toUpperCase());
          // Changed from every to some - Include look if ANY active filter matches (OR logic)
          return activeFilters.some(filter => upperLookCategories.includes(filter.toUpperCase()));
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
  const [availableFilters, setAvailableFilters] = useState(["LIPS", "EYES", "FACE", "CHEEKS"]);

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
      
      {/* Archetype Hero Section */}
      {!loading && archetypeData && (
        <ArchetypeHero 
          archetype={archetypeData}
        />
      )}
      
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
                <motion.section 
                  className="mb-2"
                  variants={contentVariants}
                >
                  <div className="md:flex md:flex-row md:justify-between md:items-center flex-col mb-2 md:mb-3">
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
                          <H3 className="mb-2 md:mb-0">
                            LOOKS FOR YOU
                          </H3>
                        </div>
                        <div className="hidden md:flex md:flex-row md:items-center md:gap-5">
                          <motion.h4 
                            className="text-sm md:text-base lg:text-lg font-light text-left mb-2 md:mb-0"
                            variants={contentVariants}
                          >
                            FILTER BY
                          </motion.h4>

                          <div className="flex flex-wrap gap-2 md:gap-2 md:flex-nowrap md:mt-1 items-center">
                            {availableFilters.map((filter) => (
                              <motion.button
                                key={filter}
                                className={`px-2 py-0.5 md:px-4 md:py-1 border border-[#1E1E1E] rounded-[2px] text-xs md:text-base lg:text-lg font-light w-auto md:w-auto ${
                                  activeFilters.includes(filter)
                                    ? "bg-[#1E1E1E] text-white"
                                    : "bg-white"
                                } flex items-center justify-center min-w-[60px] md:min-w-[80px] uppercase`}
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
                                    className="ml-1 md:ml-2 w-2.5 h-2.5 md:w-4 md:h-4"
                                  />
                                )}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </motion.section>

                <motion.div 
                  className="overflow-visible w-screen -ml-[6vw] md:-ml-[4vw]"
                >
                  {loading ? (
                    // Skeleton for looks
                    <motion.section className="mb-6 md:mb-10">
                      <div className="flex overflow-x-hidden space-x-3 md:space-x-5 lg:space-x-7 pb-4 pl-[6vw] md:pl-[4vw]">
                        {/* Look card skeletons */}
                        {Array(8).fill(null).map((_, idx) => (
                          <div key={idx} className="flex-shrink-0 w-[180px] md:w-[220px] lg:w-[310px]">
                            <Skeleton className="w-full h-[240px] md:h-[280px] lg:h-[350px] mb-3" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        ))}
                      </div>
                    </motion.section>
                  ) : (
                    // Display all looks in a single row with category tags
                    <motion.section className="mb-4 md:mb-6 lg:mb-10">
                      <div className="flex overflow-x-auto hide-scrollbar space-x-3 md:space-x-5 lg:space-x-7 pb-4 pl-[6vw] md:pl-[4vw]">
                        {filteredData && filteredData.flatMap((section) =>
                          section.looks.map((look, idx) => (
                            <LookCard
                              key={`${section.category}-${look.id || idx}`}
                              look={look}
                              onClick={() => handleLookClick(look)}
                              index={idx}
                              category={section.category}
                              isTodayLook={todayLook && look.id === todayLook.id}
                            />
                          ))
                        )}
                      </div>
                    </motion.section>
                  )}
                </motion.div>
              </div>

              {/* CONTINUE WHERE YOU LEFT OFF Section */}
              {inProgressLooks.length > 0 && (
                <div className="flex-grow pt-4 md:pt-8">
                  <motion.section 
                    className="mb-2"
                    variants={contentVariants}
                  >
                    <div className="md:flex md:flex-row md:justify-between md:items-center flex-col mb-2 md:mb-3">
                      {loading ? (
                        <>
                          <Skeleton className="h-8 w-64 mb-6 md:mb-0" />
                        </>
                      ) : (
                        <>
                          <div className="">
                            <H3 className="mb-2 md:mb-0">
                              CONTINUE WHERE YOU LEFT OFF
                            </H3>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.section>

                  <motion.div 
                    className="overflow-visible w-screen -ml-[6vw] md:-ml-[4vw]"
                  >
                    {loading ? (
                      // Skeleton for looks
                      <motion.section className="mb-6 md:mb-10">
                        <div className="flex overflow-x-hidden space-x-3 md:space-x-5 lg:space-x-7 pb-4 pl-[6vw] md:pl-[4vw]">
                          {/* Look card skeletons */}
                          {Array(4).fill(null).map((_, idx) => (
                            <div key={idx} className="flex-shrink-0 w-[140px] md:w-[220px] lg:w-[310px]">
                              <Skeleton className="w-[160px] h-[200px] md:w-[220px] md:h-[280px] lg:w-[310px] lg:h-[350px] mb-3" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                          ))}
                        </div>
                      </motion.section>
                    ) : (
                      // Display in-progress looks (looks user has started applying)
                      <motion.section className="mb-4 md:mb-6 lg:mb-10">
                        <div className="flex overflow-x-auto hide-scrollbar space-x-3 md:space-x-5 lg:space-x-7 pb-4 pl-[6vw] md:pl-[4vw]">
                          {inProgressLooks.map((look, idx) => {
                            // Find the category for this look
                            const categorySection = makeupData.find(section => 
                              section.looks.some(l => l.id === look.id)
                            );
                            return (
                              <LookCard
                                key={`continue-${look.id || idx}`}
                                look={look}
                              onClick={() => handleLookClick(look)}
                                index={idx}
                                category={categorySection?.category}
                                completionPercentage={look.completionPercentage}
                              />
                            );
                          })}
                        </div>
                      </motion.section>
                  )}
                </motion.div>
              </div>
              )}

              {/* WISHLIST Section */}
              <div className="flex-grow pt-4 md:pt-8">
                <motion.section 
                  className="mb-2"
                  variants={contentVariants}
                >
                  <div className="md:flex md:flex-row md:justify-between md:items-center flex-col mb-2 md:mb-3">
                    <div className="">
                      <H3 className="mb-2 md:mb-0">
                        MY WISHLIST ({wishlistProducts.length})
                      </H3>
                    </div>
                  </div>
                </motion.section>

                <motion.div 
                  className="overflow-visible w-screen -ml-[6vw] md:-ml-[4vw]"
                >
                  <motion.section className="mb-4 md:mb-6 lg:mb-10">
                    {wishlistProducts.length > 0 ? (
                      <div className="flex overflow-x-auto hide-scrollbar space-x-3 md:space-x-5 lg:space-x-7 pb-4 pl-[6vw] md:pl-[4vw]">
                        {wishlistProducts.map((product, idx) => (
                          <ProductCard
                            key={product.id || idx}
                            product={product}
                            index={idx}
                            isInWishlist={true}
                            onWishlistChange={async (productId, isInWishlist) => {
                              console.log("Wishlist change:", productId, isInWishlist);
                              if (!isInWishlist) {
                                // Remove from wishlist state immediately for responsive UI
                                setWishlistProducts(prev => prev.filter(p => p.id !== productId));
                                setWishlist(prev => prev.filter(item => item.product_id !== productId));
                                // Refresh from server to ensure sync
                                setTimeout(() => fetchWishlist(), 500);
                              } else {
                                // Refresh wishlist when item is added
                                fetchWishlist();
                              }
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="pl-[6vw] md:pl-[4vw] py-8">
                        <Body2 className="text-gray-500">
                          No items in your wishlist yet. Add products by clicking the heart icon.
                        </Body2>
                      </div>
                    )}
                  </motion.section>
                </motion.div>
              </div>

              <motion.section 
                className="pt-2 md:pt-4 pb-10"
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
                        <H1 className="mb-4 md:mb-0 mx-auto md:mx-0 md:whitespace-nowrap">
                        {hasFeedback ? "THANKS!" : "HOW DID IT GO?"}
                        </H1>
                      </div>
                      <div>
                        <Body2 className="mb-4 md:mb-0 max-w-[250px] md:max-w-none mx-auto md:mx-0 text-gray-400">
                          {hasFeedback 
                            ? "You can always add details or modify it"
                            : (
                              <>
                                Help us understand how to improve <i>NARS Persona</i>
                              </>
                            )
                          }
                        </Body2>
                      </div>
                    </div>
                    
                    <FeedbackButton
                      onClick={() => {
                        navigate(`/Feedback?consultationId=${consultationId}`);
                      }}
                      hasFeedback={hasFeedback}
                      variants={contentVariants}
                    />
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
