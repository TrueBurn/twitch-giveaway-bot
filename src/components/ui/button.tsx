import { forwardRef } from 'react';
import { cn, cva } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-energy-blue disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-energy-blue/20 text-energy-white border border-energy-blue/50 hover:bg-energy-blue/30",
        destructive:
          "bg-accent-red/20 text-energy-white border border-accent-red/50 hover:bg-accent-red/30",
        outline:
          "border border-energy-gold/50 bg-transparent hover:bg-energy-gold/20 text-energy-gold",
        secondary:
          "bg-orokin-700 text-energy-white hover:bg-orokin-600",
        ghost:
          "hover:bg-energy-blue/20 text-energy-white hover:text-energy-white",
        link: "text-energy-blue underline-offset-4 hover:underline",
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-10 px-4',
        lg: 'h-12 px-6',
      },
    },
  }
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    isLoading = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size }),
          className
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button }; 