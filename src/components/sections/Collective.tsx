"use client";

import React from "react";
import { TEAM_MEMBERS } from "@/constants";
import { GlassCard } from "@/components/ui/GlassCard";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type TeamMember = {
  name: string;
  role: string;
  specialty: string;
  icon: keyof typeof Icons;
  type: "core" | "executive";
};

export const Collective = () => {
  const members = TEAM_MEMBERS as unknown as TeamMember[];
  const coreNodes = members.filter(m => m.type === "core");
  const executives = members.filter(m => m.type === "executive");

  return (
    <section id="collective" className="section-spacing relative bg-transparent overflow-visible">
      <div className="phi-container relative">
        <div className="mb-16 lg:mb-24 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h2 className="text-sm font-bold tracking-[0.3em] text-primary-start uppercase mb-4 lg:mb-6">
              The Collective
            </h2>
            <h3 className="text-4xl lg:text-7xl font-black tracking-[-0.05em] uppercase leading-[0.9]">
              C-SUITE <br />
              <span className="text-gradient">HIERARCHY</span>
            </h3>
          </motion.div>
        </div>

        {/* Desktop Staggered Neural Layout */}
        <motion.div 
          className="hidden lg:grid grid-cols-12 gap-8 group/list"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
        >
          {/* Core Nodes (CEO/CTO) - Visually Dominant */}
          <div className="col-span-12 grid grid-cols-2 gap-12 mb-12">
            {coreNodes.map((member, index) => (
              <MemberCard 
                key={index} 
                member={member} 
                className="h-[400px] border-primary-start/30 shadow-[0_0_30px_rgba(0,242,254,0.1)]" 
                featured 
              />
            ))}
          </div>

          {/* Executive Nodes - Staggered */}
          {executives.map((member, index) => (
            <MemberCard 
              key={index} 
              member={member} 
              className={cn(
                "col-span-4",
                index % 3 === 1 ? "mt-12" : "" // Stagger effect
              )} 
            />
          ))}
        </motion.div>

        {/* Mobile: Vertical List - Stacked Cleanly */}
        <motion.div 
          className="lg:hidden flex flex-col gap-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
        >
          {/* Core Nodes First */}
          {coreNodes.map((member, index) => (
            <div key={`core-${index}`} className="w-full">
               <MemberCard 
                member={member} 
                className="aspect-[1/1.1] w-full border-primary-start/30" 
                featured 
              />
            </div>
          ))}
          {/* Executives */}
          {executives.map((member, index) => (
            <div key={`exec-${index}`} className="w-full">
              <MemberCard member={member} className="aspect-[1/1.1] w-full" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const MemberCard = ({ member, className, featured = false }: { member: TeamMember; className?: string; featured?: boolean }) => {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[member.icon];
  
  return (
    <GlassCard 
      className={cn(
        "group relative hover:border-primary-start/30 transition-all duration-300 flex items-center justify-center group-hover/list:opacity-40 hover:!opacity-100 overflow-hidden",
        !featured && "aspect-[1/1.1]",
        className
      )}
    >
      {/* Neural Connection Line (Visible on Hover) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <svg className="w-full h-full overflow-visible">
          <motion.line
            x1="50%" y1="50%" x2="150%" y2="-50%"
            stroke="url(#neural-gradient-card)"
            strokeWidth="1"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
           <defs>
            <linearGradient id="neural-gradient-card" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0" />
              <stop offset="50%" stopColor="#00f2fe" stopOpacity="1" />
              <stop offset="100%" stopColor="#7000ff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="text-center relative z-10 w-full px-4">
        <div className={cn(
          "rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-start/20 transition-all duration-300 group-hover:scale-110",
          featured ? "w-24 h-24" : "w-16 h-16"
        )}>
          {IconComponent && (
            <IconComponent 
              className="text-white group-hover:text-primary-start transition-colors" 
              size={featured ? 40 : 28} 
            />
          )}
        </div>
        
        <h4 className={cn(
          "font-bold tracking-tight mb-2 group-hover:text-white transition-colors truncate w-full",
          featured ? "text-3xl" : "text-xl"
        )}>
          {member.name}
        </h4>
        
        <div className="space-y-1">
          <p className={cn(
            "font-medium text-primary-start tracking-wide uppercase truncate w-full",
            featured ? "text-sm" : "text-xs"
          )}>
            {member.role}
          </p>
          <p className="text-white/40 text-xs tracking-wider uppercase truncate w-full">
            {member.specialty}
          </p>
        </div>
      </div>
    </GlassCard>
  );
};
