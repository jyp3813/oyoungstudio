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
      {/* Sidebar / Mobile Nav */}
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

      {/* Content Area */}
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
  const categories = ['BRAND FILM', 'MUSIC VIDEO/LIVE CLIP', 'INTERVIEW', 'PROMOTIONAL VIDEO', 'YOUTUBE/SNS', 'LIVE STREAMING'];

  const toSafeDate = (val: any) => {
    try {
      if (!val) return new Date();
      let d: Date;
      if (typeof val === 'string') d = new Date(val);
      else if (val && typeof val.toDate === 'function') d = val.toDate();
      else if (val && val.seconds) d = new Date(val.seconds * 1000);
      else d = new Date(val);
      
      return isNaN(d.getTime()) ? new Date() : d;
    } catch {
      return new Date();
    }
  };

  const toInputDate = (val: any) => {
    try {
      if (!val) return '';
      let d: Date;
      if (val && typeof val.toDate === 'function') d = val.toDate();
      else d = new Date(val);
      
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'portfolio'), orderBy('date', 'desc'));
    return onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const sortedDocs = [...docs].sort((a: any, b: any) => {
        const orderA = a.order ?? 999999;
        const orderB = b.order ?? 999999;
        return orderA - orderB;
      });
      setItems(sortedDocs);
    });
  }, []);

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const currentItem = items[index];
    const targetItem = items[targetIndex];

    const currentOrder = currentItem.order ?? index;
    const targetOrder = targetItem.order ?? targetIndex;

    const newCurrentOrder = direction === 'up' ? targetOrder - 1 : targetOrder + 1;
    
    try {
      await setDoc(doc(db, 'portfolio', currentItem.id), { ...currentItem, order: newCurrentOrder }, { merge: true });
      if (typeof targetItem.order === 'undefined') {
        await setDoc(doc(db, 'portfolio', targetItem.id), { ...targetItem, order: currentOrder }, { merge: true });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'portfolio');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'portfolio', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `portfolio/${id}`);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <div className="flex justify-between items-end pb-8 border-b border-white/5">
        <header>
          <div className="flex items-center gap-4 mb-3">
             <span className="h-[1px] w-8 bg-navy"></span>
             <span className="text-[10px] uppercase tracking-ultra font-black text-white/40 italic">Global Collection</span>
          </div>
          <h2 className="text-4xl font-black uppercase tracking-ultra italic">Portfolio</h2>
        </header>
        <button 
          onClick={() => setEditing({ title: '', category: 'Brand Film', videoUrl: '', thumbnail: '', date: new Date().toISOString(), order: items.length })}
          className="flex items-center gap-3 px-10 py-5 bg-navy text-white text-[10px] font-black uppercase tracking-ultra rounded-full hover:bg-white hover:text-navy transition-all shadow-xl shadow-navy/20 active:scale-95"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <div key={item.id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden group hover:border-navy/50 transition-all relative">
            <div className="aspect-video relative overflow-hidden">
               <img src={item.thumbnail} className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700" alt={item.title} />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
               <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                 <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="p-3 bg-white text-black rounded-full hover:bg-navy hover:text-white transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"><ChevronUp size={14} /></button>
                 <button onClick={() => handleMove(index, 'down')} disabled={index === items.length - 1} className="p-3 bg-white text-black rounded-full hover:bg-navy hover:text-white transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"><ChevronDown size={14} /></button>
                 <button onClick={() => setEditing({ videoUrl: '', thumbnail: '', ...item })} className="p-3 bg-white text-black rounded-full hover:bg-navy hover:text-white transition-all shadow-xl"><Edit size={14} /></button>
                 <button onClick={() => handleDelete(item.id)} className="p-3 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-xl"><Trash2 size={14} /></button>
               </div>
               <div className="absolute bottom-6 left-6">
                 <span className="text-[9px] uppercase font-black tracking-ultra text-navy-accent mb-2 block italic">{item.category}</span>
                 <h4 className="text-xl font-black uppercase tracking-tighter truncate">{item.title}</h4>
               </div>
            </div>
            <div className="p-6 flex justify-between items-center text-[9px] uppercase font-black tracking-widest text-white/20 italic">
               <span>Order: {item.order ?? index} | Last update: {item.date ? formatDate(item.date) : 'N/A'}</span>
               <div className="w-1.5 h-1.5 rounded-full bg-green-500/40"></div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-[#080808] border border-white/5 p-6 sm:p-8 lg:p-12 rounded-2xl relative shadow-2xl"
             >
                <button onClick={() => setEditing(null)} className="absolute top-6 right-6 lg:top-8 lg:right-8 text-white/20 hover:text-white z-10"><X size={24} /></button>
                <h3 className="text-2xl lg:text-3xl font-display font-bold italic mb-8 lg:mb-10">{editing.id ? 'Edit Item' : 'New Portfolio'}</h3>
                
                <form className="space-y-8" onSubmit={async (e) => {
                  e.preventDefault();
                  setSaving(true);
                  try {
                    const isNew = !editing.id;
                    const data = { 
                      ...editing, 
                      date: toSafeDate(editing.date),
                      updatedAt: serverTimestamp(),
                      createdAt: isNew ? serverTimestamp() : editing.createdAt
                    };
                    delete (data as any).id;
                    const docId = editing.id || `p-${Date.now()}`;
                    await setDoc(doc(db, 'portfolio', docId), data);
                    setEditing(null);
                  } catch (err) {
                    handleFirestoreError(err, OperationType.WRITE, 'portfolio');
                  } finally {
                    setSaving(false);
                  }
                }}>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/30">Title</label>
                    <input 
                      required
                      value={editing.title}
                      onChange={(e) => setEditing({...editing, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-3 focus:outline-none focus:border-navy"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-white/30">Category</label>
                      <select 
                        value={editing.category}
                        onChange={(e) => setEditing({...editing, category: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-3 focus:outline-none focus:border-navy"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-white/30">Release Date</label>
                      <input 
                         type="date"
                         value={toInputDate(editing.date)}
                         onChange={(e) => setEditing({...editing, date: e.target.value})}
                         className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-3 focus:outline-none focus:border-navy"
                      />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/30">Display Order</label>
                        <input 
                           type="number"
                           value={editing.order ?? 0}
                           onChange={(e) => setEditing({...editing, order: parseInt(e.target.value) || 0})}
                           className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-3 focus:outline-none focus:border-navy"
                        />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-white/30">Thumbnail URL</label>
                      <input 
                        value={editing.thumbnail || ''}
                        onChange={(e) => setEditing({...editing, thumbnail: e.target.value})}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-3 focus:outline-none focus:border-navy"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-white/30">Video URL (YouTube/Vimeo)</label>
                      <input 
                        value={editing.videoUrl || ''}
                        onChange={(e) => setEditing({...editing, videoUrl: e.target.value})}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-3 focus:outline-none focus:border-navy"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 pt-8">
                    <button type="button" onClick={() => setEditing(null)} className="px-8 py-4 text-[10px] uppercase font-bold tracking-widest">Cancel</button>
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="px-10 py-4 bg-navy text-white text-[10px] uppercase font-bold tracking-widest rounded-lg hover:bg-white hover:text-navy transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                      <Save size={14} /> {saving ? 'Saving...' : (editing.id ? 'Update' : 'Save Project')}
                    </button>
                  </div>
                </form>

             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InquiryList() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'inquiries', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `inquiries/${id}`);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <header className="pb-8 border-b border-white/5">
        <div className="flex items-center gap-4 mb-3">
           <span className="h-[1px] w-8 bg-navy"></span>
           <span className="text-[10px] uppercase tracking-ultra font-black text-white/40 italic">Communication Hub</span>
        </div>
        <h2 className="text-4xl font-black uppercase tracking-ultra italic">Inquiries</h2>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white/5 border border-white/5 p-10 rounded-3xl hover:border-navy/30 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 text-[10px] uppercase font-black tracking-ultra text-white/10 italic">
               #{item.id.slice(-4)}
             </div>
             <button 
                onClick={() => handleDelete(item.id)}
                className="absolute top-6 right-6 p-4 bg-red-500/10 text-red-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all shadow-xl z-10"
                title="Delete Inquiry"
              >
                <Trash2 size={16} />
              </button>
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 pb-8 border-b border-white/5">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/30 group-hover:bg-navy group-hover:text-white transition-all shadow-xl">
                     <User size={24} />
                   </div>
                   <div>
                     <h4 className="font-black text-2xl tracking-tighter uppercase mb-1">{item.name}</h4>
                     <p className="text-[10px] uppercase font-black tracking-widest text-white/30 italic">{item.email} // {item.phone}</p>
                   </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase font-black tracking-ultra text-navy-accent mb-2">Timestamp</span>
                  <p className="text-xs font-mono text-white/40">{item.createdAt ? formatDate(item.createdAt.toDate()) : 'N/A'}</p>
                </div>
             </div>
             <div className="max-w-4xl">
                <div className="mb-6 inline-block px-4 py-1.5 bg-navy/20 border border-navy/20 rounded-full">
                  <span className="text-[10px] uppercase font-black tracking-widest text-navy-accent italic">{item.subject}</span>
                </div>
                <p className="text-lg text-white/60 leading-relaxed whitespace-pre-wrap font-light italic">{item.message}</p>
             </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
             <Mail size={48} className="mx-auto mb-8 text-white/10" />
             <p className="text-white/20 text-[10px] uppercase font-black tracking-ultra italic">No incoming communications detected</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SettingsEditor({ settings, setSettings }: { settings: any, setSettings: any, key?: string }) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'config'), {
        ...settings,
        updatedAt: serverTimestamp()
      });
      alert('설정이 저장되었습니다.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/config');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 max-w-4xl">
      <header className="pb-8 border-b border-white/5">
        <div className="flex items-center gap-4 mb-3">
           <span className="h-[1px] w-8 bg-navy"></span>
           <span className="text-[10px] uppercase tracking-ultra font-black text-white/40 italic">System Configuration</span>
        </div>
        <h2 className="text-4xl font-black uppercase tracking-ultra italic">Settings</h2>
      </header>

      <div className="bg-white/5 border border-white/5 p-12 rounded-3xl space-y-12 backdrop-blur-md">
        <div className="space-y-8">
           <h3 className="text-[10px] uppercase tracking-ultra font-black text-navy-accent italic border-b border-white/5 pb-6">General Information</h3>
           <div className="grid grid-cols-1 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Site Name</label>
                <input 
                   value={settings.siteName} 
                   onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                />
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <h3 className="text-[10px] uppercase tracking-ultra font-black text-navy-accent italic border-b border-white/5 pb-6">Identity & Branding</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">System Logo Text</label>
                <input 
                   value={settings.systemLogo} 
                   onChange={(e) => setSettings({...settings, systemLogo: e.target.value})}
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                   placeholder="Enter logo name..."
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Logo Display Type</label>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                  <button 
                    onClick={() => setSettings({...settings, logoType: 'text'})}
                    className={cn(
                      "flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                      settings.logoType === 'text' ? "bg-navy text-white shadow-lg" : "text-white/20 hover:text-white"
                    )}
                  >
                    Text Only
                  </button>
                  <button 
                    onClick={() => setSettings({...settings, logoType: 'image'})}
                    className={cn(
                      "flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                      settings.logoType === 'image' ? "bg-navy text-white shadow-lg" : "text-white/20 hover:text-white"
                    )}
                  >
                    System Asset (Image)
                  </button>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Instagram URL</label>
                <input 
                   value={settings.instagramUrl || ''} 
                   onChange={(e) => setSettings({...settings, instagramUrl: e.target.value})}
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                   placeholder="https://instagram.com/yourprofile"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">YouTube URL</label>
                <input 
                   value={settings.youtubeUrl || ''} 
                   onChange={(e) => setSettings({...settings, youtubeUrl: e.target.value})}
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                   placeholder="https://youtube.com/@yourchannel"
                />
              </div>
           </div>
           
           {settings.logoType === 'image' && (
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Logo Image URL</label>
                <input 
                   value={settings.logoUrl || ''} 
                   onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                   placeholder="https://example.com/logo.png"
                />
                <div className="mt-4 p-8 border border-white/5 rounded-2xl bg-black/40 flex items-center justify-center">
                  {(settings.logoUrl || settings.logoType === 'image') ? (
                    <img src={settings.logoUrl || '/logo.png'} alt="Preview" className="h-16 w-auto object-contain" />
                  ) : (
                    <span className="text-[9px] uppercase font-black tracking-widest text-white/10 italic">Preview Placeholder</span>
                  )}
                </div>
              </div>
           )}
        </div>

        <div className="space-y-8">
           <h3 className="text-[10px] uppercase tracking-ultra font-black text-navy-accent italic border-b border-white/5 pb-6">Homepage Content</h3>
           <div className="grid grid-cols-1 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Hero Accent (Top bar)</label>
                <input 
                   value={settings.heroAccent || ''} 
                   onChange={(e) => setSettings({...settings, heroAccent: e.target.value})}
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Hero Title Type</label>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                  <button 
                    onClick={() => setSettings({...settings, heroTitleType: 'text'})}
                    className={cn(
                      "flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                      (settings.heroTitleType || 'text') === 'text' ? "bg-navy text-white shadow-lg" : "text-white/20 hover:text-white"
                    )}
                  >
                    Text Based
                  </button>
                  <button 
                    onClick={() => setSettings({...settings, heroTitleType: 'image'})}
                    className={cn(
                       "flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                       settings.heroTitleType === 'image' ? "bg-navy text-white shadow-lg" : "text-white/20 hover:text-white"
                    )}
                  >
                    Image Based
                  </button>
                </div>
              </div>

              {settings.heroTitleType === 'image' ? (
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Hero Title Image URL</label>
                  <input 
                     value={settings.heroTitleUrl || ''} 
                     onChange={(e) => setSettings({...settings, heroTitleUrl: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                     placeholder="https://example.com/hero-title.png"
                  />
                  <div className="mt-4 p-12 border border-white/5 rounded-2xl bg-black/40 flex items-center justify-center">
                    {settings.heroTitleUrl ? (
                      <img src={settings.heroTitleUrl} alt="Hero Title Preview" className="max-h-32 w-auto object-contain" />
                    ) : (
                      <span className="text-[9px] uppercase font-black tracking-widest text-white/10 italic">Hero Image Preview Placeholder</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Hero Title (Use \n for new line)</label>
                  <textarea 
                    rows={2}
                    value={settings.heroTitle || ''} 
                    onChange={(e) => setSettings({...settings, heroTitle: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                  />
                </div>
              )}
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Hero Description</label>
                <textarea 
                  rows={3}
                  value={settings.heroDesc || ''} 
                  onChange={(e) => setSettings({...settings, heroDesc: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold font-light italic"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Strategy Segment Title (\n for new line)</label>
                  <textarea 
                    rows={2}
                    value={settings.strategyTitle || ''} 
                    onChange={(e) => setSettings({...settings, strategyTitle: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Execution Segment Title (\n for new line)</label>
                  <textarea 
                    rows={2}
                    value={settings.executionTitle || ''} 
                    onChange={(e) => setSettings({...settings, executionTitle: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Purpose Section Title (\n for new line)</label>
                <textarea 
                  rows={3}
                  value={settings.purposeTitle || ''} 
                  onChange={(e) => setSettings({...settings, purposeTitle: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Purpose Section Description</label>
                <textarea 
                  rows={3}
                  value={settings.purposeDesc || ''} 
                  onChange={(e) => setSettings({...settings, purposeDesc: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-light italic"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Final CTA Title (\n for new line)</label>
                <textarea 
                  rows={2}
                  value={settings.ctaTitle || ''} 
                  onChange={(e) => setSettings({...settings, ctaTitle: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold italic"
                />
              </div>

              <div className="pt-8 border-t border-white/5 space-y-8">
                <h4 className="text-[9px] uppercase tracking-ultra font-black text-white/40 italic">Featured Video Section</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Featured Category</label>
                    <input 
                       value={settings.featuredCategory || ''} 
                       onChange={(e) => setSettings({...settings, featuredCategory: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                       placeholder="e.g. BRAND FILM"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Featured Title</label>
                    <input 
                       value={settings.featuredTitle || ''} 
                       onChange={(e) => setSettings({...settings, featuredTitle: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                       placeholder="e.g. THE MODERN SOUL"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Featured Background Image URL</label>
                  <input 
                     value={settings.featuredImageUrl || ''} 
                     onChange={(e) => setSettings({...settings, featuredImageUrl: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Featured Video URL</label>
                  <input 
                     value={settings.featuredVideoUrl || ''} 
                     onChange={(e) => setSettings({...settings, featuredVideoUrl: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                  />
                </div>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <h3 className="text-[10px] uppercase tracking-ultra font-black text-navy-accent italic border-b border-white/5 pb-6">Services Page Content</h3>
           <div className="grid grid-cols-1 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Header Title</label>
                <input 
                   value={settings.servicesTitle || ''} 
                   onChange={(e) => setSettings({...settings, servicesTitle: e.target.value})}
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Header Description</label>
                <textarea 
                  rows={3}
                  value={settings.servicesDesc || ''} 
                  onChange={(e) => setSettings({...settings, servicesDesc: e.target.value})}
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-light italic"
                />
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <h3 className="text-[10px] uppercase tracking-ultra font-black text-navy-accent italic border-b border-white/5 pb-6">Contact Page Content</h3>
           <div className="grid grid-cols-1 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Contact Description</label>
                <textarea 
                  rows={3}
                  value={settings.contactDesc || ''} 
                  onChange={(e) => setSettings({...settings, contactDesc: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-light italic"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Phone Number</label>
                  <input 
                     value={settings.contactPhone || ''} 
                     onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Email Address</label>
                  <input 
                     value={settings.contactEmail || ''} 
                     onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-navy text-white font-bold"
                  />
                </div>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <h3 className="text-[10px] uppercase tracking-ultra font-black text-navy-accent italic border-b border-white/5 pb-6">Theme & Identity</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Primary Color</label>
                <div className="flex gap-4">
                  <input type="color" value={settings.primaryColor} onChange={(e) => setSettings({...settings, primaryColor: e.target.value})} className="h-14 w-20 bg-white/5 border border-white/10 rounded-xl cursor-pointer p-1" />
                  <input value={settings.primaryColor} readOnly className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 text-xs font-mono text-white/60 flex items-center" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-ultra text-white/30">Accent Color</label>
                <div className="flex gap-4">
                  <input type="color" value={settings.accentColor} onChange={(e) => setSettings({...settings, accentColor: e.target.value})} className="h-14 w-20 bg-white/5 border border-white/10 rounded-xl cursor-pointer p-1" />
                  <input value={settings.accentColor} readOnly className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 text-xs font-mono text-white/60 flex items-center" />
                </div>
              </div>
           </div>
        </div>

        <div className="pt-8 flex justify-end">
           <button 
             onClick={handleSave}
             disabled={saving}
             className="px-16 py-6 bg-navy text-white font-black uppercase tracking-ultra text-[10px] rounded-full hover:bg-white hover:text-navy transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl shadow-navy/20"
           >
             {saving ? 'Syncing...' : 'Commit Changes'} <Save size={16} />
           </button>
        </div>
      </div>
    </motion.div>
  );
}
