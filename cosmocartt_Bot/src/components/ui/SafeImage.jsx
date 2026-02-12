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

  // DEBUGGING: Check what image src is actually being attempted
  // console.log("SafeImage attempting to load:", src);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        console.error("SafeImage failed to load:", src);
        setError(true);
      }}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
};

export default SafeImage;