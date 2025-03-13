import React from 'react';
// import { cn } from '@/lib/utils';
import { cn } from '../lib/utils';

const Input = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
