/**
 * Converts a string into a URL-friendly slug.
 * 
 * @param text The string to be slugified.
 * @returns A slugified version of the string.
 */
export const slugify = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')   // Remove all non-word chars
        .replace(/--+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')        // Trim - from start of text
        .replace(/-+$/, '');       // Trim - from end of text
};

/**
 * Converts a file to a base64 string for previewing.
 */
export const getBase64 = (file: File | Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

/**
 * Validates an image file size and type.
 * Default: 1MB, jpeg/png/jpg/webp/svg
 */
export const validateImage = (file: File, maxSizeMB: number = 1) => {
    const isJpgOrPng = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'].includes(file.type);
    if (!isJpgOrPng) {
        return { valid: false, message: 'You can only upload JPG/PNG/WebP/SVG files!' };
    }
    const isLtMax = file.size / 1024 / 1024 < maxSizeMB;
    if (!isLtMax) {
        return { valid: false, message: `Image must be smaller than ${maxSizeMB}MB!` };
    }
    return { valid: true };
};

/**
 * Extracts validation error messages from backend response.
 */
export const getErrorMessages = (error: unknown): string[] => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
        const response = (error as { response: { data?: { errors?: Record<string, string[]>; message?: string } } }).response;
        const errors = response?.data?.errors;
        if (!errors) return [response?.data?.message || 'Something went wrong'];

        return Object.values(errors).flat();
    }
    
    if (error instanceof Error) {
        return [error.message];
    }
    
    return ['Something went wrong'];
};
