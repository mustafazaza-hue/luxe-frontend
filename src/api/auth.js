import apiClient from './apiClient';

export const authApi = {
  customerLogin: async (email, password) => {
    try {
      const response = await apiClient.post('/Auth/customer/login', { 
        email, 
        password 
      });
      
      console.log('Customer login response:', response);
      
      // تخزين بيانات المستخدم
      if (response?.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user || response));
        localStorage.setItem('userType', 'customer');
      }
      
      return response;
    } catch (error) {
      console.error('Customer login error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Customer signup - إضافة هذا الـ API المفقود
  customerSignup: async (userData) => {
    try {
      const response = await apiClient.post('/Auth/customer/signup', userData);
      
      console.log('Customer signup response:', response);
      
      // إذا كان التسجيل يتضمن تسجيل دخول تلقائي
      if (response?.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user || response));
        localStorage.setItem('userType', 'customer');
      }
      
      return response;
    } catch (error) {
      console.error('Customer signup error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Admin login - استخدم الـ API الصحيح
  adminLogin: async (email, password) => {
    try {
      const response = await apiClient.post('/Auth/admin/login', { 
        email, 
        password 
      });
      
      console.log('Admin login response:', response);
      
      // معالجة استجابة 2FA
      if (response.requires2fa || response.requiresTwoFactor || response.requires2FA) {
        return { ...response, requires2FA: true };
      }
      
      if (response?.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user || response));
        localStorage.setItem('userType', 'admin');
      }
      
      return response;
    } catch (error) {
      console.error('Admin login error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Alternative: AdminUsers login endpoint
  adminUsersLogin: async (email, password) => {
    try {
      const response = await apiClient.post('/AdminUsers/Login', {
        email,
        password
      });
      
      console.log('AdminUsers login response:', response);
      
      // تخزين بيانات المستخدم
      if (response?.id) {
        localStorage.setItem('token', response.token || 'dummy-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('userType', 'admin');
      }
      
      return response;
    } catch (error) {
      console.error('AdminUsers login error:', error);
      throw error;
    }
  },

  // Verify 2FA - محدث ليتطابق مع الـ API
  verify2FA: async (email, code) => {
    try {
      const response = await apiClient.post('/Auth/admin/verify-2fa', { 
        email, 
        code 
      });
      
      console.log('2FA verification response:', response);
      
      if (response?.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user || response));
        localStorage.setItem('userType', 'admin');
      }
      
      return response;
    } catch (error) {
      console.error('2FA verification error:', error);
      throw error;
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/Auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiClient.post('/Auth/reset-password', { 
        token, 
        newPassword 
      });
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // Get profile
  getProfile: async () => {
    try {
      const response = await apiClient.get('/Auth/profile');
      
      if (response) {
        localStorage.setItem('user', JSON.stringify(response));
      }
      
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      if (error.response?.status === 401) {
        this.clearAuthData();
      }
      throw error;
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/Auth/profile', profileData);
      
      if (response) {
        localStorage.setItem('user', JSON.stringify(response));
      }
      
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiClient.post('/Auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      this.clearAuthData();
    }
  },

  // Helper function to clear auth data
  clearAuthData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  },

  // Helper functions
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('userType') === 'admin';
  },

  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  getAuthToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
};
