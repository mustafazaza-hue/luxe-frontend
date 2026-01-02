import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5186";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`, // 👈 أضفنا /api هنا
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Normalize response
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url, // 👈 أضفنا URL لمعرفة أي endpoint به مشكلة
    });
    return Promise.reject(error);
  }
);

export default apiClient;