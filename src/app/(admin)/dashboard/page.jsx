'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell,
  faChevronDown,
  faDollarSign,
  faUsers,
  faShoppingCart,
  faCube,
  faClock,
  faTruck,
  faArrowUp,
  faBox,
  faExclamationTriangle,
  faSpinner,
  faSignOutAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  LineChart, Line, Area, Tooltip 
} from 'recharts';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5186';

// دالة للحصول على رؤوس المصادقة
const getAuthHeaders = () => {
  if (typeof window === 'undefined') {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }
  
  // تحقق من sessionStorage أولاً، ثم localStorage
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [notificationCount] = useState(5);
  const [timeRange, setTimeRange] = useState('Last 7 days');
  const [isChartLoaded, setIsChartLoaded] = useState(false);
  const [user, setUser] = useState(null);
  
  // States للبيانات من الـ API
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [orderStats, setOrderStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);

  // التحقق من المصادقة أولاً
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // تحقق من التوكن في أماكن متعددة
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        
        if (!token) {
          console.log('No token found, redirecting to login...');
          router.push('/adminlogin');
          return;
        }
        
        // تحقق من صحة التوكن
        try {
          const userData = sessionStorage.getItem('user') || localStorage.getItem('user');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        } catch (err) {
          console.log('Error parsing user data:', err);
        }
        
        setAuthLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/adminlogin');
      }
    };

    checkAuth();
  }, [router]);

  // تسجيل الخروج
  const handleLogout = () => {
    // مسح جميع بيانات المصادقة
    sessionStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    
    // مسح المتغير المؤقت
    if (typeof window !== 'undefined') {
      delete window.__AUTH_TOKEN;
    }
    
    router.push('/adminlogin');
  };

  // Fetch dashboard data from API
  useEffect(() => {
    if (authLoading) return; // انتظر حتى انتهاء التحقق من المصادقة

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard summary
        const summaryResponse = await axios.get(`${API_BASE_URL}/api/Dashboard/Summary`, {
          headers: getAuthHeaders()
        });
        setDashboardSummary(summaryResponse.data);
        
        // Fetch revenue trend
        const revenueResponse = await axios.get(`${API_BASE_URL}/api/Dashboard/RevenueTrend`, {
          headers: getAuthHeaders()
        });
        setRevenueTrend(revenueResponse.data);
        
        // Fetch top selling products
        const topSellingResponse = await axios.get(`${API_BASE_URL}/api/Dashboard/TopSelling`, {
          headers: getAuthHeaders()
        });
        setTopSelling(topSellingResponse.data);
        
        // Fetch order stats
        const orderStatsResponse = await axios.get(`${API_BASE_URL}/api/Orders/DashboardStats`, {
          headers: getAuthHeaders()
        });
        setOrderStats(orderStatsResponse.data);
        
        // Fetch category stats
        const categoryStatsResponse = await axios.get(`${API_BASE_URL}/api/Dashboard/CategoryStats`, {
          headers: getAuthHeaders()
        });
        setCategoryStats(categoryStatsResponse.data);
        
        // Fetch stock alerts
        const stockAlertsResponse = await axios.get(`${API_BASE_URL}/api/Dashboard/StockAlerts`, {
          headers: getAuthHeaders()
        });
        setStockAlerts(stockAlertsResponse.data);
        
        setIsChartLoaded(true);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Using demo data.');
        
        // استخدام بيانات تجريبية في حالة فشل الـ API
        setDashboardSummary({
          totalProducts: 125,
          totalOrders: 234,
          totalRevenue: 127450,
          totalReviews: 89,
          outOfStockProducts: 12,
          lowStockProducts: 8,
          featuredProducts: 24,
          arEnabledProducts: 13
        });
        
        setRevenueTrend([
          { date: '2025-12-21', revenue: 15420, ordersCount: 18 },
          { date: '2025-12-22', revenue: 18350, ordersCount: 22 },
          { date: '2025-12-23', revenue: 22100, ordersCount: 27 },
          { date: '2025-12-24', revenue: 19850, ordersCount: 25 },
          { date: '2025-12-25', revenue: 24300, ordersCount: 30 },
          { date: '2025-12-26', revenue: 28750, ordersCount: 35 },
          { date: '2025-12-27', revenue: 26400, ordersCount: 32 }
        ]);
        
        setTopSelling([
          {
            id: 1,
            name: 'Milano Luxury Sofa',
            category: 'Living Room',
            price: 2499,
            sold: 24,
            imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/bbfc080f99-9a262e7b28390510d644.png'
          },
          {
            id: 2,
            name: 'Walnut Dining Table',
            category: 'Dining Room',
            price: 1899,
            sold: 18,
            imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/1b8c72839f-d44af22d32197ed4839f.png'
          },
          {
            id: 3,
            name: 'Executive Office Chair',
            category: 'Office',
            price: 899,
            sold: 31,
            imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/80381d916d-9af6adfa8290e1dea3df.png'
          }
        ]);
        
        setOrderStats({
          pending: 43,
          processing: 12,
          shipped: 87,
          delivered: 156,
          cancelled: 8
        });
        
        setCategoryStats([
          { categoryName: 'Living Room', productCount: 45, totalStock: 340, averagePrice: 1899 },
          { categoryName: 'Bedroom', productCount: 32, totalStock: 280, averagePrice: 1499 },
          { categoryName: 'Dining Room', productCount: 28, totalStock: 210, averagePrice: 1299 },
          { categoryName: 'Office', productCount: 20, totalStock: 180, averagePrice: 899 }
        ]);
        
        setStockAlerts([
          { id: 1, name: 'Velvet Accent Chair', sku: 'VAC-001', stockQuantity: 3, alertQuantity: 5 },
          { id: 2, name: 'Marble Coffee Table', sku: 'MCT-002', stockQuantity: 2, alertQuantity: 5 }
        ]);
        
        setIsChartLoaded(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authLoading]);

  // تحويل بيانات الإيرادات للرسم البياني
  const salesData = revenueTrend.map(item => ({
    day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    sales: item.revenue || 0,
    orders: item.ordersCount || 0
  }));

  // تحويل بيانات حالة الطلبات للرسم البياني الدائري
  const orderStatusData = orderStats ? [
    { name: 'Completed', value: orderStats.delivered || 156, color: '#10B981' },
    { name: 'Shipped', value: orderStats.shipped || 43, color: '#3B82F6' },
    { name: 'Pending', value: orderStats.pending || 27, color: '#F59E0B' },
    { name: 'Cancelled', value: orderStats.cancelled || 8, color: '#EF4444' }
  ] : [];

  // تحضير البيانات للمقاييس الرئيسية
  const metrics = [
    {
      id: 1,
      title: 'Total Revenue',
      value: dashboardSummary ? `$${dashboardSummary.totalRevenue?.toLocaleString() || '0'}` : '$0',
      change: '+12.5% from last month',
      icon: faDollarSign,
      color: 'var(--luxury-gold)',
      bgColor: 'bg-[var(--luxury-gold)]/10'
    },
    {
      id: 2,
      title: 'Total Orders',
      value: dashboardSummary ? dashboardSummary.totalOrders?.toLocaleString() || '0' : '0',
      change: '+8.2% from yesterday',
      icon: faShoppingCart,
      color: '#3B82F6',
      bgColor: 'bg-blue-100'
    },
    {
      id: 3,
      title: 'Pending Orders',
      value: orderStats ? orderStats.pending?.toString() || '0' : '0',
      change: 'Requires attention',
      icon: faClock,
      color: '#F59E0B',
      bgColor: 'bg-orange-100'
    },
    {
      id: 4,
      title: 'AR Products',
      value: dashboardSummary ? dashboardSummary.arEnabledProducts?.toString() || '0' : '0',
      change: '+24.1% this week',
      icon: faCube,
      color: '#8B5CF6',
      bgColor: 'bg-purple-100'
    }
  ];

  // نشاطات حديثة
  const recentActivities = [
    {
      id: 1,
      type: 'order',
      title: 'New order received',
      description: 'Order #1247 - Milano Luxury Sofa - $2,499',
      time: '2 min ago',
      color: '#10B981',
      icon: faShoppingCart
    },
    {
      id: 2,
      type: 'ar',
      title: 'AR interaction logged',
      description: 'Customer viewed Walnut Dining Table in AR',
      time: '5 min ago',
      color: '#3B82F6',
      icon: faCube
    },
    {
      id: 3,
      type: 'shipping',
      title: 'Order shipped',
      description: 'Order #1243 - Executive Office Chair shipped to customer',
      time: '1 hour ago',
      color: '#F59E0B',
      icon: faTruck
    }
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--soft-gray)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--luxury-gold)] mx-auto mb-4"></div>
          <p className="text-gray-600">{authLoading ? 'Checking authentication...' : 'Loading dashboard data...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--soft-gray)]">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--charcoal)]">Dashboard</h1>
              <p className="text-gray-600 text-sm">Welcome back, {user?.name || user?.email || 'Admin'}!</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-[var(--luxury-gold)] transition-colors">
                <FontAwesomeIcon icon={faBell} className="text-xl" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
              
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="bg-[var(--luxury-gold)] text-white w-10 h-10 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div>
                  <p className="font-medium text-[var(--charcoal)]">{user?.name || user?.email || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--charcoal)] mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your furniture store today.</p>
        </div>

        {/* Key Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <div 
              key={metric.id} 
              className="bg-white rounded-xl p-6 shadow-sm"
              style={{ borderLeft: `4px solid ${metric.color}` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-3xl font-bold text-[var(--charcoal)]">{metric.value}</p>
                  <p className={`text-sm ${metric.change.includes('+') ? 'text-green-600' : 'text-orange-600'} flex items-center mt-1`}>
                    {metric.change.includes('+') ? (
                      <FontAwesomeIcon icon={faArrowUp} className="mr-1 text-xs" />
                    ) : (
                      <FontAwesomeIcon icon={faClock} className="mr-1 text-xs" />
                    )}
                    {metric.change}
                  </p>
                </div>
                <div className={`${metric.bgColor} p-3 rounded-lg`}>
                  <FontAwesomeIcon 
                    icon={metric.icon} 
                    className="text-2xl"
                    style={{ color: metric.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[var(--charcoal)]">Revenue Overview</h3>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            
            {isChartLoaded && salesData.length > 0 && (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                      labelFormatter={(label) => `Day: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="var(--luxury-gold)"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      fill="var(--luxury-gold)"
                      fillOpacity={0.1}
                      stroke="none"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* Order Status Chart */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[var(--charcoal)]">Order Status Distribution</h3>
            </div>
            
            {isChartLoaded && orderStatusData.length > 0 && (
              <>
                <div className="h-[250px] mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Orders']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 space-y-2">
                  {orderStatusData.map((status) => (
                    <div key={status.name} className="flex justify-between items-center text-sm">
                      <span className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                        <span>{status.name}</span>
                      </span>
                      <span className="font-semibold">{status.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>

        {/* Products and Stock Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Best Selling Products */}
          <section className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[var(--charcoal)] mb-6">Best Selling Products</h3>
            <div className="space-y-4">
              {topSelling.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-[var(--soft-gray)] rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={product.imageUrl || product.image || 'https://via.placeholder.com/64x64'} 
                      alt={product.name} 
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-[var(--charcoal)]">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[var(--charcoal)]">${product.price?.toLocaleString() || '0'}</p>
                    <p className="text-sm text-gray-600">{product.sold || 0} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stock Alerts */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[var(--charcoal)]">Stock Alerts</h3>
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-500" />
            </div>
            
            <div className="space-y-3">
              {stockAlerts.length > 0 ? (
                stockAlerts.map((alert, index) => (
                  <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[var(--charcoal)]">{alert.name}</p>
                        <p className="text-sm text-gray-600">SKU: {alert.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">{alert.stockQuantity}</p>
                        <p className="text-xs text-gray-500">in stock</p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-orange-700">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                      Below alert quantity ({alert.alertQuantity})
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <FontAwesomeIcon icon={faBox} className="text-3xl mb-2 text-gray-300" />
                  <p>No stock alerts</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Category Performance */}
        <section className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-xl font-semibold text-[var(--charcoal)] mb-6">Category Performance</h3>
          {categoryStats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryStats.map((category, index) => (
                <div key={index} className="p-4 bg-[var(--soft-gray)] rounded-lg">
                  <h4 className="font-semibold text-[var(--charcoal)] mb-2">{category.categoryName}</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Products:</span>
                      <span className="font-semibold">{category.productCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Stock:</span>
                      <span className="font-semibold">{category.totalStock}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Price:</span>
                      <span className="font-semibold">${category.averagePrice?.toLocaleString() || '0'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No category data available</p>
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[var(--charcoal)] mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-center space-x-4 p-4 rounded-r-lg"
                style={{ 
                  borderLeft: `4px solid ${activity.color}`,
                  backgroundColor: `${activity.color}10`
                }}
              >
                <div 
                  className="text-white rounded-full p-2"
                  style={{ backgroundColor: activity.color }}
                >
                  <FontAwesomeIcon icon={activity.icon} className="text-sm" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[var(--charcoal)]">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
} 