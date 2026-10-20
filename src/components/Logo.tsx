import { cn } from '../lib/utils';

interface LogoProps {
  settings?: any;
  className?: string;
}

export function Logo({ settings, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 sm:gap-4", className)}>
      {settings?.logoUrl && settings.logoType === 'image' ? (
        <img 
          src={settings.logoUrl} 
          alt="oYoung" 
          className="h-6 sm:h-8 w-auto object-contain" 
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="font-black tracking-[0.2em] uppercase text-white text-base sm:text-lg">
          {settings?.systemLogo || 'OYOUNG'}
        </span>
      )}
    </div>
  );
}
