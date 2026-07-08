import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle, Mail, Phone, Instagram, Youtube } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'config'), (snap) => {
      if (snap.exists()) setSettings(snap.data());
    });
    return unsub;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save to Firebase for Admin Panel
      await addDoc(collection(db, 'inquiries'), {
        ...form,
        createdAt: serverTimestamp()
      });

      // Send to Formspree
      const response = await fetch('https://formspree.io/f/mvzldboa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error('Formspree submission failed');
      }

      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'inquiries');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 sm:pt-40 min-h-screen bg-bg-dark text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-20 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-16 lg:gap-32 mb-24 sm:mb-40">
        <aside>
          <div className="mb-4 sm:mb-6 flex items-center gap-4">
             <span className="h-[1px] w-8 sm:w-12 bg-navy"></span>
             <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-navy-light font-black italic">Get in Touch</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[clamp(1.8rem,8vw,3.2rem)] font-black uppercase tracking-tight leading-[1.2] mb-12 sm:mb-16 italic"
          >
            프로젝트를 함께 <br/> 시작해볼까요?
          </motion.h1>
          <div className="space-y-10 sm:space-y-16">
            <p className="text-lg sm:text-xl text-white/40 max-w-sm leading-relaxed font-light italic whitespace-pre-wrap">
              {settings?.contactDesc || `오영의 시점은 당신의 브랜드로부터 시작됩니다. \n 프로젝트에 대한 아이디어를 공유해 주세요.`}
            </p>
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center gap-4 sm:gap-6 group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-navy group-hover:border-navy transition-all shadow-lg">
                  <Mail size={18} className="group-hover:text-white" />
                </div>
                <div>
                  <p className="text-[8px] sm:text-[9px] uppercase font-bold tracking-[0.2em] text-white/20 italic mb-1">Email Us</p>
                  <p className="text-lg sm:text-xl font-black tracking-tighter">{settings?.contactEmail || 'contact@oyoungs.com'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-navy group-hover:border-navy transition-all shadow-lg">
                  <Phone size={18} className="group-hover:text-white" />
                </div>
                <div>
                  <p className="text-[8px] sm:text-[9px] uppercase font-bold tracking-[0.2em] text-white/20 italic mb-1">Call Us</p>
                  <p className="text-lg sm:text-xl font-black tracking-tighter">{settings?.contactPhone || '010-0000-0000'}</p>
                </div>
              </div>
            </div>

            <div className="pt-10 sm:pt-16 border-t border-white/5">
              <p className="text-[9px] sm:text-[10px] uppercase font-black tracking-[0.4em] text-white/20 italic mb-6 sm:mb-8">Social Presence</p>
              <div className="flex gap-4">
                <a 
                  href={settings?.instagramUrl || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-navy hover:border-transparent hover:scale-110 transition-all duration-500 group"
                >
                  <Instagram size={20} className="text-white/40 group-hover:text-white" />
                </a>
                <a 
                  href={settings?.youtubeUrl || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-navy hover:border-transparent hover:scale-110 transition-all duration-500 group"
                >
                  <Youtube size={20} className="text-white/40 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </aside>

        <section className="bg-black/40 backdrop-blur-md p-8 sm:p-12 md:p-20 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-navy blur-[100px] opacity-10 rounded-full" />
          
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-8 relative z-10"
            >
              <div className="w-24 h-24 rounded-full bg-navy/20 border border-navy/30 flex items-center justify-center mb-4">
                <CheckCircle size={40} className="text-navy-accent" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-ultra italic">Sent Successfully</h2>
              <p className="text-white/40 text-[11px] uppercase tracking-widest font-bold max-w-xs mx-auto leading-relaxed">
                문의하신 내용이 정상적으로 접수되었습니다. <br/> 빠른 시일 내에 담당자가 연락드리겠습니다.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-[10px] uppercase font-black tracking-[0.4em] text-navy-accent pt-12 hover:text-white transition-colors"
                type="button"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white ml-1">이름</label>
                  <input 
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder="홍길동"
                    className="w-full bg-black/60 border border-white/5 rounded-xl py-4 px-6 focus:outline-none focus:ring-1 focus:ring-navy/50 transition-all placeholder:text-white/50 text-sm font-medium text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white ml-1">연락처</label>
                  <input 
                    required
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    placeholder="010-0000-0000"
                    className="w-full bg-black/60 border border-white/5 rounded-xl py-4 px-6 focus:outline-none focus:ring-1 focus:ring-navy/50 transition-all placeholder:text-white/50 text-sm font-medium text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white ml-1">이메일</label>
                <input 
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="example@email.com"
                  className="w-full bg-black/60 border border-white/5 rounded-xl py-4 px-6 focus:outline-none focus:ring-1 focus:ring-navy/50 transition-all placeholder:text-white/50 text-sm font-medium text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white ml-1">프로젝트 내용</label>
                <textarea 
                  required
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  placeholder="어떤 프로젝트를 구상 중이신가요?"
                  rows={6}
                  className="w-full bg-black/60 border border-white/5 rounded-xl py-4 px-6 focus:outline-none focus:ring-1 focus:ring-navy/50 transition-all placeholder:text-white/50 text-sm font-medium resize-none text-white"
                />
              </div>

              <button 
                disabled={loading}
                className="w-full py-5 bg-navy text-white flex items-center justify-center gap-4 font-bold text-sm hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 rounded-xl shadow-xl shadow-black/20 mt-4"
              >
                {loading ? "전송 중..." : "문의 보내기"}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
