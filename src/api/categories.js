import apiClient from "./apiClient";
import { getImageUrl } from "@/lib/imageHelper";

export const categoriesApi = {
  // Fetch all categories
  getCategories: async () => {
    try {
      const response = await apiClient.get("/Categories/simple");

      // Add complete image URLs
      return response.data.map((category) => ({
        ...category,
        displayImage: getImageUrl(category.imageUrl),
      }));
    } catch (error) {
      console.warn("Categories endpoint not available, using mock data");
      // Return mock categories as fallback
      return [
        {
          id: 1,
          name: "Living Room",
          imageUrl:
            "https://storage.googleapis.com/uxpilot-auth.appspot.com/13fb927b8e-96842115d1b7a17f8465.png",
          displayImage:
            "https://storage.googleapis.com/uxpilot-auth.appspot.com/13fb927b8e-96842115d1b7a17f8465.png",
        },
        {
          id: 2,
          name: "Bedroom",
          imageUrl:
            "https://storage.googleapis.com/uxpilot-auth.appspot.com/13fb927b8e-96842115d1b7a17f8465.png",
          displayImage:
            "https://storage.googleapis.com/uxpilot-auth.appspot.com/13fb927b8e-96842115d1b7a17f8465.png",
        },
        {
          id: 3,
          name: "Dining",
          imageUrl:
            "https://storage.googleapis.com/uxpilot-auth.appspot.com/13fb927b8e-96842115d1b7a17f8465.png",
          displayImage:
            "https://storage.googleapis.com/uxpilot-auth.appspot.com/13fb927b8e-96842115d1b7a17f8465.png",
        },
        {
          id: 4,
          name: "Outdoor",
          imageUrl:
            "https://storage.googleapis.com/uxpilot-auth.appspot.com/13fb927b8e-96842115d1b7a17f8465.png",
          displayImage:
            "https://storage.googleapis.com/uxpilot-auth.appspot.com/13fb927b8e-96842115d1b7a17f8465.png",
        },
      ];
    }
  },

  // ... باقي الدوال كما هي ...
};
