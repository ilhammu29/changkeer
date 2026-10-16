/**
 * Image compression utility for Changkeer Customer Profiles
 * Enforces 5MB max upload limit and compresses image via HTML5 Canvas
 * Includes foolproof fallback: never hangs, handles timeouts, and guarantees valid File output.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.0 to 1.0
  format?: 'image/webp' | 'image/jpeg';
  timeoutMs?: number;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Megabytes

export function validateImageSize(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'File tidak ditemukan.' };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `Ukuran file terlalu besar (${sizeInMB}MB). Maksimal ukuran file adalah 5MB.`,
    };
  }
  return { valid: true };
}

/**
 * Compresses an image file client-side using HTML5 Canvas.
 * - Always enforces strict 5MB limit.
 * - Uses URL.createObjectURL for 0ms fast image loading.
 * - Includes a 3.5s timeout: if canvas stalls or fails, gracefully falls back to the original file.
 * - Guarantees promise resolution: NEVER stays stuck.
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<{ file: File; dataUrl: string; originalSize: number; compressedSize: number }> {
  // 1. Strict 5MB limit check
  const validation = validateImageSize(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // If running in SSR or non-browser environment, return original file
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      file,
      dataUrl: '',
      originalSize: file.size,
      compressedSize: file.size,
    };
  }

  const {
    maxWidth = 1200,
    maxHeight = 800,
    quality = 0.82,
    format = 'image/jpeg',
    timeoutMs = 3500,
  } = options;

  // If already a small file (< 80KB) or GIF/SVG, return original without canvas processing
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  if (file.size < 80 * 1024 || fileExt === 'gif' || fileExt === 'svg') {
    let previewUrl = '';
    try {
      previewUrl = URL.createObjectURL(file);
    } catch {}
    return {
      file,
      dataUrl: previewUrl,
      originalSize: file.size,
      compressedSize: file.size,
    };
  }

  return new Promise((resolve) => {
    let isSettled = false;
    let objectUrl: string | null = null;

    // Timeout safety fallback: never leave the user hanging
    const timer = setTimeout(() => {
      if (isSettled) return;
      isSettled = true;
      if (objectUrl) {
        try { URL.revokeObjectURL(objectUrl); } catch {}
      }
      console.warn('Kompresi canvas timeout, menggunakan file asli sebagai fallback.');
      let preview = '';
      try {
        preview = URL.createObjectURL(file);
      } catch {}
      resolve({
        file,
        dataUrl: preview,
        originalSize: file.size,
        compressedSize: file.size,
      });
    }, timeoutMs);

    const safeFinish = (result: { file: File; dataUrl: string; originalSize: number; compressedSize: number }) => {
      if (isSettled) return;
      isSettled = true;
      clearTimeout(timer);
      if (objectUrl) {
        try { URL.revokeObjectURL(objectUrl); } catch {}
      }
      resolve(result);
    };

    const fallbackOriginal = () => {
      let preview = '';
      try {
        preview = URL.createObjectURL(file);
      } catch {}
      safeFinish({
        file,
        dataUrl: preview,
        originalSize: file.size,
        compressedSize: file.size,
      });
    };

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onerror = () => {
        console.warn('Gagal memuat elemen gambar untuk kompresi, menggunakan fallback.');
        fallbackOriginal();
      };

      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          if (!width || !height) {
            return fallbackOriginal();
          }

          // Calculate aspect-ratio preserved dimensions
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.max(1, Math.round(width * ratio));
            height = Math.max(1, Math.round(height * ratio));
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d', { alpha: false });
          if (!ctx) {
            return fallbackOriginal();
          }

          // Draw white background in case source had transparency and output is JPEG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          // Draw image
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Get preview dataUrl
          let dataUrl = '';
          try {
            dataUrl = canvas.toDataURL(format, quality);
          } catch {
            try {
              dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            } catch {}
          }

          // Convert to blob
          const handleBlob = (blob: Blob | null) => {
            if (!blob) {
              return fallbackOriginal();
            }

            // Only use compressed file if it's actually smaller or resized
            if (blob.size >= file.size && width === (img.naturalWidth || img.width)) {
              return fallbackOriginal();
            }

            const ext = format === 'image/webp' ? 'webp' : 'jpg';
            const baseName = file.name.replace(/\.[^/.]+$/, '');
            const compressedFile = new File([blob], `${baseName}.${ext}`, {
              type: blob.type || format,
              lastModified: Date.now(),
            });

            safeFinish({
              file: compressedFile,
              dataUrl: dataUrl || (typeof window !== 'undefined' ? URL.createObjectURL(compressedFile) : ''),
              originalSize: file.size,
              compressedSize: compressedFile.size,
            });
          };

          // Try canvas.toBlob
          if (typeof canvas.toBlob === 'function') {
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  handleBlob(blob);
                } else {
                  // Fallback to JPEG if WebP was unsupported
                  canvas.toBlob((jpegBlob) => handleBlob(jpegBlob), 'image/jpeg', 0.82);
                }
              },
              format,
              quality
            );
          } else {
            // Fallback for environments without toBlob
            fallbackOriginal();
          }
        } catch (err) {
          console.warn('Canvas compression error:', err);
          fallbackOriginal();
        }
      };

      // Fast image loading via Object URL
      try {
        objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;
      } catch {
        // Fallback to FileReader if createObjectURL fails
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = (e.target?.result as string) || '';
        };
        reader.onerror = () => fallbackOriginal();
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Compress image setup failed:', err);
      fallbackOriginal();
    }
  });
}
