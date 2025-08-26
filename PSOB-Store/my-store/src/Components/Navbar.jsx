import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const HandleAllproduct = () => {
    navigate("/home")
  }
  const HandleAddProduct = () => {
    navigate("/addproduct")
  }
  const HandleCart = () => {
    navigate('/Cart')
  }
  const HandleOrders = () => {
    navigate("/allOrders")
  }
  const HandleDiscount = () => {
    navigate("/discount")
  }
  const HandleLogout = () => {
    localStorage.clear();
    navigate('/')
  }
  const HandleProfile = () => {
    navigate('/profile')   // 👈 create your profile route
    setOpen(false);
  }

  return (
    <div>
      <nav className="fixed top-0 right-0 left-0 z-10 bg-stone-200 h-16">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            
            {/* Left section */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img src="shopping-bag (1).png" alt="Logo" className="h-12 w-auto " />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <button 
                    onClick={HandleAllproduct} 
                    className="rounded-md bg-white px-3 py-2 text-xl font-medium text-black shadow-lg hover:bg-black hover:text-white"
                    style={{boxShadow:'0 3px 10px black'}}
                  >
                    Home
                  </button>
                  <button 
                    onClick={HandleAddProduct} 
                    className="rounded-md bg-white px-3 py-2 text-xl font-medium text-black shadow-lg hover:bg-black hover:text-white"
                    style={{boxShadow:'0 3px 10px black'}}
                  >
                    Add Product
                  </button>
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

              {/* Icons */}
              <div className="flex shrink-0 items-center m-5">
                <img src="grocery-store.png" alt="Cart" className="h-10 w-auto cursor-pointer" onClick={HandleCart}/>
              </div>
              <div className="flex shrink-0 items-center m-5">
                <img src="discount.png" alt="Discount" className="h-10 w-auto cursor-pointer" onClick={HandleDiscount}/>
              </div>
              <div className="flex shrink-0 items-center m-5">
                <img src="shopping-bag.png" alt="Orders" className="h-10 w-auto cursor-pointer" onClick={HandleOrders}/>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <img 
                  src="user.png" 
                  alt="User" 
                  className="size-10 rounded-full cursor-pointer"
                  onClick={() => setOpen(!open)}
                />

                {open && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <button 
                      onClick={HandleProfile} 
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </button>
                    <button 
                      onClick={HandleLogout} 
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
