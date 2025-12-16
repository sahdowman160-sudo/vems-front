import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, Search, Filter, ChevronDown, Eye, User, MapPin, Phone, CreditCard } from 'lucide-react';
import { Link , useNavigate} from "react-router-dom";
export default function AdminOrders() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);


 const navigate = useNavigate();























  useEffect(() => {
    const checkToken = async () => {
      const token = window.localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("https://kenzy-api.usif.space/extrct_super", {
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
        if (result.info == "admin" || result.info == "super" ) {
           
        }
        else{
navigate("/login");
        }
      } catch (error) {
        console.error("Error checking token:", error);
        navigate("/login");
      }
    };

    checkToken();
  }, [navigate]);














  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Update order status
  const handleStatusChange = async (order, newStatus) => {
    setUpdatingOrderId(order.id);
    
    try {
      const response = await fetch('https://kenzy-api.usif.space/update_bay_stute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: order.order_id,
          id_product: order.id_product,
          stute: newStatus,
          token_user: order.token_user
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(o => 
          o.id === order.id ? { ...o, status: newStatus } : o
        )
      );

      showNotification(`Order status updated to ${newStatus}!`, 'success');
    } catch (error) {
      console.error('Error updating order status:', error);
      showNotification('Failed to update order status. Please try again.', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://kenzy-api.usif.space/get_bayA', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        
        // Transform API data to match component structure
        const transformedOrders = data.map((item, index) => {
          // Parse image array
          let imageUrl = '📦';
          try {
            const imageArray = JSON.parse(item.image);
            imageUrl = imageArray[0] || '📦';
          } catch (e) {
            imageUrl = item.image || '📦';
          }

          return {
            id: `ORD-${item.id_product}-${index}`,
            order_id: item.id,
            date: new Date(item.time).toISOString().split('T')[0],
            status: (item.stute || 'pending').toLowerCase(),
            total: `${parseFloat(item.price).toFixed(2)}`,
            items: [
              {
                name: item.name,
                quantity: item.quantity,
                price: `${parseFloat(item.price).toFixed(2)}`,
                image: imageUrl,
                category: item.category || 'N/A',
                size: item.size || 'N/A'
              }
            ],
            id_product: item.id_product,
            token_user: item.token_user,
            location: item.loction || '',
            time: item.time,
            way_payment: item.way_payment || 'N/A',
            category: item.category || 'N/A',
            size: item.size || 'N/A'
          };
        });

        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        showNotification('Failed to load orders', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: Package, color: 'from-blue-500 to-cyan-500' },
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: 'from-orange-500 to-red-500' },
    { label: 'Shipped', value: orders.filter(o => o.status === 'shipped').length, icon: Truck, color: 'from-blue-500 to-purple-500' },
    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
    { label: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, icon: XCircle, color: 'from-red-500 to-pink-500' }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      delivered: { label: 'Delivered', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
      shipped: { label: 'Shipped', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Truck },
      pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
      cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle }
    };
    return configs[status] || configs.pending;
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         order.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.token_user.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <div className={`px-6 py-4 rounded-xl backdrop-blur-xl border shadow-2xl ${
            notification.type === 'success' 
              ? 'bg-green-500/20 border-green-500/30 text-green-400' 
              : 'bg-red-500/20 border-red-500/30 text-red-400'
          }`}>
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <XCircle size={20} />
              )}
              <p className="font-medium">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-12 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent transform -rotate-12 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Package className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Admin - Order Management</h1>
              <p className="text-white/50 text-xs">Manage all customer orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="p-4 md:p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-white/60 text-xs">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <Search size={18} className="text-white/40" />
            <input
              type="text"
              placeholder="Search orders by ID, product, location, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-sm flex-1"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                  selectedFilter === filter
                    ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-white'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/60">Loading orders...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {['pending', 'shipped', 'delivered', 'cancelled'].map(status => {
              const ordersInStatus = filteredOrders.filter(order => order.status === status);
              if (ordersInStatus.length === 0) return null;

              const statusConfig = getStatusConfig(status);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={status} className="space-y-4">
                  {/* Status Section Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusConfig.color}`}>
                      <StatusIcon size={20} />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg">{statusConfig.label}</h2>
                      <p className="text-white/60 text-sm">{ordersInStatus.length} order{ordersInStatus.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {/* Orders in this status */}
                  {ordersInStatus.map((order) => {
                    return (
                      <div
                        key={order.id}
                        className="p-4 md:p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                              <Package className="text-white" size={24} />
                            </div>
                            <div>
                              <h3 className="text-white font-bold text-lg">{order.id}</h3>
                              <p className="text-white/60 text-sm">Ordered on {order.date}</p>
                              <p className="text-white/40 text-xs">User ID: {order.token_user}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-white font-bold text-lg">${order.total}</span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3 mb-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                                {item.image.startsWith('http') ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="text-4xl">{item.image}</div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-medium">{item.name}</p>
                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                  <p className="text-white/60 text-sm">Quantity: <span className="text-white font-semibold">{item.quantity}</span></p>
                                  <span className="text-white/30">•</span>
                                  <p className="text-white/60 text-sm">Size: <span className="text-white font-bold text-base">{item.size}</span></p>
                                  <span className="text-white/30">•</span>
                                  <p className="text-white/60 text-sm">Category: <span className="text-white/80">{item.category}</span></p>
                                </div>
                              </div>
                              <p className="text-white font-bold">${item.price}</p>
                            </div>
                          ))}
                        </div>

                        {/* Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-start gap-2">
                              <MapPin size={16} className="text-white/60 mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-white/60 text-xs mb-1">Delivery Address</p>
                                <p className="text-white text-sm">{order.location || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-start gap-2">
                              <CreditCard size={16} className="text-white/60 mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-white/60 text-xs mb-1">Payment Method</p>
                                <p className="text-white text-sm">{order.way_payment}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status Selector */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                          <div>
                            <p className="text-white/60 text-xs mb-1">Update Order Status</p>
                            <p className="text-white text-sm">Current: <span className="font-bold capitalize">{order.status}</span></p>
                          </div>
                          
                          <div className="flex gap-2 flex-wrap">
                            {['pending', 'shipped', 'delivered', 'cancelled'].map((statusOption) => (
                              <button
                                key={statusOption}
                                onClick={() => handleStatusChange(order, statusOption)}
                                disabled={order.status === statusOption || updatingOrderId === order.id}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                  order.status === statusOption
                                    ? 'bg-white/10 border border-white/20 text-white/60 cursor-not-allowed'
                                    : statusOption === 'pending'
                                    ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30'
                                    : statusOption === 'shipped'
                                    ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
                                    : statusOption === 'delivered'
                                    ? 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
                                    : 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                                }`}
                              >
                                {updatingOrderId === order.id ? (
                                  <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    Updating...
                                  </span>
                                ) : (
                                  statusOption.charAt(0).toUpperCase() + statusOption.slice(1)
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package size={48} className="text-white/20 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">No orders found</h3>
            <p className="text-white/60">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
