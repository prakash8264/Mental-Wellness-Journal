import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface IconButtonProps extends HTMLMotionProps<'button'> {
  icon: React.ReactNode;
  ariaLabel: string;
  variant?: 'yellow' | 'blue' | 'mint' | 'white' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  ariaLabel,
  variant = 'white',
  size = 'md',
  active = false,
  className,
  ...props
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-base rounded-xl',
    md: 'w-10 h-10 text-lg rounded-2xl',
    lg: 'w-12 h-12 text-xl rounded-2xl',
  };

  const variantStyles = {
    white: 'bg-[var(--bg-card)] text-[var(--text)] border-3 border-[var(--border)] shadow-[3px_3px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--border)]',
    yellow: 'bg-[var(--primary)] text-[var(--text)] border-3 border-[var(--border)] shadow-[3px_3px_0px_0px_var(--border)]',
    blue: 'bg-[var(--secondary)] text-[var(--text)] border-3 border-[var(--border)] shadow-[3px_3px_0px_0px_var(--border)]',
    mint: 'bg-[var(--accent-mint)] text-[var(--text)] border-3 border-[var(--border)] shadow-[3px_3px_0px_0px_var(--border)]',
    ghost: 'text-[var(--text)] border-none shadow-none hover:bg-[var(--secondary)]',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center font-bold transition-all duration-150 focus:outline-none cursor-pointer select-none',
          sizeStyles[size],
          variantStyles[variant],
          active && 'bg-[var(--primary)] text-[var(--text)] font-extrabold',
          className
        )
      )}
      {...props}
    >
      {icon}
    </motion.button>
  );
};
