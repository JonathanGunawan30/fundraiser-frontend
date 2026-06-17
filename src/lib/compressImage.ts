interface CompressImageOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
}

export async function compressImageToWebp(
    file: File,
    options: CompressImageOptions = {}
): Promise<File> {
    const { maxWidth = 1600, maxHeight = 1600, quality = 0.8 } = options;

    const supportsWebp = await checkWebpSupport();
    if (!supportsWebp) {
        return file;
    }

    const imageBitmap = await createImageBitmap(file);

    let { width, height } = imageBitmap;

    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas context tidak tersedia di browser ini');
    }

    ctx.drawImage(imageBitmap, 0, 0, width, height);
    imageBitmap.close();

    const blob: Blob | null = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/webp', quality);
    });

    if (!blob) {
        return file;
    }
    const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';

    return new File([blob], newFileName, {
        type: 'image/webp',
        lastModified: Date.now(),
    });
}

function checkWebpSupport(): Promise<boolean> {
    return new Promise(resolve => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        canvas.toBlob(blob => {
            resolve(blob !== null && blob.type === 'image/webp');
        }, 'image/webp');
    });
}