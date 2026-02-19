"use client";

import React from "react";
import { SERVICES } from "@/constants";
import { SERVICES_DETAIL, ServiceDetail } from "@/constants/services-detail";
import { GlassCard } from "@/components/ui/GlassCard";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ServiceModal } from "@/components/ui/ServiceModal";

export const Services = () => {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

  const handleServiceClick = (slug: string) => {
    const details = SERVICES_DETAIL[slug];
    if (details) {
      setSelectedService(details);
    }
  };

  return (
    <section id="services" className="section-spacing relative">
      {/* Glow Blob for Services - Hardware accelerated */}
      <div 
        className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-primary-end/20 rounded-full blur-[120px] -z-10 opacity-20 will-change-[transform,opacity]" 
        style={{ pointerEvents: "none" }}
      />

      <div className="phi-container">
        {/* Header - Fluid Flex Column / Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12 mb-16 lg:mb-24">
          <div className="max-w-3xl text-center lg:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-sm font-bold tracking-[0.3em] text-primary-end uppercase mb-4 lg:mb-6"
            >
              Our Services
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              className="text-4xl lg:text-7xl font-black tracking-[-0.05em] uppercase leading-[0.9]"
            >
              HIGH-IMPACT <br />
              <span className="text-gradient">SOLUTIONS</span>
            </motion.h3>
          </div>
          
          <div className="max-w-xl text-center lg:text-left mx-auto lg:mx-0">
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
              className="text-white/40 text-lg leading-relaxed text-balance"
            >
              We bridge the gap between imagination and execution with our core competencies, delivering editorial-grade digital experiences.
            </motion.p>
          </div>
        </div>

        {/* Services Grid - 1 Col Mobile -> 4 Col Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {SERVICES.map((service, index) => {
            const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[service.icon];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 + (index * 0.05), ease: "easeOut" }}
                className="h-full w-full"
              >
                <GlassCard 
                  glow 
                  className="group flex flex-col h-full p-8 transition-all duration-300 noise-overlay cursor-pointer hover:border-primary-end/50 min-h-[350px] lg:min-h-[400px]"
                  onClick={() => handleServiceClick(service.slug)}
                >
                  <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-primary-end/20 transition-all duration-300 group-hover:rotate-6 will-change-transform">
                    {IconComponent && (
                      <IconComponent className="text-white group-hover:text-primary-end transition-colors" size={28} />
                    )}
                  </div>
                  
                  <h4 className="text-2xl font-bold mb-6 group-hover:text-gradient transition-all tracking-[-0.04em]">
                    {service.title}
                  </h4>
                  <p className="text-white/50 text-base leading-relaxed mb-10 flex-grow text-balance">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center gap-3 text-[11px] font-bold tracking-[0.2em] uppercase text-white/30 group-hover:text-primary-end transition-colors mt-auto">
                    Explore Detail
                    <Icons.ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300 ease-in-out will-change-transform" />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ServiceModal 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)} 
        service={selectedService} 
      />
    </section>
  );
};
