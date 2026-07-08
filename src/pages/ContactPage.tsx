import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle, Mail, Phone, Instagram, Youtube, CreditCard } from 'lucide-react';
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
      loading && setLoading(false);
    }
  };

  // 토스페이먼츠 임시 결제 핸들러
  const handlePayment = (amount: number, orderName: string) => {
    alert(`${orderName} (${amount.toLocaleString()}원) 결제창 연동 테스트 중입니다.`);
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

        <div className="space-y-12">
          {/* 기존 문의 폼 섹션 */}
          <section className="bg-black/40 backdrop-blur-md p-8 sm:p-12 md:p-16 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-navy blur-[100px] opacity-10 rounded-full" />
            
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-8 relative z-10 py-12"
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
                    rows={5}
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

          {/* 1. 토스 심사용 서비스 및 가격 테이블 */}
          <section className="bg-black/20 border border-white/5 rounded-2xl p-8 sm:p-12 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={14} className="text-navy-light" />
                <h3 className="text-base font-bold uppercase tracking-wider">Service & Pricing</h3>
              </div>
              <p className="text-xs text-white/40 font-light">온라인 결제 이용이 가능한 정찰제 상품 목록입니다.</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-5 bg-black/40 border border-white/5 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h4 className="font-bold text-sm text-white/90">Standard Brand Film</h4>
                  <p className="text-xs text-white/40 mt-1 font-light">기획 및 구성, 1분 내외 연출 및 고감도 브랜딩 영상 편집</p>
                  <p className="text-sm font-black text-navy-light mt-2">1,100,000 원 <span className="text-[10px] font-normal text-white/30">(VAT 포함)</span></p>
                </div>
                <button 
                  type="button"
                  onClick={() => handlePayment(1100000, "Standard Brand Film")}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-navy hover:border-transparent text-white text-xs font-bold rounded-lg transition-all active:scale-[0.97]"
                >
                  결제하기
                </button>
              </div>

              <div className="p-5 bg-black/40 border border-white/5 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h4 className="font-bold text-sm text-white/90">Premium Commercial Video</h4>
                  <p className="text-xs text-white/40 mt-1 font-light">맞춤형 컨셉 브랜딩, 전문 로케이션 연출 및 시네마틱 영상 제작</p>
                  <p className="text-sm font-black text-navy-light mt-2">3,300,000 원 <span className="text-[10px] font-normal text-white/30">(VAT 포함)</span></p>
                </div>
                <button 
                  type="button"
                  onClick={() => handlePayment(3300000, "Premium Commercial Video")}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-navy hover:border-transparent text-white text-xs font-bold rounded-lg transition-all active:scale-[0.97]"
                >
                  결제하기
                </button>
              </div>
            </div>
          </section>

          {/* 2. 토스 심사용 하단 필수 사업자 정보 */}
          <footer className="text-[11px] text-white/30 leading-relaxed space-y-1 px-4 pt-4 border-t border-white/5">
            <p className="font-bold text-white/50 text-xs mb-2 tracking-wide uppercase">oYoung Business Info</p>
            <p>상호명: 오영스튜디오 | 대표자명: 박준영</p>
            <p>사업자등록번호: 382-77-00224 | 통신판매업신고: 면제 대상 (전자상거래법 적용 비대상 업종)</p>
            <p>주소: 서울특별시 영등포구 양평로157 선유도투웨니퍼스트밸리 지하2층, B211호</p>
            <p>고객센터: {settings?.contactPhone || '010-0000-0000'} | 이메일: {settings?.contactEmail || 'contact@oyoungs.com'}</p>
            <div className="pt-3 space-x-3 text-[10px] text-white/40">
              <a href="#/terms" className="underline hover:text-white transition-colors">이용약관</a>
              <a href="#/privacy" className="underline hover:text-white transition-colors">개인정보처리방침</a>
            </div>
          </footer>
        </div>

      </div>
    </div>
  );
}
