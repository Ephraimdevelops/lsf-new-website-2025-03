import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';

interface BrandButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const BrandButton = React.forwardRef<HTMLButtonElement, BrandButtonProps>(
  ({ 
    className, 
    variant = "default", 
    size = "default", 
    loading = false, 
    disabled,
    children, 
    ...props 
  }, ref) => {
    return (
      <Button
        className={cn(
          // Additional brand-specific styling
          "font-medium transition-all duration-300",
          loading && "pointer-events-none opacity-70",
          className
        )}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </Button>
    );
  }
);

BrandButton.displayName = "BrandButton";

export { BrandButton };