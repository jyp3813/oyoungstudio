import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layers, Target, Zap, TrendingUp } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function ServicesPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'config'), (snap) => {
      if (snap.exists()) setSettings(snap.data());
    });
    return unsub;
  }, []);

  const steps = [
    {
      icon: <Layers size={24} />,
      title: "기획 & 연출",
      desc: "브랜드의 핵심 가치를 파헤치고, 독창적인 스토리텔링을 통해 소비자의 감성을 자극하는 최적의 컨셉을 도출합니다."
    },
    {
      icon: <Target size={24} />,
      title: "영상 촬영",
      desc: "시네마틱한 영상미를 위해 최신 장비와 전문 인력을 투입하여 현장의 생동감과 브랜드의 이미지를 최고로 담아냅니다."
    },
    {
      icon: <Zap size={24} />,
      title: "종합 편집",
      desc: "색보정(DI), 2D/3D 그래픽, 사운드 믹싱을 통해 영상의 완성도를 높이고 메시지를 더욱 강력하게 전달합니다."
    },
    {
      icon: <TrendingUp size={24} />,
      title: "브랜딩 솔루션",
      desc: "제작된 영상을 기반으로 온/오프라인 통합 브랜딩 전략을 제안하여 브랜드의 일관된 가치를 시장에 확산시킵니다."
    }
  ];

  return (
    <div className="pt-24 sm:pt-32 min-h-screen bg-black">
      {/* Editorial Header */}
      <section className="px-6 sm:px-10 md:px-20 mb-6 sm:mb-10 border-b border-white/10 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 sm:gap-20 items-center">
          <div className="flex-1">
             <div className="mb-4 sm:mb-6 flex items-center gap-4">
                <span className="h-[1px] w-8 sm:w-12 bg-navy"></span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-white/40 font-black italic">Infinite Possibilities</span>
              </div>
            <h1 className="text-[clamp(2.5rem,10vw,5rem)] font-black leading-[0.9] sm:leading-[0.85] tracking-ultra mb-8 sm:mb-12 italic uppercase whitespace-pre-wrap">
              {settings?.servicesTitle || 'OUR SERVICES'}
            </h1>
            <p className="text-base sm:text-lg text-white/40 max-w-lg leading-relaxed font-light italic whitespace-pre-wrap">
              {settings?.servicesDesc || `오영은 창의적인 기획부터 완성도 높은 제작까지 \n 당신의 비전을 실현하는 통합 영상 솔루션을 제공합니다.`}
            </p>
          </div>
          <div className="flex-1 w-full aspect-[4/5] bg-bg-dark border border-white/10 relative overflow-hidden rounded-2xl">
             <img 
               src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000" 
               className="w-full h-full object-cover grayscale opacity-20 hover:grayscale-0 hover:opacity-50 transition-all duration-1000"
               alt="Services Overview"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent" />
             <div className="absolute inset-x-6 sm:inset-x-10 bottom-6 sm:bottom-10 p-6 sm:p-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
               <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black text-navy-light block mb-2">Total Creative Solution</span>
               <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white/40 leading-relaxed">From initial concept to final delivery, ensuring every frame aligns with your mission.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-12 sm:py-20 px-6 sm:px-10 md:px-20 bg-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-bg-dark p-8 sm:p-12 hover:bg-navy/10 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-navy-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                <div className="text-navy-accent mb-10 group-hover:scale-110 transition-transform">{step.icon}</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">{step.title}</h3>
                <p className="text-xs text-white/30 leading-relaxed group-hover:text-white/60 transition-colors font-bold uppercase tracking-widest">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
