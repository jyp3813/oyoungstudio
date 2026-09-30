import { cn } from '../lib/utils';

interface LogoProps {
  settings?: any;
  className?: string;
}

export function Logo({ settings, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 sm:gap-4", className)}>
      
      {/* 1. 지니제이 로고 이미지 (새로 전달해주신 파일명 적용) */}
      <img 
        src="/jinij-logo3.png" 
        alt="JINI.J" 
        className="h-5 sm:h-7 w-auto object-contain" 
      />

      {/* 2. 중앙 크로스(x) 마크 */}
      <span className="text-white/30 font-light text-[10px] sm:text-xs">x</span>

      {/* 3. 오영 로고 이미지 */}
      {settings?.logoUrl && settings.logoType === 'image' ? (
        <img 
          src={settings.logoUrl} 
          alt="oYoung" 
          className="h-5 sm:h-7 w-auto object-contain" 
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="font-black tracking-[0.1em] uppercase text-white text-[11px] sm:text-sm">
          OYOUNG
        </span>
      )}

    </div>
  );
}
