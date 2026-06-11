import React, { useEffect, useState } from 'react'
import {Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const ResetPassword = () => {

    const location = useLocation()
    console.log("reset password page location data",location)

    const navigate = useNavigate()

    const [showNewPassword, setShowNewPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState(false)

    // Location ka concept dakho
    // location.state.email React Router se aati hai jab tum navigate karte waqt state bhejte ho.
    // navigate("/reset-password", {
    //   state: {
    //     email: data.email,
    //     data: response.data
    //   }
    // })

    useEffect(()=>{
        if(!(location?.state?.data?.success)){
              navigate("/home")
        }

        if(location?.state?.email){   //Ye ensure karta hai ke Reset Password page me input ya state ke andar user ka email pehle se set ho,jisse backend ko pata chale ke kis user ka password reset karna hai.
          setData((preve)=>{
              return{
                  ...preve,
                  email : location?.state?.email
              }
          })
    }

    },[location, navigate])


    const [data, setData] = useState({
        email : "",
        newPassword : "",
        confirmPassword : ""
    })

    const valideValue = data.newPassword.trim() && data.confirmPassword.trim() //ya spaces ko ignore kr dy ga.

    const handleChange =(e)=>{
        const{name, value} =e.target

           setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }


    const handleSubmit = async(e)=>{
           e.preventDefault()

        if(data.newPassword !== data.confirmPassword){ 
            toast.error("newPassword and ConfirmPassword should be same")
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.resetPassword,
                data : data,
            })

            if(response.data.error){
                toast.error(response.data.message)
            }
            if(response.data.success){
                toast.success(response.data.message)
                setData({
                    email : "",
                    newPassword : "",
                    confirmPassword : ""
                })
                navigate("/login")
            }
            
        } catch (error) {
            AxiosToastError(error)
        }
    }


  return (
    <div className="flex justify-center items-center py-8 bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl px-8 w-full max-w-md">
        <h4 className="text-xl font-semibold text-center mt-3 my-4">Enter Your New Password</h4>

        <form className="space-y-2" onSubmit={handleSubmit} >

          {/* newPassword */}
          <div  >
            <label className="block text-gray-700 mb-1">New Password</label>
            <div  className="flex bg-white items-center  border border-gray-300 rounded-lg ">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={data.newPassword}
                onChange={handleChange}
                placeholder="Enter your newPassword"
                className="w-full px-3 py-1 rounded-lg focus:outline-none "
              />
            <div
              onClick={() => setShowNewPassword(prev => !prev)}
              className="cursor-pointer px-1"
             >
              {showNewPassword ? <FaRegEye /> : <FaRegEyeSlash />}
           </div>
            </div>
             </div>

          {/* confirmPassword */}
          <div  >
            <label className="block text-gray-700 mb-1">confirm newPassword</label>
            <div  className="flex bg-white items-center  border border-gray-300 rounded-lg ">
              <input
                type={confirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Enter your confirmPassword"
                className="w-full px-3 py-1 rounded-lg focus:outline-none "
              />
            <div
              onClick={() => setConfirmPassword(prev => !prev)}
              className="cursor-pointer px-1"
             >
              {confirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
           </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={!valideValue}
            type="submit"
            className={` ${valideValue ? " bg-green-600 hover:bg-green-700" : "bg-gray-400" } w-full mt-4 text-white py-2 rounded-lg transition`}
          >
            Change Password
          </button>
        </form>

        <div className='flex justify-items-start'>
            <p className="text-center text-gray-600 mb-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword