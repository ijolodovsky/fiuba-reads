import React from 'react';

export const Button = ({ variant, children, ...props }) => {
  const className = variant === 'ghost' ? 'bg-transparent' : 'bg-blue-500 text-white';
  return (
    <button className={`${className} px-4 py-2 rounded`} {...props}>
      {children}
    </button>
  );
};
