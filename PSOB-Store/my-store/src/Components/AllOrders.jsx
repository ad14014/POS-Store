import axios from "axios";
import React, { useEffect, useState } from "react";

function AllOrders() {

  const email=  JSON.parse(localStorage.getItem("user"));
  console.log(email);
       if(!email) return alert('You are not Authorize for this Page!!')
  const [order, setOrder] = useState([]);
  const [OrderDate, setOrderDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const getAllOrder = async () => {
   
    const res = await axios.get(`http://localhost:3000/order/orders/${email}`);
    setOrder(res.data.orders);
    console.log(res.data.orders);
  };

  useEffect(() => {
    getAllOrder();
  }, []);
console.log(order);

  const filteredProducts = order.filter((product) => {
    const matchStatus = product.status
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchDate =
      OrderDate === "" ||
      new Date(product.date).toISOString().split("T")[0] === OrderDate;

    return matchStatus && matchDate;
  });



  return (
    <div className="mt-30">
      
<div className="fixed top-16 left-10 mt-2  w-half max-w-5xl bg-white border-1 shadow-lg rounded-xl p-4 flex items-center gap-4 z-50">
 
  <div className="flex items-center gap-2">
    <img src="filter.png" alt="Filter" className="h-6 w-6" />
    <span className="text-black font-medium">Filters</span>
  </div>

  
  <select
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
  >
    <option value="">All Status</option>
    <option value="Active">Active</option>
    <option value="Pending">Pending</option>
    <option value="Failure">Failure</option>
  </select>
  <input
    type="date"
    value={OrderDate}
    onChange={(e) => setOrderDate(e.target.value)}
    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
  />

 
  <button
    onClick={() => {
      setSearchTerm("");
      setOrderDate("");
    }}
    className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg transition"
  >
    Clear
  </button>
</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-40 px-4">
        {filteredProducts.map((ord, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center text-center"
            style={{ boxShadow: "0 10px 20px black" }}
          >
            <div className="relative h-34 w-full flex justify-center">
              <img
                src="products.png"
                alt="Order Product"
                className="h-full object-cover rounded-lg"
              />
            </div>

            <div className="mt-4 w-full">
                {ord.cartItems.map((v)=>(
                    <h2 className="font-semibold text-gray-800">
                {v.productName}
              </h2>
            
                ))}
               
              <h2 className="text-xl font-semibold text-gray-800">
                {ord.customerName}
              </h2>
              <p className="text-m text-black">{ord.phoneNumber}</p>
            </div>

            <div className="mt-4 space-y-2 w-full text-left">
              <p className="text-m text-black">
                <span className="font-semibold">Address:</span> {ord.address}
              </p>
              <p className="text-m text-black">
                <span className="font-semibold">Amount:</span> {ord.amount}
              </p>
              <p className="text-m text-black">
                <span className="font-semibold">Total Price:</span>{" "}
                {ord.totalPrice}
              </p>
              <p className="text-m text-black">
                <span className="font-semibold">Date:</span>{" "}
                {new Date(ord.date).toDateString()}
              </p>
              <p className="text-m text-black">
                <span className="font-semibold">Payment Mode:</span>{" "}
                {ord.paymentMode}
              </p>
              <p className="text-m text-black">
                <span className="font-semibold">Status:</span> {ord.status}
              </p>
               <p className="text-m text-black">
                <span className="font-semibold">PostedBy:</span> {ord.postedBy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllOrders;
