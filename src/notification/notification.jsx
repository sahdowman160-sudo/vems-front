import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Settings , ArrowLeft } from 'lucide-react';
import Footer from "../footer/footer";
import { Link } from 'react-router-dom';
import img from "../main/logo.jpg";
import { IoIosArrowBack } from 'react-icons/io';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('https://kenzy-api.usif.space/message');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Transform the fetched data to match the expected notification format
        const transformedNotifications = data.map((item, index) => ({
          id: item.id || index + 1,
          type: item.type || 'info',
          title: item.title || 'Notification',
          message: item.message || 'New message',
          time: item.time || 'Just now',
          read: item.read || false
        }));
        
        setNotifications(transformedNotifications);
      } catch (err) {
        setError(err.message);
        // Fallback to mock data if fetch fails
        setNotifications([
          {
            id: 1,
            type: 'success',
            title: 'Account Verified',
            message: 'Your account has been successfully verified and is ready to use.',
            time: '2 minutes ago',
            read: false
          },
          {
            id: 2,
            type: 'warning',
            title: 'Security Alert',
            message: 'New login detected from Cairo, Egypt. If this wasn\'t you, secure your account.',
            time: '1 hour ago',
            read: false
          },
          {
            id: 3,
            type: 'info',
            title: 'System Update',
            message: 'We\'ve updated our privacy policy. Review the changes in your settings.',
            time: '3 hours ago',
            read: true
          },
          {
            id: 4,
            type: 'success',
            title: 'Payment Confirmed',
            message: 'Your payment of $29.99 has been processed successfully.',
            time: '1 day ago',
            read: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <div className="w-2 h-2 bg-green-400 rounded-full"></div>;
      case 'warning':
        return <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>;
      case 'info':
        return <div className="w-2 h-2 bg-blue-400 rounded-full"></div>;
      case 'error':
        return <div className="w-2 h-2 bg-red-400 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10 text-center p-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Connection Error</h2>
          <p className="text-slate-300 mb-4">Failed to load notifications: {error}</p>
          <p className="text-slate-400 text-sm">Showing cached data instead...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-32 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-60 left-1/2 w-1 h-1 bg-blue-300 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-purple-300 rounded-full animate-ping delay-1500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-between p-8">
                  <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                    <Link to="/profile">
                      <button className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200">
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </button>
                    </Link>
                  </div>
        <div className="flex items-center space-x-4">
                     
          <img src={"https://i.ibb.co/QvKdRXDr/Whats-App-Image-2025-12-15-at-10-32-04-e58c092b.jpg"} alt="" className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center" />
       
          <h1 className="text-2xl font-bold text-white">Kenzy</h1>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header Card */}
          <div className="mb-6 p-6 rounded-2xl bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bell className="w-8 h-8 text-blue-400" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {unreadCount}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Notifications</h1>
                  <p className="text-slate-400 text-sm">Stay updated with your activities</p>
                </div>
              </div>
            </div>
{/*             
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="w-full py-2 px-4 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-medium transition-all duration-200 border border-blue-400/30"
              >
                Mark all as read
              </button>
            )} */}
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-2xl backdrop-blur-xl border shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                  notification.read 
                    ? 'bg-slate-800/20 border-slate-700/30' 
                    : 'bg-slate-800/40 border-slate-600/50 ring-1 ring-blue-400/20'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold ${notification.read ? 'text-slate-300' : 'text-white'}`}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm mt-1 ${notification.read ? 'text-slate-500' : 'text-slate-400'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-600 mt-2">
                          {notification.time}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="p-8 rounded-2xl bg-slate-800/20 backdrop-blur-xl border border-slate-700/30 text-center">
              <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">All caught up!</h3>
              <p className="text-slate-400 text-sm">You don't have any notifications right now.</p>
            </div>
          )}

          {/* Footer */}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
