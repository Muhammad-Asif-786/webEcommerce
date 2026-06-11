import React from 'react'
import UserMenu from '../components/UserMenu'
import { IoArrowBackSharp } from "react-icons/io5";

const UserMenuMobile = () => {


  return (
    <section>
      <div className='p-4 col-auto '>
        <div>
        <button onClick={()=>window.history.back()}  className="flex gap-0.5 ml-auto bg-amber-300 hover:bg-amber-400 px-1 text-white rounded-full" >
            <IoArrowBackSharp size={16} />
        </button>
      </div>
      <div>
        <UserMenu  />
      </div>
      </div>
    </section>
  )
}

export default UserMenuMobile