import React from 'react';

export function Badge({ variant = 'default', children }) {
  const baseStyle = 'px-2 py-1 text-xs font-semibold rounded-full';
  const styles = {
    default: `${baseStyle} bg-gray-200 text-gray-700`,
    secondary: `${baseStyle} bg-blue-200 text-blue-700`,
  };

  return <span className={styles[variant]}>{children}</span>;
}
