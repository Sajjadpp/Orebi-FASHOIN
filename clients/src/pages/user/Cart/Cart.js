import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../../components/user/pageProps/Breadcrumbs";
import { resetCart } from "../../../redux/orebiSlice";
import { emptyCart } from "../../../assets/images/index";
import ItemCard from "./ItemCard";
import { userAxiosInstance } from "../../../redux/constants/AxiosInstance";
import toast from "react-hot-toast";

const Cart = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);
  const [cartProduct, setCartProduct] = useState([]);
  const [totalAmt, setTotalAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [trigger, setTrigger] = useState(0); // Used to refresh the cart

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const response = await userAxiosInstance.get("/cart", {
        params: { userId: user._id },
      });
      setCartProduct(response.data.products);
      setTotalAmt(response.data.totalAmt);
    } catch (error) {
      toast.error("Failed to fetch cart data. Please try again later.");
    }
  };
  const navigate = useNavigate()
  // Fetch cart whenever trigger or user changes
  useEffect(() => {
    if (user) fetchCart();

    if(!user) navigate('/signin')
  }, [user, trigger]);

  // Calculate shipping charges based on total amount
  useEffect(() => {
    if (totalAmt <= 1000) {
      setShippingCharge(50);
    } else if (totalAmt <= 4000) {
      setShippingCharge(25);
    } else {
      setShippingCharge(0);
    }
  }, [totalAmt]);

  // Update trigger to refresh the cart
  const refreshCart = () => {
    setTrigger(Date.now());
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Cart" />
      {cartProduct.length > 0 ? (
        <div className="pb-20">
        
          {/* Cart Items */}
          <div className="mt-5">
            {cartProduct.map((item) => (
              <div key={item._id}>
                <ItemCard item={item} refreshCart={refreshCart} />
              </div>
            ))}
          </div>

          

          {/* Cart Totals */}
          <div className="max-w-7xl gap-4 flex justify-end mt-4">
            <div className="w-96 flex flex-col gap-4">
              <h1 className="text-2xl font-semibold text-right">Cart totals</h1>
              <div>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Subtotal
                  <span className="font-semibold tracking-wide font-titleFont">
                    ₹{totalAmt}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Shipping Charge
                  <span className="font-semibold tracking-wide font-titleFont">
                    ₹{shippingCharge}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
                  Total
                  <span className="font-bold tracking-wide text-lg font-titleFont">
                    ₹{totalAmt + shippingCharge}
                  </span>
                </p>
              </div>
              <div className="flex justify-end">
                <Link to="/payment">
                  <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Empty Cart
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
        >
          <div>
            <img
              className="w-80 rounded-lg p-4 mx-auto"
              src={emptyCart}
              alt="emptyCart"
            />
          </div>
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Your Cart feels lonely.
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Your Shopping cart lives to serve. Give it purpose - fill it with
              books, electronics, videos, etc., and make it happy.
            </p>
            <Link to="/shop">
              <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                Continue Shopping
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
