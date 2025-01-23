import React, { useState } from 'react';
import { Heart, RefreshCw, Eye, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userAxiosInstance } from '../../../../redux/constants/AxiosInstance';
import toast from 'react-hot-toast';

const ProductCard = ({
  _id,
  name,
  category,
  currentPrice,
  regularPrice,
  description,
  images,
  status,
  stock,
  createdAt,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImage, setCurrentImage] = useState(images?.[0]);
  const navigate = useNavigate();
  const user = useSelector(state => state.userReducer.user);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((regularPrice - currentPrice) / regularPrice) * 100
  );

  // Check if product is new (within 7 days)
  const isNew = () => {
    const productDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - productDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Calculate total stock
  const totalStock = stock?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Handle Add to Wishlist
  const handleAddToWishList = async () => {
    try {
      if (!user) {
        toast.error('Please login to add items to wishlist');
        return;
      }
      const response = await userAxiosInstance.put('/wishList', {
        userId: user._id,
        productId: _id,
        status: !isInWishlist
      });
      if(response.data !== 'the product remove from wish list'){
        setIsInWishlist(prev => !prev);
      }
      toast.success(response.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || 'Error adding to wishlist');
    }
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    try {
      if (!user) {
        toast.error('Please login to add items to cart');
        return;
      }
      const response = await userAxiosInstance.patch('/cart', {
        productId: _id,
        userId: user._id
      });
      toast.success(response.data);
    } catch (error) {
      toast.error(error.response?.data || error.message);
    }
  };

  // Handle View Details
  const handleProductDetails = () => {
    navigate(`/product/${_id}`, {
      state: {
        item: JSON.stringify({
          _id,
          name,
          category,
          currentPrice,
          regularPrice,
          description,
          images,
          status,
          stock,
          createdAt
        }),
      },
    });
  };

  return (
    <div 
      className="w-full max-w-sm border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-square">
        {/* Main Image */}
        <div 
          className="w-full h-full transition-transform duration-500"
          
        >
          <img 
            src={currentImage} 
            alt={name}
            className="w-full h-full object-cover hover:scale-125 ease-in duration-100"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {isNew() && (
            <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
              New
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute right-2 -top-20 group-hover:top-2 transition-all duration-300 flex flex-col gap-2">
          <button
            onClick={handleProductDetails}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-md"
            title="Quick View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={handleAddToWishList}
            className={`p-2 bg-white rounded-full hover:bg-gray-100 transition-all duration-300 shadow-md group`}
            title="Add to Wishlist"
          >
            <Heart 
              className={`h-4 w-4 transition-all duration-300 transform ${
                isInWishlist 
                  ? 'fill-red-500 text-red-500 scale-110' 
                  : 'group-hover:text-red-500 group-hover:scale-110'
              }`} 
            />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-md"
            title="Add to Cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
          <button
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-md"
            title="Compare"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Category */}
        <div className="text-sm text-gray-600 capitalize mb-2">
          {category}
        </div>

        {/* Product Name */}
        <h3 
          className="font-semibold text-lg leading-none mb-2 truncate cursor-pointer hover:text-blue-600"
          onClick={handleProductDetails}
        >
          {name}
        </h3>

        {/* Stock Status */}
        {totalStock > 0 ? (
          <p className="text-green-500 text-sm mb-2">
            {totalStock} in stock
          </p>
        ) : (
          <p className="text-red-500 text-sm mb-2">
            Out of stock
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold">₹{currentPrice}</span>
          {discountPercentage > 0 && (
            <span className="text-sm text-gray-600 line-through">
              ₹{regularPrice}
            </span>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default React.memo(ProductCard);