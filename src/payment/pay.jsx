import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Truck, MapPin, User, Mail, Phone, Lock, Check, Navigation } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom"

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [isFromCart, setIsFromCart] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    // Shipping Info
    firstName: '',
    lastName: '',
    phone2: '',
    phone1: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Egypt',
    latitude: '',
    longitude: '',
    
    // Payment Info
    paymentMethod: 'cash', // 'cash' or 'wallet'
    
    // Shipping Options
    shippingMethod: 'standard'
  });

  // Load order items from localStorage
  useEffect(() => {
    try {
      const buyNowProduct = localStorage.getItem('buyNowProduct');
      if (buyNowProduct) {
        const productData = JSON.parse(buyNowProduct);
        console.log('Loaded buyNowProduct:', productData);
        
        // Check if this is from cart (multiple items)
        if (productData.source === 'cart' && productData.orderDetails) {
          setIsFromCart(true);
          setOrderItems(productData.orderDetails.items);
          console.log('Loading cart items:', productData.orderDetails.items);
        }
        // Check if orderDetails exists (backward compatibility)
        else if (productData.orderDetails && productData.orderDetails.items && productData.orderDetails.items.length > 0) {
          setOrderItems(productData.orderDetails.items);
        } 
        // Array of products
        else if (Array.isArray(productData)) {
          setOrderItems(productData);
        } 
        // Single product - convert to array format
        else {
          setOrderItems([{
            id: productData.id || productData.product_id || 1,
            name: productData.name || productData.title || 'Product',
            color: productData.color || productData.category || 'N/A',
            size: productData.size || 'N/A',
            quantity: productData.quantity || 1,
            price: productData.price || 0,
            token_user: productData.token_user || localStorage.getItem('token') || 'guest',
            image: productData.image || ''
          }]);
        }
      }
    } catch (error) {
      console.error('Error loading product from localStorage:', error);
    }
  }, []);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Show notification function
  const showNotification = (message, type = 'error') => {
    setNotification({ show: true, message, type });
  };

  // Get location using browser's geolocation API
  const getLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            
            setFormData(prev => ({
              ...prev,
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              address: data.address.road || data.display_name,
              city: data.address.city || data.address.town || data.address.village || '',
              state: data.address.state || '',
              zipCode: data.address.postcode || '',
              country: data.address.country || 'Egypt'
            }));
            showNotification('Location detected successfully!', 'success');
          } catch (error) {
            console.error('Error getting address:', error);
            showNotification('Could not get address from location. Please enter manually.', 'error');
          }
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          showNotification('Could not get your location. Please enable location access.', 'error');
          setLoadingLocation(false);
        }
      );
    } else {
      showNotification('Geolocation is not supported by your browser', 'error');
      setLoadingLocation(false);
    }
  };

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price ), 0);
  const shippingCost = 60; // Fixed 60 EGP
  const tax = subtotal * 0.075; // 7.5% VAT
  const total = subtotal + shippingCost ;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validation for shipping information
  const validateShippingInfo = () => {
    const requiredFields = [
      { field: 'firstName', label: 'First Name' },
      { field: 'lastName', label: 'Last Name' },
      { field: 'phone1', label: 'Phone 1' },
      { field: 'phone2', label: 'Phone 2' },
      { field: 'address', label: 'Address' },
      { field: 'city', label: 'City' },
      { field: 'state', label: 'State' },
      { field: 'zipCode', label: 'ZIP Code' }
    ];
    
    for (let item of requiredFields) {
      if (!formData[item.field] || formData[item.field].trim() === '') {
        showNotification(`Please fill in ${item.label}`, 'error');
        return false;
      }
    }
    
    return true;
  };

  const nextStep = () => {
    // Validate current step before moving to next
    if (currentStep === 1) {
      if (!validateShippingInfo()) {
        return; // Don't proceed if validation fails
      }
    }
    
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handlePlaceOrder = async () => {
    try {
      const buyNowProduct = localStorage.getItem('buyNowProduct');
      let productData = buyNowProduct ? JSON.parse(buyNowProduct) : {};
      
      // Get user token
      const userToken = productData.token_user || 
                       localStorage.getItem('token') || 
                       localStorage.getItem('token_user') || 
                       'guest';
      
      console.log('Order Items:', orderItems);
      console.log('User Token:', userToken);
      console.log('Is From Cart:', isFromCart);
      
      // Prepare order data for localStorage
      const orderData = {
        ...productData,
        orderDetails: {
          items: orderItems,
          subtotal: subtotal,
          shippingCost: shippingCost,
       
          total: total
        },
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone1: formData.phone1,
          phone2: formData.phone2,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          latitude: formData.latitude,
          longitude: formData.longitude,
          shippingMethod: formData.shippingMethod
        },
        paymentInfo: {
          method: formData.paymentMethod,
          methodLabel: formData.paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'الدفع بواسطة المحفظة'
        },
        orderDate: new Date().toISOString(),
        orderStatus: 'pending'
      };
      
      // Save to localStorage
      localStorage.setItem('buyNowProduct', JSON.stringify(orderData));
      
      // If from cart, send each item as separate order to API
      if (isFromCart && orderItems.length > 0) {
        const orderPromises = orderItems.map(item => {
          const apiData = {
            id_product: item.id.toString(),
            price: (item.price + 60).toString(),
            way_payment: formData.paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'الدفع بواسطة المحفظة',
            loction: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}, ${formData.country}${formData.latitude ? ` (${formData.latitude}, ${formData.longitude})` : ''}`,
            time: new Date().toISOString(),
            size: item.size || 'N/A',
            stute: 'pending',
            quantity: item.quantity.toString(),
            token_user: userToken,
            phone1: formData.phone1,
            phone2: formData.phone2
          };
          
          console.log('Sending order for item:', item.name, apiData);
          
          return fetch('http://127.0.0.1:8000/Bay', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData)
          });
        });
        
        // Wait for all orders to complete
        const responses = await Promise.all(orderPromises);
        
        // Check if all orders succeeded
        const allSucceeded = responses.every(response => response.ok);
        
        if (allSucceeded) {
          showNotification('تم تقديم الطلب بنجاح! All orders placed successfully!', 'success');
          
          // Delete cart items after successful order
          if (orderItems.length > 0) {
            const deletePromises = orderItems.map(item => {
              if (item.cart_id) {
                return fetch('http://127.0.0.1:8000/Delet_cart', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ 
                    token_user: userToken, 
                    id: item.cart_id 
                  })
                });
              }
              return Promise.resolve();
            });
            
            await Promise.all(deletePromises);
            console.log('Cart cleared successfully');
          }
          
          // Wait 2 seconds before redirecting
          setTimeout(() => {
            localStorage.removeItem('buyNowProduct');
            navigate('/');
          }, 2000);
        } else {
          throw new Error('Some orders failed');
        }
      } 
      // Single product order
      else {
        const apiData = {
          id_product: orderItems.map(item => item.id).join(','),
          price: total.toString(),
          way_payment: formData.paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'الدفع بواسطة المحفظة',
          loction: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}, ${formData.country}${formData.latitude ? ` (${formData.latitude}, ${formData.longitude})` : ''}`,
          time: new Date().toISOString(),
          size: orderItems.map(item => item.size || 'N/A').join(','),
          stute: 'pending',
          quantity: orderItems.reduce((sum, item) => sum + item.quantity, 0).toString(),
          token_user: userToken,
          phone1: formData.phone1,
          phone2: formData.phone2
        };
        
        console.log('Sending single order:', apiData);
        
        const response = await fetch('http://127.0.0.1:8000/Bay', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Order placed successfully:', result);
        
        showNotification('تم تقديم الطلب بنجاح! Order placed successfully!', 'success');
        
        // Wait 2 seconds before redirecting
        setTimeout(() => {
          localStorage.removeItem('buyNowProduct');
          navigate('/');
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error placing order:', error);
      showNotification('حدث خطأ في تقديم الطلب. Error placing order.', 'error');
    }
  };

  const steps = [
    { id: 1, title: 'Shipping', icon: Truck },
    { id: 2, title: 'Payment', icon: CreditCard },
    { id: 3, title: 'Review', icon: Check }
  ];

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
      
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Modern Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
            notification.type === 'success' 
              ? 'bg-green-500/20 border-green-400/30 text-green-300' 
              : 'bg-red-500/20 border-red-400/30 text-red-300'
          }`}>
            {notification.type === 'success' ? (
              <Check className="w-5 h-5 flex-shrink-0" />
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className="font-medium text-sm">{notification.message}</p>
            <button 
              onClick={() => setNotification({ show: false, message: '', type: '' })}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-12 animate-pulse"></div>
          <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent transform -rotate-12 animate-pulse delay-500"></div>
        </div>
        
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white/10 h-full"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 lg:mb-8">
            <Link to={isFromCart ? "/cart" : "/"}>
              <button className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </Link>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Checkout {isFromCart && `(${orderItems.length} items)`}
            </h1>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 lg:mb-12">
            <div className="flex items-center justify-center gap-4 sm:gap-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 ${
                    currentStep >= step.id 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-400 text-black' 
                      : 'bg-white/10 backdrop-blur-sm border-white/30 text-white/60'
                  }`}>
                    <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className={`ml-2 text-sm sm:text-base font-medium hidden sm:block ${
                    currentStep >= step.id ? 'text-white' : 'text-white/60'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 sm:w-16 h-px mx-4 ${
                      currentStep > step.id ? 'bg-yellow-400' : 'bg-white/20'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Main Form */}
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8">
                
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-yellow-400" />
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Shipping Information</h2>
                      </div>
                      <button
                        onClick={getLocation}
                        disabled={loadingLocation}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 rounded-xl border border-yellow-400/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Navigation className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {loadingLocation ? 'Getting Location...' : 'Use My Location'}
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-white/80 text-sm mb-2">First Name *</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-2">Last Name *</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-white/80 text-sm mb-2">Phone 2 *</label>
                        <input
                          type="text"
                          value={formData.phone2}
                          onChange={(e) => handleInputChange('phone2', e.target.value)}
                          className="w-full p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                          placeholder="+20 xxx xxx xxxx"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-2">Phone 1 *</label>
                        <input
                          type="text"
                          value={formData.phone1}
                          onChange={(e) => handleInputChange('phone1', e.target.value)}
                          className="w-full p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                          placeholder="+20 xxx xxx xxxx"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">Address *</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                        placeholder="123 Main Street"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-white/80 text-sm mb-2">City *</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                          placeholder="Cairo"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-2">State *</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="w-full p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                          placeholder="Cairo"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-2">ZIP Code *</label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className="w-full p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                          placeholder="11511"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-400/20">
                      <div className="flex items-start gap-3">
                        <Truck className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-blue-300 font-medium text-sm">Standard Delivery</p>
                          <p className="text-blue-200/80 text-xs mt-1">Shipping cost: 60 EGP • Delivery in 3-4 business days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <CreditCard className="w-5 h-5 text-yellow-400" />
                      <h2 className="text-xl sm:text-2xl font-bold text-white">طريقة الدفع / Payment Method</h2>
                    </div>
                    <div className="space-y-4">
                      <label className="flex items-start p-5 rounded-xl bg-white/5 border-2 border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                          className="mt-1 text-yellow-400 focus:ring-yellow-400 focus:ring-2"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-semibold text-lg"> الدفع عند الستلام </span>
                            <CreditCard className="w-6 h-6 text-yellow-400" />
                          </div>
      <p className="text-white/70 text-sm mt-2">ادفع نقداً عند استلام الطلب</p>
                          <p className="text-white/50 text-xs mt-1">Cash on Delivery - Pay when you receive your order</p>
                        </div>
                      </label>
                    </div>
                    <div className="space-y-4">
                      <label className="flex items-start p-5 rounded-xl bg-white/5 border-2 border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          value="wallet"
                          checked={formData.paymentMethod === 'wallet'}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                          className="mt-1 text-yellow-400 focus:ring-yellow-400 focus:ring-2"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-semibold text-lg">الدفع بواسطة المحفظة</span>
                            <CreditCard className="w-6 h-6 text-yellow-400" />
                          </div>
                          <p className="text-white/70 text-sm mt-2">ادفع باستخدام محفظتك الإلكترونية</p>
                          <p className="text-white/50 text-xs mt-1">Digital Wallet Payment - Pay using your digital wallet</p>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-400/20 mt-6">
                      <Lock className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-green-300 font-medium text-sm">دفع آمن / Secure Payment</p>
                        <p className="text-green-200/80 text-xs mt-1">جميع معاملاتك محمية ومشفرة / Your transactions are protected and encrypted</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Order Review */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Check className="w-5 h-5 text-yellow-400" />
                      <h2 className="text-xl sm:text-2xl font-bold text-white">Order Review</h2>
                    </div>

                    {/* Shipping Details */}
                    <div className="p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-4">Shipping Address</h3>
                      <div className="text-white/80 space-y-1">
                        <p>{formData.firstName} {formData.lastName}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                        <p>{formData.country}</p>
                        <p className="text-white/60 text-sm mt-2">{formData.phone2}</p>
                        <p className="text-white/60 text-sm">{formData.phone1}</p>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-4">طريقة الدفع / Payment Method</h3>
                      <div className="text-white/80">
                        <p className="font-medium">
                          {formData.paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'الدفع بواسطة المحفظة'}
                        </p>
                        <p className="text-white/60 text-sm mt-1">
                          {formData.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Digital Wallet Payment'}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
                      <div className="space-y-3">
                        {orderItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center">
                            <div>
                              <p className="text-white font-medium">{item.name}</p>
                              <p className="text-white/60 text-sm">{item.color} × {item.quantity}</p>
                            </div>
                            <p className="text-white font-semibold">EGP {(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-white/20">
                  {currentStep > 1 && (
                    <button
                      onClick={prevStep}
                      className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </button>
                  )}
                  
                  <button
                    onClick={currentStep === 3 ? handlePlaceOrder : nextStep}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex-1 sm:flex-none"
                  >
                    {currentStep === 3 ? 'تقديم الطلب / Place Order' : 'Continue'}
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96">
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8 sticky top-6">
                <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  {orderItems.length > 0 ? (
                    orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium text-sm">{item.name}</p>
                          <p className="text-white/60 text-xs">{item.color} × {item.quantity}</p>
                        </div>
                        <p className="text-white font-semibold text-sm">EGP {(item.price).toLocaleString()}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/60 text-sm">No items in cart</p>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-white/20">
                  <div className="flex justify-between text-white/80 text-sm">
                    <span>Subtotal</span>
                    <span>EGP {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white/80 text-sm">
                    <span>Shipping (Standard)</span>
                    <span>EGP 60</span>
                  </div>

                  <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-white/20">
                    <span>Total</span>
                    <span>EGP {Math.round(total).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}