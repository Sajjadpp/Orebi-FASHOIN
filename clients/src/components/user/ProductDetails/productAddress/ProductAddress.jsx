import { ShoppingCart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { userAxiosInstance } from '../../../../redux/constants/AxiosInstance';
import toast from 'react-hot-toast';

const ProductAddress = ({product}) => {
    const [selectedSize, setSelectedSize] = useState('');
      const [quantity, setQuantity] = useState(1);
      const user = useSelector(state => state.userReducer.user)
    const [selectedSizeQnty, setSelectedSizeQnty] = useState(1)
    
    useEffect(()=>{
        setSelectedSizeQnty(product?.stock?.find(item => item.size == selectedSize).quantity)
        console.log(selectedSizeQnty)
    },[selectedSize])
    const handleAddToCart = async() =>{
          
        if(!user?.token) return toast.error('please login')
          try{
            console.log('woroking')
            if(!selectedSize) return toast.error('select a size')
            let response = await userAxiosInstance.put('/cart', {
                productId: product._id,
                userId: user._id,
                quantity, 
                selectedSize
            })
            toast.success(response.data)
            
        }
        catch(error){
            console.log(error)
            toast.error(error.response.data || error.message)
        }
       
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">₹{product.currentPrice}</span>
                <span className="text-lg text-gray-500 line-through">₹{product.regularPrice}</span>
            </div>
            <p className="text-gray-600">{product.description}</p>

            {/* Size Selection */}
            <div className="space-y-2">
                <label className="block font-medium">Size</label>
                <div className="flex gap-2 relative">
                {product.stock && product?.stock?.map((item, index) => {
                    return (
                    <div key={index}>
                        <button
                        onClick={() => setSelectedSize(item.size)}
                        className={`px-4 py-2 border ${
                        selectedSize === item.size ? 'bg-black text-white' : 'hover:bg-gray-100'
                        }`}
                        >
                        {item.size}
                        </button>
                        <div className='text-center w-100 absolute top-12 left-0'>
                        {selectedSize === item.size && `${item.quantity} left on this size`} 
                        </div>
                    </div>
                    )
                })}
                </div>
            </div>

            {/* Quantity */}
            <div className="space-y-4 my-3">
                <label className="block font-medium mt-8">Quantity</label>
                <div className="flex items-center gap-2">
                <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 border hover:bg-gray-100"
                >
                    -
                </button>
                <span className="px-4 py-1 border">{quantity}</span>
                <button
                    onClick={() => setQuantity(Math.min( selectedSizeQnty, quantity + 1))}
                    className="px-3 py-1 border hover:bg-gray-100"
                >
                    +
                </button>
            </div>
        </div>

        {/* Add to Cart Button */}
        <button onClick={handleAddToCart} className="w-full py-3 bg-black text-white flex items-center justify-center gap-2 hover:bg-gray-800">
            <ShoppingCart size={20} />
            Add to Cart
        </button>
        </div>
    )
}

export default ProductAddress
