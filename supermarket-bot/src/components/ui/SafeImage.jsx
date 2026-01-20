// src/components/ui/SafeImage.jsx
import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const SafeImage = ({ src, alt, className }) => {
  const [error, setError] = useState(false);

  // Fallback to a clean gray box with an icon if image fails
  if (error || !src) {
      return (
        <div className={`flex items-center justify-center bg-slate-100 text-slate-300 ${className}`}>
          <ImageIcon size={24} />
        </div>
      );
  }

  return (
    <img 
        src={src} 
        alt={alt} 
        className={className} 
        onError={() => setError(true)} 
        loading="lazy"
    />
  );
};

export default SafeImage;