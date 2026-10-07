import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { box: 'h-7 w-7', text: 'text-base', icon: 16 },
  md: { box: 'h-9 w-9', text: 'text-lg', icon: 20 },
  lg: { box: 'h-12 w-12', text: 'text-2xl', icon: 28 },
};

export function Logo({ size = 'md', className }: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-lg bg-accent-600 text-white shadow-sm',
          s.box,
        )}
      >
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h10l6 6v10a0 0 0 0 1 0 0H4z" />
          <path d="M14 4v6h6" />
          <path d="M8 16h8" />
          <path d="M8 13h5" />
        </svg>
      </div>
    </div>
  );
}
