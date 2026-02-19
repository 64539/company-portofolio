"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SERVICES } from "@/constants";
import { ServiceDetail } from "@/constants/services-detail";
import * as Icons from "lucide-react";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceDetail | null;
}

export const ServiceModal = ({ isOpen, onClose, service }: ServiceModalProps) => {
  const handleInitializeProject = () => {
    onClose();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      
      // Dispatch a custom event to fill the contact form
      const event = new CustomEvent('fillContactForm', { 
        detail: { subject: service?.title } 
      });
      window.dispatchEvent(event);
    }
  };

  if (!service) return null;

  const serviceMeta = SERVICES.find(s => s.slug === service.slug);
  const IconComponent = serviceMeta ? (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[serviceMeta.icon] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 lg:p-8 cursor-pointer"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none p-4 lg:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300, duration: 0.3 }}
              className="w-full max-w-5xl max-h-[32rem] sm:max-h-[36rem] md:max-h-[40rem] overflow-y-auto pointer-events-auto no-scrollbar"
            >
              <GlassCard className="border-white/10 shadow-2xl bg-[#050505]/90 overflow-hidden relative">
                {/* Close Button */}
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group"
                >
                  <X size={20} className="text-white/60 group-hover:text-white transition-colors" />
                </button>

                {/* Modal Header */}
                <div className="p-8 lg:p-12 border-b border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-start/10 rounded-full blur-[100px] -z-10 opacity-50 pointer-events-none" />
                  
                  <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-white/60 mb-6">
                    Service Detail
                  </span>
                  
                  <div className="flex items-start justify-between gap-6 mb-6">
                    <h2 className="text-4xl lg:text-6xl font-black tracking-[-0.04em] uppercase leading-[0.9]">
                      {service.title}
                    </h2>
                    {/* Neon Icon */}
                    {IconComponent && (
                      <div className="hidden lg:flex w-20 h-20 rounded-2xl bg-white/5 items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(0,242,254,0.15)]">
                        <IconComponent className="text-primary-start" size={40} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8 lg:items-end justify-between">
                    <p className="text-xl text-white/70 leading-relaxed max-w-2xl text-balance">
                      {service.hero.description}
                    </p>
                    <div className="text-right min-w-[200px]">
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary-start mb-2">Lead Office</p>
                      <p className="text-sm font-medium text-white">{service.hero.leadExpert}</p>
                    </div>
                  </div>
                </div>

                {/* Modal Body - Deep Dive */}
                <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                  {/* Left Column: Expertise & Tech Stack */}
                  <div className="space-y-12">
                    <div>
                      <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white/40 mb-6 flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-white/20" />
                        Core Expertise
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {service.expertise.map((exp, i) => (
                          <div key={i} className="flex items-center gap-4 group">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-start group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(0,242,254,0.5)]" />
                            <span className="text-lg font-medium text-white/80 group-hover:text-white transition-colors">
                              {exp}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white/40 mb-6 flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-white/20" />
                        Tech Stack
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {service.techStack.map((tech, i) => (
                          <span 
                            key={i} 
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-xs font-bold tracking-wide text-white/60 hover:text-white hover:border-primary-start/30 transition-all cursor-default"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Neural Flow */}
                  <div>
                    <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white/40 mb-8 flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-white/20" />
                      The Neural Flow
                    </h3>
                    <div className="relative border-l border-white/10 ml-3 space-y-12 pb-2">
                      {service.flow.map((step, i) => (
                        <div key={i} className="relative pl-10 group">
                          {/* Timeline Dot */}
                          <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-white/10 border border-white/20 group-hover:bg-primary-start group-hover:border-primary-start transition-all duration-300 z-10 shadow-[0_0_0_rgba(0,0,0,0)] group-hover:shadow-[0_0_10px_rgba(0,242,254,0.5)]" />
                          
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-white/30 mb-1 tracking-widest uppercase group-hover:text-primary-start transition-colors">
                              Phase 0{i + 1}
                            </span>
                            <span className="text-xl font-bold text-white/90 group-hover:translate-x-2 transition-transform duration-300">
                              {step}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-8 lg:p-12 border-t border-white/5 bg-white/[0.02]">
                  <button onClick={handleInitializeProject} className="w-full py-5 rounded-xl bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-primary-start hover:text-white transition-all duration-500 flex items-center justify-center gap-3 group">
                    Initialize Project
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
