import { cn } from '../lib/utils';

interface LogoProps {
  settings?: any;
  className?: string;
}

export function Logo({ settings, className }: LogoProps) {
  // 관리자 페이지에서 로고 이미지를 설정한 경우
  if (settings?.logoUrl && settings.logoType === 'image') {
    return (
      <img 
        src={settings.logoUrl} 
        alt="Jini.J x oYoung" 
        className={cn("h-8 w-auto object-contain", className)} 
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className={cn("font-black tracking-[0.15em] uppercase text-white flex items-center gap-2", className)}>
      <span className="w-2 h-2 bg-navy-accent rounded-full hidden sm:block"></span>
      <div className="flex items-center gap-2 text-sm sm:text-base">
        <span>JINI.J</span>
        <span className="text-white/30 font-light text-[10px] sm:text-xs">x</span>
        <span>OYOUNG</span>
      </div>
    </div>
  );
}
