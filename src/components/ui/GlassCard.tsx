"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const GlassCard = ({ children, className, glow = false, ...props }: GlassCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass overflow-hidden rounded-2xl p-6 transition-all duration-300",
        glow && "hover:shadow-[0_0_30px_rgba(0,242,254,0.15)]",
        className
      )}
      {...props}
    >
      {/* Subtle glow effect */}
      {glow && (
        <div className="absolute -inset-px bg-linear-to-r from-primary-start to-primary-end opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
