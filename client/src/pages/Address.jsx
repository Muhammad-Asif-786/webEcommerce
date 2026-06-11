import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';
import EditAddressDetails from '../components/EditAddressDetails';
import ConfirmBox2 from '../components/ConfirmBox2';

const Address = () => {
  const addressList = useSelector(state => state.address.addressList)
  const [openAddress,setOpenAddress] = useState(false)
  const [OpenEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({})
  const { fetchAddress} = useGlobalContext()
  const [openConfirmBox, setOpenConfirmBox] = useState(false)
  const [ deleteAddress, setDeleteAddress] = useState({
    _id: '',
  })

  const handleDisableAddress = async(id)=>{
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data : {
          _id : id
        }
      })
      if(response.data.success){
        toast.success("Address Remove")
        
        if(fetchAddress){
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <div className='mt-20'>
        <div className='bg-white shadow-lg px-2 py-2 flex justify-between gap-4 items-center '>
            <h2 className='font-semibold text-ellipsis line-clamp-1'>Address</h2>
            <button onClick={()=>setOpenAddress(true)} className=' bg-green-500 hover:bg-green-600 border border-green-200 text-white px-3  cursor-pointer py-1 rounded-full'>
                Add Address
            </button>
        </div>
        <div className='bg-blue-50 p-2 grid gap-4'>
              {
                addressList.map((address,index)=>{
                  return(
                      <div key={address._id} className={`border rounded p-3 flex gap-3 bg-white ${!address.status && 'hidden'}`}>
                          <div className='w-full'>
                            <p>{address.address_line}</p>
                            <p>{address.city}</p>
                            <p>{address.state}</p>
                            <p>{address.country} - {address.pincode}</p>
                            <p>{address.mobile}</p>
                          </div>
                          <div className='mb-2'>
                            <div className='flex gap-4 p-3 rounded-full'>
                            <button
                              onClick={() => {
                                setOpenEdit(true)
                                setEditData(address)
                              }}
                              className='bg-green-200 hover:text-white hover:bg-green-600 rounded-full p-2 flex items-center justify-center'
                            >
                              <MdEdit size={20} />
                            </button>

                            <button
                              onClick={() => {
                                setOpenConfirmBox(true)
                                setDeleteAddress(address)
                              }}
                              className='bg-red-200 hover:text-white hover:bg-red-600 rounded-full p-2 flex items-center justify-center'
                            >
                              <MdDelete size={20} />
                            </button>
                          </div>
                          </div>
                         
                      </div>
                  )
                })
              }
              <div onClick={()=>setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
                Add address
              </div>
        </div>

        {
          openAddress && (
            <AddAddress close={()=>setOpenAddress(false)}/>
          )
        }

        {
          OpenEdit && (
            <EditAddressDetails data={editData} close={()=>setOpenEdit(false)}/>
          )
        }

        {
          openConfirmBox && (
            <ConfirmBox2 
              close={() => setOpenConfirmBox(false)} 
              cancel={() => setOpenConfirmBox(false)} 
              confirm={() => {
                handleDisableAddress(deleteAddress._id);
                setOpenConfirmBox(false); // ✅ modal close
              }} 
            />
          )
        }
        
    </div>
  )
}

export default Address
