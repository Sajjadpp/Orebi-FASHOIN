import React, { useEffect, useState } from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { fetchData } from '../../../services/fetchData/fetchData';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { userAxiosInstance } from '../../../redux/constants/AxiosInstance';
import { useNavigate } from 'react-router-dom';

const WishlistPage = () => {
    const [wishlistItems, setWishListItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSize, setSelectedSize] = useState({});
    const user = useSelector(state => state.userReducer.user);
    const navigate = useNavigate();

    const fetchWishList = async () => {
        setIsLoading(true);
        try {
            console.log('Fetching wishlist...');
            const response = await userAxiosInstance('/wishList', {
                params:{ userId: user._id }
            });
            console.log('Wishlist data:', response);
            setWishListItems(response?.data.products);
        } catch (error) {
            if(error.response.data === null) return toast.error('no wishlist added')
            console.error('Error fetching wishlist:', error);
            toast.error(error.response?.data || 'Failed to fetch wishlist.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        try {
            const response = await userAxiosInstance.delete('/wishList', {
                params: {
                    productId,
                    userId: user._id,
                },
            });
            toast.success(response.data);
            await fetchWishList(); // Ensure state updates after removal
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error(error.response?.data || 'Failed to remove item.');
        }
    };

    const handleAddToCart = async (product) => {
        try {
            if (!selectedSize[product._id]) {
                return toast.error('Please select a size.');
            }
            const response = await userAxiosInstance.put('/cart', {
                productId: product._id,
                userId: user._id,
                quantity: 1,
                selectedSize: selectedSize[product._id],
            });
            toast.success(response.data);
            await handleRemoveFromWishlist(product._id); // Remove item from wishlist after adding to cart
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error(error.response?.data || 'Failed to add to cart.');
        }
    };

    useEffect(() => {
        if (!user?.token) {
            navigate('/signin');
        } else {
            fetchWishList(); // Fetch wishlist on component mount
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-2 mb-8">
                    <Heart className="text-red-500" size={24} />
                    <h1 className="text-2xl font-bold">My Wishlist</h1>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading your wishlist...</p>
                    </div>
                ) : wishlistItems.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Your wishlist is empty</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistItems.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="relative h-64">
                                    <img
                                        src={item.images[0]}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => handleRemoveFromWishlist(item._id)}
                                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
                                    >
                                        <Trash2 size={18} className="text-red-500" />
                                    </button>
                                </div>

                                <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>

                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-lg font-bold">₹{item.currentPrice}</span>
                                        {item.regularPrice && (
                                            <span className="text-sm text-gray-400 line-through">
                                                ₹{item.regularPrice}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-sm text-gray-600 mb-1 block">
                                            Select Size:
                                        </label>
                                        <select
                                            value={selectedSize[item._id] || ''}
                                            onChange={(e) =>
                                                setSelectedSize({
                                                    ...selectedSize,
                                                    [item._id]: e.target.value,
                                                })
                                            }
                                            className="w-full p-2 border rounded bg-white"
                                        >
                                            <option value="">Choose a size</option>
                                            {item.stock.map((stockItem) => (
                                                <option
                                                    key={stockItem.size}
                                                    value={stockItem.size}
                                                >
                                                    {stockItem.size} ({stockItem.quantity} available)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        disabled={!selectedSize[item._id]}
                                        className={`w-full py-2 px-4 rounded flex items-center justify-center gap-2
                                            ${
                                                selectedSize[item._id]
                                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <ShoppingCart size={18} />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
