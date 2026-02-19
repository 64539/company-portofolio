"use client";

import React from "react";
import { LAB_PROJECTS } from "@/constants";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { Beaker, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

type LabProject = {
  title: string;
  description: string;
  category: string;
  size: string;
};

export const Lab = () => {
  const projects = LAB_PROJECTS as unknown as LabProject[];
  const largeProject = projects.find(p => p.size === "large");
  const smallProjects = projects.filter(p => p.size !== "large");

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

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-6 lg:gap-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
        >
          {/* Large Card (61.8%) */}
          <div className="lg:col-span-1 h-full">
            {largeProject && <ProjectCard project={largeProject} featured index={0} className="h-full min-h-[400px]" />}
          </div>
          
          {/* Small Cards Column (38.2%) */}
          <div className="lg:col-span-1 grid grid-cols-1 gap-6 lg:gap-12 h-full">
            {smallProjects.map((project, i) => (
              <ProjectCard key={i} project={project} index={i + 1} className="h-full min-h-[300px]" />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index, featured = false, className }: { project: LabProject; index: number; featured?: boolean, className?: string }) => (
  <GlassCard 
    glow 
    className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:border-primary-start/50 flex flex-col",
      featured ? "p-8 lg:p-12" : "p-6 lg:p-8",
      className
    )}
  >
    {/* Noise Overlay */}
    <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-noise z-0" />
    
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex justify-between items-start mb-6 lg:mb-8">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary-start/20 transition-colors duration-300">
          <Beaker className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:text-primary-start transition-colors" />
        </div>
        <span className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase">0{index + 1}</span>
      </div>

      <div className="mt-auto">
        <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-primary-start mb-4">
          {project.category}
        </span>
        <h4 className={cn(
          "font-bold mb-4 leading-tight group-hover:text-gradient transition-all",
          featured ? "text-3xl lg:text-4xl" : "text-2xl"
        )}>
          {project.title}
        </h4>
        <p className="text-white/50 text-base leading-relaxed text-balance">
          {project.description}
        </p>
      </div>

      <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
          <ArrowUpRight size={20} />
        </div>
      </div>
    </div>
  </GlassCard>
);
