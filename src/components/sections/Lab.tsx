"use client";

import React, { useState } from "react";
import { LAB_PROJECTS } from "@/constants";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { Beaker, ArrowUpRight, X, Cpu, Terminal, Layout, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type LabProject = {
  title: string;
  description: string;
  category: string;
  size: string;
  stack?: string[];
  team?: { role: string; name: string }[];
  progress?: number;
};

export const Lab = () => {
  const [selectedProject, setSelectedProject] = useState<LabProject | null>(null);
  const projects = LAB_PROJECTS as unknown as LabProject[];
  
  // We only show the "Product Alpha" project (Jastip Web)
  const alphaProject = projects.find(p => p.category === "Product Alpha");

  const handleInquire = () => {
    setSelectedProject(null);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      // Dispatch event to pre-fill the form
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('fillContactForm', { 
          detail: { subject: 'Jastip Web (Product Alpha)' } 
        }));
      }, 500);
    }
  };

  return (
    <section id="capabilities" className="section-spacing relative overflow-visible">
      <div className="phi-container relative">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12 mb-16 lg:mb-24">
           <div className="max-w-3xl text-center lg:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-sm font-bold tracking-[0.3em] text-primary-start uppercase mb-4 lg:mb-6"
            >
              Capabilities
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              className="text-4xl lg:text-7xl font-black tracking-[-0.05em] uppercase leading-[0.9]"
            >
              The <span className="text-gradient">Lab</span>
            </motion.h3>
          </div>
        </div>

        {/* Hero Project Card */}
        {alphaProject && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
            className="w-full"
          >
            <div onClick={() => setSelectedProject(alphaProject)} className="cursor-pointer">
              <GlassCard 
                glow 
                className="group relative overflow-hidden transition-all duration-300 hover:border-primary-start/50 flex flex-col p-8 lg:p-12 min-h-[500px]"
              >
                {/* Noise Overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-noise z-0" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-12">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary-start/20 transition-colors duration-300 border border-white/10">
                        <Beaker className="w-7 h-7 text-white group-hover:text-primary-start transition-colors" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-1">Status</span>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                          <span className="text-xs font-bold text-yellow-500 uppercase tracking-wide">In Development</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold tracking-[0.2em] text-white/30 uppercase">Alpha 0.1</span>
                  </div>

                  <div className="mt-auto max-w-4xl">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-primary-start mb-6">
                      {alphaProject.category}
                    </span>
                    <h4 className="text-4xl lg:text-6xl font-black mb-6 leading-[0.9] group-hover:text-gradient transition-all uppercase">
                      {alphaProject.title}
                    </h4>
                    <p className="text-white/50 text-xl leading-relaxed text-balance max-w-2xl">
                      {alphaProject.description}
                    </p>
                  </div>

                  <div className="absolute bottom-12 right-12 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 hidden lg:flex items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-white">View Blueprint</span>
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center">
                      <ArrowUpRight size={24} />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-5xl max-h-[90vh] overflow-y-auto relative z-10 no-scrollbar"
            >
              <GlassCard className="bg-[#050505] border-white/10 shadow-2xl overflow-hidden">
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <X size={20} className="text-white/50 group-hover:text-white" />
                </button>

                <div className="p-8 lg:p-16 grid lg:grid-cols-2 gap-12 lg:gap-24">
                  {/* Left Column: Info */}
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary-start/10 border border-primary-start/20 text-[10px] font-bold tracking-[0.2em] uppercase text-primary-start mb-8">
                      Confidential Blueprint
                    </span>
                    
                    <h2 className="text-4xl lg:text-5xl font-black uppercase leading-[0.9] mb-8">
                      {selectedProject.title}
                    </h2>
                    
                    <p className="text-white/60 text-lg leading-relaxed mb-12">
                      {selectedProject.description} A revolutionary platform designed to streamline global procurement logistics through automated workflows and real-time tracking.
                    </p>

                    <div className="mb-12">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">Industrial Tech Stack</h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedProject.stack?.map((tech) => (
                          <span key={tech} className="px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-xs font-bold text-white/80 uppercase tracking-wide">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">The Neural Team</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedProject.team?.map((member) => (
                          <div key={member.role} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary-start">
                              {member.role === 'CEO' && <Cpu size={16} />}
                              {member.role === 'CTO' && <Terminal size={16} />}
                              {member.role === 'CPO' && <Layout size={16} />}
                              {member.role === 'COS' && <ShieldCheck size={16} />}
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{member.role}</p>
                              <p className="text-sm font-bold text-white">{member.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Progress & Visuals */}
                  <div className="flex flex-col justify-center">
                    <div className="relative aspect-square w-full max-w-[400px] mx-auto mb-12">
                      {/* Circular Progress */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="1"
                          strokeOpacity="0.1"
                        />
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          fill="none"
                          stroke="#00f2fe"
                          strokeWidth="2"
                          strokeDasharray="283"
                          strokeDashoffset={283 - (283 * (selectedProject.progress || 0)) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-black text-white">{selectedProject.progress}%</span>
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mt-2">Completion</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-white/40 mb-2">Estimated Launch</p>
                      <p className="text-xl font-bold text-white uppercase tracking-widest mb-8">Q3 2026</p>
                      
                      <button 
                        onClick={handleInquire}
                        className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary-start hover:text-white transition-all duration-300 flex items-center justify-center gap-3 group min-h-[44px]"
                      >
                        Initialize Project
                        <Zap size={18} className="group-hover:fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
