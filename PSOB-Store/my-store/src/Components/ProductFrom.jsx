import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductForm = () => {
 const token= localStorage.getItem("token")
  if(!token) return alert('You are not Authorize for this Page!!')
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    categoryId: "",
    description: "",
    variant_name: "",
    variant_value: "",
    price: "",
    refundable: "",
    quantity: "",
    location: ""
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/category/getAll", {
        headers: { "ngrok-skip-browser-warning": "true",
          'Authorization': `Bearer ${token}` 
         }
      })
      .then((res) => setCategories(res.data.Data))
      .catch((err) => console.error(err));
  }, []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const payload = {
      ...formData,
      refundable: formData.refundable === "true"
    };
console.log("FormData",payload);

    try {
      await axios.post("http://localhost:3000/create", payload, {
        headers: { "ngrok-skip-browser-warning": "true",
          'Authorization': `Bearer ${token}` 
         }
      });
      alert("Your Product Added Successfully!!");

      setFormData({
        productName: "",
        sku: "",
        categoryId: "",
        description: "",
        variant_name: "",
        variant_value: "",
        price: "",
        refundable: "",
        quantity: "",
        location: ""
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 mt-16">
      <form
        className="w-half h-auto bg-stone-200 p-6 rounded-2xl shadow-xl space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-black text-center">
          Add New Product
        </h2>

        <input
          type="text"
          name="productName"
          placeholder="Enter product name"
          value={formData.productName}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border px-4 py-2 bg-white"
        />

        
        <input
          type="text"
          name="sku"
          placeholder="Enter SKU"
          value={formData.sku}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border px-4 py-2 bg-white"
        />

        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border px-4 py-2 bg-white"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Enter description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border px-4 py-2 h-26 bg-white"
        />

        <hr className="border-gray-400" />

      
        <h3 className="text-lg font-semibold text-gray-800">Variant Info</h3>

        <input
          type="text"
          name="variant_name"
          placeholder="Enter variant name (e.g. Size, Color)"
          value={formData.variant_name}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border px-4 py-2 bg-white"
        />

        <input
          type="text"
          name="variant_value"
          placeholder="Enter variant value (e.g. Large, Red)"
          value={formData.variant_value}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border px-4 py-2 bg-white"
        />

        <input
          type="number"
          name="price"
          placeholder="Enter price"
          value={formData.price}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border px-4 py-2 bg-white"
        />

        <label className="flex flex-col space-y-1">
          <span className="text-gray-700">Refundable</span>
          <select
            name="refundable"
            value={formData.refundable}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border px-4 py-2 bg-white"
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>

        <hr className="border-gray-400" />

       
        <h3 className="text-lg font-semibold text-gray-800">Inventory Info</h3>

        <input
          type="number"
          name="quantity"
          placeholder="Enter quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border px-4 py-2 bg-white"
        />

        <input
          type="text"
          name="location"
          placeholder="Enter location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border px-4 py-2 bg-white"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
