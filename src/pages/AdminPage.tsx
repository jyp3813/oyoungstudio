import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, LayoutDashboard, Briefcase, Settings, LogOut, Plus, Trash2, Edit, Save, 
  X, ExternalLink, Mail, User, ShieldAlert, ChevronUp, ChevronDown 
} from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { 
  collection, query, orderBy, onSnapshot, doc, 
  setDoc, deleteDoc, serverTimestamp, getDocs
} from 'firebase/firestore';
import { cn, formatDate } from '../lib/utils';
import { Logo } from '../components/Logo';

interface AdminPageProps {
  isAdmin: boolean;
}

export default function AdminPage({ isAdmin }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(auth.currentUser);
  const [settings, setSettings] = useState<any>({
    siteName: 'OYOUNG STUDIO',
    systemLogo: 'OYOUNG',
    logoType: 'image',
    logoUrl: '/logo.png',
    heroAccent: 'Premium Branding Solutions',
    heroTitle: '오영 \n OYOUNG',
    heroDesc: '세계를 무대로 하는 영상 제작 및 브랜딩 솔루션. \n 우린 당신의 가치를 가장 혁신적인 방식으로 시각화합니다.',
    strategyTitle: '감각적인 영상미와 전략적 브랜딩의 만남.',
    executionTitle: '최고의 기술력이 빚어내는 혁신적인 결과물.',
    purposeTitle: 'Beyond \n Visuals \n Power',
    purposeDesc: '오영(oYoung)은 감각적인 영상미와 전략적 브랜딩이 만나는 지점에서 탄생했습니다. \n 우리는 단순한 영상을 넘어 브랜드의 영혼을 시각화합니다.',
    ctaTitle: "Let's build \n Impact Together",
    primaryColor: '#1a4382',
    secondaryColor: '#000000',
    accentColor: '#60a5fa',
    fontSans: 'Inter',
    fontDisplay: 'Playfair Display',
    servicesTitle: 'OUR SERVICES',
    servicesDesc: '오영은 창의적인 기획부터 완성도 높은 제작까지 \n 당신의 비전을 실현하는 통합 영상 솔루션을 제공합니다.',
    servicesPhilosophy: '기술은 시대를 반영하지만, \n 진정한 감동은 기술 너머의 철학에서 나옵니다.',
    contactDesc: '오영의 시점은 당신의 브랜드로부터 시작됩니다. \n 프로젝트에 대한 아이디어를 공유해 주세요.',
    contactPhone: '02-1234-5678',
    contactEmail: 'contact@oyoung.com'
  });

  useEffect(() => {
    (window as any).setActiveTab = setActiveTab;
    const unsubAuth = auth.onAuthStateChanged((u) => setUser(u));
    const unsubSettings = onSnapshot(doc(db, 'settings', 'config'), (snap) => {
      if (snap.exists()) setSettings(snap.data());
    });
    return () => {
      unsubAuth();
      unsubSettings();
    };
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => signOut(auth);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-navy blur-[150px] opacity-10 -mr-20 -mt-20"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#08080a] border border-white/10 p-16 text-center rounded-3xl relative z-10 shadow-2xl"
        >
          <div className="mb-12">
            <Logo className="text-4xl justify-center" />
          </div>
          <div className="w-20 h-20 rounded-full bg-navy/10 flex items-center justify-center mx-auto mb-10 border border-navy/20">
            <Lock className="text-navy-light" size={24} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-ultra mb-4">Admin Access</h1>
          <p className="text-white/20 text-[10px] uppercase font-black tracking-widest mb-12 italic">System Authorization Required</p>
          <button 
            onClick={handleLogin}
            className="w-full py-5 bg-navy text-white font-black uppercase tracking-widest text-[10px] hover:bg-navy-light transition-all rounded-full flex items-center justify-center gap-3 shadow-lg shadow-navy/20 active:scale-95"
          >
            Authenticate with Google
          </button>
        </motion.div>
      </div>
    );
  }

  if (user && !isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#08080a] border border-white/10 p-16 text-center rounded-3xl">
          <ShieldAlert className="text-red-500 mx-auto mb-8" size={64} />
          <h1 className="text-2xl font-bold uppercase tracking-tight mb-4">Unauthorized</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-10 leading-relaxed">
            관리자 권한이 없습니다. <br/>
            UID: <span className="text-navy-accent select-all font-mono">{user.uid}</span>
          </p>
          <button onClick={handleLogout} className="text-[10px] uppercase tracking-[0.3em] font-bold text-navy-accent border-b border-navy-accent/30 pb-1">Sign Out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-bg-dark pt-16 lg:pt-20">
      <aside className="w-full lg:w-72 border-b lg:border-r lg:border-b-0 border-white/5 flex flex-col bg-black/40 backdrop-blur-md overflow-y-auto lg:h-full max-h-[40vh] lg:max-h-none shrink-0">
        <header className="p-6 lg:p-10 border-b border-white/5 bg-gradient-to-br from-navy/10 to-transparent hidden lg:block">
           <div className="flex items-center gap-4 mb-4">
              <Logo settings={settings} className="text-[14px]" />
           </div>
           <p className="text-white/20 text-[9px] uppercase tracking-widest font-bold leading-relaxed px-1">
              Management Core v2.8.0
           </p>
        </header>

        <div className="px-8 mt-12 mb-16 hidden lg:block">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 group hover:border-navy/50 transition-all cursor-default">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-navy/20 flex items-center justify-center text-white/80 font-black border border-navy/20 text-lg shadow-inner group-hover:bg-navy/40 transition-colors">
                {user.displayName?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-[8px] uppercase font-black tracking-[0.2em] text-navy-accent italic mb-1">Authenticated</p>
                <p className="text-[11px] truncate font-black text-white uppercase tracking-tight">{user.displayName || 'Administrator'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible p-4 lg:px-4 lg:py-0 space-x-2 lg:space-x-0 lg:space-y-2 no-scrollbar">
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'portfolio', label: 'Projects', icon: Briefcase },
            { id: 'inquiries', label: 'Messages', icon: Mail },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex-none lg:flex items-center gap-3 lg:gap-5 px-6 lg:px-8 py-3 lg:py-5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-xl relative group",
                activeTab === item.id 
                  ? "bg-navy text-white shadow-xl shadow-navy/20" 
                  : "text-white/30 hover:bg-white/5 hover:text-white"
              )}
            >
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-tab"
                  className="absolute bottom-0 lg:bottom-auto lg:left-0 h-1 lg:h-6 w-full lg:w-1 bg-navy-accent rounded-t-full lg:rounded-r-full"
                />
              )}
              <item.icon size={13} className={cn(activeTab === item.id ? "text-white" : "text-white/20 group-hover:text-white")} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 lg:p-6 flex flex-row lg:flex-col gap-4 lg:space-y-4">
          <a 
            href="/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 lg:gap-5 px-6 lg:px-8 py-3 lg:py-5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white bg-white/5 rounded-xl transition-all"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">Visit Site</span>
          </a>
          <button 
            onClick={handleLogout}
            className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 lg:gap-5 px-6 lg:px-8 py-3 lg:py-5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-black/20 p-6 sm:p-10 lg:p-16">
        <header className="mb-8 lg:mb-16 border-b border-white/5 pb-8 lg:pb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
           <div>
              <div className="mb-3 lg:mb-4 flex items-center gap-4">
                <span className="h-[1px] w-8 bg-navy-accent/50"></span>
                <span className="text-[8px] lg:text-[9px] uppercase tracking-[0.4em] text-navy-accent font-bold italic">Management Core</span>
              </div>
              <h2 className="text-2xl lg:text-4xl font-bold uppercase tracking-tight italic">{activeTab}</h2>
           </div>
           <div className="text-[8px] lg:text-[9px] bg-white/5 px-4 py-2 border border-white/10 rounded-full text-white/40 font-bold uppercase tracking-widest self-end sm:self-auto">
             OYOUNG OS v2.6.0
           </div>
        </header>
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <DashboardView key="dashboard" />}
          {activeTab === 'portfolio' && <PortfolioManager key="portfolio" />}
          {activeTab === 'inquiries' && <InquiryList key="inquiries" />}
          {activeTab === 'settings' && <SettingsEditor key="settings" settings={settings} setSettings={setSettings} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function DashboardView() {
  const [stats, setStats] = useState({ portfolio: 0, inquiries: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const p = await getDocs(collection(db, 'portfolio'));
      const i = await getDocs(collection(db, 'inquiries'));
      setStats({ portfolio: p.size, inquiries: i.size });
    };
    fetchStats();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-16"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { label: 'Live Projects', value: stats.portfolio, icon: Briefcase, color: 'navy', tab: 'portfolio' },
          { label: 'Unread Messages', value: stats.inquiries, icon: Mail, color: 'navy-accent', tab: 'inquiries' },
        ].map((s, idx) => (
          <button 
            key={idx} 
            onClick={() => (window as any).setActiveTab?.(s.tab)}
            className="w-full text-left bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-8 lg:p-12 rounded-3xl relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-navy blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity"></div>
            <div className="flex justify-between items-start mb-8 lg:mb-12 relative z-10">
               <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/80 group-hover:bg-navy group-hover:text-white transition-all">
                 <s.icon size={18} />
               </div>
               <div className="flex flex-col items-end">
                 <span className="text-[8px] lg:text-[9px] uppercase font-black tracking-[0.3em] text-white/20 italic">Global Analytics</span>
                 <div className="mt-1 lg:mt-2 flex items-center gap-2 text-green-500">
                   <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[7px] lg:text-[8px] uppercase font-black tracking-widest">Active</span>
                 </div>
               </div>
            </div>
            <div className="relative z-10">
              <p className="text-[9px] lg:text-[10px] uppercase tracking-ultra font-black text-white/40 mb-2 lg:mb-3">{s.label}</p>
              <p className="text-6xl lg:text-8xl font-black tracking-ultra leading-none">{s.value}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
          <h3 className="text-[11px] uppercase tracking-ultra text-navy-accent font-black mb-10">System Activity</h3>
          <div className="space-y-6">
             <div className="flex items-center gap-6 text-[11px] text-white/50 border-b border-white/5 pb-6">
               <span className="w-2 h-2 rounded-full bg-navy shadow-[0_0_10px_rgba(0,0,128,1)]"></span>
               <span className="font-mono text-white/20">10:24 AM</span>
               <span className="font-black italic text-white/80 uppercase tracking-widest">Update</span>
               <span className="truncate">Portfolio system sync finalized</span>
             </div>
             <div className="flex items-center gap-6 text-[11px] text-white/50 border-b border-white/5 pb-6">
               <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)]"></span>
               <span className="font-mono text-white/20">09:12 AM</span>
               <span className="font-black italic text-white/80 uppercase tracking-widest">Inquiry</span>
               <span className="truncate">New message received in buffer</span>
             </div>
          </div>
        </div>

        <div className="p-10 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
          <h3 className="text-[11px] uppercase tracking-ultra text-white/40 font-black mb-10">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => (window as any).setActiveTab?.('portfolio')}
              className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-navy hover:bg-navy/10 transition-all gap-3 cursor-pointer"
            >
              <Plus size={20} className="text-navy-accent" />
              <span className="text-[9px] uppercase font-black tracking-widest">Add Project</span>
            </button>
            <button 
              onClick={() => (window as any).setActiveTab?.('inquiries')}
              className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-navy hover:bg-navy/10 transition-all gap-3 cursor-pointer"
            >
              <Mail size={20} className="text-navy-accent" />
              <span className="text-[9px] uppercase font-black tracking-widest">Check Mail</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PortfolioManager() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  
  const [filter, setFilter] = useState('All');
  const categories = ['BRAND FILM', 'PROMOTIONAL VIDEO', 'MUSIC VIDEO/LIVE CLIP', 'INTERVIEW', 'YOUTUBE/SNS', 'LIVE STREAMING'];

  const toSafeDate = (val: any) => {
    try {
      if (!val) return new Date();
      let d: Date;
      if (typeof val === 'string') d = new Date(val);
      else if (val && typeof val.toDate === 'function') d = val.toDate();
      else if (val && val.seconds) d = new Date(val.seconds * 1000);
      else d = new Date(val);
      
      return isNaN(d.getTime()) ? new Date() : d;
