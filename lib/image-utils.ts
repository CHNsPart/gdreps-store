// lib/image-utils.ts

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

export async function optimizeImage(base64String: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64String;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Maximum dimensions
      const maxWidth = 800;
      const maxHeight = 800;
      
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with reduced quality
      const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      resolve(optimizedBase64);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
  });
}

export async function processImages(files: FileList): Promise<string[]> {
  const processedImages: string[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const base64 = await fileToBase64(file);
    const optimizedBase64 = await optimizeImage(base64);
    processedImages.push(optimizedBase64);
  }
  
  return processedImages;
}