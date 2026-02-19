"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useStore } from "@/lib/store";

export const NeuralBackground = () => {
  const { nervePulse } = useStore();
  const controls = useAnimation();

  useEffect(() => {
    if (nervePulse > 0) {
      // Trigger the fast pulse for sync (Visual Pulse)
      controls.start({
        pathOffset: [0, 1],
        opacity: [0, 1, 1, 0],
        transition: { duration: 1.5, ease: "easeInOut" }
      });
    }
  }, [nervePulse, controls]);

  // Organic path that snakes from top to bottom
  const nervePath = "M 50 0 C 65 15, 35 35, 50 50 S 65 85, 50 100";

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
      {/* Static Background Layer */}
      <div className="absolute inset-0 bg-white/[0.02] mix-blend-overlay noise-overlay" />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#7000ff" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#7000ff" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base Nerve - The Ultra-thin 1.5px Neon Line */}
        <motion.path
          d={nervePath}
          stroke="url(#neon-gradient)"
          strokeWidth="1.5px"
          fill="none"
          filter="url(#glow)"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 1, opacity: 0.8 }}
        />

        {/* Repeating Pulse Animation (3-5s duration) */}
        <motion.path
          d={nervePath}
          stroke="#00f2fe"
          strokeWidth="2px"
          fill="none"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0.15, opacity: 0, pathOffset: 0 }}
          animate={{ 
            pathOffset: [0, 1],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "linear",
            repeatDelay: 1
          }}
        />
        
        {/* Sync Trigger Pulse */}
        <motion.path
          d={nervePath}
          stroke="#fff"
          strokeWidth="3px"
          fill="none"
          filter="url(#glow)"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0.3, opacity: 0 }}
          animate={controls}
        />
      </svg>
    </div>
  );
};
