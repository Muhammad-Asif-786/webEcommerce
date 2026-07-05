import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Success = () => {
  const location = useLocation()
    
    console.log("location",)  
  return (
    <div className='mt-30 m-2 w-full max-w-md bg-green-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
        <p className='text-green-800 font-bold text-lg text-center'>
          {location?.state?.text ? location.state.text : "Payment"} Successfully.Successfully
        </p>
        {/* <p className='text-green-800 font-bold text-lg text-center'>{Boolean (location?.state?.text) ? location?.state?.text : "Payment" } Successfully</p> */}
        <Link to="/" className="border border-green-900 rounded text-green-900 hover:bg-green-900 hover:text-white transition-all px-4 py-1">Go To Home</Link>
    </div>
  )
}

export default Success



// location.state.text: flexible aur professional approach hai, multiple payment types handle karne ke liye best
// Abhi ka reason location.state.text use karne ka:
// Ye dynamic message allow karta hai:
// COD → "Order Successfully"
// Online Payment → "Payment Successfully"
// Future me agar aur payment methods add kiye → easily handle ho jata hai