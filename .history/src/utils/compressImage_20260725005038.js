export const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 1200;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        let quality = 0.7;
        const compressRecursive = () => {
          canvas.toBlob((blob) => {
            // If size is under 2MB or quality is too low, resolve
            if (blob.size / 1024 / 1024 < 2 || quality < 0.3) {
              // Create a new File object from the compressed blob
              const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
              resolve(compressedFile);
            } else {
              quality -= 0.1;
              compressRecursive();
            }
          }, 'image/jpeg', quality);
        };
        compressRecursive();
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};