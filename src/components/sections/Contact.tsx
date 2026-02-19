"use client";

import React, { useState, useEffect } from "react";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/constants";
import { GlassCard } from "@/components/ui/GlassCard";
import { Send } from "lucide-react";
import { DynamicLogo } from "../ui/DynamicLogo";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Fullstack Development",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const handleFillForm = (event: CustomEvent) => {
      if (event.detail?.subject) {
        setFormData(prev => ({ ...prev, subject: event.detail.subject }));
      }
    };

    window.addEventListener('fillContactForm', handleFillForm as EventListener);
    return () => window.removeEventListener('fillContactForm', handleFillForm as EventListener);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSent(true);
        // Reset form after delay? Or keep as success state? User wants success state visual.
      }
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="section-spacing relative overflow-hidden">
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary-end/10 rounded-full blur-[150px] -z-10 opacity-20 pointer-events-none" />
      
      <div className="phi-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-sm font-bold tracking-[0.3em] text-primary-start uppercase mb-6"
            >
              Contact Us
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-black tracking-[-0.05em] mb-8 leading-[0.9]"
            >
              READY TO <br />
              <span className="text-gradient uppercase">SYNTHESIZE?</span>
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-white/60 text-lg mb-8 lg:max-w-md leading-relaxed"
            >
              {CONTACT_INFO.subtitle} Whether you have a specific project in mind or just want to explore possibilities, our team is ready to connect.
            </motion.p>
            
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              <div className="flex items-center gap-4 text-white/40">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-start animate-pulse" />
                </div>
                <span className="text-sm font-medium tracking-wide">Available for new projects</span>
              </div>

              <div className="flex gap-4">
                {SOCIAL_LINKS.map((social) => {
                  return (
                    <a
                      key={social.platform}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      title={social.platform}
                      className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 hover:scale-110 hover:border-primary-start/30 border border-white/5 transition-all duration-300 group"
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
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            <GlassCard className="p-8 md:p-12 noise-overlay">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-white/40 ml-1">Name</label>
                    <input
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary-start/50 focus:ring-2 focus:ring-primary-start/10 transition-all text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-white/40 ml-1">Email</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary-start/50 focus:ring-2 focus:ring-primary-start/10 transition-all text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-white/40 ml-1">Service / Subject</label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary-start/50 focus:ring-2 focus:ring-primary-start/10 transition-all appearance-none text-white/80"
                  >
                    <option className="bg-black text-white">Fullstack Development</option>
                    <option className="bg-black text-white">UI/UX Design</option>
                    <option className="bg-black text-white">Video Editing</option>
                    <option className="bg-black text-white">Jasa Titip (Jastip)</option>
                    <option className="bg-black text-white">Digital Strategy</option>
                    <option className="bg-black text-white">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-white/40 ml-1">Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us about your project..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary-start/50 focus:ring-2 focus:ring-primary-start/10 transition-all resize-none text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isSent}
                  className={cn(
                    "w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary-start hover:text-white transition-all duration-500 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed",
                    isSent && "border-2 border-[#00f2fe] shadow-[0_0_20px_rgba(0,242,254,0.5)] !text-[#00f2fe] !bg-transparent hover:!bg-transparent"
                  )}
                >
                  {isLoading ? (
                    <span className="animate-pulse">Synthesizing...</span>
                  ) : isSent ? (
                    "Pesan Terdisintesis ✓"
                  ) : (
                    <>
                      Send Message
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
