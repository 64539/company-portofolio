"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, Trash2, CheckCircle, MessageCircle, RefreshCw, LogOut, ArrowRight, ChevronRight, ArrowLeft, Send } from "lucide-react";
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
  adminReply?: string;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SNIPPETS = [
  "Terima kasih atas pesan Anda. Kami akan segera meninjau.",
  "Bisa kami jadwalkan call untuk diskusi lebih lanjut?",
  "Mohon informasikan budget range untuk proyek ini.",
  "Berikut adalah portfolio kami yang relevan dengan kebutuhan Anda.",
  "Kami siap membantu inisialisasi proyek Anda."
];

// Min 44x44px Touch Target Helper
const IconButton = ({ onClick, children, className, disabled = false, title }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-start/50",
      className
    )}
  >
    {children}
  </button>
);

export const AdminModal = ({ isOpen, onClose }: AdminModalProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  // Reply State
  const [replyContent, setReplyContent] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Auto-save logic
  useEffect(() => {
    if (selectedMessage) {
      const savedDraft = localStorage.getItem(`draft_reply_${selectedMessage.id}`);
      if (savedDraft) {
        setReplyContent(savedDraft);
      } else {
        setReplyContent("");
      }
    }
  }, [selectedMessage]);

  useEffect(() => {
    if (selectedMessage) {
      localStorage.setItem(`draft_reply_${selectedMessage.id}`, replyContent);
    }
  }, [replyContent, selectedMessage]);

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
    setSelectedMessage(null);
  };

  const updateStatus = async (id: string, status: string) => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) return;

    // Optimistic update
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: status as any } : m));
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(prev => prev ? { ...prev, status: status as any } : null);
    }

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
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(null);
    }

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

  const sendReply = async () => {
    if (!selectedMessage || !replyContent) return;
    
    // Client-side Sanitization (Basic)
    const sanitizedContent = replyContent.replace(/<[^>]*>/g, ''); // Strip HTML tags
    
    setSendingReply(true);
    const token = sessionStorage.getItem("adminToken");

    try {
      const res = await fetch("/api/admin/send-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          userEmail: selectedMessage.email,
          userName: selectedMessage.name,
          replyContent: sanitizedContent,
          subject: selectedMessage.subject
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Update local state
        setMessages(prev => prev.map(m => 
          m.id === selectedMessage.id ? { ...m, status: 'replied', adminReply: sanitizedContent } : m
        ));
        setSelectedMessage(prev => prev ? { ...prev, status: 'replied', adminReply: sanitizedContent } : null);
        
        // Clear draft
        localStorage.removeItem(`draft_reply_${selectedMessage.id}`);
        setReplyContent("");
        setPreviewMode(false);
        alert("Reply sent successfully!");
      } else {
        alert(data.error || "Failed to send reply");
      }
    } catch (error) {
      console.error("Reply error:", error);
      alert("Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const MessageListSkeleton = () => (
    <div className="space-y-3 p-2 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 bg-white/5 rounded-lg border border-white/5" />
      ))}
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <style jsx global>{`
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 242, 254, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 242, 254, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 lg:p-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-7xl max-h-[95vh] flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          <GlassCard className="flex flex-col h-full border-primary-start/20 shadow-[0_0_50px_rgba(0,242,254,0.1)] bg-[#050505]/95 overflow-hidden">
            {/* Header - Sticky */}
            <div className="p-4 lg:p-6 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0 sticky top-0 z-50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary-start animate-pulse" />
                <h2 className="text-xl font-bold tracking-widest uppercase">
                  Admin <span className="text-primary-start">Gate</span>
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {isAuthenticated && (
                  <>
                    <IconButton 
                      onClick={() => fetchMessages(sessionStorage.getItem("adminToken") || "")}
                      className={cn("hover:bg-white/10 text-white", refreshing && "animate-spin")}
                      title="Refresh"
                    >
                      <RefreshCw size={20} />
                    </IconButton>
                    <IconButton 
                      onClick={handleLogout}
                      className="hover:bg-red-500/20 text-red-400 hover:text-red-300"
                      title="Logout"
                    >
                      <LogOut size={20} />
                    </IconButton>
                  </>
                )}
                <IconButton 
                  onClick={onClose}
                  className="hover:bg-white/10 text-white"
                  title="Close"
                >
                  <X size={24} />
                </IconButton>
              </div>
            </div>

            {/* Content Area */}
            {!isAuthenticated ? (
               // Login Form
               <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                 <Lock size={48} className="text-white/20 mb-8" />
                 <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
                   <div>
                     <input
                       type="password"
                       placeholder="Enter Access Code"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] focus:border-primary-start focus:ring-1 focus:ring-primary-start outline-none transition-all placeholder:tracking-normal placeholder:text-sm text-white"
                       autoFocus
                     />
                   </div>
                   {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                   <button
                     type="submit"
                     disabled={loading}
                     className="w-full min-h-[44px] py-3 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary-start hover:text-white transition-all disabled:opacity-50"
                   >
                     {loading ? "Decrypting..." : "Unlock"}
                   </button>
                 </form>
               </div>
            ) : (
              // Authenticated View - Split Pane
              <div className="flex-1 overflow-y-auto flex relative">
                
                {/* Left Pane: Message List */}
                <div className={cn(
                  "w-full lg:w-1/3 border-r border-white/5 flex flex-col transition-transform duration-300 absolute lg:relative z-10 bg-[#050505] lg:bg-transparent h-full",
                  selectedMessage ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
                )}>
                  <div className="p-4 border-b border-white/5 shrink-0">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Inbox ({messages.length})</h3>
                  </div>
                  {/* Inbox Sidebar Wrapper */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar pb-4 max-h-[calc(100vh-200px)]">
                    <div className="p-2 space-y-2">
                      {refreshing && messages.length === 0 ? (
                        <MessageListSkeleton />
                      ) : messages.length === 0 ? (
                        <div className="text-center py-20 text-white/30 text-sm">No messages yet.</div>
                      ) : (
                        messages.map((msg) => (
                          <div 
                            key={msg.id}
                            onClick={() => {
                               setSelectedMessage(msg);
                               setPreviewMode(false);
                            }}
                            className={cn(
                              "p-4 rounded-lg cursor-pointer border transition-all hover:bg-white/5 min-h-[80px]",
                              selectedMessage?.id === msg.id ? "bg-white/10 border-primary-start/30" : "bg-transparent border-transparent",
                              msg.status === 'unread' && "border-l-2 border-l-primary-start bg-primary-start/5"
                            )}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className={cn("font-bold text-sm truncate pr-2", msg.status === 'unread' ? "text-white" : "text-white/70")}>
                                {msg.name}
                              </h4>
                              <span className="text-[10px] text-white/30 whitespace-nowrap">
                                {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-xs text-white/50 truncate mb-2">{msg.subject}</p>
                            <div className="flex items-center justify-between">
                              <span className={cn(
                                "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full",
                                msg.status === 'done' ? "bg-green-500/20 text-green-400" :
                                msg.status === 'replied' ? "bg-blue-500/20 text-blue-400" :
                                msg.status === 'unread' ? "bg-primary-start/20 text-primary-start" :
                                "bg-white/10 text-white/50"
                              )}>
                                {msg.status}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Pane: Message Detail & Reply */}
                <div className={cn(
                  "w-full lg:w-2/3 flex flex-col transition-transform duration-300 absolute lg:relative h-full bg-[#050505] lg:bg-transparent z-20",
                  selectedMessage ? "translate-x-0" : "translate-x-full lg:translate-x-0"
                )}>
                  {selectedMessage ? (
                    <div className="flex flex-col h-full max-h-[calc(100vh-150px)] overflow-y-auto custom-scrollbar relative">
                      {/* Detail Header - Sticky inside detail view? User asked to separate it. 
                          If I put it outside the scrollable area, it's better. 
                          But user said "Restrukturisasi container detail pesan dengan membatasi tinggi maksimal... Pisahkan area header detail pesan... agar header tetap visible saat scroll."
                          So Header should NOT scroll.
                      */}
                      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#050505] lg:bg-transparent shrink-0 sticky top-0 z-30 backdrop-blur-md">
                        <button 
                          onClick={() => setSelectedMessage(null)}
                          className="lg:hidden flex items-center gap-2 text-white/50 hover:text-white text-sm min-h-[44px] px-2"
                        >
                          <ArrowLeft size={20} /> Back
                        </button>
                        <div className="flex gap-2 ml-auto">
                           {selectedMessage.whatsapp && (
                             <a
                               href={`https://wa.me/${selectedMessage.whatsapp.replace(/\D/g, '')}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors"
                               title="Chat WhatsApp"
                             >
                               <MessageCircle size={20} />
                             </a>
                           )}
                           <IconButton 
                              onClick={() => deleteMessage(selectedMessage.id)}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400"
                              title="Delete"
                           >
                             <Trash2 size={20} />
                           </IconButton>
                           <IconButton 
                              onClick={() => updateStatus(selectedMessage.id, 'done')}
                              className="bg-white/5 hover:bg-green-500/20 hover:text-green-400 text-white/60"
                              title="Mark as Done"
                           >
                             <CheckCircle size={20} />
                           </IconButton>
                        </div>
                      </div>

                      <div className="flex-1 p-6 lg:p-8">
                        {/* Message Info */}
                        <div className="mb-8">
                           <h2 className="text-2xl font-bold text-white mb-2">{selectedMessage.subject}</h2>
                           <div className="flex flex-wrap gap-4 text-sm text-white/50 mb-6">
                             <div className="flex items-center gap-2">
                               <span className="w-2 h-2 rounded-full bg-primary-start" />
                               {selectedMessage.name}
                             </div>
                             <span>&bull;</span>
                             <div>{selectedMessage.email}</div>
                             <span>&bull;</span>
                             <div>{new Date(selectedMessage.createdAt).toLocaleString()}</div>
                           </div>
                           
                           <div className="bg-white/5 p-6 rounded-xl border border-white/5 text-white/80 leading-relaxed whitespace-pre-wrap select-text">
                             {selectedMessage.message}
                           </div>
                        </div>

                        {/* Reply Section - Sticky Bottom */}
                        <div className="border-t border-white/10 pt-6 pb-20 lg:pb-0 sticky bottom-0 bg-[#050505] z-20">
                           <h3 className="text-sm font-bold uppercase tracking-widest text-primary-start mb-4">Reply to {selectedMessage.name}</h3>
                           
                           {/* Quick Snippets */}
                           <div className="flex flex-wrap gap-2 mb-4">
                             {SNIPPETS.map((snippet, i) => (
                               <button
                                 key={i}
                                 onClick={() => setReplyContent(prev => prev + snippet + "\n")}
                                 className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-white/60 hover:text-white transition-colors cursor-pointer min-h-[32px]"
                               >
                                 + {snippet.slice(0, 20)}...
                               </button>
                             ))}
                           </div>

                           {previewMode ? (
                             <div className="bg-[#050505] border border-white/10 rounded-xl p-6 mb-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                               <p className="text-white/40 text-xs mb-4 uppercase tracking-widest">Email Preview</p>
                               <div className="text-white/80 space-y-4 font-sans">
                                  <p>Halo {selectedMessage.name},</p>
                                  <div dangerouslySetInnerHTML={{ __html: replyContent.replace(/\n/g, '<br>') }} />
                                  <div className="pt-4 border-t border-white/10 text-sm text-white/50">
                                    <p className="font-bold text-white">Admin Axonova</p>
                                    <p>Digital Transformation Partner</p>
                                  </div>
                               </div>
                             </div>
                           ) : (
                             <div className="relative">
                               <textarea
                                 value={replyContent}
                                 onChange={(e) => setReplyContent(e.target.value)}
                                 placeholder="Type your reply here..."
                                 className="w-full h-40 bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 outline-none focus:border-primary-start/50 focus:ring-1 focus:ring-primary-start/20 transition-all resize-none font-mono text-sm mb-4"
                               />
                               <div className={cn(
                                 "absolute bottom-6 right-4 text-xs font-mono",
                                 replyContent.length > 5000 ? "text-red-500" : "text-white/30"
                               )}>
                                 {replyContent.length}/5000
                               </div>
                             </div>
                           )}

                           <div className="flex items-center justify-between pb-4">
                             <button
                               onClick={() => setPreviewMode(!previewMode)}
                               className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors min-h-[44px] px-2"
                             >
                               {previewMode ? "Edit Reply" : "Preview Email"}
                             </button>
                             
                             <div className="flex gap-3">
                               {previewMode && (
                                 <button
                                   onClick={sendReply}
                                   disabled={sendingReply || !replyContent.trim() || replyContent.length > 5000 || replyContent.length < 10}
                                   className="px-6 py-2 bg-primary-start text-black font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-h-[44px]"
                                 >
                                   {sendingReply ? (
                                     <>
                                       <RefreshCw size={14} className="animate-spin" /> Sending...
                                     </>
                                   ) : (
                                     <>
                                       Send Reply <Send size={14} />
                                     </>
                                   )}
                                 </button>
                               )}
                               {!previewMode && (
                                 <button
                                   onClick={() => setPreviewMode(true)}
                                   disabled={!replyContent.trim()}
                                   className="px-6 py-2 bg-white/10 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 min-h-[44px]"
                                 >
                                   Review
                                 </button>
                               )}
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/20">
                      <Mail size={48} className="mb-4 opacity-50" />
                      <p className="uppercase tracking-widest text-sm">Select a message to read</p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
