import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from "../utils/Axios.js"
import SummaryApi from "../common/SummaryApi.js"
import toast from 'react-hot-toast';
import { setUserDetails } from '../reduxStore/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';
import { IoArrowBackSharp } from "react-icons/io5";
// import { FaArrowRight } from "react-icons/fa";

const Profile = () => {

    const user = useSelector((state) => state.user);
    const [openProfileAvatarEdit, setOpenProfileAvatarEdit]= useState(false)
    const [loading, setLoading] =useState(false)
    const dispatch = useDispatch()

    const [userData, setUserData] = useState({
          name : user.name,
          email: user.email,
          mobile:user.mobile
    })

    useEffect(()=>{
        setUserData({
            name : user.name,
            email : user.email,
            mobile : user.mobile,
        })
    },[user])

    const handleOnChange = (e)=>{
        const {name,value} = e.target

        setUserData((preve)=>{
            return{
                ...preve,
                [name]:value
            }
        })
    }

    const handleSubmit =async (e)=>{
        e.preventDefault()

        try {
            setLoading(true)
        const response= await Axios({
            ...SummaryApi.userDetails,
            data: userData
        })

        const {data:responseData} = response

        if(responseData.error){
            toast.error(responseData.message)
        }
        if(responseData.success){
            toast.success(responseData.message)

            // console.log("1-userDetails",responseData)

            const userData = await fetchUserDetails()
            dispatch(setUserDetails(userData.data))
            // console.log("2-userDetails",userData)

        }
            
        } catch (error) {
            AxiosToastError(error)
        }finally{
            setLoading(false)
        }
    }

  return (
    <section className='mt-25' >
        <div className='col-1'>
            <div className='flex gap 3' >
                <button onClick={()=>window.history.back()}  className="flex gap-0.5 ml-auto bg-amber-300 hover:bg-amber-400 px-1 text-white rounded-full" >
                    <IoArrowBackSharp size={16} />
                </button>
                {/* <button onClick={()=>window.history.forward()}  className="flex gap-0.5 ml-auto bg-gray-400 px-1 text-white rounded-full" >
                    <FaArrowRight  size={16} />
                </button> */}
            </div>
            <div className='mt-0 '>
        {
            user.avatar ? (
                <img
                src={user.avatar}
                className='w-16 h-16 rounded-full'
                />
            ):(
               <FaRegUserCircle size={30} className='bg-red-400 rounded-full'/>
            )
        }
        </div>
        <button onClick={()=>setOpenProfileAvatarEdit(true)}
         className='bg-amber-300 hover:bg-amber-400 px-4 mt-1 rounded-xl cursor-pointer'>
            Edit
        </button>
        </div>

        {
            openProfileAvatarEdit &&(

                <UserProfileAvatarEdit  close={()=>setOpenProfileAvatarEdit(false)} />
            )
        }

        {/**name, email, mobile  */}
        <form className='my-4 grid gap-4' onSubmit={handleSubmit}>
            <div className='grid'>
                <label>Name</label>
                <input
                    type='text'
                    placeholder='Enter your name' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                    name='name'
                    value={userData.name || ""}
                    onChange={handleOnChange}
                    required
                />
            </div>
            <div className='grid'>
                <label htmlFor='email'>Email</label>
                <input
                    type='email'
                    id='email'
                    placeholder='Enter your email' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                    value={userData.email || ""}
                    name='email'
                    onChange={handleOnChange}
                    required
                />
            </div>
            <div className='grid'>
                <label htmlFor='mobile'>Mobile</label>
                <input
                    type='number'
                    id='mobile'
                    placeholder='Enter your mobile' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                    value={userData.mobile || ""}
                    name='mobile'
                    onChange={handleOnChange}
                    required
                />
            </div>

            <button className='border px-4 py-2 font-semibold hover:bg-primary-100 border-primary-100 text-primary-200 hover:text-neutral-800 rounded'>
                {
                    loading ? "Loading..." : "Submit"
                }
            </button>
        </form>
      

    </section>
  )
}

export default Profile