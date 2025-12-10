import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, FileText, Settings, BarChart3, Bell, Search, Menu, X } from 'lucide-react';
import { Link , useNavigate} from "react-router-dom";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [productLoading, setProductLoading] = useState(true);
  const navigate = useNavigate();

  // Check token on component mount
  useEffect(() => {
    const checkToken = async () => {
      const token = window.localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("https://kenzy-api.usif.spaceseif.me/extrct_super", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token_user: token,
          }),
        });

        const result = await response.json();
        
        if (result.status !== "success") {
          navigate("/login");
        }
        if (result.info !== "super") {
           navigate("/login");
        }
      } catch (error) {
        console.error("Error checking token:", error);
        navigate("/login");
      }
    };

    checkToken();
  }, [navigate]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://kenzy-api.usif.spaceseif.me/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          setUserCount(data.length);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch total revenue/money data
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch('https://kenzy-api.usif.spaceseif.me/money', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        });
        
        if (response.ok) {
          const data = await response.json();
          // Sum all prices from the array
          const total = data.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
          setTotalRevenue(total);
        } else {
          console.error('Failed to fetch revenue data');
        }
      } catch (error) {
        console.error('Error fetching revenue:', error);
      } finally {
        setRevenueLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch('https://kenzy-api.usif.spaceseif.me/count_cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        });
        
        if (response.ok) {
          const data = await response.json();
          setCartCount(data.count || data.cart_count || (typeof data === 'number' ? data : 0));
        } else {
          console.error('Failed to fetch cart count');
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
      } finally {
        setCartLoading(false);
      }
    };

    fetchCartCount();
  }, []);

  // Fetch product count
  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await fetch('https://kenzy-api.usif.spaceseif.me/count_products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        });
        
        if (response.ok) {
          const data = await response.json();
          setProductCount(data.count || data.product_count || (typeof data === 'number' ? data : 0));
        } else {
          console.error('Failed to fetch product count');
        }
      } catch (error) {
        console.error('Error fetching product count:', error);
      } finally {
        setProductLoading(false);
      }
    };

    fetchProductCount();
  }, []);

   const stats = [
    { label: 'Total Users', value: loading ? '...' : userCount.toLocaleString(), change: '+12.5%', positive: true , go :"/super"},
    { label: 'Money', value: revenueLoading ? '...' : `$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, change: '+8.2%', positive: true , go :"/Super"},
    { label: 'Count Products', value: productLoading ? '...' : productCount.toLocaleString(), change: '+15.3%', positive: true , go :"/Product"},
    { label: 'Count Cart', value: cartLoading ? '...' : cartCount.toLocaleString(), change: '-3.1%', positive: true , go :"/super"},
  ];

  // Display users in recent activity (limit to 4)
  const recentActivity = users.slice(0, 4).map((user) => ({
    user: user.name || 'Unknown User',
    email: user.email || 'No email',
    action: 'Registered user',
    time: 'Recently'
  }));

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Flowing lines */}
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-12 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent transform -rotate-12 animate-pulse"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white/10 h-full"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white font-bold text-base md:text-lg">V</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-base md:text-xl">VEMS</h1>
                <p className="text-white/50 text-xs hidden sm:block">Admin Panel</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Search size={16} className="text-white/40" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-white text-sm w-32 lg:w-48"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
              <Bell size={18} className="md:w-5 md:h-5" />
              <span className="absolute top-0.5 right-0.5 md:top-1 md:right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-colors">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
              <span className="text-white text-sm font-medium hidden md:block">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-20"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative w-64 h-[calc(100vh-73px)] border-r border-white/10 bg-black/90 backdrop-blur-xl transition-transform duration-300 z-30`}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon size={20} className={activeTab === item.id ? 'text-orange-400' : ''} />
                  <span className="font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white/60 text-xs">System Status</span>
            </div>
            <p className="text-white text-sm font-medium">All Systems Operational</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-73px)] w-full lg:w-auto">
          {/* Welcome banner */}
          <div className="mb-4 md:mb-6 p-4 md:p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Welcome back, Admin</h2>
                <p className="text-sm md:text-base text-white/60">Here's what's happening with your platform today</p>
              </div>
              <div className="hidden md:block w-16 md:w-20 h-16 md:h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 opacity-20"></div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            {stats.map((stat, index) => (
              <Link to={stat.go}>
              <div
                key={index}
                className="p-4 md:p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <span className="text-white/60 text-xs md:text-sm">{stat.label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${stat.positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.value}</p>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full w-2/3 group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Recent Activity */}
            <div className="p-4 md:p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                Recent Activity
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </h3>
              <div className="space-y-3 md:space-y-4">
                {loading ? (
                  <p className="text-white/60 text-center py-4">Loading users...</p>
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 md:gap-4 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{activity.user}</p>
                        <p className="text-white/60 text-xs truncate">{activity.email}</p>
                      </div>
                      <span className="text-white/40 text-xs whitespace-nowrap hidden sm:block">{activity.time}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60 text-center py-4">No users found</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 md:p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Add notification', icon: Users , link : "/notf" },
                  { label: 'New Proudect', icon: FileText , link : "/Insert_proudect" },
                  { label: 'Orders', icon: BarChart3 , link : "/OrdersA" },
                  { label: 'Add admin', icon: BarChart3 , link : "/Add_admin" }
                ].map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link to={action.link} key={index} className='p-4 md:p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-gradient-to-br hover:from-orange-500/20 hover:to-red-500/20 hover:border-orange-500/30 transition-all duration-300 group'>
                      <button>
                        <Icon size={20} className="text-white/60 group-hover:text-orange-400 transition-colors mx-auto mb-2" />
                        <p className="text-white/80 text-xs md:text-sm font-medium">{action.label}</p>
                      </button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
    </div>
  );
}
