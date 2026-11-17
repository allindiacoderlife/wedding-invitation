export const getVideoEmbedInfo = (url) => {
  if (!url) return null;

  // 1. Google Drive: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const gDriveMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  if (gDriveMatch) {
    return {
      type: 'iframe',
      src: `https://drive.google.com/file/d/${gDriveMatch[1]}/preview`,
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
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  // 4. Direct video link (.mp4, .webm, Cloudinary, S3, Supabase)
  return {
    type: 'video',
    src: url,
  };
};

export const VideoPlayer = ({ url, className = 'w-full h-full', autoPlay = true }) => {
  const info = getVideoEmbedInfo(url);

  if (!info) {
    return (
      <div className="w-full h-full bg-stone-900 flex items-center justify-center text-stone-500 text-xs">
        No video URL provided
      </div>
    );
  }

  if (info.type === 'iframe') {
    return (
      <iframe
        src={info.src}
        title="Wedding Invitation Video Preview"
        className={`w-full h-full border-0 rounded-xl ${className}`}
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    );
  }

  return (
    <video
      src={info.src}
      controls
      autoPlay={autoPlay}
      playsInline
      className={`w-full h-full object-contain bg-black rounded-xl ${className}`}
    />
  );
};
