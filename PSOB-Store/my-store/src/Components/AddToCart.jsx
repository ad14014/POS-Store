import React, { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
  const token= localStorage.getItem("token")
       if(!token) return alert('You are not Authorize for this Page!!')
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
 const [Bill,setBill]=useState([])
  const [customerName, setCustomerName] = useState("");
  const [status, setStatus] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [discounts, setDiscount] = useState([]);
  const [postedBy, setpostedBy] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [ShowBill,setShowBill]=useState(false)

  const mode = ["Online", "Cash"];
  const action = ["Active", "Pending", "Failure"];

 
  useEffect(() => {
    const fetchProducts = async () => {
    
      try {
        const res = await axios.get("http://localhost:3000/getAll", {
        headers: { "ngrok-skip-browser-warning": "true",
          'Authorization': `Bearer ${token}` 
         }
      });
        const res2 = await axios.get("http://localhost:3000/discount/getAll", {
        headers: { "ngrok-skip-browser-warning": "true",
          'Authorization': `Bearer ${token}` 
         }
      });
        setProducts(res.data.Data);
        setDiscount(res2.data.Data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  
  const handleAddToCart = async () => {
    try {
      const product = products.find((p) => p._id === selectedProductId);
      const variant = product.variants.find((v) => v._id === selectedVariantId);

      
      const discount = discounts.find((d) => d.variant_id._id === variant._id);

      let discountedPrice = variant.price;
      if (discount) {
        discountedPrice =
          variant.price - (variant.price * discount.value) / 100;
      }

      const newItem = {
        ...product,
        selectedVariant: {
          ...variant,
          discountedPrice,
        },
        quantity,
      };

      const updatedCart = [...cartItems, newItem];
      setCartItems(updatedCart);

      console.log("New Cart", newItem);

      await axios.post("http://localhost:3000/cart", newItem, {
        headers: { "ngrok-skip-browser-warning": "true",
          'Authorization': `Bearer ${token}` 
         }
      });
      alert("Product added to cart!");
    } catch (error) {
      alert(`Please Enter Valid Quantity`);
    }
  };


const totalPrice = cartItems.reduce((total, item) => {
  const price =
    item.selectedVariant.discountedPrice || item.selectedVariant.price || 0;
  return total + price * item.quantity;
}, 0);


let discountAmount = 0;
if (totalPrice >= 20000) {
  discountAmount = 6000;
} else if (totalPrice >= 10000) {
  discountAmount = 3000;
}

const finalPrice = totalPrice - discountAmount;


  const HandleOrder = async (e) => {
    e.preventDefault();
   
    if (!customerEmail) {
      alert("Please enter your email before placing the order.");
      return;
    }

    const orderData = {
      cartItems,
      finalPrice,
      totalPrice,
      customerName,
      status,
      paymentMode,
      customerEmail,
      amount,
      address,
      phoneNumber,
      postedBy,
      date: new Date().toISOString(),
    };
    console.log("orderdetails", orderData);

    try {
      await axios.post("http://localhost:3000/order/create", orderData, {
        headers: { "ngrok-skip-browser-warning": "true",
          'Authorization': `Bearer ${token}` 
         }
      });
      alert("Order Placed!!");
       setBill(orderData)
       console.log("This is Bill",Bill);
       setShowBill(true)
      setShowOrderForm(false);
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="p-6 z-10">
      <h1
        className="text-2xl font-bold mb-4 mt-14 p-3 flex justify-center bg-white text-black rounded-2xl "
        style={{ boxShadow: "0 3px 10px black" }}
      >
        Select Products for Cart
      </h1>

   
      <div className="z-10 w-80 mb-4">
        <button
          onClick={() => setShowProductDropdown(!showProductDropdown)}
          className="border-2 border-black rounded-lg  p-2 w-80 text-left bg-white"
        >
          {selectedProductId
            ? products.find((p) => p._id === selectedProductId).productName
            : "Select a product..."}
        </button>

        {showProductDropdown && (
          <div className="absolute  mt-1 w-80 bg-white border-2 border-black rounded-lg shadow-lg max-h-80 overflow-auto">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => {
                  setSelectedProductId(product._id);
                  setSelectedVariantId("");
                  setShowProductDropdown(false);
                }}
                className="flex flex-col items-center border-b border-gray-200 p-4 hover:bg-gray-100 cursor-pointer"
              >
                <img
                  src="products.png"
                  alt={product.productName}
                  className="w-32 h-32 object-contain mb-4"
                />
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {product.productName}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  {product.categoryName}
                </p>
                <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Variant Dropdown */}
      {selectedProductId && (
        <>
          <label className="block mb-1 font-medium">Choose Variant:</label>
          <select
            value={selectedVariantId}
            onChange={(e) => setSelectedVariantId(e.target.value)}
            className="border border-white bg-white rounded-lg p-2 w-60 mb-4"
          >
            <option value="">Select variant...</option>
            {products
              .find((p) => p._id === selectedProductId)
              ?.variants.map((variant) => (
                <option key={variant._id} value={variant._id}>
                  {variant.variant_name} - {variant.variant_value} (${variant.price})
                </option>
              ))}
          </select>
        </>
      )}

      {/* Quantity Selector */}
      {selectedProductId && (
        <>
          <label className="block mb-1 font-medium">Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg p-2 w-24 mb-4"
          />
        </>
      )}

      <button
        onClick={handleAddToCart}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Add to Cart
      </button>

      
      {cartItems.length !== 0 ? (
        <h1
          className="text-2xl font-bold mb-4 mt-10 p-3 flex justify-center bg-white text-black rounded-2xl "
          style={{ boxShadow: "0 3px 10px black" }}
        >
          Saved Cart Product
        </h1>
      ) : (
        <h1
          className="text-2xl font-bold mb-4 mt-10 p-3 flex justify-center bg-white text-black rounded-2xl "
          style={{ boxShadow: "0 3px 10px black" }}
        >
          No Product Yet!!
        </h1>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cartItems.map((product, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center text-center"
            style={{ boxShadow: "0 10px 20px black" }}
          >
            <img
              src="products.png"
              alt={product.productName}
              className="w-32 h-32 object-contain mb-4"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {product.productName}
            </h2>
            <p className="text-sm text-gray-500 mb-2">{product.categoryName}</p>
            <p className="text-sm text-gray-500 mb-2">{product.sku}</p>

            
            {product.selectedVariant && (
              <div className="mt-3 w-full flex flex-wrap justify-center gap-2">
                <span
                  style={{ backgroundColor: "green" }}
                  className="m-1 text-white rounded-lg px-1"
                >
                  {product.selectedVariant.variant_name}
                </span>
                <span
                  style={{ backgroundColor: "purple" }}
                  className="m-1 text-white rounded-lg px-1"
                >
                  {product.selectedVariant.variant_value}
                </span>

                <div className="ml-2 text-black text-m font-bold">
                  {product.selectedVariant.discountedPrice &&
                  product.selectedVariant.discountedPrice !==
                    product.selectedVariant.price ? (
                    <>
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "red",
                          marginRight: "8px",
                        }}
                      >
                        ${product.selectedVariant.price * product.quantity}
                      </span>
                      <span className="text-green-600">
                        ${product.selectedVariant.discountedPrice * product.quantity}
                      </span>
                    </>
                  ) : (
                    <>${product.selectedVariant.price * product.quantity}</>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

   
      {cartItems.length > 0 && (
        <>
          <div className="mt-6 p-4 bg-gray-200 rounded-lg text-center">
            <h2 className="text-xl font-bold text-gray-800">
              Total Price: ${totalPrice}
            </h2>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowOrderForm(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg"
            >
              Proceed to Order
            </button>
          </div>
        </>
      )}

      {/* -------- Slidebar Order Form -------- */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-150 bg-white h-full shadow-2xl p-6 overflow-y-auto transition-transform duration-300">
            <button
              onClick={() => setShowOrderForm(false)}
              className="text-red-500 font-bold text-lg mb-4"
            >
              Close
            </button>

            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            {cartItems.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 shadow-md bg-gray-50"
              >
                <h3 className="font-bold">{item.productName}</h3>
                <p>Variant: {item.selectedVariant?.variant_name}</p>
                <p>Value: {item.selectedVariant?.variant_value}</p>
                <p>Quantity: {item.quantity}</p>

                {/* Discount logic */}
                {item.selectedVariant?.discountedPrice &&
                item.selectedVariant.discountedPrice !==
                  item.selectedVariant.price ? (
                  <>
                    <p>
                      Price:{" "}
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "red",
                          marginRight: "8px",
                        }}
                      >
                        ${item.selectedVariant.price}
                      </span>
                      <span className="text-green-600 font-bold">
                        ${item.selectedVariant.discountedPrice}
                      </span>
                    </p>
                    <p className="font-semibold">
                      Subtotal:{" "}
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "red",
                          marginRight: "8px",
                        }}
                      >
                        ${item.selectedVariant.price * item.quantity}
                      </span>
                      <span className="text-green-600 font-bold">
                        ${item.selectedVariant.discountedPrice * item.quantity}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="font-semibold">
                    Subtotal: ${item.selectedVariant?.price * item.quantity}
                  </p>
                )}
              </div>
            ))}
            <div className="mt-6 p-4 bg-gray-200 rounded-lg text-center">
  <h2 className="text-xl font-bold text-gray-800">
    Total Price: ${totalPrice}
  </h2>
  {discountAmount > 0 && (
    <h2 className="text-xl font-bold text-green-600">
      Discount: -${discountAmount}
    </h2>
  )}
  <h2 className="text-2xl font-bold text-black">
    Final Amount: ${finalPrice}
  </h2>
</div>
            {/* Order Form */}
            <form className="mt-6">
              <label className="block mb-2 font-medium">Customer Name:</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border rounded p-2 mb-4"
                placeholder="Enter your name"
              />
              <label className="block mb-2 font-medium">Customer Email:</label>
              <input
                type="text"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full border rounded p-2 mb-4"
                placeholder="Enter your Email"
              />
              <label className="block mb-2 font-medium">Status:</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                className="w-full border rounded p-2 mb-4"
              >
                <option className="disabled">select item</option>
                {action.map((act) => (
                  <option key={act}>{act}</option>
                ))}
              </select>
              <label className="block mb-2 font-medium">Payment:</label>
              <select
                value={paymentMode}
                onChange={(e) => {
                  setPaymentMode(e.target.value);
                }}
                className="w-full border rounded p-2 mb-4"
              >
                <option className="disabled">select item</option>
                {mode.map((act) => (
                  <option key={act}>{act}</option>
                ))}
              </select>

              {paymentMode === "Online" && (
                <div className="mb-2">
                  <label
                    htmlFor="amt"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Online Amount
                  </label>
                  <input
                    type="text"
                    id="amt"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="shadow-xs bg-gray-50 border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Enter amount"
                    required
                  />
                </div>
              )}
              {paymentMode === "Cash" && (
                <div className="mb-2">
                  <label
                    htmlFor="onamt"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Cash Amount
                  </label>
                  <input
                    type="text"
                    id="onamt"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="shadow-xs bg-gray-50 border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Enter amount"
                    required
                  />
                </div>
              )}
              <label className="block mb-2 font-medium">Address:</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded p-2 mb-4"
                placeholder="Enter delivery address"
              />

              <label className="block mb-2 font-medium">Phone Number:</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border rounded p-2 mb-4"
                placeholder="Enter your phone"
              />
               <label className="block mb-2 font-medium">PostedBy:</label>
              <input
                type="text"
                value={postedBy}
                onChange={(e) => setpostedBy(e.target.value)}
                className="w-full border rounded p-2 mb-4"
                placeholder="Enter your email"
              />

              <button
                type="submit"
                onClick={HandleOrder}
                
                className="bg-blue-600 text-white w-full py-2 rounded-lg"
              >
                Place Order
              </button>
            </form>
          </div>

        </div>
      )}
      {ShowBill && Bill && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-3/4 max-w-2xl p-6 relative">
      {/* Close button */}
      <button
        onClick={() => setShowBill(false)}
        className="absolute top-2 right-3 text-red-500 font-bold text-xl"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold text-center mb-4">Order Invoice</h2>

      {/* Customer Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Name:</strong> {Bill.customerName}</p>
          <p><strong>Email:</strong> {Bill.customerEmail}</p>
          <p><strong>Phone:</strong> {Bill.phoneNumber}</p>
          <p><strong>Address:</strong> {Bill.address}</p>
        </div>
        <div>
          <p><strong>Posted By:</strong> {Bill.postedBy}</p>
          <p><strong>Status:</strong> {Bill.status}</p>
          <p><strong>Payment Mode:</strong> {Bill.paymentMode}</p>
          <p><strong>Date:</strong> {new Date(Bill.date).toLocaleString()}</p>
        </div>
      </div>

      {/* Items */}
      <h3 className="text-lg font-semibold mb-2">Items</h3>
      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Product</th>
            <th className="border border-gray-300 p-2">Variant</th>
            <th className="border border-gray-300 p-2">Qty</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {Bill.cartItems.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{item.productName}</td>
              <td className="border border-gray-300 p-2">
                {item.selectedVariant?.variant_name} - {item.selectedVariant?.variant_value}
              </td>
              <td className="border border-gray-300 p-2">{item.quantity}</td>
              <td className="border border-gray-300 p-2">
                ${item.selectedVariant?.discountedPrice || item.selectedVariant?.price}
              </td>
              <td className="border border-gray-300 p-2">
                ${(item.selectedVariant?.discountedPrice || item.selectedVariant?.price) * item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="text-right">
        <p className="text-lg"><strong>Total Price:</strong> ${Bill.totalPrice}</p>
        {Bill.finalPrice !== Bill.totalPrice && (
          <p className="text-lg text-green-600">
            <strong>Discount:</strong> -${Bill.totalPrice - Bill.finalPrice}
          </p>
        )}
        <p className="text-2xl font-bold"><strong>Final Amount:</strong> ${Bill.finalPrice}</p>
        <p className="text-lg"><strong>Paid Amount:</strong> ${Bill.amount}</p>
      </div>
    </div>
  </div>
)}  </div>
  );
};

export default Cart;
