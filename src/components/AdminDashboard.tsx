import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LogOut,
  ShoppingBag,
  UtensilsCrossed,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Search,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react';
import { MenuItem, OrderStatus, Order } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    adminLogout,
    orders,
    updateOrderStatus,
    deleteOrder,
    clearAllOrders,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    restaurantSettings,
    updateRestaurantSettings,
    setActiveTab,
    adminEmail,
    currentUser,
    isSuperAdmin,
  } = useApp();

  const [currentTab, setCurrentTab] = useState<'orders' | 'menu' | 'settings'>('orders');

  // New Dish Form State
  const [showAddDish, setShowAddDish] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('South Indian');
  const [newDishPrice, setNewDishPrice] = useState(199);
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishImage, setNewDishImage] = useState(
    'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80'
  );
  const [newDishType, setNewDishType] = useState<'food' | 'beverage'>('food');

  // Menu Search
  const [menuSearch, setMenuSearch] = useState('');

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState(restaurantSettings);

  // Statistics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.grandTotal, 0);
  const pendingOrders = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  ).length;

  const handleAddNewDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    addMenuItem({
      id: `dish-${Date.now()}`,
      name: newDishName,
      description: newDishDesc,
      price: Number(newDishPrice),
      category: newDishCategory,
      menuType: newDishType,
      vegetarian: true,
      image: newDishImage,
      available: true,
    });

    setNewDishName('');
    setNewDishDesc('');
    setShowAddDish(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantSettings(settingsForm);
  };

  return (
    <div id="admin-dashboard-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 space-y-6">
      {/* Top Admin Bar */}
      <div className="bg-[#143627] text-white p-5 sm:p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-widest text-[#C69234]">
              Authorized Admin: {adminEmail}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-cinzel mt-1 uppercase">
            {restaurantSettings.name} Admin Console
          </h1>
          <p className="text-xs text-emerald-100/80 mt-0.5">
            Logged in as <strong className="text-white">{currentUser?.email || adminEmail}</strong> · Direct access to live kitchen, incoming orders, and menu catalog.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors border border-white/20"
          >
            Preview Customer App
          </button>
          <button
            id="admin-logout-btn"
            onClick={adminLogout}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E6DEC8] shadow-xs">
          <span className="text-xs text-[#65736C] font-semibold">Total Orders</span>
          <div className="text-2xl font-extrabold text-[#143627] mt-1">{orders.length}</div>
          <span className="text-[11px] text-emerald-700 font-medium">Lifetime count</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E6DEC8] shadow-xs">
          <span className="text-xs text-[#65736C] font-semibold">Pending / Live</span>
          <div className="text-2xl font-extrabold text-[#C69234] mt-1">{pendingOrders}</div>
          <span className="text-[11px] text-amber-700 font-medium">Requires action</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E6DEC8] shadow-xs">
          <span className="text-xs text-[#65736C] font-semibold">Menu Catalog</span>
          <div className="text-2xl font-extrabold text-[#143627] mt-1">{menuItems.length}</div>
          <span className="text-[11px] text-[#2E7D58] font-medium">100% Pure Veg items</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E6DEC8] shadow-xs">
          <span className="text-xs text-[#65736C] font-semibold">Total Sales</span>
          <div className="text-2xl font-extrabold text-[#235D43] mt-1">₹{totalRevenue}</div>
          <span className="text-[11px] text-emerald-700 font-medium">Gross revenue</span>
        </div>
      </div>

      {/* Admin Tab Selector */}
      <div className="flex border-b border-[#E6DEC8] overflow-x-auto no-scrollbar">
        <button
          onClick={() => setCurrentTab('orders')}
          className={`px-4 sm:px-5 py-3 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-all shrink-0 ${
            currentTab === 'orders'
              ? 'border-[#235D43] text-[#143627]'
              : 'border-transparent text-[#65736C] hover:text-[#143627]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders Management ({orders.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('menu')}
          className={`px-4 sm:px-5 py-3 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-all shrink-0 ${
            currentTab === 'menu'
              ? 'border-[#235D43] text-[#143627]'
              : 'border-transparent text-[#65736C] hover:text-[#143627]'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Menu Catalog ({menuItems.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('settings')}
          className={`px-4 sm:px-5 py-3 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-all shrink-0 ${
            currentTab === 'settings'
              ? 'border-[#235D43] text-[#143627]'
              : 'border-transparent text-[#65736C] hover:text-[#143627]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Restaurant Settings</span>
        </button>
      </div>

      {/* TAB 1: Orders Management */}
      {currentTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#E6DEC8] shadow-xs space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#65736C] flex items-center justify-center mx-auto mb-2">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#143627]">No Orders Placed Yet</h4>
              <p className="text-xs text-[#65736C] max-w-sm mx-auto">
                No orders have been placed yet. As customers place real orders, they will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-[#65736C]">
                  {orders.length} Real Order{orders.length !== 1 ? 's' : ''} in Database
                </span>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all orders?')) {
                      clearAllOrders();
                    }
                  }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Orders</span>
                </button>
              </div>

              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl bg-white border border-[#E6DEC8] shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6DEC8] pb-3">
                    <div>
                      <span className="font-mono font-bold text-base text-[#143627]">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-xs text-[#65736C] ml-2">
                        {ord.date}{ord.time ? ` · ${ord.time}` : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAE2D3] text-[#143627] font-semibold capitalize">
                        {ord.orderType}
                      </span>

                      {/* Status Changer Dropdown */}
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          updateOrderStatus(ord.id, e.target.value as OrderStatus)
                        }
                        className="text-xs font-bold px-3 py-1.5 rounded-xl border border-[#2E7D58] bg-[#E2F4EA] text-[#143627] focus:outline-none cursor-pointer"
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing in Kitchen</option>
                        <option value="ready">Ready / Out</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete order #${ord.orderNumber}?`)) {
                            deleteOrder(ord.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4A5550] bg-[#FAF7F2] p-3 rounded-xl">
                  <div>
                    <strong>Customer:</strong> {ord.customerDetails.name} ({ord.customerDetails.phone})
                  </div>
                  <div>
                    {ord.orderType === 'delivery' ? (
                      <span><strong>Address:</strong> {ord.customerDetails.address}</span>
                    ) : ord.orderType === 'dine-in' ? (
                      <span><strong>Table:</strong> {ord.customerDetails.tableNumber || 'Main Hall'}</span>
                    ) : (
                      <span><strong>Type:</strong> Pickup at Counter</span>
                    )}
                  </div>
                  {ord.customerDetails.notes && (
                    <div className="sm:col-span-2 text-gray-500">
                      <strong>Notes:</strong> {ord.customerDetails.notes}
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="text-xs space-y-1">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.quantity}× {it.menuItem.name}</span>
                      <span className="font-semibold">₹{it.totalPrice}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#E6DEC8] flex justify-between text-xs font-bold text-[#143627]">
                  <span>Payment: {ord.paymentMethod}</span>
                  <span className="text-sm text-[#235D43]">Total: ₹{ord.grandTotal}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )}

      {/* TAB 2: Menu Management */}
      {currentTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search catalog to edit..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#E6DEC8] rounded-xl text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowAddDish(!showAddDish)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddDish ? 'Close Form' : 'Add New Dish'}</span>
            </button>
          </div>

          {/* Add Dish Form */}
          {showAddDish && (
            <form
              onSubmit={handleAddNewDish}
              className="p-5 bg-white rounded-2xl border-2 border-[#2E7D58] shadow-sm space-y-4"
            >
              <h3 className="font-bold text-sm text-[#143627]">Add New Dish to Catalog</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Dish Name *</label>
                  <input
                    type="text"
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="e.g. Schezwan Fried Rice"
                    className="w-full p-2 bg-[#FAF7F2] border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(Number(e.target.value))}
                    className="w-full p-2 bg-[#FAF7F2] border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    placeholder="e.g. Chinese, South Indian"
                    className="w-full p-2 bg-[#FAF7F2] border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Type</label>
                  <select
                    value={newDishType}
                    onChange={(e) => setNewDishType(e.target.value as any)}
                    className="w-full p-2 bg-[#FAF7F2] border rounded-lg"
                  >
                    <option value="food">Food</option>
                    <option value="beverage">Beverage</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newDishImage}
                    onChange={(e) => setNewDishImage(e.target.value)}
                    className="w-full p-2 bg-[#FAF7F2] border rounded-lg"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-semibold mb-1">Description</label>
                  <input
                    type="text"
                    value={newDishDesc}
                    onChange={(e) => setNewDishDesc(e.target.value)}
                    placeholder="Crispy, fragrant, wok tossed..."
                    className="w-full p-2 bg-[#FAF7F2] border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDish(false)}
                  className="px-3 py-1.5 rounded-lg border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#235D43] text-white text-xs font-bold"
                >
                  Save Dish
                </button>
              </div>
            </form>
          )}

          {/* Menu Items Table / Cards */}
          <div className="bg-white rounded-2xl border border-[#E6DEC8] overflow-hidden shadow-xs">
            <div className="divide-y divide-[#E6DEC8]">
              {menuItems
                .filter((i) =>
                  menuSearch ? i.name.toLowerCase().includes(menuSearch.toLowerCase()) : true
                )
                .map((dish) => (
                  <div
                    key={dish.id}
                    className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#FAF7F2] transition-colors"
                  >
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-[#143627] truncate">
                          {dish.name}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                          {dish.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#65736C] truncate mt-0.5">
                        {dish.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Price editor */}
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">₹</span>
                        <input
                          type="number"
                          value={dish.price}
                          onChange={(e) =>
                            updateMenuItem(dish.id, { price: Number(e.target.value) })
                          }
                          className="w-16 p-1 border rounded text-xs font-bold text-center"
                        />
                      </div>

                      {/* Availability toggle */}
                      <button
                        onClick={() =>
                          updateMenuItem(dish.id, { available: !dish.available })
                        }
                        className={`p-1.5 rounded-lg text-xs font-semibold ${
                          dish.available
                            ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200'
                            : 'text-gray-500 bg-gray-200 hover:bg-gray-300'
                        }`}
                        title={dish.available ? 'Available' : 'Sold out'}
                      >
                        {dish.available ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteMenuItem(dish.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Restaurant Settings */}
      {currentTab === 'settings' && (
        <form
          onSubmit={handleSaveSettings}
          className="bg-white p-6 rounded-3xl border border-[#E6DEC8] shadow-xs space-y-5"
        >
          <h3 className="font-cinzel font-bold text-lg text-[#143627]">
            Restaurant Details & Configurations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold mb-1">Restaurant Name</label>
              <input
                type="text"
                value={settingsForm.name}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, name: e.target.value })
                }
                className="w-full p-2.5 bg-[#FAF7F2] border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Primary Phone</label>
              <input
                type="text"
                value={settingsForm.phone}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, phone: e.target.value })
                }
                className="w-full p-2.5 bg-[#FAF7F2] border rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold mb-1">Location / Address</label>
              <input
                type="text"
                value={settingsForm.location}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, location: e.target.value })
                }
                className="w-full p-2.5 bg-[#FAF7F2] border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Opening Time</label>
              <input
                type="text"
                value={settingsForm.openingTime}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, openingTime: e.target.value })
                }
                className="w-full p-2.5 bg-[#FAF7F2] border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Closing Time</label>
              <input
                type="text"
                value={settingsForm.closingTime}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, closingTime: e.target.value })
                }
                className="w-full p-2.5 bg-[#FAF7F2] border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Delivery Fee (₹)</label>
              <input
                type="number"
                value={settingsForm.deliveryFee}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    deliveryFee: Number(e.target.value),
                  })
                }
                className="w-full p-2.5 bg-[#FAF7F2] border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Tax / GST (%)</label>
              <input
                type="number"
                value={settingsForm.taxPercent}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    taxPercent: Number(e.target.value),
                  })
                }
                className="w-full p-2.5 bg-[#FAF7F2] border rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold mb-1">Happy Hours Text</label>
              <input
                type="text"
                value={settingsForm.happyHours}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, happyHours: e.target.value })
                }
                className="w-full p-2.5 bg-[#FAF7F2] border rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Restaurant Settings</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
