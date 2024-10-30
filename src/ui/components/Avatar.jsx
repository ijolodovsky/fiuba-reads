import React from 'react';

export function Avatar({ children }) {
  return (
    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt }) {
  return <img src={src} alt={alt} className="w-full h-full object-cover" />;
}

export function AvatarFallback({ children }) {
  return <span className="text-gray-500 font-semibold">{children}</span>;
}
