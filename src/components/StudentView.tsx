import React, { useState, useRef, useEffect } from "react";
import { Upload, Send, Image as ImageIcon, X, Loader2, AlertTriangle, Brain, Sparkles } from "lucide-react";
import { getTutorResponse } from "../services/gemini";
import { saveInteraction, getInteractions, Interaction } from "../store";
import { motion, AnimatePresence } from "motion/react";

export default function StudentView() {
  const [query, setQuery] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Interaction[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadHistory = () => setHistory(getInteractions());
    loadHistory();
    window.addEventListener("titantrack_updated", loadHistory);
    return () => window.removeEventListener("titantrack_updated", loadHistory);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isLoading]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !imageFile) return;

    setIsLoading(true);
    setError(null);

    try {
      let base64Data: string | undefined;
      let mimeType: string | undefined;

      if (imageFile) {
        base64Data = (imagePreview as string).split(",")[1];
        mimeType = imageFile.type;
      }

      const result = await getTutorResponse(query, base64Data, mimeType, history);

      saveInteraction({
        ...result,
        studentQuery: query,
        hasImage: !!imageFile,
      });
      
      setQuery("");
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      removeImage();
    } catch (err: any) {
      setError(err.message || "An error occurred while processing your request. Please try again or rephrase your question.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden flex flex-col items-center">
      {/* Atmospheric Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />

      {/* Chat Area */}
      <div className="flex-1 w-full max-w-4xl overflow-y-auto hide-scrollbar scroll-smooth px-4 pt-8 pb-40 z-10">
        <AnimatePresence initial={false}>
          {history.length === 0 && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center mt-20"
            >
              <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                <Sparkles className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-3 text-glow">How can I help you think today?</h2>
              <p className="text-slate-400 max-w-md">
                Upload a picture of where you're stuck, or type your question below. I won't give you the answer, but I'll help you find it.
              </p>
            </motion.div>
          )}

          {history.map((interaction) => (
            <div key={interaction.id} className="space-y-8 mb-8 flex flex-col">
              {/* Student Message */}
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", bounce: 0.3 }}
                className="self-end max-w-[85%] md:max-w-[75%] flex items-end gap-3"
              >
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl rounded-br-sm p-5 shadow-[0_10px_40px_rgba(99,102,241,0.2)]">
                  {interaction.hasImage && (
                    <div className="flex items-center gap-2 mb-3 text-indigo-100 text-xs font-medium bg-black/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Image attached</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">{interaction.studentQuery || "Uploaded an image"}</p>
                </div>
              </motion.div>

              {/* Tutor Message */}
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", bounce: 0.3, delay: 0.1 }}
                className="self-start max-w-[90%] md:max-w-[80%] flex items-end gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mb-1 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                  <span className="text-indigo-300 font-display font-bold text-lg">T</span>
                </div>
                <div className="glass-panel rounded-3xl rounded-bl-sm p-6 shadow-2xl">
                  <p className="text-slate-200 leading-relaxed whitespace-pre-wrap text-[15px]">
                    {interaction.socratic_response}
                  </p>
                  {interaction.is_jailbreak_attempt && (
                    <div className="mt-4 flex items-center gap-3 text-amber-300 bg-amber-500/10 p-3 rounded-xl text-sm border border-amber-500/20">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>Academic Integrity Notice: Please focus on learning the concepts.</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          ))}

          {isLoading && (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="self-start max-w-[90%] md:max-w-[80%] flex items-end gap-4 mb-8"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mb-1">
                <span className="text-indigo-300 font-display font-bold text-lg">T</span>
              </div>
              <div className="glass-panel rounded-3xl rounded-bl-sm p-5 flex items-center gap-3 text-slate-400">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm font-medium">Analyzing...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Floating Input Dock */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-50">
        <form onSubmit={handleSubmit} className="relative">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-14 left-0 right-0 p-3 bg-red-500/10 text-red-400 rounded-xl text-sm border border-red-500/20 flex items-center gap-2 backdrop-blur-md"
            >
              <AlertTriangle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          <div className="bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-2 shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all focus-within:border-indigo-500/50 focus-within:bg-[#0f172a]/95">
            {imagePreview && (
              <div className="px-4 pt-4 pb-2">
                <div className="relative inline-block group">
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    className="h-20 w-auto object-cover rounded-xl border border-white/10 shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-slate-800 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:scale-110 shadow-lg"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={query}
                  onChange={handleInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Ask a question..."
                  className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 px-4 py-3 outline-none resize-none min-h-[48px] hide-scrollbar text-[15px]"
                  disabled={isLoading}
                  rows={1}
                />
              </div>

              <div className="flex items-center gap-2 pb-1 pr-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 cursor-pointer transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                </label>

                <button
                  type="submit"
                  disabled={isLoading || (!query.trim() && !imageFile)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] disabled:shadow-none"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
