import React, { useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import fetchUserDetails from "../utils/fetchUserDetails.js";
import { setUserDetails } from "../reduxStore/userSlice";
import { useDispatch } from "react-redux";

export default function Login() {

    const [data, setData] = useState({
        email : "",
        password : ""
    })

    const handleChange = (e)=>{
        const {name, value} = e.target
        setData ((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const valideValue = Object.values(data).every(el => el)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showPassword, setShowPassword]= useState(false)

    const handleSubmit = async(e)=>{
        e.preventDefault()
        
        try {

          const response = await Axios({
            ...SummaryApi.login,
            data : data
          })

          if(response.data.error){
            toast.error(response.data.message)
          }
          if(response.data.success){
            toast.success(response.data.message)

            localStorage.setItem('accesstoken',response.data.data.accesstoken)
            localStorage.setItem('refreshToken',response.data.data.refreshToken)
 
            const userDetails = fetchUserDetails()
            dispatch(setUserDetails(userDetails.data))
            

          console.log("userDetails", userDetails)

            setData({
              email : "",
              password : ""
            })
            navigate("/home")
          }
            
        } catch (error) {
          AxiosToastError(error)
        }

    }


  return (
        <div className=" mt-15 flex justify-center items-center py-8 bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl px-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mt-3">Login</h2>

        <form className="space-y-2" onSubmit={handleSubmit} >
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Password */}
          <div  >
            <label className="block text-gray-700 mb-1">Password</label>
            <div  className="flex bg-white items-center  border border-gray-300 rounded-lg ">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-3 py-1 rounded-lg focus:outline-none "
              />
            <div
              onClick={() => setShowPassword(prev => !prev)}
              className="cursor-pointer px-1"
             >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
           </div>
            </div>
              <div className="flex">
                <Link to={"/forgot-password"} className=" ml-auto pl-2 pt-1 pb-3 hover:text-blue-600 cursor-pointer hover:underline" > ForgotPassword? </Link>
              </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={!valideValue}
            type="submit"
            className={` ${valideValue ? " bg-green-600 hover:bg-green-700" : "bg-gray-400" } w-full text-white py-2 rounded-lg transition`}
          >
            Login
          </button>
        </form>

        <div className="flex justify-items-start mb-6">
          <p className="text-center text-gray-600 my-2">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
        </div>
      </div>
    </div>
    
  );
}
