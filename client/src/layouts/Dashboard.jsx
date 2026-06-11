import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {

  const user = useSelector((state)=>state.user)
  console.log("user",user)

  return (
    <section>
        <div className='flex p-3 ' >
            <div className=' py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block lg:w-1/5 border-r'>
              <UserMenu/>
            </div>

            <div className='bg-white min-h-[75vh] w-full lg:px-12'>
                <Outlet/>
            </div>
            
        </div>
        
    </section>
  )
}

export default Dashboard