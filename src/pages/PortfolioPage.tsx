import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Filter, Plus } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'portfolio'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedDocs = [...docs].sort((a: any, b: any) => {
        const orderA = a.order ?? 999999;
        const orderB = b.order ?? 999999;
        return orderA - orderB;
      });
      setProjects(sortedDocs);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'portfolio');
    });

    return unsub;
  }, []);

  const categories = ['All', 'BRAND FILM', 'MUSIC VIDEO/LIVE CLIP', 'INTERVIEW', 'PROMOTIONAL VIDEO', 'YOUTUBE/SNS', 'LIVE STREAMING'];

  const filteredProjects = filter === 'All' 
    ? projects.length > 0 ? projects : [
        { title: "The Modern Soul", category: "BRAND FILM", thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000", id: 1, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { title: "Urban Dynamics", category: "PROMOTIONAL VIDEO", thumbnail: "https://images.unsplash.com/photo-1533750516457-a7f992034fce?auto=format&fit=crop&q=80&w=1000", id: 2, videoUrl: "" },
        { title: "Neon Nights", category: "MUSIC VIDEO/LIVE CLIP", thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000", id: 3, videoUrl: "" },
        { title: "Broadcast Special", category: "LIVE STREAMING", thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000", id: 5, videoUrl: "" },
        { title: "Craftsmanship", category: "BRAND FILM", thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000", id: 4, videoUrl: "" },
        { title: "Live Event X", category: "LIVE STREAMING", thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000", id: 6, videoUrl: "" },
      ]
    : projects.filter(p => p.category?.toUpperCase() === filter.toUpperCase());

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    try {
      const videoUrl = new URL(url);
      let videoId = '';

      if (videoUrl.hostname.includes('youtube.com')) {
        videoId = videoUrl.searchParams.get('v') || '';
      } else if (videoUrl.hostname.includes('youtu.be')) {
        videoId = videoUrl.pathname.slice(1);
      } else if (videoUrl.hostname.includes('vimeo.com')) {
        videoId = videoUrl.pathname.split('/').pop() || '';
        return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
      }

      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
    } catch {
      // Fallback for non-standard formats
      if (url.includes('v=')) return `https://www.youtube.com/embed/${url.split('v=')[1].split('&')[0]}?autoplay=1`;
      return null;
    }
  };

  if (loading && projects.length === 0) {
      return <div className="pt-40 px-10 text-white/20 italic">Loading gallery...</div>;
  }

  return (
    <div className="pt-24 sm:pt-32 pb-20 px-4 sm:px-12 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 sm:mb-32 border-b border-white/10 pb-12 sm:pb-20">
          <div className="mb-4 sm:mb-6 flex items-center gap-4">
            <span className="h-[1px] w-8 sm:w-12 bg-navy"></span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-white/40 font-black italic">Selected Works</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(2rem,10vw,5rem)] font-black uppercase tracking-ultra leading-[1] mb-8 sm:mb-12 italic"
          >
            Portfolio
          </motion.h1>
          
          <div className="flex flex-col gap-6 pt-4 sm:pt-8 bg-bg">
            <div className="flex items-center gap-4">
              <Filter size={14} className="text-navy-accent shrink-0" />
              <button
                onClick={() => setFilter('All')}
                className={`text-[10px] sm:text-[12px] uppercase tracking-[0.3em] font-black px-8 sm:px-16 py-2 sm:py-2.5 rounded-full border transition-all active:scale-95 ${
                  filter === 'All' ? "bg-navy text-white border-transparent shadow-2xl shadow-navy/40" : "text-white/40 border-white/5 hover:bg-navy-accent/10 hover:border-navy-accent/50 hover:text-white"
                }`}
              >
                All Works
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {categories.filter(cat => cat !== 'All').map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-[9px] sm:text-[11px] uppercase tracking-[0.15em] font-black px-4 sm:px-6 py-3 sm:py-4 rounded-xl border transition-all text-center flex items-center justify-center min-h-[44px] sm:min-h-0 active:scale-[0.98] ${
                    filter === cat ? "bg-navy text-white border-transparent shadow-2xl shadow-navy/40" : "text-white/40 border-white/5 hover:bg-navy-accent/10 hover:border-navy-accent/50 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id || idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="group relative aspect-video bg-bg-dark overflow-hidden border border-white/10 rounded-2xl cursor-pointer"
              onClick={() => project.videoUrl ? setSelectedVideo(project.videoUrl) : null}
            >
              <img 
                src={project.thumbnail} 
                alt={project.title}
                className="w-full h-full object-cover opacity-70 grayscale-0 sm:opacity-30 sm:grayscale group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 sm:opacity-80" />
              
              <div className="absolute bottom-0 left-0 px-6 pb-6 sm:p-10 w-full translate-y-0 sm:translate-y-14 group-hover:translate-y-0 transition-all duration-700 ease-[0.22, 1, 0.36, 1] isolate">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:hidden -z-10" />
                <span 
                  onClick={(e) => {
                    if (filter === 'All') {
                      e.stopPropagation();
                      setFilter(project.category);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="text-[8px] uppercase tracking-[0.3em] font-black text-navy mb-1 sm:mb-2 block italic hover:text-white transition-colors"
                >
                  {project.category}
                </span>
                <h3 
                  className="title-responsive font-black tracking-tighter mb-1 sm:mb-4 whitespace-pre-wrap"
                  style={project.titleFontSize ? { '--custom-size': project.titleFontSize } as React.CSSProperties : {}}
                >
                  {project.title}
                </h3>
                {project.videoUrl && (
                  <div className="hidden sm:flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-navy hover:text-white transition-all cursor-pointer">
                      <Play size={14} fill="currentColor" />
                    </div>
                    <span className="text-[9px] uppercase font-black tracking-widest text-white/40">
                      Play Video
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-6xl aspect-video bg-black shadow-2xl"
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors flex items-center gap-2 text-[10px] uppercase tracking-widest font-black"
              >
                Close <Plus className="rotate-45" size={16} />
              </button>
              {getEmbedUrl(selectedVideo) ? (
                <iframe
                  src={getEmbedUrl(selectedVideo)!}
                  className="w-full h-full border-none"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 italic">
                  Video format not supported or invalid URL
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
