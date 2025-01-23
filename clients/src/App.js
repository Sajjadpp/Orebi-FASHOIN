import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  useNavigate,
} from "react-router-dom";

import About from "./pages/user/About/About";
import SignIn from "./pages/user/Account/signIn/SignIn";
import SignUp from "./pages/user/Account/SignUp/SignUp";
import Cart from "./pages/user/Cart/Cart";
import Contact from "./pages/user/Contact/Contact";
import Home from "./pages/user/Home/Home";
import Journal from "./pages/user/Journal/Journal";
import Offer from "./pages/user/Offer/Offer";
import Payment from "./pages/user/payment/Payment";
import ProductDetails from "./pages/user/ProductDetails/ProductDetails";
import Shop from "./pages/user/Shop/Shop";
import Otp from "./pages/user/Otp/Otp";
import ProfilePage from "./pages/user/profile/Profile";
import AdminLogin from './pages/admin/Login/Login'
import Dashboard from "./pages/admin/Dashboard/DashBboard";
import AdminLayout from "./layout/AdminLayout"
import UserLayout from "./layout/userLayout";
import EditProduct from "./pages/admin/product/EditProduct/EditProduct";
// toast
import toast, {Toaster, } from 'react-hot-toast'
import {ThreeDot} from "react-loading-indicators"
import { SidebarContextProvider } from "./context/SideBarContext";
import AddProduct from "./pages/admin/product/AddProduct";
import Category from "./pages/admin/Category/Category";
import AdminProductList from "./pages/admin/product/productList/ProductList";
import {  LoadingProvider } from "./context/LoadingContext";
import UserManagement from "./pages/admin/UserManagement/UserManagement";
import BlockedPage from "./pages/user/Blocked/Blocked";
import OrderConfirmation from "./pages/user/OrderCompleted/OrderCompleted";
import ForgotPassword from "./pages/user/ForgetPassword/ForgetPassword";
import OrderList from "./pages/admin/Orders/Orders";
import OrderDetailsPage from "./components/admin/Orders/OrderViewDetails/OrderDetails";
import StockList from "./pages/admin/Stock/StockManagement";
import WishlistPage from "./pages/user/WhishList/WishList";
import OfferListing from "./pages/admin/Offer/Offer";
import AddOffer from "./pages/admin/Offer/addOffer";
import CouponPage from "./pages/admin/Coupon/Coupons";
import AddCouponPage from "./pages/admin/Coupon/AddCoupon";
import EditCouponPage from "./pages/admin/Coupon/EditCoupon";
import SalesReport from "./pages/admin/salesReport/SaleReportPage";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<LoadingProvider><UserLayout /></LoadingProvider>}>
        {/* ==================== Header Navlink Start here =================== */}
        <Route index element={<Home />}></Route>
        <Route path="/shop" element={<Shop />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/journal" element={<Journal />}></Route>
        <Route path="/profile" element={<ProfilePage/>}></Route>
        {/* ==================== Header Navlink End here ===================== */}
        <Route path="/offer" element={<Offer />}></Route>
        <Route path="/product/:_id" element={<ProductDetails />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/payment" element={<Payment />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/wishlist" element={<WishlistPage/>}/>
        

      </Route>
      <Route path="/orderCompleted" element={<OrderConfirmation />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/signin" element={<SignIn />}></Route>
      <Route path="/verify" element={<Otp/>}/>
      <Route path="/blocked" element={<BlockedPage/>}/>

      
        <Route
         path="/admin" 
         element={
          <SidebarContextProvider>
            <AdminLayout/>
          </SidebarContextProvider>
            }>

          <Route index element={<Dashboard/>}></Route>
          <Route element={<AddProduct/>} path="products/add"></Route>
          <Route element={<AdminProductList/>} path="products/list"></Route>
          <Route element={<EditProduct/>} path="products/edit"></Route>
          <Route element={<Category/>} path="Category"></Route>
          <Route element={<UserManagement/>} path="customers"></Route>
          <Route element={<OrderList/>} path="orders"></Route>
          <Route element={<StockList/>} path='stockManagement'></Route>

          <Route element={<OfferListing/>} path='offer'></Route>
          <Route element={<AddOffer/>} path='addOffer'></Route>

          <Route element={<CouponPage/>} path='coupon'></Route>
          <Route element={<AddCouponPage/>} path='addCoupon'></Route>
          <Route element={<EditCouponPage/>} path='editCoupon/:id'></Route>
          <Route path="sales-report" element={<SalesReport/>}/>
        </Route>
          <Route element={<OrderDetailsPage/>} path="details"/>
      
        <Route path="admin/login" element={<AdminLogin/>}/>
    </Route>
  )
);

function App() {
  
  return (
    <div className="font-bodyFont">
      
        <Toaster position="top-right"/>
        <RouterProvider router={router} />
    </div>
  );
}

export default App;
