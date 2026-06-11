import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import { GoTriangleRight } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import UserMenuMobile from "../pages/UserMenuMobile";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import DisplayCart from "../pages/DisplayCart";

export default function Header() {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  // const [openCartSection, setOpenCartSection] = useState(false);
  const user = useSelector((state) => state?.user);
  const cartItems = useSelector((state) => state.cartItem.cart);
  const { totalQty, totalPrice } = useGlobalContext();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [openDisplayCart, setOpenDisplayCart] = useState(false)

  const handleLogoClick = () => navigate("/home");
  const handleSearchClick = () => navigate("/searchpage");
  const redirectToLoginPage = () => navigate("/login");

  const handleCloseUserMenu = () => setOpenUserMenu(false);

  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }
    navigate("/usermenu");
  };



  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow p-3 px-6 z-50 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      {/* Top Row: Logo + User Icon */}
      <div className="flex items-center justify-between">
        <div
          onClick={handleLogoClick}
          className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition"
        >
          MyStore
        </div>

        {/* Mobile User Icon */}
        <div className="flex md:hidden items-center">
          <button
            onClick={handleMobileUser}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FaRegUserCircle size={28} className="cursor-pointer" />
          </button>

          {openUserMenu && (
            <div className="absolute ml-auto">
              <UserMenuMobile close={handleCloseUserMenu} />
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-1/2">
        <input
          type="text"
          placeholder="Search products..."
          value={searchValue}
          onClick={handleSearchClick}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              navigate(`/searchpage?q=${searchValue}`);
            }
          }}
          className="w-full border rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search
          className="absolute right-3 top-2.5 text-gray-500 cursor-pointer hover:text-blue-600 transition"
          size={20}
        />
      </div>

      {/* Desktop Login + Cart */}
      <div className="hidden md:flex items-center gap-5">
        {user?._id ? (
          <div className="relative">
            <div
              onClick={() => setOpenUserMenu((prev) => !prev)}
              className="flex select-none items-center gap-1 cursor-pointer"
            >
              <p>Account</p>
              {openUserMenu ? <GoTriangleUp size={25} /> : <GoTriangleDown size={25} />}
            </div>
            {openUserMenu && (
              <div className="absolute right-0 top-12">
                <div className="bg-white rounded p-4 min-w-52 shadow-lg">
                  <UserMenu close={handleCloseUserMenu} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={redirectToLoginPage}
            className="text-lg px-2 hover:text-blue-600 cursor-pointer"
          >
            Login
          </button>
        )}

        {/* Cart */}
        <button
          onClick={()=>setOpenDisplayCart(true)}
          className="bg-green-500 h-14 px-4 flex items-center p-1 pt-2 rounded-md font-bold text-white gap-2"
        >
          <div className="relative animate-bounce cursor-pointer">
            <ShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {/* {cartItems[0] && <span>{totalQty}</span>} */}
              {cartItems[0] ? totalQty : 0}
            </span>
          </div>
          {cartItems[0] ? (
            <div>{DisplayPriceInRupees(totalPrice)}</div>
          ) : (
            <div className="font-semibold">My Cart</div>
          )}
        </button>
      </div>

      {/* Mobile Cart Full Width */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-green-500 p-3 z-50 mx-3 rounded">
        <button
          
          className="w-full flex gap-4 items-center text-white font-semibold"
        >
          <div className="animate-bounce relative">
            <ShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {/* {cartItems[0] && <span>{totalQty}</span>} */}
              {cartItems[0] ? totalQty : 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between w-full">
            <div>{cartItems[0] ? DisplayPriceInRupees(totalPrice) : "My Cart"}</div>
            <div onClick={()=>setOpenDisplayCart(true)} className="flex items-center  cursor-pointer">
              <div>view Cart</div>
              <div className="mt-1" ><GoTriangleRight size={22} /></div>
            </div>
          </div>
        </button>
      </div>

      {
        openDisplayCart && (
          <DisplayCart  close={()=>setOpenDisplayCart(false)} />
        )
      }


          </header>
        );
      }





// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Search, ShoppingCart } from "lucide-react";
// import { FaRegUserCircle } from "react-icons/fa";
// import { useSelector } from "react-redux";
// import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
// import UserMenu from "./UserMenu";
// import UserMenuMobile from "../pages/UserMenuMobile";
// import { useGlobalContext } from "../provider/GlobalProvider";
// import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";

// export default function Header() {
//   const [openUserMenu, setOpenUserMenu] = useState(false);
//   const user = useSelector((state) => state?.user);
//   const navigate = useNavigate();
//   const [searchValue, setSearchValue] = useState("");
//   const cartItems = useSelector((state)=>state.cartItem.cart)
//   console.log("cartItems",cartItems)
//   // const [cartCount, setCartCount] = useState(cartItems.length)
//   const {totalQty, totalPrice} = useGlobalContext()

//   const handleSearchClick = () => navigate("/searchpage");
//   const handleLogoClick = () => navigate("/home");
//   const handleCartClick = () => navigate("/cart");
//   const redirectToLoginPage = () => navigate("/login");

//   const handleCloseUserMenu = ()=>{
//         setOpenUserMenu(false)
//     }
  
//   const handleMobileUser = ()=>{
//         if(!user._id){
//             navigate("/login")
//             return
//         }
//             navigate("/usermenu")
//     }

// // useEffect(()=>{
// //   setCartCount(cartItems.length)
// // }, [cartItems])

//   return (
//     <header className="fixed top-0 left-0 w-full bg-white shadow p-3 px-6 z-50 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
//       {/* Top Row: Logo + User Icon */}
//       <div className="flex items-center justify-between">
//         <div
//           onClick={handleLogoClick}
//           className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition"
//         >
//           MyStore
//         </div>

//         {/* Mobile User Icon */}
//         <div className="flex md:hidden items-center">
//           <button
//           onClick={handleMobileUser}
//           className="p-2 rounded-full hover:bg-gray-100"
//           >
//             <FaRegUserCircle size={28} className="cursor-pointer" />
//           </button>

//           {openUserMenu && (
//             <div className="absolute ml-auto">
//               <UserMenuMobile close={handleCloseUserMenu} />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Search Bar — visible on all screens but style changes */}
//       <div className="relative w-full md:w-1/2">
//         <input
//           type="text"
//           placeholder="Search products..."
//           onClick={handleSearchClick}
//           value={searchValue}
//           onChange={(e) => setSearchValue(e.target.value)}
//           onKeyDown={(e) => {
//           if (e.key === "Enter"){
//               navigate(`/searchpage?q=${searchValue}`);
//             }}}
//           className="w-full border rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         <Search
//           className="absolute right-3 top-2.5 text-gray-500 cursor-pointer hover:text-blue-600 transition"
//           size={20}
//         />
//         </div>
//       {/* <div className="relative w-full md:w-1/2">
//         <input
//           type="text"
//           placeholder="Search products..."
//           onClick={handleSearchClick}
//           className="w-full border rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <Search
//           className="absolute right-3 top-2.5 text-gray-500 cursor-pointer hover:text-blue-600 transition"
//           size={20}
//         />
//       </div> */}

//       {/* Right: Desktop Login + Cart */}
//       <div className="hidden md:flex items-center gap-5">
//         {user?._id ? (
//           <div className="relative">
//             <div
//               onClick={() => setOpenUserMenu((prev) => !prev)}
//               className="flex select-none items-center gap-1 cursor-pointer"
//             >
//               <p>Account</p>
//               {openUserMenu ? (
//                 <GoTriangleUp size={25} />
//               ) : (
//                 <GoTriangleDown size={25} />
//               )}
//             </div>

//             {openUserMenu && (
//               <div className="absolute right-0 top-12">
//                 <div className="bg-white rounded p-4 min-w-52 shadow-lg">
//                   <UserMenu close={handleCloseUserMenu} />
//                 </div>
//               </div>
//             )}
//           </div>
//         ) : (
//           <button
//             onClick={redirectToLoginPage}
//             className="text-lg px-2 hover:text-blue-600 cursor-pointer"
//           >
//             Login
//           </button>
//         )}

//         {/* Cart */}
//         <button
//           onClick={handleCartClick}
//           className=" bg-green-500 h-14 px-4 flex items-center p-1 pt-2 rounded-md font-bold text-white gap-2"
//         >
//           <div className="relative animate-bounce cursor-pointer">
//             <ShoppingCart size={22} />
//             <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
//               {totalQty}
//             </span>
//           </div>

//           {
//             cartItems[0]? (

//               <div>{ DisplayPriceInRupees(totalPrice) }</div>
//             ):(
//               <div className="font-semibold">My Cart</div>
//             )
//           }
//         </button>
//       </div>
//     </header>
//   );
// }
