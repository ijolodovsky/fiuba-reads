import React from 'react';

export function Textarea({ value, onChange, placeholder, rows = 4, className }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full p-2 bg-gray-800 text-blue-200 rounded-lg resize-none border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}
