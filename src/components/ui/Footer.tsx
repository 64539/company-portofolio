import React from "react";
import Link from "next/link";
import { NAV_LINKS, SOCIAL_LINKS } from "@/constants";
import { DynamicLogo } from "./DynamicLogo";

export const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <img 
                src="/logo/Logo.svg" 
                alt="Company Logo" 
                className="max-w-[200px] w-full h-auto object-contain"
              />
            </div>
            <span className="font-bold text-lg tracking-tight uppercase">SYNTHESIZE AXONOVA</span>
          </Link>
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Synthesize Axonova. All rights reserved.
          </p>
        </div>

        <div className="flex gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex gap-3 md:gap-4">
          {SOCIAL_LINKS.map((social) => {
            return (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.platform}
                title={social.platform}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all duration-300 group"
              >
                <DynamicLogo 
                  name={social.platform} 
                  size={24}
                  className="opacity-60 group-hover:opacity-100 transition-opacity invert" 
                />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};
