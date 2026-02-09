import React from 'react';
import { motion } from 'framer-motion';
import { Body2, H1 } from './atoms';
import HeroImage from '../assets/hero.png';

export default function ArchetypeHero({ archetype }) {
  return (
    <motion.div 
      className="w-full h-auto lg:h-[515px] relative bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Right side image - hidden on mobile and tablet, shown on PC only */}
      <img 
        className="hidden lg:block w-[599px] h-[515px] absolute right-0 top-0 object-cover" 
        src={archetype?.image_url || HeroImage}
        alt={archetype?.name}
      />
      
      {/* Left side content - full width on mobile/tablet, constrained on PC */}
      <div className="w-full lg:w-[549px] h-auto lg:h-full px-6 md:px-8 lg:px-0 lg:left-[43px] relative lg:absolute top-0 flex flex-col justify-center items-start py-8 md:py-12 lg:py-0">
        <motion.div 
          className="self-stretch flex flex-col justify-start items-start"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Archetype Name */}
          <H1 className="self-stretch text-white">
            {archetype?.name}
          </H1>
          
          {/* Archetype Description */}
          <Body2 className="self-stretch mt-4 text-[#616161]">
            {archetype?.short_description}
          </Body2>
        </motion.div>
      </div>
    </motion.div>
  );
}

