"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, Trash2, CheckCircle, MessageCircle, RefreshCw, LogOut } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'done';
  createdAt: string;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal = ({ isOpen, onClose }: AdminModalProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Check session storage on mount
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
      fetchMessages(token);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem("adminToken", password); // Simple session storage
        fetchMessages(password);
      } else {
        setError("Access Denied");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (token: string) => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.messages) {
        // Sort by date desc just in case
        const sorted = data.messages.sort((a: Message, b: Message) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setMessages(sorted);
      }
    } catch (err) {
      console.error("Failed to fetch messages");
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setPassword("");
    setMessages([]);
  };

  const updateStatus = async (id: string, status: string) => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) return;

    // Optimistic update
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: status as any } : m));

    try {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ id, status }),
      });
    } catch (err) {
      console.error("Failed to update status");
      fetchMessages(token); // Revert on error
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    const token = sessionStorage.getItem("adminToken");
    if (!token) return;

    // Optimistic update
    setMessages(prev => prev.filter(m => m.id !== id));

    try {
      await fetch(`/api/admin/messages?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to delete message");
      fetchMessages(token);
    }
  };

  const getMailtoLink = (msg: Message) => {
    const subject = `[Synthesize Axonova] Tindak Lanjut Proyek - ${msg.subject}`;
    const body = `Halo ${msg.name},

Terima kasih sudah menghubungi Axonova. Kami telah menerima pesan Anda mengenai "${msg.subject}".

Tim kami telah meninjau kebutuhan Anda dan kami siap untuk mendiskusikan langkah selanjutnya.

Salam hangat,
Tim Axonova`;
    
    return `mailto:${msg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          <GlassCard className="h-full flex flex-col border-primary-start/20 shadow-[0_0_50px_rgba(0,242,254,0.1)]">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary-start animate-pulse" />
                <h2 className="text-xl font-bold tracking-widest uppercase">
                  Admin <span className="text-primary-start">Gate</span>
                </h2>
              </div>
              <div className="flex items-center gap-4">
                {isAuthenticated && (
                  <>
                    <button 
                      onClick={() => fetchMessages(sessionStorage.getItem("adminToken") || "")}
                      className={cn("p-2 hover:bg-white/10 rounded-full transition-colors", refreshing && "animate-spin")}
                    >
                      <RefreshCw size={18} />
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-full transition-colors"
                    >
                      <LogOut size={18} />
                    </button>
                  </>
                )}
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto min-h-[400px] max-h-[70vh]">
              {!isAuthenticated ? (
                // Login Form
                <div className="flex flex-col items-center justify-center h-full py-20">
                  <Lock size={48} className="text-white/20 mb-8" />
                  <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
                    <div>
                      <input
                        type="password"
                        placeholder="Enter Access Code"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] focus:border-primary-start focus:ring-1 focus:ring-primary-start outline-none transition-all placeholder:tracking-normal placeholder:text-sm"
                        autoFocus
                      />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary-start hover:text-white transition-all disabled:opacity-50"
                    >
                      {loading ? "Decrypting..." : "Unlock"}
                    </button>
                  </form>
                </div>
              ) : (
                // Dashboard
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {messages.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-white/30">
                      No messages intercepted yet.
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={cn(
                          "bg-white/5 border border-white/5 rounded-xl p-5 hover:border-primary-start/30 transition-all group relative overflow-hidden",
                          msg.status === 'unread' && "bg-primary-start/5 border-primary-start/20"
                        )}
                      >
                        {/* Status Indicator */}
                        <div className="absolute top-0 right-0 p-3">
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full",
                            msg.status === 'done' ? "bg-green-500/20 text-green-400" :
                            msg.status === 'replied' ? "bg-blue-500/20 text-blue-400" :
                            msg.status === 'unread' ? "bg-primary-start/20 text-primary-start" :
                            "bg-white/10 text-white/50"
                          )}>
                            {msg.status}
                          </span>
                        </div>

                        <div className="mb-4">
                          <h3 className="font-bold text-lg text-white mb-1">{msg.name}</h3>
                          <p className="text-xs text-white/40 font-mono">
                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                          </p>
                        </div>

                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-sm text-white/70">
                            <span className="text-primary-start font-bold text-xs uppercase w-16">Subject</span>
                            <span className="truncate">{msg.subject}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/70">
                            <span className="text-primary-start font-bold text-xs uppercase w-16">Email</span>
                            <span className="truncate">{msg.email}</span>
                          </div>
                          {msg.whatsapp && (
                             <div className="flex items-center gap-2 text-sm text-white/70">
                              <span className="text-primary-start font-bold text-xs uppercase w-16">WhatsApp</span>
                              <span className="truncate">{msg.whatsapp}</span>
                            </div>
                          )}
                        </div>

                        <div className="bg-black/30 rounded-lg p-3 text-sm text-white/80 mb-6 line-clamp-3">
                          "{msg.message}"
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={getMailtoLink(msg)}
                            onClick={() => updateStatus(msg.id, 'replied')}
                            className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-primary-start/20 text-xs font-bold uppercase tracking-wider transition-colors border border-white/5"
                          >
                            <Mail size={14} /> Reply
                          </a>
                          
                          {msg.whatsapp && (
                            <a
                              href={`https://wa.me/${msg.whatsapp.replace(/\D/g, '')}`} // Strip non-digits
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider transition-colors border border-green-500/20"
                            >
                              <MessageCircle size={14} /> Chat WA
                            </a>
                          )}

                          <button
                            onClick={() => updateStatus(msg.id, 'done')}
                            className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-green-500/20 hover:text-green-400 text-xs font-bold uppercase tracking-wider transition-colors border border-white/5"
                          >
                            <CheckCircle size={14} /> Done
                          </button>
                          
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-colors border border-white/5"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
