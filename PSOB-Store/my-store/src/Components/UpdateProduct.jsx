import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const UpdateProduct = () => {
  const token= localStorage.getItem("token")
       if(!token) return alert('You are not Authorize for this Page!!')
  const navigate=useNavigate()
  const { id } = useParams();
   const [categories, setCategories] = useState([]);
   const [vareints, setVareint] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    sku:'',
    description: '',
    createdAt:'',
    category: '',
    updatedAt:'',
    varient_Id:''
  });


  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        axios.get('http://localhost:3000/category/getAll',{
        headers: { "ngrok-skip-browser-warning": "true",
          'Authorization': `Bearer ${token}` 
         }
      }) 
      .then(res => setCategories(res.data.Data))
      .catch(err => console.error(err));
        const response = await axios.get(`http://localhost:3000/single/${id}`,{
        headers: { "ngrok-skip-browser-warning": "true",
          'Authorization': `Bearer ${token}` 
         }
      });
        const product = response.data.message;
        console.log("product",product);
        
        const response2=await axios.get('http://localhost:3000/vareint/getAll',{
        headers: { "ngrok-skip-browser-warning": "true",
          'Authorization': `Bearer ${token}` 
         }
      })
        setVareint(response2.data.data)
        console.log("this Vareint:",vareints);
       const EnhancedVareint=vareints.map((v)=>{
        const newproduct=product._id===v.product_id

       })

        
       
        setFormData({
          productName: product.productName,
         sku:product.sku,
          description: product.description,
          createdAt:product.createdAt,
          category:product.category.name,
          varient_Id:"",
          updatedAt:product.updatedAt||Date.now(),
        });
        console.log(product);
        
      } catch (error) {
        console.error('Error fetching product:', error.message);
      }
    };

    fetchProduct();
  }, [id]);

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/update/${id}`, formData,{
          headers: { 
            'ngrok-skip-browser-warning': 'true',
            'Authorization': `Bearer ${token}` 
          },
        });
      navigate('/')
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error.message);
      alert('Failed to update product.');
    }
  };



  return (
    <div className="p-6 max-w-md mx-auto mt-20 border-1 rounded-2xl bg-stone-200">
      <h2 className="text-2xl font-bold mb-4">Update Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4 ">
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          placeholder={formData.productName}
          className="w-full border p-2 rounded bg-white"
        /><input
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          placeholder={formData.sku}
          className="w-full border p-2 rounded bg-white"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder={formData.description}
          className="w-full border p-2 rounded bg-white"
        />
        <input
          type="text"
          name="createdAt"
          value={formData.createdAt}
          onChange={handleChange}
          placeholder={formData.createdAt}
          className="w-full border p-2 rounded bg-white"
        />
       <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border px-4 py-2 bg-white"
        >
           <option value="">Select Category</option>
  {categories.map(cat => (
    <option key={cat._id} value={cat._id}>{cat.name}</option>
              
          ))}
        </select>
        <select
          name="varient_Id"
          value={formData.varient_Id}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border px-4 py-2 bg-white"
        >
           <option value="">Select Category</option>
  {vareints.map(vare => (
    <option key={vare._id} value={vare._id}>{vare.variant_name}</option>
              
          ))}
        </select>
        <input
          type="text"
          name="updatedAt"
          value={formData.updatedAt}
          onChange={handleChange}
          placeholder={formData.updatedAt}
          className="w-full border p-2 rounded bg-white"
        />
       
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
