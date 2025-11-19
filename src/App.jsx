import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Main from "./main/main";
import Cart from "./cart/cart";
import About from "./about/about";
import Details_proudact from "./details_proudact/cart";
import Fit from "./details_proudact/fitroom";
import Login from "./login/login";
import Code from "./login/code";
import Start from "./login/start";
import Register from "./login/register";
import Heart from "./heart/heart";
import Notification from "./notification/notification";
import Payment from "./payment/pay";
import Orders from "./payment/orders";
import Profile from "./profile/profile";
// import Point from "./profile/point";
import Password from "./profile/change_profile";
import Search from "./search/serach";
import Admin from "./admin/admin";
import OrdersA from "./admin/orders";
import Found from "./404/404";
import Add from "./addC/add";
import Insert_proudect from "./admin/Insert_proudect";
import Contact from "./contact_us/contact";
import Notf from "./admin/notf";
import Product from "./admin/product";
import Super from "./super_admin/super";
import Add_admin from "./super_admin/add";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Product" element={<Product />} />
        {/* <Route path="/Point" element={<Point />} /> */}
         <Route path="/change_password" element={<Password />} />
        <Route path="/Add_admin" element={<Add_admin />} />
        <Route path="/super" element={<Super />} />
        <Route path="/OrdersA" element={<OrdersA />} />
        <Route path="/try_on" element={<Fit />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/details_proudact" element={<Details_proudact />} />
        <Route path="/Notf" element={<Notf />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/Code" element={<Code />} />
        <Route path="/Start" element={<Start />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Heart" element={<Heart />} />
        <Route path="/Start" element={<Start />} />
        <Route path="/notice" element={<Notification />} />
        <Route path="/checkout" element={<Payment />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Insert_proudect" element={<Insert_proudect />} />
        <Route path="/add" element={<Add />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="*" element={<Found />} /> {/* Catch all unmatched routes */}
      </Routes>
    </Router>
  );
}

export default App;
