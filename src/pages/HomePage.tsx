import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function HomePage() {
  const [settings, setSettings] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    return onSnapshot(doc(db, 'settings', 'config'), (snap) => {
      if (snap.exists()) setSettings(snap.data());
    });
  }, []);

  const renderTextWithNewLines = (text: string, defaultText: string) => {
    const content = text || defaultText;
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center border-b border-white/10 overflow-hidden">
        {/* Interactive Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-bg-dark" />
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0 bg-bg-dark"
          />

          {/* Interactive Mouse Glow */}
          <motion.div 
            className="absolute w-[1200px] h-[1200px] bg-navy-accent/20 blur-[180px] rounded-full pointer-events-none hidden md:block mix-blend-screen"
            animate={{
              x: mousePosition.x - 600,
              y: mousePosition.y - 600,
            }}
            transition={{ type: "spring", damping: 50, stiffness: 40 }}
          />

          {/* Ambient Light Accents */}
          <motion.div 
            className="absolute top-0 right-0 w-full h-full bg-navy/30 blur-[150px] rounded-full opacity-50"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-bg-dark/20 to-transparent" />
        </div>

        <div className="relative z-10 w-full flex items-center justify-center h-full">
          <div className="w-full max-w-5xl px-6 sm:px-10 md:px-20 py-24 sm:py-32 flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="flex flex-col items-center"
            >
              <div className="mb-6 flex items-center justify-center gap-4">
                <span className="h-[1px] w-8 sm:w-12 bg-navy"></span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-navy-accent font-bold italic">
                  {settings?.heroAccent || 'Premium Branding Solutions'}
                </span>
                <span className="h-[1px] w-8 sm:w-12 bg-navy"></span>
              </div>
              {settings?.heroTitleType === 'image' && settings?.heroTitleUrl ? (
                <div className="mb-8 sm:mb-12">
                  <motion.img 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    src={settings.heroTitleUrl} 
                    alt="Hero Title" 
                    className="max-h-[80px] md:max-h-[140px] w-auto object-contain"
                  />
                </div>
              ) : (
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-black leading-[0.9] sm:leading-[0.85] tracking-ultra mb-8 sm:mb-12">
                  {settings?.heroTitle ? renderTextWithNewLines(settings.heroTitle, '') : (
                    <>오영 <br/><span className="text-navy-light">OYOUNG</span></>
                  )}
                </h1>
              )}
              <p className="text-base sm:text-lg text-white/40 max-w-lg mx-auto leading-relaxed font-light italic mb-8 sm:mb-12">
                {settings?.heroDesc ? renderTextWithNewLines(settings.heroDesc, '') : (
                  <>세계를 무대로 하는 영상 제작 및 서비스 솔루션. <br className="hidden sm:block" />우리는 당신의 가치를 가장 혁신적인 방식으로 시각화합니다.</>
                )}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/portfolio" className="px-6 sm:px-10 py-4 sm:py-5 bg-navy text-white text-[14px] sm:text-[16px] uppercase tracking-widest font-black hover:bg-navy-light transition-all flex items-center justify-center gap-3 active:scale-95">
                  포트폴리오 <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="px-6 sm:px-10 py-4 sm:py-5 border border-white/10 text-white text-[14px] sm:text-[16px] uppercase tracking-widest font-black hover:bg-white/5 transition-all text-center active:scale-95">
                  문의하기
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
 
      {/* Intro Section - Vertical Layout with Softer Accents */}
      <section className="py-24 sm:py-40 px-6 sm:px-10 md:px-20 flex flex-col items-center text-center border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl">
          <h2 className="text-[9px] sm:text-[11px] uppercase tracking-[0.4em] text-white font-bold mb-6 sm:mb-10">Our Purpose</h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight leading-tight italic text-white mb-10"
          >
            {settings?.purposeTitle ? renderTextWithNewLines(settings.purposeTitle, '') : (
              <>Beyond Visuals <span className="text-stroke text-transparent">Power</span></>
            )}
          </motion.h3>
          <div className="flex flex-col items-center space-y-6 sm:space-y-8">
             <p className="text-base sm:text-xl text-white leading-relaxed font-light max-w-2xl">
               {settings?.purposeDesc ? renderTextWithNewLines(settings.purposeDesc, '') : (
                 <>오영(oYoung)은 창의적인 기획부터 완성도 높은 제작까지, 당신의 비전을 실현하는 통합 영상 솔루션을 제공합니다. <br className="hidden sm:block" />우리는 단순한 영상을 넘어 브랜드의 본질을 가장 혁신적인 방식으로 시각화합니다.</>
               )}
             </p>
             <Link to="/services" className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-navy-light border-b border-navy-light/30 pb-1 w-fit hover:text-white transition-colors">
               View our services
             </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-10 text-center border-b border-white/5 relative overflow-hidden">
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="max-w-4xl mx-auto"
        >
          <h2 className="text-[8rem] font-bold tracking-tighter opacity-[0.03] leading-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none uppercase italic">Contact</h2>
          <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tight leading-[1.1] mb-12 italic relative z-10">
            {settings?.ctaTitle ? renderTextWithNewLines(settings.ctaTitle, '') : (
              <>Let's build <br/> <span className="text-navy-accent">Impact</span> Together</>
            )}
          </h3>
          <Link to="/contact" className="inline-flex px-12 py-5 bg-navy/80 backdrop-blur-md text-white font-bold uppercase tracking-widest text-[10px] hover:bg-navy transition-all active:scale-95 relative z-10 rounded-full border border-white/10 shadow-xl">
            Start a project
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
