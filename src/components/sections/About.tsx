"use client";

import React from "react";
import { ABOUT_CONTENT } from "@/constants";
import { GlassCard } from "@/components/ui/GlassCard";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

export const About = () => {
  return (
    <section id="about" className="section-spacing relative">
      <div className="phi-container">
        {/* Responsive Grid: 1 col mobile, 2 cols desktop (auto-fit logic applied) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {Object.entries(ABOUT_CONTENT).map(([key, content], index) => {
            const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[content.icon];
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1, ease: "easeInOut" }}
                className="h-full"
              >
                <GlassCard className="h-full p-8 lg:p-12 flex flex-col items-center text-center hover:border-primary-start/30 transition-colors duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 lg:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                    {IconComponent && (
                      <IconComponent className="text-primary-start w-8 h-8" />
                    )}
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 tracking-tight uppercase">
                    {content.title}
                  </h3>
                  
                  <p className="text-white/60 text-base lg:text-lg leading-relaxed text-balance">
                    {content.description}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
