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

  // Menu Animation Variants
  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

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
          isScrolled ? "glass border-b border-white/5 py-3 shadow-lg backdrop-blur-md" : "bg-transparent py-4 md:py-6"
        )}
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          {/* Logo Section - Flexible & Scalable */}
          <Link 
            href="/" 
            className="flex items-center gap-2 sm:gap-3 group shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary-start rounded-lg p-1"
            aria-label="Synthesize Axonova Home"
          >
            <div className="relative flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/logo/Logo.svg" 
                alt="Synthesize Axonova Logo" 
                className="w-10 h-auto sm:w-12 md:w-10 object-contain transition-all duration-300"
              />
            </div>
            <span className="font-bold text-lg sm:text-xl md:text-xl tracking-tight uppercase hidden xs:inline-block sm:inline-block">
              SYNTHESIZE <span className="text-primary-start">AXONOVA</span>
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on Mobile/Tablet (< 1024px) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-white/70 hover:text-white hover:text-shadow-glow transition-all duration-300 relative group py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary-start rounded-md px-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary-start transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link
              href="#contact"
              className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 hover:border-primary-start/50 transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-primary-start active:scale-95"
            >
              Start a Project
            </Link>
          </div>

          {/* Mobile Menu Toggle - Visible on Mobile/Tablet (< 1024px) */}
          <button
            className="lg:hidden text-white p-2 rounded-md hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary-start min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu - Full Width Glassmorphism */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="absolute top-full left-0 right-0 glass border-b border-white/5 lg:hidden overflow-hidden bg-[#050505]/95 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex flex-col p-6 gap-2">
                {NAV_LINKS.map((link) => (
                  <motion.div key={link.label} variants={itemVariants}>
                    <Link
                      href={link.href}
                      className="block text-lg font-medium text-white/80 hover:text-white hover:pl-2 transition-all duration-300 py-3 border-b border-white/5 outline-none focus-visible:ring-2 focus-visible:ring-primary-start rounded-md px-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={itemVariants} className="pt-4">
                  <Link
                    href="#contact"
                    className="flex items-center justify-center w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-start/20 to-primary-end/20 border border-white/10 text-white font-bold tracking-wide hover:from-primary-start/30 hover:to-primary-end/30 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary-start active:scale-95 min-h-[44px]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Start a Project
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};
