import { cn } from '../lib/utils';

interface LogoProps {
  settings?: any;
  className?: string;
}

export function Logo({ settings, className }: LogoProps) {
  const siteName = settings?.siteName || 'OYOUNG STUDIO';
  
  if (settings?.logoUrl && settings.logoType === 'image') {
    return (
      <img 
        src={settings.logoUrl} 
        alt={siteName} 
        className={cn("h-8 w-auto object-contain", className)} 
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className={cn("font-black tracking-[0.3em] uppercase text-white flex items-center gap-2", className)}>
      <span className="w-2.5 h-2.5 bg-navy-accent rounded-full"></span>
      {siteName}
    </div>
  );
}
