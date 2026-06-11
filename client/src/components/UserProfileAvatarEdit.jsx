import React, { useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import {  useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose } from "react-icons/io5";
import toast from 'react-hot-toast'
import { updatedAvatar } from '../reduxStore/userSlice'


const UserProfileAvatarEdit = ({close}) => {

    const user = useSelector(state => state.user)
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()

    const handleSubmit = (e)=>{
        e.preventDefault()
    }

    const handleUploadAvatarImage = async (e)=>{
        const file = e.target.files[0]

        if(!file){
            return
        }
    

    const formData = new FormData()
          formData.append('avatar',file)

// jab bhi hum image/avatar/file upload karte hain frontend se backend par, toh hamesha FormData use hota hai.
// 🔥 FormData kyu use karte hain?
// Image ya file JSON format me send nahi ho sakti.
// File ko binary format me send karne ke liye multipart/form-data type chahiye hota hai.
// FormData() wahi format banata hai jo backend easily read kar sake.
//✔️ Jab bhi file upload hogi → FormData hi use hoga → Aur Axios me data ke andar FormData hi pass hota hai.

try {
    setLoading(true)

    const response = await Axios({
        ...SummaryApi.uploadAvatar,
        data: formData
    })

    const {data:responseData} = response

    if(responseData?.error){
        toast.error(responseData.message)
    }
    if(responseData?.success){
        toast.success(responseData.message)
        dispatch(updatedAvatar(responseData.data.avatar))
    }
    
} catch (error) {
    AxiosToastError(error)
    
}finally{
    setLoading(false)
}

}

  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-60 p-4 flex items-center justify-center'>
        <div className='bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center'>
            <button onClick={close} className='text-neutral-800 w-fit block ml-auto'>
                <IoClose size={20}/>
            </button>
            <div className='w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
                {
                    user.avatar ? (
                        <img 
                        alt={user.name}
                        src={user.avatar}
                        className='w-full h-full'
                        />
                    ) : (
                        <FaRegUserCircle size={65}/>
                    )
                }
            </div>
            <form onSubmit={handleSubmit}>
                <label htmlFor='uploadProfile'>
                    <div className='border border-primary-200 cursor-pointer hover:bg-primary-200 px-4 py-1 rounded text-sm my-3'>
                        {
                            loading ? "Loading" : "Upload"
                        }
                    </div>
                    <input onChange={handleUploadAvatarImage} type='file' id='uploadProfile' className='hidden'/>
                </label>
            </form>
            
        </div>
    </section>
  )
}

export default UserProfileAvatarEdit
