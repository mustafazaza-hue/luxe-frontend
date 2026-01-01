// Helper function to create SVG fallback images
export const createFallbackImage = (text = 'Furniture', width = 400, height = 300) => {
  // Create SVG image with Base64 encoding
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#F5F1EB"/>
    <text x="50%" y="50%" font-family="Inter, sans-serif" font-size="18" fill="#2C2C2C" text-anchor="middle" dy=".3em">${text}</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Create avatar fallback
export const createAvatarFallback = (name = 'User') => {
  const initial = name.charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="24" fill="#D4AF37"/>
    <text x="50%" y="50%" font-family="Inter, sans-serif" font-size="20" fill="white" font-weight="bold" text-anchor="middle" dy=".3em">${initial}</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Get complete image URL
export const getImageUrl = (path) => {
  if (!path) {
    return createFallbackImage();
  }
  
  // If it's already a full URL, return it
  if (path.startsWith('http') || path.startsWith('data:image')) {
    return path;
  }
  
  // Add base URL for relative paths
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5186';
  return `${baseUrl}${path}`;
};