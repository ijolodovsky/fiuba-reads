import React from 'react';

export function Button({ variant = 'default', onClick, children }) {
  const baseStyle = 'px-4 py-2 rounded focus:outline-none';
  const styles = {
    default: `${baseStyle} bg-blue-500 text-white`,
    link: `${baseStyle} text-blue-500 underline`,
  };

  return (
    <button onClick={onClick} className={styles[variant]}>
      {children}
    </button>
  );
}
