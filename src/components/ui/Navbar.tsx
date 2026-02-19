"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/constants";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSyncing } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Sync Loading Bar */}
      <AnimatePresence>
        {isSyncing && (
          <motion.div 
             className="fixed top-0 left-0 right-0 h-1 z-[100] bg-linear-to-r from-[#00f2fe] to-[#7000ff]"
             initial={{ scaleX: 0, originX: 0 }}
             animate={{ scaleX: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 2, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
          isScrolled ? "glass border-b border-white/5 py-3" : "bg-transparent py-4 md:py-6"
        )}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              {/* Mobile: 1.5x larger relative to desktop baseline, ensuring sharp SVG */}
              <img 
                src="/logo/Logo.svg" 
                alt="Synthesize Axonova Logo" 
                className="w-12 h-auto md:w-10 object-contain"
              />
            </div>
            <span className="font-bold text-xl md:text-xl tracking-tight uppercase hidden sm:inline-block">
              SYNTHESIZE <span className="text-primary-start">AXONOVA</span>
            </span>
          </Link>

          {/* Desktop Links - Flexbox with Justify-End */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#contact"
              className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition-all whitespace-nowrap"
            >
              Start a Project
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 glass border-b border-white/5 p-6 lg:hidden flex flex-col gap-4"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-lg font-medium text-white/70 hover:text-white py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="#contact"
                className="text-lg font-medium text-primary-start hover:text-white py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Start a Project
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};
