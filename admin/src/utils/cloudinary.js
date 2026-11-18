/**
 * Uploads a file (video or image) directly from browser to Cloudinary
 * using an unsigned upload preset.
 *
 * @param {File} file - The file to upload (.mp4, .mov, .jpg, .png, etc.)
 * @param {Function} onProgress - Callback receiving upload percentage (0 - 100)
 * @param {Object} options - Custom cloudName or uploadPreset overrides
 * @returns {Promise<Object>} The Cloudinary API response
 */
export const uploadToCloudinary = (file, onProgress, options = {}) => {
  return new Promise((resolve, reject) => {
    const cloudName =
      options.cloudName ||
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
      localStorage.getItem('cloudinary_cloud_name') ||
      '';

    const uploadPreset =
      options.uploadPreset ||
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ||
      localStorage.getItem('cloudinary_upload_preset') ||
      '';

    if (!cloudName || !uploadPreset) {
      return reject(
        new Error(
          'Cloudinary is not configured. Please set your Cloud Name and Upload Preset in settings or .env.'
        )
      );
    }

    // Determine resource type: 'video' or 'image'
    const isVideo = file.type.startsWith('video') || file.name.match(/\.(mp4|mov|webm|mkv|avi)$/i);
    const resourceType = isVideo ? 'video' : 'image';

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    // Track upload progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress(percent);
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            // If it's a video, generate thumbnail URL automatically from video
            const thumbnailUrl = isVideo
              ? data.secure_url.replace(/\.[^/.]+$/, '.jpg')
              : data.secure_url;

            resolve({
              ...data,
              videoUrl: isVideo ? data.secure_url : null,
              thumbnailUrl,
              durationSeconds: data.duration ? Math.round(data.duration) : null,
            });
          } catch (err) {
            reject(new Error('Failed to parse Cloudinary response: ' + err.message));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.error?.message || 'Cloudinary upload failed'));
          } catch {
            reject(new Error(`Upload failed with status code ${xhr.status}`));
          }
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred during Cloudinary upload'));
    };

    xhr.open('POST', url, true);
    xhr.send(formData);
  });
};
