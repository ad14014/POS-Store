import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AllProduct = () => {
  const navigate = useNavigate();
  const [Getproduct, setGetproduct] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const GetAllProduct = async () => {
     const token= localStorage.getItem("token")
      try {
        const response = await axios.get('http://localhost:3000/getAll',{
          headers: { 
            'ngrok-skip-browser-warning': 'true',
            'Authorization': `Bearer ${token}` 
          },
        });;
        setGetproduct(response.data.Data);
        console.log(response.data.Data);
      } catch (error) {
        console.error('Error fetching product:', error.message);
      }
    };
    GetAllProduct();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/delete/${id}`,{
          headers: { 
            'ngrok-skip-browser-warning': 'true',
            'Authorization': `Bearer ${token}` 
          },
        });
      setGetproduct((prevData) => prevData.filter((product) => product._id !== id));
      alert(`Product Deleted Successfully: ${id}`);
    } catch (error) {
      console.log(error);
      alert(`Problem in deleting product: ${id}`);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update/${id}`);
  };

 const filteredProducts = Getproduct.filter((product) =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="fixed top-16 left-8 mt-2  w-half max-w-5xl bg-white border-1 shadow-lg rounded-xl p-4 flex items-center gap-4 z-50">
 
  <div className="flex items-center gap-2">
    <img src="filter.png" alt="Filter" className="h-6 w-6" />
    <span className="text-black font-medium">Filters</span>
  </div>

  
  <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-30 p-2 border border-gray-300 rounded-lg  focus:outline-none focus:ring focus:border-blue-300"
      />



 
  <button
    onClick={() => {
      setSearchTerm("");
    }}
    className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg transition"
  >
    Clear
  </button>
</div>
      <div className='flex flex-col items-center text-center'>
        <h1 className="text-2xl font-bold mt-20 bg-white p-2 text-black rounded-md" style={{boxShadow:'0 3px 10px black'}}>
          Choose Your Desire Product Here!!
        </h1>
      </div>

      {/* Search bar */}
     

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center text-center"
            style={{ boxShadow: '0 10px 20px black' }}
          >
            <img
              src="products.png"
              alt={product.productName}
              className="w-32 h-32 object-contain mb-4"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-1">{product.productName}</h2>
            <p className="text-sm text-gray-500 mb-2">{product.categoryName}</p>
            <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
            <p className="text-sm text-gray-500 mb-2">{new Date(product.createdAt).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500 mb-2">{new Date(product.updatedAt).toLocaleDateString()}</p>
            
            

            {/* Show variants if available */}
           {product.variants && product.variants.length > 0 && (
  <div className="mt-3 w-full">
    
    <div className="flex flex-wrap justify-center gap-2">
      {product.variants.map((variant) => (
        <span
          key={variant._id}
        ><span style={{backgroundColor:'green'}} className='m-1 text-white rounded-lg px-1'>{variant.variant_name}</span>
          <span style={{backgroundColor:'purple'}} className='m-1 text-white rounded-lg px-1'>{variant.variant_value}</span>
          <div className="ml-2 text-black-500 text-m font-bold">(${variant.price})</div>
        </span>
        
      ))}
    </div>
  </div>
)}
            <div className="mt-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg mb-2"
                onClick={() => handleUpdate(product._id)}
                style={{ boxShadow: '0 5px 10px black' }}
              >
                Update
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg m-3"
                onClick={() => handleDelete(product._id)}
                style={{ boxShadow: '0 5px 10px black' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProduct;
