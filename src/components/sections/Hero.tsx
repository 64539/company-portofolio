"use client";

import React from "react";
import { motion } from "framer-motion";
import { HERO_CONTENT } from "@/constants";
import { ChevronDown } from "lucide-react";
import { useStore } from "@/lib/store";

export const Hero = () => {
  const { triggerSync } = useStore();

  const handleLabScroll = () => {
    const labSection = document.getElementById('capabilities');
    if (labSection) {
      labSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative flex flex-col justify-center section-spacing overflow-visible">
      <div 
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-start/10 rounded-full blur-[120px] -z-10 animate-pulse will-change-[transform,opacity]" 
        style={{ pointerEvents: "none" }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary-end/10 rounded-full blur-[120px] -z-10 will-change-[transform,opacity]" 
        style={{ pointerEvents: "none" }}
      />

      <div className="phi-container z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h1 className="text-[clamp(2.5rem,8vw,5rem)] lg:text-[clamp(3.5rem,8vw,8rem)] font-black tracking-[-0.05em] leading-[0.85] uppercase text-gradient mb-8 lg:mb-12 text-center lg:text-left mx-auto lg:mx-0 max-w-4xl lg:max-w-none text-balance break-words hyphens-auto">
                {HERO_CONTENT.title.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h1>
            </motion.div>
          </div>
          
          <div className="lg:col-span-5 lg:col-start-1 text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
              className="text-lg md:text-xl text-white/60 leading-relaxed mb-8 lg:mb-12 max-w-lg mx-auto lg:mx-0"
            >
              {HERO_CONTENT.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: "easeInOut" }}
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center lg:justify-start"
            >
              <button 
                onClick={triggerSync}
                className="px-8 py-4 lg:px-10 lg:py-5 rounded-full bg-linear-to-r from-primary-start to-primary-end text-white font-bold text-base lg:text-lg hover:shadow-[0_0_30px_rgba(0,242,254,0.3)] transition-all min-w-[200px] group cursor-pointer"
              >
                <span className="flex items-center gap-2 justify-center">
                  Sync with Collective
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </span>
              </button>
              <button 
                onClick={handleLabScroll}
                className="px-8 py-4 lg:px-10 lg:py-5 rounded-full glass text-white font-bold text-base lg:text-lg hover:bg-white/10 transition-all min-w-[200px] cursor-pointer"
              >
                The Lab
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
