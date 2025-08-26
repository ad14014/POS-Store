import React from "react";
import {  Routes, Route, useLocation } from "react-router-dom";
import ProductFrom from "./ProductFrom";
import AllProduct from "./AllProduct";
import UpdateProduct from "./UpdateProduct";
import Navbar from "./Navbar";
import Cart from "./AddToCart";
import AllOrders from "./AllOrders";
import DiscountForm from "./DiscountForm";
import Login from "./LoginPage";
import Register from "./RegistrationForm";

const AppRoutes = () => {
  const location = useLocation();
const hideNavbar = location.pathname === "/" || location.pathname === "/registration"; 

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<AllProduct />} />
        <Route path="/addproduct" element={<ProductFrom />} />
        <Route path='/registration' element={<Register/>}/>
        <Route path="/update/:id" element={<UpdateProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/allOrders" element={<AllOrders />} />
        <Route path="/discount" element={<DiscountForm />} />
      </Routes>
    </>
  );
};



export default AppRoutes;
