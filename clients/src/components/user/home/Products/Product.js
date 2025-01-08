import React, { useState } from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "../../designLayouts/Image";
import Badge from "./Badge";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../../redux/orebiSlice";
import { userAxiosInstance } from "../../../../redux/constants/AxiosInstance";
import toast from "react-hot-toast";

const Product = (props) => {
  const {
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
  } = props;
  const [currentImage, setCurrentImage] = useState(typeof images === "object" && images[0]);
  const dispatch = useDispatch();
  
  const user = useSelector(state => state.userReducer.user)
  const idString = (name) => {
    return String(name).toLowerCase().split(" ").join("");
  };
  const rootId = idString(name);

  const navigate = useNavigate();
  const handleProductDetails = () => {
    console.log(props)
    navigate(`/product/${_id}`, {
      state: {
        item: JSON.stringify(props),
      },
    });
  };

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((regularPrice - currentPrice) / regularPrice) * 100
  );

  const handleAddToWishList = async () =>{
    console.log('fetch data....')
    try{
      let userId = user._id;
      const response = await userAxiosInstance.put('/wishList', {
        userId,
        productId: _id
      })
      console.log(response.data)
      toast.success(response.data);
    }
    catch(error){
      console.log(error);
      toast.error(error.response.data)
    }
  }

  // Check if product is new (within 7 days)
  const isNew = () => {
    const productDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - productDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };
  const handleAddToCart = async() =>{

    try{
      let response = await userAxiosInstance.patch('/cart', {productId: _id, userId: user._id})
      console.log(response.data,'')
    }
    catch(error){
      toast.error(error.response.data || error.message)
    }
  }

  return (
    <div className="w-full relative group">
      <div className="max-w-80 max-h-80 relative overflow-y-hidden">
        <div onMouseEnter={() => images[1] && setCurrentImage(images[1])}
             onMouseLeave={() => setCurrentImage(images[0])}>
          <Image className="w-full h-full" imgSrc={currentImage} />
        </div>
        <div className="absolute top-6 left-8">
          {isNew() && <Badge text="New" />}
          {discountPercentage > 0 && 
            <Badge text={`-${discountPercentage}%`} className="bg-red-500" />
          }
        </div>
        <div className="w-full h-32 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
          <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">
            <li className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full">
              Compare
              <span>
                <GiReturnArrow />
              </span>
            </li>
            <li
              onClick={handleAddToCart}
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
            >
              Add to Cart
              <span>
                <FaShoppingCart />
              </span>
            </li>
            <li
              onClick={handleProductDetails}
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
            >
              View Details
              <span className="text-lg">
                <MdOutlineLabelImportant />
              </span>
            </li>
            <li onClick={handleAddToWishList} className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full">
              Add to Wish List
              <span>
                <BsSuitHeartFill />
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-80 py-6 flex flex-col gap-1 border-[1px] border-t-0 px-4">
        <div className="flex items-center justify-between font-titleFont">
          <h2 className="text-lg text-primeColor font-bold">
            {name}
          </h2>
          <div className="flex flex-col items-end">
            <p className="text-[#767676] text-[14px] line-through">${regularPrice}</p>
            <p className="text-red-500 font-bold">${currentPrice}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[#767676] text-[14px] capitalize">{category}</p>
          {stock?.length > 0 && (
            <p className="text-green-500 text-[12px]">
              {stock.reduce((total, item) => total + item.quantity, 0)} in stock
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Product);