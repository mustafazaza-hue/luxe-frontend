import axios from 'axios';

const API_BASE_URL = 'http://localhost:5186/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsApi = {
  getAll: () => api.get('/Products'),
  
  getArEnabled: () => api.get('/Products/ar-enabled'),
  
  getById: (id) => api.get(`/Products/${id}`),
  
  create: (productData) => api.post('/Furniture/Products', productData),
  
  update: (id, productData) => api.put(`/Furniture/Products/${id}`, productData),
  
  delete: (id) => api.delete(`/Furniture/Products/${id}`),
  
  getLowStock: () => api.get('/Products/low-stock'),
  
  getNewArrivals: () => api.get('/Products/new-arrivals'),
  
  getFeatured: () => api.get('/Products/featured'),
  
  getCategoryProducts: (categoryName) => api.get(`/Products/category/${categoryName}`),
  
  getStats: () => api.get('/Products/stats'),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/Categories'),
  
  getSimple: () => api.get('/Categories/simple'),
  
  create: (categoryData) => api.post('/Categories', categoryData),
  
  getById: (id) => api.get(`/Categories/${id}`),
  
  update: (id, categoryData) => api.put(`/Categories/${id}`, categoryData),
  
  delete: (id) => api.delete(`/Categories/${id}`),
};

// Dashboard API
export const dashboardApi = {
  getSummary: () => api.get('/Dashboard/Summary'),
  
  getCategoryStats: () => api.get('/Dashboard/CategoryStats'),
  
  getStockAlerts: () => api.get('/Dashboard/StockAlerts'),
  
  getTopSelling: () => api.get('/Dashboard/TopSelling'),
  
  getRevenueTrend: () => api.get('/Dashboard/RevenueTrend'),
};

// Orders API
export const ordersApi = {
  getAll: () => api.get('/Orders'),
  
  getById: (id) => api.get(`/Orders/${id}`),
  
  create: (orderData) => api.post('/Orders/Create', orderData),
  
  update: (id, orderData) => api.put(`/Orders/${id}`, orderData),
  
  delete: (id) => api.delete(`/Orders/${id}`),
  
  updateStatus: (id, statusData) => api.put(`/Orders/${id}/Status`, statusData),
  
  getStats: () => api.get('/Orders/Stats'),
  
  getDashboardStats: () => api.get('/Orders/DashboardStats'),
  
  getRecent: () => api.get('/Orders/Recent'),
};

// Authentication API
export const authApi = {
  adminLogin: (loginData) => api.post('/Auth/admin/login', loginData),
  
  verify2FA: (verifyData) => api.post('/Auth/admin/verify-2fa', verifyData),
  
  getProfile: () => api.get('/Auth/profile'),
  
  updateProfile: (profileData) => api.put('/Auth/profile', profileData),
  
  logout: () => api.post('/Auth/logout'),
  
  customerLogin: (loginData) => api.post('/Auth/customer/login', loginData),
  
  customerSignup: (signupData) => api.post('/Auth/customer/signup', signupData),
};

// Reviews API
export const reviewsApi = {
  getAll: () => api.get('/Reviews'),
  
  create: (reviewData) => api.post('/Reviews', reviewData),
  
  getById: (id) => api.get(`/Reviews/${id}`),
  
  delete: (id) => api.delete(`/Reviews/${id}`),
  
  getProductReviews: (productName) => api.get(`/Reviews/Product/${productName}`),
  
  approve: (id) => api.put(`/Reviews/${id}/Approve`),
  
  reject: (id) => api.put(`/Reviews/${id}/Reject`),
  
  getStats: () => api.get('/Reviews/Stats'),
};

// Wishlist API
export const wishlistApi = {
  getAll: (params) => api.get('/Wishlist', { params }),
  
  create: (wishlistData) => api.post('/Wishlist', wishlistData),
  
  getSummary: () => api.get('/Wishlist/Summary'),
  
  getById: (id) => api.get(`/Wishlist/${id}`),
  
  update: (id, data) => api.put(`/Wishlist/${id}`, data),
  
  delete: (id) => api.delete(`/Wishlist/${id}`),
  
  moveToCart: (id) => api.post(`/Wishlist/MoveToCart/${id}`),
  
  clear: () => api.post('/Wishlist/Clear'),
  
  getSuggestions: () => api.get('/Wishlist/Suggestions'),
  
  compare: (itemIds) => api.get('/Wishlist/Compare', { params: { itemIds } }),
};

// Cart API
export const cartApi = {
  getCart: () => api.get('/Cart'),
  
  addItem: (itemData) => api.post('/Cart/AddItem', itemData),
  
  removeItem: (itemId) => api.delete(`/Cart/RemoveItem/${itemId}`),
  
  clear: () => api.post('/Cart/Clear'),
};

// Checkout API
export const checkoutApi = {
  process: (checkoutData) => api.post('/Checkout/Process', checkoutData),
};

// Offers API
export const offersApi = {
  getAll: () => api.get('/Offers'),
  
  create: (offerData) => api.post('/Offers', offerData),
  
  getActive: () => api.get('/Offers/Active'),
  
  getForProduct: (productId) => api.get(`/Offers/ForProduct/${productId}`),
  
  getById: (id) => api.get(`/Offers/${id}`),
  
  update: (id, offerData) => api.put(`/Offers/${id}`, offerData),
  
  delete: (id) => api.delete(`/Offers/${id}`),
  
  getStats: () => api.get('/Offers/Stats'),
};

// Shipping API
export const shippingApi = {
  getCarriers: () => api.get('/ShippingCarriers'),
  
  createCarrier: (carrierData) => api.post('/ShippingCarriers', carrierData),
  
  getCarrierById: (id) => api.get(`/ShippingCarriers/${id}`),
  
  updateCarrier: (id, carrierData) => api.put(`/ShippingCarriers/${id}`, carrierData),
  
  deleteCarrier: (id) => api.delete(`/ShippingCarriers/${id}`),
  
  getRates: () => api.get('/admin/shipping-rates'),
  
  createRate: (rateData) => api.post('/admin/shipping-rates', rateData),
  
  updateRate: (id, rateData) => api.put(`/admin/shipping-rates/${id}`, rateData),
};

// Users API
export const usersApi = {
  getAll: () => api.get('/AdminUsers'),
  
  create: (userData) => api.post('/AdminUsers', userData),
  
  getById: (id) => api.get(`/AdminUsers/${id}`),
  
  update: (id, userData) => api.put(`/AdminUsers/${id}`, userData),
  
  delete: (id) => api.delete(`/AdminUsers/${id}`),
  
  login: (loginData) => api.post('/AdminUsers/Login', loginData),
};

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;