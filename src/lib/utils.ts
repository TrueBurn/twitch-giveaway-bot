import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cva as _cva } from 'class-variance-authority';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const cva = _cva; 