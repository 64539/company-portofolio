import React from "react";
import Link from "next/link";
import { NAV_LINKS, SOCIAL_LINKS } from "@/constants";
import * as Icons from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/5 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-start/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 md:gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-6 items-center md:items-start text-center md:text-left">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <img 
                src="/logo/Logo.svg" 
                alt="Company Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight uppercase leading-none">SYNTHESIZE</span>
              <span className="font-bold text-lg tracking-tight uppercase leading-none text-primary-start">AXONOVA</span>
            </div>
          </Link>
          <p className="text-white/40 text-xs tracking-wide">
            © {new Date().getFullYear()} Synthesize Axonova. All rights reserved.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-white/60 hover:text-white hover:text-shadow-glow transition-all duration-300 relative group min-h-[44px] flex items-center px-2"
            >
              {link.label}
              <span className="absolute bottom-2 left-0 w-0 h-[1px] bg-primary-start transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex gap-4">
          {SOCIAL_LINKS.map((social) => {
            const IconComponent = (Icons as any)[social.icon];
            
            return (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.platform}
                title={social.platform}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center transition-all duration-300 group hover:border-primary-start/50 hover:shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:-translate-y-1"
              >
                {IconComponent && (
                  <IconComponent 
                    size={20} 
                    className="text-white/60 group-hover:text-primary-start transition-colors duration-300" 
                  />
                )}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};
