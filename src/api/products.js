import apiClient from "./apiClient";
import { getImageUrl } from "@/lib/imageHelper";

export const productsApi = {
  // Fetch featured products
  getFeaturedProducts: async () => {
    try {
      const response = await apiClient.get("/Products/featured"); // هذا صحيح الآن

      // Add complete image URLs
      return response.map((product) => ({
        ...product,
        displayImage: getImageUrl(product.imageUrl),
      }));
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  },

  // ... باقي الدوال كما هي ...
};