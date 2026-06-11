import React, { useEffect, useState } from 'react'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import  {useGlobalContext}  from '../provider/GlobalProvider'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from 'react-icons/fa'

const AddToCartButton = ({data}) => {
  // console.log("AddToCartButtondata",data)
  const {fetchCartItem, updateCartItem, deleteCartItem} = useGlobalContext()
  const [loading, setLoading] = useState(false)
  const cartItem = useSelector((state)=>state.cartItem.cart)
  const [isAvailableCart, setIsAvailableCart] = useState(false)
  const [qty, setQty] = useState(0)
  const [cartItemDetails,setCartItemsDetails] = useState()



  const handleAddToCart = async(e)=>{
      e.preventDefault()
      e.stopPropagation()

      try {
        setLoading(true)
        const response = await Axios({
          ...SummaryApi.addToCart,
          data:{productId:data?._id}
        })

        const {data:responseData} =response

        if(responseData.error){
          toast.error(responseData.message )
        }
        if(responseData.success){
          toast.success(responseData.message )
          if(fetchCartItem){
            await fetchCartItem()
          }
        }
        
      } catch (error) {
        AxiosToastError(error)
      }finally{
        setLoading(false)
      }
  }

    //checking this item in cart or not
    useEffect(() => {
        const checkingitem = cartItem.some(item => item.productId._id === data._id) //cartItem → ye cart me saare items ka array hai. .some() array ke har element ko check karta hai aur return karta hai true ya false.
        setIsAvailableCart(checkingitem)

        const product = cartItem.find(item => item.productId._id === data._id) // cart me already added item ka actual data lene ke liye use hoti hai .find() array me pehla element return karta hai jo condition match kare.
        setQty(product?.quantity)
        setCartItemsDetails(product)
        
    }, [data, cartItem])

    const increaseQty = async(e) => {
    e.preventDefault()
    e.stopPropagation()

    const response = await updateCartItem(cartItemDetails?._id, qty + 1)

    if(response.success){
      await fetchCartItem()
      toast.success("Item added")
    }
}


    const decreaseQty = async(e) => {

          e.preventDefault()
          e.stopPropagation()
        if(qty === 1){
            deleteCartItem(cartItemDetails?._id)
        }else{
            const response = await updateCartItem(cartItemDetails?._id,qty-1)

            if(response.success){
              await fetchCartItem()
              toast.success("Item remove")
            }
        }
    }

  

  return (
    <div className='w-full max-w-[150px]'>
      {
        isAvailableCart? (
          <div className='flex w-full h-full'>
              <button onClick={decreaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'><FaMinus /></button>

              <p className='flex-1 w-full font-semibold px-1 flex items-center justify-center'>{qty}</p>

              <button onClick={increaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'><FaPlus /></button>
          </div>
        ):(
      <button onClick={handleAddToCart} className='bg-green-500 hover:bg-green-700 rounded font-bold text-white px-3 py-1 cursor-pointer' >
        {loading ? <Loading/> : "Add"}  
      </button>
        )
      }

    </div>
  )
}

export default AddToCartButton