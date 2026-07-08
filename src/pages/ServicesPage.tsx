import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Target, Zap, TrendingUp, CreditCard, X } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function ServicesPage() {
  const [settings, setSettings] = useState<any>(null);
  const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'config'), (snap) => {
      if (snap.exists()) setSettings(snap.data());
    });
    return unsub;
  }, []);

  // 토스 링크페이 주소 연결 함수
  const handlePayment = (orderName: string) => {
    if (orderName === "Standard Brand Film") {
      window.open("https://s.tosspayments.com/Bn0P4kew6Bt", "_blank");
    } else if (orderName === "Premium Commercial Video") {
      window.open("https://s.tosspayments.com/Bn0QBqeY2Ui", "_blank");
    }
  };

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
    <div className="pt-24 sm:pt-32 min-h-screen bg-black text-white relative">
      {/* Editorial Header */}
      <section className="px-6 sm:px-10 md:px-20 mb-6 sm:mb-10 border-b border-white/10 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
             <div className="mb-4 sm:mb-6 flex items-center gap-4">
                <span className="h-[1px] w-8 sm:w-12 bg-navy"></span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-white/40 font-black italic">Infinite Possibilities</span>
              </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black leading-[0.9] sm:leading-[0.85] tracking-ultra mb-8 sm:mb-12 italic whitespace-pre-wrap">
              {settings?.servicesTitle || 'OUR SERVICES'}
            </h1>
            <p className="text-base sm:text-[22px] text-white max-w-2xl leading-relaxed font-bold italic whitespace-pre-wrap">
              {settings?.servicesDesc || `창의적인 기획부터 완성도 높은 제작까지 \n당신의 비전을 실현하는 통합 영상 솔루션을 제공합니다.`}
            </p>
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

      {/* 서비스 및 가격 테이블 */}
      <section className="py-12 sm:py-20 px-6 sm:px-10 md:px-20 bg-black/20">
        <div className="max-w-4xl mx-auto bg-black/40 border border-white/10 rounded-2xl p-8 sm:p-12 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-navy blur-[100px] opacity-10 rounded-full" />
          
          <div className="mb-8 relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard size={14} className="text-navy-light" />
              <h3 className="text-base font-bold uppercase tracking-wider">Service & Pricing</h3>
            </div>
            <p className="text-xs text-white/40 font-light">온라인 결제 이용이 가능한 정찰제 상품 목록입니다.</p>
          </div>
          
          <div className="space-y-4 relative z-10">
            {/* 상품 1 */}
            <div className="p-5 bg-black/60 border border-white/5 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h4 className="font-bold text-sm text-white/90">Standard Brand Film</h4>
                <p className="text-xs text-white/40 mt-1 font-light">기획 및 구성, 1분 내외 연출 및 고감도 브랜딩 영상 편집</p>
                <p className="text-sm font-black text-navy-light mt-2">990,000 원 <span className="text-[10px] font-normal text-white/30">(VAT 포함)</span></p>
              </div>
              <button 
                type="button"
                onClick={() => handlePayment("Standard Brand Film")}
                className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-navy hover:border-transparent text-white text-xs font-bold rounded-lg transition-all active:scale-[0.97]"
              >
                결제하기
              </button>
            </div>

            {/* 상품 2 */}
            <div className="p-5 bg-black/60 border border-white/5 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h4 className="font-bold text-sm text-white/90">Premium Commercial Video</h4>
                <p className="text-xs text-white/40 mt-1 font-light">맞춤형 컨셉 브랜딩, 전문 로케이션 연출 및 시네마틱 영상 제작</p>
                <p className="text-sm font-black text-navy-light mt-2">1,980,000 원 <span className="text-[10px] font-normal text-white/30">(VAT 포함)</span></p>
              </div>
              <button 
                type="button"
                onClick={() => handlePayment("Premium Commercial Video")}
                className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-navy hover:border-transparent text-white text-xs font-bold rounded-lg transition-all active:scale-[0.97]"
              >
                결제하기
              </button>
            </div>
          </div>

          {/* 사업자 정보 푸터 */}
          <footer className="text-[11px] text-white/30 leading-relaxed space-y-1 pt-12 mt-12 border-t border-white/5 relative z-10">
            <p className="font-bold text-white/50 text-xs mb-2 tracking-wide uppercase">oYoung Business Info</p>
            <p>상호명: 오영스튜디오 | 대표자명: 박준영</p>
            <p>사업자등록번호: 382-77-00224 | 통신판매업신고: 면제 대상 (전자상거래법 적용 비대상 업종)</p>
            <p>주소: 서울특별시 영등포구 양평로157 선유도투웨니퍼스트밸리 지하2층, B211호</p>
            <p>고객센터: {settings?.contactPhone || '010-0000-0000'} | 이메일: {settings?.contactEmail || 'contact@oyoungs.com'}</p>
            <div className="pt-3 space-x-3 text-[10px] text-white/40">
              <button type="button" onClick={() => setModalType('terms')} className="underline hover:text-white transition-colors">이용약관</button>
              <button type="button" onClick={() => setModalType('privacy')} className="underline hover:text-white transition-colors">개인정보처리방침</button>
            </div>
          </footer>
        </div>
      </section>

      {/* 약관 팝업 모달창 */}
      <AnimatePresence>
        {modalType && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-neutral-200 text-xs"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-neutral-900 border border-white/10 p-6 sm:p-8 rounded-2xl max-w-xl w-full max-h-[70vh] overflow-y-auto relative"
            >
              <button 
                onClick={() => setModalType(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white p-1"
              >
                <X size={18} />
              </button>
              
              {modalType === 'terms' ? (
                <div>
                  <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">이용약관</h3>
                  <div className="space-y-3 font-light leading-relaxed text-white/60">
                    <p><strong>제 1 조 (목적)</strong><br />본 약관은 oYoung(오영스튜디오)이 운영하는 웹사이트에서 제공하는 영상 제작 서비스 및 관련 용역을 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
                    <p><strong>제 2 조 (서비스의 제공 및 변경)</strong><br />1. 본 회사는 영상 콘텐츠 기획, 촬영, 편집 등의 용역 서비스를 제공합니다.<br />2. 모든 서비스 계약은 상호 별도 서면 계약 및 협의된 견적서를 바탕으로 개별 개시됩니다.</p>
                    <p><strong>제 3 조 (결제 및 환불)</strong><br />1. 이용자는 회사가 제공하는 결제 수단을 통해 용역 대금을 청구 및 지불할 수 있습니다.<br />2. 영상 제작 용역의 특성상 프로젝트 착수 및 작업이 개시된 이후에는 단순 변심에 의한 환불이 불가하며, 수정 및 보완 조건은 계약서 규정에 따릅니다.</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">개인정보처리방침</h3>
                  <div className="space-y-3 font-light leading-relaxed text-white/60">
                    <p>oYoung(오영스튜디오)은 이용자의 개인정보를 소중히 다루며, 개인정보보호법 등 관련 법령을 준수합니다.</p>
                    <p><strong>1. 수집하는 개인정보 항목</strong><br />회사는 프로젝트 문의 및 상담 접수를 위해 이름, 연락처, 이메일 주소를 필수 항목으로 수집합니다.</p>
                    <p><strong>2. 개인정보의 수집 및 이용 목적</strong><br />수집된 개인정보는 오직 영상 제작 상담, 프로젝트 견적 제안, 계약 이행을 위한 의사소통 창구로만 활용됩니다.</p>
                    <p><strong>3. 보유 및 이용 기간</strong><br />원칙적으로 개인정보 수집 및 이용목적이 달성된 후(문의 처리 완료 후 1년 이내) 혹은 이용자의 파기 요청이 있을 시 해당 정보를 지체 없이 파기합니다.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
