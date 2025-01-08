import React, { useEffect, useState } from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { fetchData } from '../../../services/fetchData/fetchData';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { userAxiosInstance } from '../../../redux/constants/AxiosInstance';
import { useNavigate } from 'react-router-dom';

const WishlistPage = () => {
  // Sample wishlist data - in real app, this would come from props or state management
    const [wishlistItems, setWishListItems] = useState([]);
    let user = useSelector(state => state.userReducer.user)
    const [selectedSize, setSelectedSize] = useState({});

    const handleAddToCart = async(product) =>{
        console.log(selectedSize[product._id])
        try{
        console.log('woroking')
        if(!selectedSize[product._id]) return toast.error('select a size')
        let response = await userAxiosInstance.put('/cart', {
            productId: product._id,
            userId: user._id,
            quantity: 1, 
            selectedSize: selectedSize[product._id]
        })
        toast.success(response.data)
        
        }
        catch(error){
            console.log(error)
            toast.error(error.response.data || error.message)
        }
    }

    const fetchWishList = async() =>{
        try{
            let response = await fetchData('wishList',{userId: user._id})
            setWishListItems(response.products);
        }
        catch(error){
            console.log(error)
            toast.error(error.response.data)
        }
    }

    const handleRemoveFromWishlist = async(productId) => {
        // Implement remove from wishlist functionality
        console.log('Removing product:', productId);
        try{
            let response = await userAxiosInstance.delete("/wishList",{
                params:{
                    productId: productId,
                    userId: user._id
                }
            })
            toast.success(response.data)
            fetchWishList()
        }
        catch(error){
            console.log(error);
            toast.error(error.response.data)
        }
    };
    const navigate = useNavigate()
    useEffect(()=>{
        if(!user?.token){
            return navigate('/signin')
        }
    })

    useEffect(()=>{
        console.log(user._id,"user id")
        console.log('fetch wishllist')
        fetchWishList()
    },[])

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
            <Heart className="text-red-500" size={24} />
            <h1 className="text-2xl font-bold">My Wishlist</h1>
            </div>

            {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
                <p className="text-gray-500">Your wishlist is empty</p>
            </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.length && wishlistItems?.map((item) => (
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
                        onChange={(e) => setSelectedSize({
                            ...selectedSize,
                            [item._id]: e.target.value
                        })}
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
                        ${selectedSize[item._id]
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