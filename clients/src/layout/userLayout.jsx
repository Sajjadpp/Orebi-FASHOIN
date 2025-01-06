import ChatPopup from "../components/user/chat/Chat";
import Footer from "../components/user/home/Footer/Footer";
import FooterBottom from "../components/user/home/Footer/FooterBottom";
import Header from "../components/user/home/Header/Header";
import HeaderBottom from "../components/user/home/Header/HeaderBottom";
import SpecialCase from "../components/user/SpecialCase/SpecialCase";
import {Outlet, ScrollRestoration} from "react-router-dom"
const UserLayout = () => {
    return (
      <div>
        <Header />
        <HeaderBottom />
        <SpecialCase />
        <ScrollRestoration />
        <Outlet />
        <Footer />
        <ChatPopup/>
        <FooterBottom />
      </div>
    );
  };

  export default UserLayout