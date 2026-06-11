import React, { useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import AddAddress from '../components/AddAddress';
import { useDispatch, useSelector } from 'react-redux';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../reduxStore/cartSlice';
import { clearOrder } from '../reduxStore/orderSlice';

const CheckoutPage = () => {
  const { totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector(state => state.address.addressList);
  const [selectAddress, setSelectAddress] = useState(null);
  const cartItemsList = useSelector(state => state.cartItem.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ PROPER VALID BOOLEAN
  const valid = !!addressList[selectAddress]?._id;

  /*** CASH ON DELIVERY ***/
  const handleCashOnDelivery = async () => {

    if (!valid) {
      toast.error("Please select an address!");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.cashOnDelivery,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        dispatch(clearCart());
        dispatch(clearOrder());
        if (fetchCartItem) fetchCartItem();
        if (fetchOrder) fetchOrder();
        navigate('/success', { state: { text: "Order" } });
      }

    } catch (error) {
      AxiosToastError(error);
    }
  };

  /*** ONLINE PAYMENT ***/
  const handleOnlinePayment = async () => {

    if (!valid) {
      toast.error("Please select an address!");
      return;
    }

    try {

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      });

      const session = response?.data;

      if (!session?.url) {
        toast.error("Stripe URL not received");
        return;
      }

      dispatch(clearCart());
      dispatch(clearOrder());
      if (fetchCartItem) fetchCartItem();

      window.location.href = session.url;

    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className='bg-blue-50'>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row gap-5 justify-between'>

        {/* ADDRESS SECTION */}
        <div className='w-full'>
          <h3 className='text-lg font-semibold'>Choose your address</h3>
          <div className='bg-white p-2 grid gap-4'>
            {addressList.map((address, index) => (
              <label key={address._id || index} htmlFor={"address" + index} className={!address.status ? "hidden" : ""}>
                <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>
                  <div>
                    <input
                      id={"address" + index}
                      type='radio'
                      value={index}
                      onChange={(e) => setSelectAddress(Number(e.target.value))}
                      name='address'
                      checked={selectAddress === index}
                    />
                  </div>
                  <div>
                    <p>{address.address_line}</p>
                    <p>{address.city}</p>
                    <p>{address.state}</p>
                    <p>{address.country} - {address.pincode}</p>
                    <p>{address.mobile}</p>
                  </div>
                </div>
              </label>
            ))}

            <div
              onClick={() => setOpenAddress(true)}
              className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
              Add address
            </div>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className='w-full max-w-md bg-white py-4 px-2'>
          <h3 className='text-lg font-semibold'>Order Summary</h3>

          {cartItemsList.map(item => (
            <div key={item._id} className='flex justify-between items-center border-b py-2'>
              <div className='flex gap-3'>
                <img src={item.productId.image} alt={item.productId.name} className='w-16 h-16 object-cover' />
                <div>
                  <p>{item.productId.name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Unit Price: {DisplayPriceInRupees(item.productId.price)}</p>
                </div>
              </div>
              <div>
                <p>Total: {DisplayPriceInRupees(item.productId.price * item.quantity)}</p>
              </div>
            </div>
          ))}

          <div className='mt-3 p-3 bg-gray-50 rounded'>
            <div className='flex justify-between'>
              <p>Total Quantity:</p>
              <p>{totalQty} items</p>
            </div>
            <div className='flex justify-between'>
              <p>Subtotal:</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
            <div className='flex justify-between'>
              <p>Delivery Charge:</p>
              <p>Free</p>
            </div>
            <div className='flex justify-between font-semibold text-lg'>
              <p>Grand Total:</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>

          <div className='flex flex-col gap-3 mt-4'>
            <button
              disabled={!valid}
              className={`${valid ? "bg-green-400 hover:bg-green-600" : "bg-gray-400"} w-full text-white py-2 rounded-lg transition`}
              onClick={handleOnlinePayment}
            >
              Online Payment
            </button>

            <button
              disabled={!valid}
              className={`${valid ? "bg-green-400 hover:bg-green-600" : "bg-gray-400"} w-full text-white py-2 rounded-lg transition`}
              onClick={handleCashOnDelivery}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;

// import React, { useState } from 'react';
// import { useGlobalContext } from '../provider/GlobalProvider';
// import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
// import AddAddress from '../components/AddAddress';
// import { useDispatch, useSelector } from 'react-redux';
// import AxiosToastError from '../utils/AxiosToastError';
// import Axios from '../utils/Axios';
// import SummaryApi from '../common/SummaryApi';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import { clearCart } from '../reduxStore/cartSlice';
// import { clearOrder } from '../reduxStore/orderSlice';

// const CheckoutPage = () => {
//   const { totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext();
//   const [openAddress, setOpenAddress] = useState(false);
//   const addressList = useSelector(state => state.address.addressList);
//   const [selectAddress, setSelectAddress] = useState(0);
//   const cartItemsList = useSelector(state => state.cartItem.cart);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   /*** CASH ON DELIVERY ***/
//   const handleCashOnDelivery = async () => {
//     if (!addressList[selectAddress]?._id) {
//       toast.error("Please select an address!");
//       return;
//     }
    
//     try {
//       const response = await Axios({
//         ...SummaryApi.cashOnDelivery,
//         data: {
//           list_items: cartItemsList,
//           addressId: addressList[selectAddress]._id,
//           subTotalAmt: totalPrice,
//           totalAmt: totalPrice,
//         }
//       });

//       const { data: responseData } = response;
//       if (responseData.success) {
//         toast.success(responseData.message);
//         if (fetchCartItem) fetchCartItem();
//         if (fetchOrder) fetchOrder();
//         navigate('/success', { state: { text: "Order" } });
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   /*** ONLINE PAYMENT ***/
//   // const handleOnlinePayment = async()=>{
//   //   try {
//   //       // toast.loading("Loading...")
//   //       const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY  // import.meta.env. ya vitejs k documents sy tarika lia hy
//   //       const stripePromise = await loadStripe(stripePublicKey)         
       
//   //       const response = await Axios({
//   //           ...SummaryApi.payment_url,
//   //           data : {
//   //             list_items : cartItemsList,
//   //             addressId : addressList[selectAddress]?._id,
//   //             subTotalAmt : totalPrice,
//   //             totalAmt :  totalPrice,
//   //           }
//   //       })
//   //       const { data : responseData } = response

//   //       stripePromise.redirectToCheckout({ sessionId : responseData.id })
        
//   //       if(fetchCartItem){
//   //         fetchCartItem()
//   //       }
//   //       if(fetchOrder){
//   //         fetchOrder()
//   //       }
//   //   } catch (error) {
//   //       AxiosToastError(error)
//   //   }
//   // }
// const handleOnlinePayment = async () => {

//   if (!addressList[selectAddress]?._id) {
//     toast.error("Please select an address!");
//     return;
//   }

//   try {

//     const response = await Axios({
//       ...SummaryApi.payment_url,
//       data: {
//         list_items: cartItemsList,
//         addressId: addressList[selectAddress]._id,
//         subTotalAmt: totalPrice,
//         totalAmt: totalPrice,
//       }
//     });

//     const session = response?.data;

//     if (!session?.url) {
//       toast.error("Stripe URL not received");
//       return;
//     }
    
//       dispatch(clearCart());
//       dispatch(clearOrder())
//       if(fetchCartItem) fetchCartItem();
    

//     // 🔥 NEW WAY (Stripe Updated)
//     window.location.href = session.url;

//   } catch (error) {
//     console.error(error);
//     AxiosToastError(error);
//   }
// };






//   return (
//     <section className='bg-blue-50'>
//       <div className='container mx-auto p-4 flex flex-col lg:flex-row gap-5 justify-between'>

//         {/* ADDRESS SELECTION */}
//         <div className='w-full'>
//           <h3 className='text-lg font-semibold'>Choose your address</h3>
//           <div className='bg-white p-2 grid gap-4'>
//             {addressList.map((address, index) => (
//               <label key={address._id || index} htmlFor={"address" + index} className={!address.status ? "hidden" : ""}>
//                 <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>
//                   <div>
//                     <input 
//                       id={"address" + index} 
//                       type='radio' 
//                       value={index} 
//                       onChange={(e) => setSelectAddress(Number(e.target.value))} 
//                       name='address' 
//                       checked={selectAddress === index}
//                     />
//                   </div>
//                   <div>
//                     <p>{address.address_line}</p>
//                     <p>{address.city}</p>
//                     <p>{address.state}</p>
//                     <p>{address.country} - {address.pincode}</p>
//                     <p>{address.mobile}</p>
//                   </div>
//                 </div>
//               </label>
//             ))}
//             <div 
//               onClick={() => setOpenAddress(true)} 
//               className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
//               Add address
//             </div>
//           </div>
//         </div>

//         {/* ORDER SUMMARY */}
//         <div className='w-full max-w-md bg-white py-4 px-2'>
//           <h3 className='text-lg font-semibold'>Order Summary</h3>

//           {cartItemsList.map(item => (
//             <div key={item._id} className='flex justify-between items-center border-b py-2'>
//               <div className='flex gap-3'>
//                 <img src={item.productId.image} alt={item.productId.name} className='w-16 h-16 object-cover' />
//                 <div>
//                   <p>{item.productId.name}</p>
//                   <p>Qty: {item.quantity}</p>
//                   <p>Unit Price: {DisplayPriceInRupees(item.productId.price)}</p>
//                 </div>
//               </div>
//               <div>
//                 <p>Total: {DisplayPriceInRupees(item.productId.price * item.quantity)}</p>
//               </div>
//             </div>
//           ))}

//           <div className='mt-3 p-3 bg-gray-50 rounded'>
//             <div className='flex justify-between'>
//               <p>Total Quantity:</p>
//               <p>{totalQty} items</p>
//             </div>
//             <div className='flex justify-between'>
//               <p>Subtotal:</p>
//               <p>{DisplayPriceInRupees(totalPrice)}</p>
//             </div>
//             <div className='flex justify-between'>
//               <p>Delivery Charge:</p>
//               <p>Free</p>
//             </div>
//             <div className='flex justify-between font-semibold text-lg'>
//               <p>Grand Total:</p>
//               <p>{DisplayPriceInRupees(totalPrice)}</p>
//             </div>
//           </div>

//           <div className='flex flex-col gap-3 mt-4'>
//             <button 
//               className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold'
//               onClick={handleOnlinePayment}
//             >
//               Online Payment
//             </button>
//             <button 
//               className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white'
//               onClick={handleCashOnDelivery}
//             >
//               Cash on Delivery
//             </button>
//           </div>
//         </div>
//       </div>

//       {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
//     </section>
//   );
// };

// export default CheckoutPage;
