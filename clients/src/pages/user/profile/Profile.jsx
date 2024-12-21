import React, { useEffect } from 'react';
import { useState } from 'react';
import { User, ShoppingBag, MapPin, Wallet, Gift } from 'lucide-react';
import ProfileContent from "../../../components/user/Profile/ProfileContent"
import OrdersContent from '../../../components/user/Profile/OrdersContent';
import AddressesContent from '../../../components/user/Profile/AddressesContent';
import WalletContent from '../../../components/user/Profile/WalletContent';
import CouponsContent from '../../../components/user/Profile/CouponsContent';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProfileApp = () => {
  const user = useSelector(state=> state.userReducer.user)
  console.log(user)
  const navigate = useNavigate()

  useEffect(()=>{
    if(!user) return navigate('/')
  },[user, navigate])
  const [activePage, setActivePage] = useState('profile');
  const navItems = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'orders', icon: ShoppingBag, label: 'Orders' },
    { id: 'addresses', icon: MapPin, label: 'Addresses' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'coupons', icon: Gift, label: 'Coupons' }
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'profile':
        return <ProfileContent />;
      case 'orders':
        return <OrdersContent />;
      case 'addresses':
        return <AddressesContent />;
      case 'wallet':
        return <WalletContent />;
      case 'coupons':
        return <CouponsContent />;
      default:
        return <ProfileContent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 space-y-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            {
              user?.profile ?
              <div className='w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center'>
                <img className='w-100 h-100 rounded-full'  src={user?.profile} alt="" />
              </div> :
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            }
            
            <button className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
              <User className="w-4 h-4 text-white" />
            </button>
          </div>
          <h2 className="text-xl font-semibold">{user?.username}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 ${
                  activePage === item.id ? 'bg-black text-white hover:bg-black' : 'text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileApp;