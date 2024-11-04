import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ 
  size = 24, 
  color = 'text-blue-500', 
  text = 'Cargando...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12 text-center">
      <Loader2 
        className={`animate-spin ${color}`} 
        size={size} 
      />
      {text && (
        <p className={`text-sm font-medium ${color}`}>
          {text}
        </p>
      )}
    </div>
  )
}