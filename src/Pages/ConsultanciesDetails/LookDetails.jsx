import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import { Loader2 } from 'lucide-react';
import Logo from "../../assets/Main.png";
import { motion } from "framer-motion";
import { Grid } from "../../Components/Grid";
import { collectionService, historyService, wishlistService, API_BASE_URL } from '../../services/api';
import { Checkbox, H1, H3, Body2 } from "../../Components/atoms";
import ProductCard from "../../Components/ProductCard";

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
  const [currentLookId, setCurrentLookId] = useState(null);
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
  const [ownedProducts, setOwnedProducts] = useState(new Set());
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [completedInstructions, setCompletedInstructions] = useState([]);
  const [savingProgress, setSavingProgress] = useState(false);

  // Load wishlist from backend
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const wishlistData = await wishlistService.getWishlist();
        if (wishlistData?.items) {
          const wishlistIds = new Set(wishlistData.items.map(item => item.product_id));
          setWishlistItems(wishlistIds);
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    };
    loadWishlist();
  }, []);

  // Toggle wishlist
  const toggleWishlist = async (product) => {
    try {
      setLoadingWishlist(true);
      
      if (wishlistItems.has(product.id)) {
        // Remove from wishlist
        await wishlistService.removeFromWishlist(product.id);
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(product.id);
          return newSet;
        });
      } else {
        // Add to wishlist
        await wishlistService.addToWishlist(product.id, 'general');
        setWishlistItems(prev => new Set([...prev, product.id]));
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setLoadingWishlist(false);
    }
  };

  // Toggle product ownership
  const toggleProductOwnership = async (productId) => {
    try {
      if (ownedProducts.has(productId)) {
        await collectionService.removeFromCollection(productId);
        setOwnedProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        await collectionService.addToCollection(productId);
        setOwnedProducts(prev => new Set([...prev, productId]));
      }
    } catch (error) {
      console.error("Error toggling product ownership:", error);
    }
  };

  // Load product ownership status
  const loadOwnershipStatus = async (products) => {
    try {
      const productIds = products.map(p => p.id).filter(Boolean);
      if (productIds.length > 0) {
        const result = await collectionService.checkOwnership(productIds);
        setOwnedProducts(new Set(result.owned_product_ids || []));
      }
    } catch (error) {
      console.error("Error loading ownership status:", error);
    }
  };

  // Load instruction progress from look history
  useEffect(() => {
    const loadInstructionProgress = async () => {
      const activeId = currentLookId || lookId;
      if (!activeId) return;
      
      try {
        const history = await historyService.getHistory();
        const lookHistory = history.find(h => h.look_id === activeId || h.look_id === parseInt(activeId));
        if (lookHistory && lookHistory.completed_instructions) {
          setCompletedInstructions(lookHistory.completed_instructions);
          console.log("Loaded instruction progress:", lookHistory.completed_instructions);
        }
      } catch (error) {
        console.error("Error loading instruction progress:", error);
      }
    };
    loadInstructionProgress();
  }, [currentLookId, lookId]);

  // Toggle instruction completion
  const toggleInstructionComplete = async (stepIndex, isChecked) => {
    const activeId = currentLookId || lookId;
    if (!activeId) {
      console.error("No look ID available");
      return;
    }
    
    console.log("Toggling step", stepIndex, "for look ID", activeId);
    
    let newCompleted;
    if (isChecked) {
      newCompleted = [...completedInstructions, stepIndex];
    } else {
      newCompleted = completedInstructions.filter(i => i !== stepIndex);
    }
    
    setCompletedInstructions(newCompleted);
    
    // Save to backend with debounce
    try {
      setSavingProgress(true);
      console.log("Saving progress:", newCompleted);
      await historyService.updateInstructionProgress(activeId, newCompleted);
      console.log("Progress saved successfully");
    } catch (error) {
      console.error('Error saving instruction progress:', error);
      // Revert on error
      setCompletedInstructions(completedInstructions);
    } finally {
      setSavingProgress(false);
    }
  };

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
      
      // Set the current look ID
      if (lookData.id) {
        setCurrentLookId(lookData.id);
        console.log("Setting current look ID:", lookData.id);
      }
      
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
          
          // The instructions are now a flat array of {step, title, description}
          // Convert to the format expected by the component
          if (Array.isArray(instructions)) {
            setLookSteps(instructions);
            console.log("Setting steps from navigation:", instructions);
          }
        } catch (err) {
          console.error("Error parsing instructions:", err);
        }
      }
      
      // Update products if available
      if (lookData.products && Array.isArray(lookData.products)) {
        // Pass the full product object with all fields
        setLookProducts(lookData.products);
        console.log("Setting products from navigation:", lookData.products);
        
        // Load ownership status
        loadOwnershipStatus(lookData.products);
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
              
              // The instructions are now a flat array of {step, title, description}
              // Convert to the format expected by the component
              if (Array.isArray(instructions)) {
                setLookSteps(instructions);
                console.log("Setting steps from API:", instructions);
              }
            } catch (err) {
              console.error("Error parsing instructions:", err);
            }
          }
          
          // Update products if available
          if (lookData.products && Array.isArray(lookData.products)) {
            // Pass the full product object with all fields
            setLookProducts(lookData.products);
            console.log("Setting products from API:", lookData.products);
            
            // Load ownership status
            loadOwnershipStatus(lookData.products);
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


  // Update the artistAdvice array creation with the title
  const artistAdvice = artistInstruction 
    ? [{ title: artistInstructionTitle, content: artistInstruction }] 
    : lookDetails.artistAdvice;

  return (
    <>
      {loading ? (
        <div className="min-h-screen bg-white">
          <Navbar />
          <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8 text-center flex flex-col items-center justify-center">
              <div className="flex justify-center items-center">
                <img src={Logo} alt="Logo" />
              </div>
              <div className="mt-8 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#1E1E1E]" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-white">
          <Navbar />
          <div className="flex justify-center w-full">
            <Grid>
              <div className="col-span-4 md:col-span-6 px-0 md:px-0">
                {/* 🔹 Back Button with increased top and bottom spacing - updated to match ConsultantInfo.jsx */}
                <button 
                  onClick={handleBack} 
                  className="text-[15px] my-8 md:my-8 flex items-center"
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
                </button>
                
                <div className="grid md:grid-cols-6 gap-[26px] mb-[8px]">
                  {/* Image section - ensure it spans 4 columns on mobile */}
                  <div className="col-span-4 md:col-span-3">
                    <div className="w-full flex flex-col items-center md:items-start">
                      {/* Image container */}
                      <div 
                        className="relative w-full md:max-w-none h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
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
                      </div>
                      
                      {/* Image dots/carousel indicators - only show if multiple images */}
                      {lookImages.length > 1 && (
                        <div className="relative mt-[10px] flex justify-center items-center gap-[3px] mx-auto z-20 w-full">
                          {lookImages.map((_, index) => (
                            <button
                              key={index}
                              className={`w-1 h-1 rounded-full ${
                                currentImage === index ? "bg-[#8E8E8E]" : "bg-gray-300"
                              }`}
                              onClick={() => handleDotClick(index)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content section - 3 columns */}
                  <div className="col-span-full md:col-span-3">
                    <div className="flex flex-col justify-end h-full md:h-[500px] lg:h-[600px] w-full gap-[48px] md:gap-[40px]">
                      {/* Top content group */}
                      <div className="flex flex-col gap-1">
                        {/* Title and Author */}
                        <div className="flex flex-col">
                          <H1 className="mt-4">
                            {lookTitle}
                          </H1>
                          {location.state?.lookData?.author && (
                            <Body2 className="text-[#000000] mt-2 md:mt-1">
                              {location.state.lookData.author}
                            </Body2>
                          )}
                        </div>

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
                        <div className="hidden md:block">
                          {artistAdvice.map((advice, index) => (
                            <div
                              key={index}
                              className="bg-[#EFEFEF] p-4 md:p-6 lg:p-8 rounded-[2px]"
                            >
                              <Body2 className="font-bold">
                              <strong>{advice.title}</strong>
                              </Body2>
                              <Body2 className={advice.title ? 'mt-2' : ''}>
                                {advice.content}
                              </Body2>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 🔹 Get the Look Section */}
                <div className="mt-12 md:mt-16">
                  <div>
                    <H3 className="mb-[8%] md:mb-[4%] lg:mb-[3%]">
                    GET THE LOOK
                    </H3>
                  </div>

                  {/* 🔹 Look Steps */}
                  <div className="space-y-6">
                    {lookSteps.map((item, index) => {
                      const isCompleted = completedInstructions.includes(index);
                      
                      return (
                        <div
                          key={index} 
                          className="flex gap-3 items-center"
                      >
                          {/* Step number box that acts as checkbox */}
                          <button
                            onClick={() => toggleInstructionComplete(index, !isCompleted)}
                            disabled={savingProgress}
                            className={`flex-shrink-0 inline-flex items-center justify-center w-[27px] h-[27px] rounded-[2px] text-[16px] font-medium transition-all duration-200 ${
                              isCompleted 
                                ? 'bg-black text-white' 
                                : 'bg-white border-1 border-[#GGGGGG] text-black'
                            } ${savingProgress ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
                          >
                            {item.step || index + 1}
                          </button>
                          
                          {/* Step content */}
                          <div className="flex-1">
                            <Body2 className={`transition-all duration-200 ${
                              isCompleted ? 'line-through text-gray-500' : ''
                            }`}>
                              {item.title && <strong>{item.title}.</strong>} {item.description}
                            </Body2>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 🔹 Artist Advice Section - moved here for mobile, hidden on tablet/desktop */}
                {artistInstruction && (
                  <div className="block md:hidden mt-16 w-screen h-auto -mx-[6vw]">
                    {artistAdvice.map((advice, index) => (
                      <div
                        key={index}
                        className="bg-[#EFEFEF] px-[5%] py-6 h-auto max-h-[300px] overflow-y-auto"
                      >
                        <Body2 className="mb-4 font-bold">
                          <strong>{advice.title}</strong>
                        </Body2>
                        <Body2 className={advice.title ? 'mt-2' : ''}>
                          {advice.content}
                        </Body2>
                      </div>
                    ))}
                  </div>
                )}

                {/* Must-have Products with increased bottom spacing */}
                <div className="mb-10 md:mb-16 mt-16 md:mt-16">
                  <H3 className="mb-2 md:mb-3">
                    MUST HAVE PRODUCTS
                  </H3>
                  
                  <div className="overflow-visible w-screen -ml-[6vw] md:-ml-[4vw]">
                    <div className="flex overflow-x-auto hide-scrollbar space-x-3 md:space-x-5 lg:space-x-7 pb-4 pl-[6vw] md:pl-[4vw]">
                      {lookProducts.map((product, index) => (
                        <ProductCard
                          key={product.id || index}
                          product={product}
                          isOwned={ownedProducts.has(product.id)}
                          isInWishlist={wishlistItems.has(product.id)}
                          index={index}
                          onWishlistChange={(productId, isInWishlist) => {
                            if (isInWishlist) {
                              setWishlistItems(prev => new Set([...prev, productId]));
                            } else {
                              setWishlistItems(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(productId);
                                return newSet;
                              });
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </div>
        </div>
      )}
    </>
  );
}
