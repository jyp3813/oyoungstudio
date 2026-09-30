import { cn } from '../lib/utils';

interface LogoProps {
  settings?: any;
  className?: string;
}

export function Logo({ settings, className }: LogoProps) {
  // 미팅용 임시 고정: 기존 등록된 이미지 로고를 무시하고 텍스트로만 출력합니다.
  return (
    <div className={cn("font-black tracking-[0.1em] uppercase text-white flex items-center gap-2", className)}>
      <span className="w-2 h-2 bg-navy-accent rounded-full hidden sm:block"></span>
      <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm">
        <span>JINI. J MEDIA</span>
        <span className="text-white/30 font-light text-[9px] sm:text-[10px]">x</span>
        <span>OYOUNG</span>
      </div>
    </div>
  );
}
