import { cn } from '../lib/utils';

interface LogoProps {
  settings?: any;
  className?: string;
}

export function Logo({ settings, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 sm:gap-4", className)}>
      
      {/* 1. 오영 로고 이미지 (관리자 페이지에 등록된 이미지 불러오기) */}
      {settings?.logoUrl && settings.logoType === 'image' ? (
        <img 
          src={settings.logoUrl} 
          alt="oYoung" 
          className="h-5 sm:h-7 w-auto object-contain" 
          referrerPolicy="no-referrer"
        />
      ) : (
        /* 오영 이미지 로고가 없을 경우 대비한 예비 텍스트 */
        <span className="font-black tracking-[0.1em] uppercase text-white text-[11px] sm:text-sm">
          OYOUNG
        </span>
      )}

      {/* 2. 중앙 크로스(x) 마크 */}
      <span className="text-white/30 font-light text-[10px] sm:text-xs">x</span>

      {/* 3. 지니제이 로고 이미지 (오영 로고와 시각적 밸런스를 맞추기 위해 h-3 sm:h-4로 사이즈 축소) */}
      <img 
        src="/jinij-logo.png" 
        alt="JINI.J" 
        className="h-3 sm:h-4 w-auto object-contain" 
      />

    </div>
  );
}
