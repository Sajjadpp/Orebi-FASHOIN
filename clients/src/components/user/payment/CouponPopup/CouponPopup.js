import React, { useEffect, useState } from 'react';
import { Copy, X, Scissors } from 'lucide-react';
import { adminAxiosInstance, userAxiosInstance } from '../../../../redux/constants/AxiosInstance';

const CouponPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);
    const [coupons, setCoupons] = useState([])
    
    

    const handleCopy = async (code) => {
        try {
        await navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
        console.error('Failed to copy:', err);
        }
    };

    const fetchCoupon = async() =>{
        const response = await userAxiosInstance.get('/coupon');
        setCoupons(response.data);
    }

    useEffect(() =>{
        fetchCoupon()
    },[])

    return (
        <div className="absolute top-88 right-1">
        {/* Main Button */}
        <button
            onClick={() => setIsOpen(true)}
            className="group relative overflow-hidden bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
            <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5" />
            <span>View Coupons</span>
            </div>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-blue-400 transition-transform duration-300 ease-out -z-10" />
        </button>

        {/* Popup */}
        {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom duration-300">
                {/* Popup Header */}
                <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Available Coupons</h2>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                </div>

                {/* Coupons List */}
                <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {coupons.map((coupon) => (
                    <div
                    key={coupon.code}
                    className="relative border rounded-lg p-4 hover:border-blue-500 transition-colors group"
                    >
                    {/* Decorative scissors */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <Scissors className="w-4 h-4 text-gray-500" />
                    </div>
                    
                    <div className="ml-4">
                        <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-semibold text-lg">{coupon.discountType === 'fixed'? `₹${coupon.discountValue}` : `${coupon.discountValue}%`}</h3>
                            <p className="text-sm text-gray-600">{coupon.description}</p>
                        </div>
                        <button
                            onClick={() => handleCopy(coupon.code)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        >
                            {copiedCode === coupon.code ? (
                            <span className="text-green-600">Copied!</span>
                            ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                <span className="font-medium">{coupon.code}</span>
                            </>
                            )}
                        </button>
                        </div>
                        <div className="text-sm text-gray-500">
                        <p>Min. order: ₹{coupon.minimumOrderValue}</p>
                        <p>Valid until: {new Date(coupon.endDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Dashed border effect */}
                    <div className="absolute inset-y-0 left-0 w-0 border-l border-dashed border-gray-300" />
                    </div>
                ))}
                </div>
                
                {/* Popup Footer */}
                <div className="border-t p-4 bg-gray-50">
                <p className="text-sm text-gray-600 text-center">
                    Copy code and apply at checkout
                </p>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default CouponPopup;