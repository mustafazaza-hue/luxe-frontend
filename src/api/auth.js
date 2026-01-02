import apiClient from "./apiClient";

export const authApi = {
  // =======================
  // CUSTOMER
  // =======================
  customerLogin: async (email, password) => {
    const response = await apiClient.post("/Auth/customer/login", { // 👈 بدون /api
      email,
      password,
    });

    if (response?.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user || response));
      localStorage.setItem("userType", "customer");
    }

    return response;
  },

  customerSignup: async (data) => {
    const response = await apiClient.post("/Auth/customer/signup", data); // 👈 بدون /api

    if (response?.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user || response));
      localStorage.setItem("userType", "customer");
    }

    return response;
  },

  // =======================
  // ADMIN
  // =======================
  adminLogin: async (email, password) => {
    const response = await apiClient.post("/Auth/admin/login", { // 👈 بدون /api
      email,
      password,
    });

    if (
      response.requires2fa ||
      response.requiresTwoFactor ||
      response.requires2FA
    ) {
      return { ...response, requires2FA: true };
    }

    if (response?.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user || response));
      localStorage.setItem("userType", "admin");
    }

    return response;
  },

  adminUsersLogin: async (email, password) => {
    const response = await apiClient.post("/AdminUsers/Login", { // 👈 بدون /api
      email,
      password,
    });

    if (response?.id) {
      localStorage.setItem("token", response.token || `demo-${Date.now()}`);
      localStorage.setItem("user", JSON.stringify(response));
      localStorage.setItem("userType", "admin");
    }

    return response;
  },

  verify2FA: async (email, code) => {
    const response = await apiClient.post("/Auth/admin/verify-2fa", { // 👈 بدون /api
      email,
      code,
    });

    if (response?.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user || response));
      localStorage.setItem("userType", "admin");
    }

    return response;
  },

  logout: () => {
    localStorage.clear();
  },
};