/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Instagram, Youtube } from 'lucide-react';
import { cn } from './lib/utils';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

// Pages
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import { Logo } from './components/Logo';

function Footer({ settings }: { settings?: any }) {
  return (
    <footer className="relative z-10 px-6 sm:px-10 py-10 border-t border-white/10 bg-black/50 flex flex-col sm:flex-row items-center justify-between text-[9px] uppercase tracking-[0.2em] text-white/30 gap-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center sm:items-start text-center sm:text-left">
        <span>Copyright © 2026 {settings?.siteName?.toUpperCase() || 'OYOUNG STUDIO'}. ALL RIGHTS RESERVED.</span>
        <span className="opacity-50 sm:border-l sm:border-white/10 sm:pl-8">Seoul, Korea</span>
      </div>
      <div className="flex items-center gap-6 sm:gap-8">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
          Server Live
        </div>
        <Link to="/admin" className="hover:text-white transition-colors">Admin Access</Link>
        <div className="flex items-center gap-4 text-white/50">
           {settings?.instagramUrl && (
             <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
               <Instagram size={14} />
             </a>
           )}
           {settings?.youtubeUrl && (
             <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
               <Youtube size={14} />
             </a>
           )}
        </div>
      </div>
    </footer>
  );
}

function Navigation({ settings }: { settings?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '홈', path: '/' },
    { name: '서비스', path: '/services' },
    { name: '포트폴리오', path: '/portfolio' },
    { name: '문의하기', path: '/contact' },
  ];

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 sm:px-10 py-6 sm:py-8 flex justify-between items-center border-b border-white/10",
        scrolled ? "bg-black/90 backdrop-blur-md py-4 sm:py-6" : "bg-transparent"
      )}>
        <div className="flex items-center gap-6 md:gap-12">
          <Link to="/" className="flex items-center">
            <Logo settings={settings} />
          </Link>
          <div className="hidden md:flex gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={cn(
                  "text-[16px] uppercase tracking-[0.2em] font-black transition-all hover:text-navy-light",
                  location.pathname === link.path ? "text-white" : "text-white/40"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex px-4 py-1.5 rounded-full border border-navy bg-navy/20 text-[9px] uppercase tracking-wider font-black text-navy-accent">
            Seoul Est. 2026
          </div>
          <button 
            className="md:hidden text-white"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 bg-black z-[100] flex flex-col p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-16">
              <Logo settings={settings} />
              <button 
                className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <X size={28} />
              </button>
            </div>
            
            <div className="flex flex-col gap-10">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link 
                    to={link.path}
                    className={cn(
                      "text-4xl sm:text-6xl font-black uppercase tracking-tighter transition-all duration-300",
                      location.pathname === link.path ? "text-navy" : "text-white hover:text-navy-light"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pt-10 border-t border-white/10 flex justify-between items-center">
               <div className="flex gap-8">
                 {settings?.instagramUrl && (
                   <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                     <Instagram size={20} className="text-white/40" />
                   </a>
                 )}
                 {settings?.youtubeUrl && (
                   <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                     <Youtube size={20} className="text-white/40" />
                   </a>
                 )}
               </div>
               <div className="text-[10px] uppercase font-black tracking-widest text-white/20 italic">
                 Est. 2026
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'config'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSettings(data);
      }
    }, (error) => {
      console.error("Error fetching settings:", error);
    });

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const adminSnap = await getDoc(doc(db, 'admins', user.uid));
          const isUserAdmin = adminSnap.exists() || user.email === 'jyp3813@gmail.com';
          setIsAdmin(isUserAdmin);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(user.email === 'jyp3813@gmail.com');
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => {
      unsubAuth();
      unsubSettings();
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-bg-dark overflow-x-hidden relative">
        {/* Background Patterns & Accents */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.1] bg-noise"></div>
        <div className="fixed inset-0 z-0 pointer-events-none bg-grid opacity-20"></div>
        
        <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-navy/20 blur-accent -mr-64 -mt-64 z-0 animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-navy/10 blur-accent -ml-32 -mb-32 z-0 animate-pulse" style={{ animationDuration: '15s' }}></div>
        <div className="fixed top-1/2 left-1/4 w-[400px] h-[400px] bg-navy-accent/5 blur-accent z-0"></div>

        <Navigation settings={settings} />
        <main className="relative z-10">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin/*" element={<AdminPage isAdmin={isAdmin} />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer settings={settings} />
      </div>
    </Router>
  );
}
