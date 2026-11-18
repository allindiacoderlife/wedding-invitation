import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';

export const getVideoEmbedInfo = (url) => {
  if (!url) return null;

  // 1. Google Drive: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const gDriveMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  if (gDriveMatch) {
    const fileId = gDriveMatch[1];
    return {
      type: 'gdrive',
      id: fileId,
      // Stream via backend proxy to bypass Google Drive's CORP same-site restriction
      streamSrc: `${API_BASE_URL}/api/templates/stream/${fileId}`,
      directSrc: `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`,
      fallbackIframeSrc: `https://drive.google.com/file/d/${fileId}/preview`,
    };
  }

  // 2. YouTube: watch?v=ID, youtu.be/ID, shorts/ID
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    return {
      type: 'iframe',
      src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&playsinline=1&modestbranding=1`,
    };
  }

  // 3. Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/([0-9]+)/);
  if (vimeoMatch) {
    return {
      type: 'iframe',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&playsinline=1`,
    };
  }

  // 4. Direct video link (.mp4, .webm, Cloudinary, S3, Supabase)
  return {
    type: 'video',
    src: url,
  };
};

export const VideoPlayer = ({ url, className = 'w-full h-full', autoPlay = true }) => {
  const [streamError, setStreamError] = useState(false);
  const info = getVideoEmbedInfo(url);

  // Reset fallback state when the URL changes
  useEffect(() => {
    setStreamError(false);
  }, [url]);

  if (!info) {
    return (
      <div className="w-full h-full bg-stone-900 flex items-center justify-center text-stone-500 text-xs">
        No video URL provided
      </div>
    );
  }

  // For Google Drive: Stream directly as a native HTML5 video tag
  // Completely eliminates Google Drive's pop-out icon [↗], 10s buttons, and cluttered controls
  if (info.type === 'gdrive') {
    if (!streamError) {
      return (
        <video
          key={info.id}
          src={info.streamSrc}
          controls
          autoPlay={autoPlay}
          playsInline
          preload="metadata"
          className={`w-full h-full object-contain bg-black rounded-xl ${className}`}
          onError={() => {
            console.warn('Backend video stream failed, falling back to iframe');
            setStreamError(true);
          }}
        />
      );
    }

    // Fallback: If streaming proxy is unavailable, use preview iframe with popout blocker overlay
    return (
      <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center rounded-xl">
        <iframe
          src={info.fallbackIframeSrc}
          title="Wedding Invitation Video Preview"
          className={`w-full h-full border-0 rounded-xl ${className}`}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
        {/* Invisible touch overlay to prevent opening external Google Drive popout tab */}
        <div
          className="absolute top-0 right-0 w-16 h-14 z-20 cursor-default"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  if (info.type === 'iframe') {
    return (
      <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center rounded-xl">
        <iframe
          src={info.src}
          title="Wedding Invitation Video Preview"
          className={`w-full h-full border-0 rounded-xl ${className}`}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <video
      src={info.src}
      controls
      autoPlay={autoPlay}
      playsInline
      preload="metadata"
      className={`w-full h-full object-contain bg-black rounded-xl ${className}`}
    />
  );
};
