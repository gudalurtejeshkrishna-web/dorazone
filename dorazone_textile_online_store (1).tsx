import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Filter, Lock, Phone, Mail, User, MapPin, 
  Truck, ShieldCheck, Plus, Trash2, Edit, CheckCircle, Package, 
  BarChart3, RefreshCw, X, LogOut, ChevronRight, Star, Heart, ArrowRight
} from 'lucide-react';

// Sample initial products tailored to traditional Tirupati/Chandragiri textile store
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Kanchipuram Pure Silk Saree - Royal Magenta & Gold",
    category: "Sarees",
    price: 3499,
    originalPrice: 4999,
    rating: 4.8,
    reviews: 42,
    fabric: "Pure Silk",
    stock: 12,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    description: "Traditional pure mulberry silk saree featuring rich zardosi gold zari woven borders. Perfect for grand weddings and Tirupati temple visits."
  },
  {
    id: 2,
    name: "Chanderi Cotton Chudidhar Set with Banarasi Dupatta",
    category: "Chudidhars",
    price: 1299,
    originalPrice: 1899,
    rating: 4.6,
    reviews: 28,
    fabric: "Cotton Silk Blend",
    stock: 18,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
    description: "Elegant breathable handloom dress material with contrast woven dupatta. Lightweight and extremely comfortable for daily wear."
  },
  {
    id: 3,
    name: "Pure Premium Cotton Inskirt (Petticoat) - Deep Maroon",
    category: "Inskirts",
    price: 299,
    originalPrice: 450,
    rating: 4.9,
    reviews: 84,
    fabric: "100% Breathable Cotton",
    stock: 45,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
    description: "6-cut heavy high-density cotton inskirt with adjustable drawstring waist. Fade-resistant color match for traditional silk sarees."
  },
  {
    id: 4,
    name: "Soft Alpine Hosiery Cotton Nighty - Floral Print",
    category: "Nighties",
    price: 499,
    originalPrice: 799,
    rating: 4.7,
    reviews: 63,
    fabric: "Alpine Cotton",
    stock: 30,
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800",
    description: "Maxi-length relaxed fit daily wear nightgown with soft neck embroidery. Sweat-absorbent fabric specially crafted for Andhra summers."
  },
  {
    id: 5,
    name: "Gadwal Cotton Silk Temple Border Saree",
    category: "Sarees",
    price: 2199,
    originalPrice: 2999,
    rating: 4.7,
    reviews: 19,
    fabric: "Cotton Silk",
    stock: 8,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
    description: "Traditional hand-woven Gadwal saree featuring contrasting silk border and ethnic bootis across the body."
  },
  {
    id: 6,
    name: "Readymade Rayon Anarkali Suit Set",
    category: "Chudidhars",
    price: 1599,
    originalPrice: 2299,
    rating: 4.5,
    reviews: 31,
    fabric: "Heavy Rayon",
    stock: 15,
    image: "https://images.unsplash.com/photo-1583391733975-ac9d81648a31?auto=format&fit=crop&q=80&w=800",
    description: "Stitched flare Anarkali suit set with gold foil prints, paired with matching pants and chiffon chunni."
  }
];

// Initial mock orders to populate Admin view
const INITIAL_ORDERS = [
  {
    id: "DZ-9081",
    customerName: "Sravanthi Reddy",
    phone: "9876543210",
    email: "sravanthi@gmail.com",
    address: "Door 4-12, Near SV University, Tirupati",
    pincode: "517502",
    distanceKm: 8,
    items: [
      { id: 1, name: "Kanchipuram Pure Silk Saree", price: 3499, quantity: 1 }
    ],
    subtotal: 3499,
    shippingFee: 0,
    total: 3499,
    status: "Delivered",
    paymentMethod: "UPI",
    date: "2026-10-22"
  },
  {
    id: "DZ-9082",
    customerName: "Kalyan Kumar",
    phone: "9440123456",
    email: "kalyan@yahoo.com",
    address: "H.No 12-4, High School Road, Chittoor",
    pincode: "517001",
    distanceKm: 28,
    items: [
      { id: 2, name: "Chanderi Cotton Chudidhar Set", price: 1299, quantity: 2 },
      { id: 3, name: "Pure Premium Cotton Inskirt", price: 299, quantity: 2 }
    ],
    subtotal: 3196,
    shippingFee: 60,
    total: 3256,
    status: "Pending",
    paymentMethod: "Cash on Delivery",
    date: "2026-10-24"
  }
];

export default function App() {
  // Navigation & User State
  const [viewMode, setViewMode] = useState('user'); // 'user' or 'admin'
  const [currentUser, setCurrentUser] = useState(null); // { phone, email, name }
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // App Data State
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Auth Modals & Steps
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authForm, setAuthForm] = useState({ phone: '', email: '', otp: '', name: '' });
  const [otpSent, setOtpSent] = useState(false);

  // Admin Auth Steps
  const [adminAuthStep, setAdminAuthStep] = useState(1); // 1: Phone, 2: OTP, 3: Password
  const [adminPhone, setAdminPhone] = useState('');
  const [adminOtp, setAdminOtp] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Checkout Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Delivery Details, 2: Confirmation
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pincode: '517101',
    distanceKm: 5,
    paymentMethod: 'UPI'
  });

  // New Product State for Admin
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Sarees',
    price: '',
    originalPrice: '',
    fabric: '',
    stock: 10,
    image: '',
    description: ''
  });
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync checkout form when user logs in
  useEffect(() => {
    if (currentUser) {
      setCheckoutForm(prev => ({
        ...prev,
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        name: currentUser.name || ''
      }));
    }
  }, [currentUser]);

  // Handle User Login Flow
  const handleSendUserOtp = (e) => {
    e.preventDefault();
    if (!authForm.phone || !authForm.email) {
      showToast("Please enter both Phone Number and Email ID!");
      return;
    }
    if (authForm.phone.length < 10) {
      showToast("Please enter a valid 10-digit mobile number!");
      return;
    }
    setOtpSent(true);
    showToast("OTP sent to " + authForm.phone + " (Demo OTP: 1234)");
  };

  const handleVerifyUserOtp = (e) => {
    e.preventDefault();
    if (authForm.otp !== '1234' && authForm.otp !== '0000' && authForm.otp.length < 4) {
      showToast("Invalid OTP! Try entering 1234 for demo.");
      return;
    }
    const userObj = {
      phone: authForm.phone,
      email: authForm.email,
      name: authForm.name || 'Valued Customer'
    };
    setCurrentUser(userObj);
    setShowAuthModal(false);
    setOtpSent(false);
    showToast("Successfully logged in to DoraZone!");
  };

  // Handle Admin Login Multi-Step Flow
  const handleAdminPhoneSubmit = (e) => {
    e.preventDefault();
    setAdminError('');
    if (adminPhone.trim() !== '8106934110') {
      setAdminError('Access Denied: Only authorized store phone number 8106934110 can login as Admin.');
      return;
    }
    setAdminAuthStep(2);
    showToast("Admin OTP dispatched to 8106934110 (Demo OTP: 8106)");
  };

  const handleAdminOtpSubmit = (e) => {
    e.preventDefault();
    setAdminError('');
    if (adminOtp !== '8106' && adminOtp !== '1234') {
      setAdminError('Invalid OTP! Enter 8106 for demo login.');
      return;
    }
    setAdminAuthStep(3);
  };

  const handleAdminPasswordSubmit = (e) => {
    e.preventDefault();
    setAdminError('');
    if (adminPassword !== 'admin123' && adminPassword !== 'admin') {
      setAdminError('Incorrect Admin Password! Try: admin123');
      return;
    }
    setIsAdminLoggedIn(true);
    showToast("Welcome Admin! Access granted to DoraZone Dashboard.");
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminAuthStep(1);
    setAdminPhone('');
    setAdminOtp('');
    setAdminPassword('');
    setViewMode('user');
    showToast("Logged out from Admin Dashboard");
  };

  // Cart Functions
  const addToCart = (product) => {
    if (!currentUser) {
      setShowAuthModal(true);
      showToast("Please login with Phone & Email to add items to cart!");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} added to cart!`);
  };

  const updateCartQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  // Distance & Shipping logic
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const distance = parseFloat(checkoutForm.distanceKm) || 0;
  const isFreeShipping = distance <= 15;
  const shippingFee = subtotal === 0 ? 0 : (isFreeShipping ? 0 : 60);
  const grandTotal = subtotal + shippingFee;

  // Place Order Handler
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
      showToast("Please fill all required delivery details!");
      return;
    }

    const newOrder = {
      id: "DZ-" + Math.floor(1000 + Math.random() * 9000),
      customerName: checkoutForm.name,
      phone: checkoutForm.phone,
      email: checkoutForm.email,
      address: checkoutForm.address,
      pincode: checkoutForm.pincode,
      distanceKm: distance,
      items: [...cart],
      subtotal,
      shippingFee,
      total: grandTotal,
      status: "Processing",
      paymentMethod: checkoutForm.paymentMethod,
      date: new Date().toISOString().split('T')[0]
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setShowCheckoutModal(false);
    setCheckoutStep(1);
    showToast(`🎉 Order ${newOrder.id} successfully placed! Thank you for shopping with DoraZone.`);
  };

  // Add New Product (Admin)
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      showToast("Please provide product name and price!");
      return;
    }

    const createdProduct = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice) || Number(newProduct.price) * 1.3,
      rating: 5.0,
      reviews: 1,
      fabric: newProduct.fabric || 'Cotton Blend',
      stock: Number(newProduct.stock) || 10,
      image: newProduct.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
      description: newProduct.description || 'Authentic fine quality handloom textile item from Chandragiri weavers.'
    };

    setProducts([createdProduct, ...products]);
    setShowAddProductModal(false);
    setNewProduct({ name: '', category: 'Sarees', price: '', originalPrice: '', fabric: '', stock: 10, image: '', description: '' });
    showToast("New Product uploaded to DoraZone catalog!");
  };

  // Admin Order Status Update
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order ${orderId} marked as ${newStatus}`);
  };

  // Product Filtering logic
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.fabric.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'low') return a.price - b.price;
    if (sortBy === 'high') return b.price - a.price;
    return b.rating - a.rating;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-gray-800 font-sans antialiased flex flex-col">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-amber-300 px-5 py-3 rounded-xl shadow-2xl border border-amber-500/30 flex items-center space-x-3 transition-all animate-bounce">
          <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-[#800020] via-[#A00028] to-[#800020] text-amber-100 text-xs py-2 px-4 text-center font-medium tracking-wide flex justify-between items-center px-4 md:px-12 border-b border-amber-500/20">
        <div className="flex items-center space-x-2">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>Chandragiri, Near Tirupati, A.P (Pincode: 517101)</span>
        </div>
        <div className="hidden sm:flex items-center space-x-3">
          <Truck className="w-3.5 h-3.5 text-amber-400" />
          <span><strong>FREE SHIPPING</strong> on orders within 15 km distance!</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>Help: +91 81069 34110</span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-amber-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setViewMode('user')}>
            <div className="w-11 h-11 bg-[#800020] rounded-xl flex items-center justify-center text-amber-300 font-serif font-bold text-2xl shadow-md border-2 border-amber-400/40">
              D
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-[#800020] to-[#b31238] bg-clip-text text-transparent tracking-wide">
                DoraZone
              </h1>
              <p className="text-[10px] text-amber-800 font-medium tracking-widest uppercase -mt-1">
                Authentic Ethnic Textiles
              </p>
            </div>
          </div>

          {/* Mode Switcher Toggle (User vs Admin) */}
          <div className="bg-amber-100/60 p-1 rounded-full border border-amber-200 flex items-center space-x-1">
            <button
              onClick={() => setViewMode('user')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'user' 
                  ? 'bg-[#800020] text-amber-200 shadow' 
                  : 'text-amber-900 hover:text-amber-950'
              }`}
            >
              Customer Shop
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1 ${
                viewMode === 'admin' 
                  ? 'bg-[#800020] text-amber-200 shadow' 
                  : 'text-amber-900 hover:text-amber-950'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* User Profile & Cart Buttons */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 py-1.5 px-3 rounded-xl text-xs">
                <User className="w-4 h-4 text-[#800020]" />
                <span className="font-semibold text-amber-900 hidden sm:inline">{currentUser.phone}</span>
                <button 
                  onClick={() => { setCurrentUser(null); showToast("Logged out"); }}
                  className="text-gray-400 hover:text-red-600 ml-1"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-[#800020] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-[#800020] hover:bg-[#660019] text-amber-300 p-2.5 rounded-xl shadow-md transition-all flex items-center justify-center"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.reduce((a, b) => a + b.quantity, 0) > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-red-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* VIEW 1: ADMIN PORTAL */}
      {viewMode === 'admin' ? (
        <div className="flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8">
          {!isAdminLoggedIn ? (
            /* Admin Multi-step Verification Screen */
            <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl shadow-xl border border-amber-900/10">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-amber-100 text-[#800020] rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900">Admin Authentication</h2>
                <p className="text-xs text-slate-500 mt-1">DoraZone Management System (Chandragiri Store)</p>
              </div>

              {adminError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {adminError}
                </div>
              )}

              {/* Step 1: Phone Verification */}
              {adminAuthStep === 1 && (
                <form onSubmit={handleAdminPhoneSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Admin Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        placeholder="Enter 8106934110"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Only 8106934110 is authorized to manage DoraZone.</p>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#800020] text-amber-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#660019] transition-all shadow"
                  >
                    Proceed to Verification
                  </button>
                </form>
              )}

              {/* Step 2: OTP Verification */}
              {adminAuthStep === 2 && (
                <form onSubmit={handleAdminOtpSubmit} className="space-y-4">
                  <div className="p-3 bg-amber-50 text-amber-900 text-xs rounded-xl border border-amber-200">
                    OTP sent to registered phone number <strong>8106934110</strong>.
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Enter Admin Security OTP</label>
                    <input
                      type="text"
                      value={adminOtp}
                      onChange={(e) => setAdminOtp(e.target.value)}
                      placeholder="Enter demo OTP: 8106"
                      className="w-full text-center tracking-widest text-lg font-bold py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020]"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#800020] text-amber-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#660019] transition-all shadow"
                  >
                    Verify OTP
                  </button>
                </form>
              )}

              {/* Step 3: Password Entry */}
              {adminAuthStep === 3 && (
                <form onSubmit={handleAdminPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Enter Admin Security Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Default password: admin123"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#800020] text-amber-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#660019] transition-all shadow"
                  >
                    Login to Dashboard
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Admin Logged In Dashboard */
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Dashboard Top Header */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-slate-900">DoraZone Admin Control Center</h2>
                  <p className="text-xs text-slate-500">Managing products, catalog, and Tirupati area local deliveries</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="bg-[#800020] text-amber-200 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#660019] transition-all flex items-center space-x-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload New Textile</span>
                  </button>
                  <button
                    onClick={handleAdminLogout}
                    className="bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-all flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Exit Admin</span>
                  </button>
                </div>
              </div>

              {/* Key Store Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Total Customer Orders</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{orders.length}</h3>
                  </div>
                  <div className="p-3 bg-amber-50 text-[#800020] rounded-xl">
                    <Package className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Total Sales Revenue</p>
                    <h3 className="text-2xl font-bold text-[#800020] mt-1">
                      ₹{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Active Products in Store</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{products.length}</h3>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-serif font-bold text-slate-900 text-lg">Customer Orders & Shipping Management</h3>
                  <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2.5 py-1 rounded-full">
                    Store Location: Chandragiri (517101)
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="p-4">Order ID & Date</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Delivery Distance & Pincode</th>
                        <th className="p-4">Items Ordered</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 font-medium text-slate-900">
                            <div>{order.id}</div>
                            <div className="text-[10px] text-slate-400">{order.date}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-900">{order.customerName}</div>
                            <div>{order.phone}</div>
                            <div className="text-[10px] text-slate-400">{order.address}</div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              order.distanceKm <= 15 ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {order.distanceKm} km ({order.distanceKm <= 15 ? 'FREE Delivery' : '₹60 Delivery Fee'})
                            </span>
                            <div className="mt-1 text-slate-500">Pincode: {order.pincode}</div>
                          </td>
                          <td className="p-4">
                            {order.items.map((i, idx) => (
                              <div key={idx} className="truncate max-w-[180px]">
                                {i.quantity}x {i.name}
                              </div>
                            ))}
                          </td>
                          <td className="p-4 font-bold text-slate-900">
                            ₹{order.total}
                            <div className="text-[10px] font-normal text-slate-400">{order.paymentMethod}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                              order.status === 'Processing' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="bg-slate-100 border border-slate-300 rounded px-2 py-1 text-[11px] focus:outline-none"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Manage Existing Inventory */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-serif font-bold text-slate-900 text-lg mb-4">Store Inventory Catalog</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="border border-slate-200 rounded-xl p-3 flex gap-3 items-center">
                      <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                      <div className="overflow-hidden flex-1">
                        <h4 className="font-semibold text-xs text-slate-900 truncate">{p.name}</h4>
                        <p className="text-[11px] text-slate-500">{p.category} • {p.fabric}</p>
                        <p className="text-xs font-bold text-[#800020] mt-1">₹{p.price}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setProducts(products.filter(item => item.id !== p.id));
                          showToast("Product deleted");
                        }}
                        className="text-slate-400 hover:text-red-500 p-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: CUSTOMER SHOPPING FRONTEND */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          
          {/* Hero Banner Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#800020] via-[#5c0017] to-[#36000e] text-white p-8 md:p-12 shadow-xl border border-amber-500/20">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-block bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-amber-400/30">
                Chandragiri & Tirupati's Trusted Textile Hub
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight text-amber-100">
                Pure Kanchi Silks & Handloom Collections
              </h2>
              <p className="text-amber-100/80 text-sm md:text-base font-light">
                Explore handpicked authentic Sarees, Salwar Sets, Inskirts, Soft Nighties & Dhotis directly from regional master weavers.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <a
                  href="#catalog"
                  className="bg-amber-400 text-red-950 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-amber-300 transition-all shadow-lg flex items-center space-x-2"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <div className="text-xs text-amber-200/90 flex items-center space-x-1">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Free delivery up to 15 KM radius</span>
                </div>
              </div>
            </div>
            {/* Soft decorative background pattern */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 pointer-events-none hidden md:block bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
          </div>

          {/* Search & Category Filter Navigation */}
          <section id="catalog" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              
              {/* Category Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                {['All', 'Sarees', 'Chudidhars', 'Inskirts', 'Nighties'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#800020] text-amber-200 shadow-md'
                        : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search & Price Sort Controls */}
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search saree, cotton, fabric..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020] shadow-sm"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 shadow-sm focus:outline-none"
                >
                  <option value="featured">Popular</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                  {/* Product Image Container */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 shadow flex items-center space-x-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{product.rating}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-[#800020]/90 text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-md backdrop-blur-sm">
                      {product.fabric}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[11px] text-amber-800 font-semibold tracking-wider uppercase">{product.category}</div>
                      <h3 className="font-serif font-bold text-slate-900 text-base leading-snug mt-1 group-hover:text-[#800020] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-slate-500 text-xs line-clamp-2 mt-1 font-light">
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-lg font-bold text-[#800020]">₹{product.price}</span>
                          <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
                        </div>
                        <p className="text-[10px] text-emerald-600 font-semibold">In Stock ({product.stock} left)</p>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className="bg-[#800020] hover:bg-[#660019] text-amber-200 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow flex items-center space-x-1.5 active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">No matching products found</h3>
                <p className="text-xs text-slate-400 mt-1">Try resetting your category or search filter.</p>
              </div>
            )}
          </section>
        </main>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-[#800020] text-amber-300 font-bold rounded-lg flex items-center justify-center font-serif text-lg">D</div>
              <span className="text-lg font-serif font-bold text-amber-100">DoraZone</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Your premier destination for traditional and authentic South Indian sarees, dress materials, inskirts, and everyday cottons near Tirupati.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-200 mb-3">Store Location</h4>
            <p className="leading-relaxed">
              DoraZone Ethnic Textiles<br />
              High School Road, Chandragiri<br />
              Near Tirupati, Chittoor District<br />
              Andhra Pradesh - 517101
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-200 mb-3">Free Delivery Terms</h4>
            <p className="leading-relaxed">
              Enjoy <strong>15 KM Free Local Delivery</strong> covering Chandragiri town, SV University, Tirupati town, and surrounding areas. Standard nominal charge of ₹60 applies beyond 15 km.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-800 text-center text-slate-500">
          © {new Date().getFullYear()} DoraZone Textiles. All rights reserved.
        </div>
      </footer>

      {/* USER LOGIN MODAL (Phone + Email mandatory) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-amber-900/10">
            <button 
              onClick={() => setShowAuthModal(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-amber-100 text-[#800020] rounded-2xl flex items-center justify-center mx-auto mb-2 font-serif font-bold text-xl">
                D
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-900">Sign In to DoraZone</h3>
              <p className="text-xs text-slate-500 mt-1">Please log in with Phone Number and Email ID to proceed</p>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendUserOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Required)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={authForm.phone}
                      onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (Required)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                      placeholder="e.g. customer@gmail.com"
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#800020] text-amber-200 py-3 rounded-xl text-sm font-semibold hover:bg-[#660019] transition-all shadow"
                >
                  Send Verification OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyUserOtp} className="space-y-4">
                <div className="p-3 bg-amber-50 text-amber-900 text-xs rounded-xl border border-amber-200">
                  Verification code sent to <strong>{authForm.phone}</strong>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enter 4-Digit OTP</label>
                  <input
                    type="text"
                    value={authForm.otp}
                    onChange={(e) => setAuthForm({ ...authForm, otp: e.target.value })}
                    placeholder="Enter 1234"
                    className="w-full text-center tracking-widest text-lg font-bold py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#800020] text-amber-200 py-3 rounded-xl text-sm font-semibold hover:bg-[#660019] transition-all shadow"
                >
                  Verify & Sign In
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SLIDE-OUT CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between">
            {/* Cart Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-amber-50/50">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-[#800020]" />
                <h3 className="font-serif font-bold text-slate-900 text-lg">Your Shopping Bag</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-600">Your bag is currently empty</p>
                  <p className="text-xs text-slate-400">Explore our sarees and dress materials to add items.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-semibold text-xs text-slate-900 truncate">{item.name}</h4>
                      <p className="text-[11px] text-slate-500">{item.fabric}</p>
                      <p className="text-xs font-bold text-[#800020] mt-1">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white rounded-lg border border-slate-200 px-2 py-1">
                      <button onClick={() => updateCartQuantity(item.id, -1)} className="text-slate-600 font-bold text-xs">-</button>
                      <span className="text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, 1)} className="text-slate-600 font-bold text-xs">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Summary Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping Fee (Chandragiri rules)</span>
                    <span className="text-emerald-600 font-semibold">Calculated at Checkout</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setShowCheckoutModal(true);
                  }}
                  className="w-full bg-[#800020] hover:bg-[#660019] text-amber-200 py-3 rounded-xl text-sm font-semibold transition-all shadow flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT & DISTANCE SHIPPING MODAL */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setShowCheckoutModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-serif font-bold text-slate-900">Delivery & Checkout</h3>
              <p className="text-xs text-slate-500 mt-1">DoraZone Store Base: Chandragiri (517101)</p>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Receiver Name</label>
                  <input
                    type="text"
                    value={checkoutForm.name}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Delivery Address</label>
                <textarea
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  placeholder="House No, Street, Landmark, Village/Town"
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Area Pincode</label>
                  <input
                    type="text"
                    value={checkoutForm.pincode}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Distance from Chandragiri (KM)</label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={checkoutForm.distanceKm}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, distanceKm: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Shipping Fee Box Notice */}
              <div className={`p-4 rounded-2xl border text-xs ${
                isFreeShipping ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center space-x-2 font-bold mb-1">
                  <Truck className="w-4 h-4" />
                  <span>{isFreeShipping ? '🎉 Free Local Shipping Applicable!' : 'Standard Regional Shipping Charge'}</span>
                </div>
                <p className="text-[11px] opacity-90">
                  {isFreeShipping 
                    ? `Your location is within ${distance} km of Chandragiri store (≤ 15 km limit). Delivery fee is ₹0!`
                    : `Your location is ${distance} km from Chandragiri (> 15 km limit). ₹60 delivery fee applied.`}
                </p>
              </div>

              {/* Payment Option */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'UPI' })}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      checkoutForm.paymentMethod === 'UPI' ? 'border-[#800020] bg-amber-50 text-[#800020]' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    UPI / PhonePe / GPay
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'Cash on Delivery' })}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      checkoutForm.paymentMethod === 'Cash on Delivery' ? 'border-[#800020] bg-amber-50 text-[#800020]' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Cash on Delivery
                  </button>
                </div>
              </div>

              {/* Order Total Summary */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className={isFreeShipping ? 'text-emerald-600 font-bold' : ''}>
                    {isFreeShipping ? 'FREE (₹0)' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-100">
                  <span>Grand Total</span>
                  <span className="text-[#800020]">₹{grandTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#800020] hover:bg-[#660019] text-amber-200 py-3 rounded-xl text-sm font-semibold transition-all shadow mt-2"
              >
                Confirm Order (₹{grandTotal})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowAddProductModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-slate-900 mb-4">Upload New Textile Product</h3>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Mangalagiri Pure Cotton Saree"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020]"
                  >
                    <option value="Sarees">Sarees</option>
                    <option value="Chudidhars">Chudidhars</option>
                    <option value="Inskirts">Inskirts</option>
                    <option value="Nighties">Nighties</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fabric Details</label>
                  <input
                    type="text"
                    value={newProduct.fabric}
                    onChange={(e) => setNewProduct({ ...newProduct, fabric: e.target.value })}
                    placeholder="e.g. 100% Handloom Cotton"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="1299"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original MRP (₹)</label>
                  <input
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    placeholder="1899"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Brief description of the weave, embroidery, and comfort..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#800020] text-amber-200 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#660019] transition-all shadow mt-2"
              >
                Upload Product to Catalog
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}