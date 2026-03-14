'use client';

import Image from 'next/image';
import { useState } from 'react';

type PlayerImageProps = {
  playerId?: string;
  alt?: string;
  height?: number;
  className?: string;
};

const PlayerImage = ({
  playerId,
  alt = 'Player avatar',
  height = 24,
  className = '',
}: PlayerImageProps) => {
  const [hasError, setHasError] = useState(false);

  const imageUrl = playerId
    ? `https://sleepercdn.com/content/nfl/players/thumb/${playerId}.jpg`
    : '';

  const sizeStyle = {
    width: `${height}px`,
    height: `${height}px`,
  };

  if (!playerId || hasError) {
    return (
      <div
        className={`bg-slate-700 text-white flex items-center justify-center rounded-full flex-shrink-0 text-xs ${className}`}
        style={sizeStyle}
      >
        {/* Show fallback initials if possible */}
        {alt?.split(' ').map(word => word[0]).join('')}
      </div>
    );
  }

  return (
    <div
      className={`rounded-full overflow-hidden flex-shrink-0 ${className}`}
      style={sizeStyle}
    >
      <Image
        src={imageUrl}
        alt={alt}
        width={height}
        height={height}
        unoptimized
        className="object-cover w-full h-full"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export default PlayerImage;
