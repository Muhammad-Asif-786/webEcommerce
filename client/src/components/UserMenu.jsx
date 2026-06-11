import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import isAdmin from "../utils/isAdmin";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { logout } from "../reduxStore/userSlice";


export default function UserMenu({ close }) {


  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogout = async ()=>{
        try {
          const response = await Axios({
            ...SummaryApi.logout,
          })

          const {data:responseData} = response

          if(responseData.error){
            toast.error(responseData.message)
          }
          if(responseData.success){
            toast.success(responseData.message)
            if(close){
              close()
            }
            dispatch(logout())
            localStorage.clear()
            navigate("/home")
          }

        } catch (error) {
          AxiosToastError(error)
        }
  }


   const handleClose = ()=>{
      if(close){
        close()
      }
   }
  
  
  return (
    <div className=" mt-16 text-gray-800">
      {/* User Info */}
      <div className="border-b pb-2 mb-2">
          <div className="mb-1">
            <p className="font-semibold text-black">My Account</p>
          </div>
          <div className="flex gap-2 items-center">
             <p className="text-sm text-gray-500">{ user?.name || user?.mobile } <span className="text-red-700">({user?.role})</span> </p>
              <Link onClick to={"/dashboard/profile"} className="hover:text-green-600 " >
                  <LuSquareArrowOutUpRight size={12}  />
              </Link>
          </div>
      </div>

      {/* Menu Options */}
      <div className='text-sm grid gap-1'>
            {
              isAdmin (user.role) && (
                <Link onClick={handleClose} to={"/dashboard/category"} className='px-2 hover:bg-orange-200 py-1'>Category</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/subcategory"} className='px-2 hover:bg-orange-200 py-1'>Sub Category</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/upload-product"} className='px-2 hover:bg-orange-200 py-1'>Upload Product</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/product"} className='px-2 hover:bg-orange-200 py-1'>Product</Link>
              )
            }

            <Link onClick={handleClose} to={"/dashboard/myorders"} className='px-2 hover:bg-orange-200 py-1'>My Orders</Link>

            <Link onClick={handleClose} to={"/dashboard/address"} className='px-2 hover:bg-orange-200 py-1'>My Address</Link>

            <button onClick={handleLogout} className='cursor-pointer text-left px-2 hover:bg-orange-200 py-1 '>Log Out</button>

        </div>
    </div>
  );
}
