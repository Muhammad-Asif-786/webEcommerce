import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import AxiosToastError from '../utils/AxiosToastError'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import EditCategory from '../components/EditCategory'
import ConfirmBox from '../components/ConfirmBox'



const Category = () => {
  const [openUploadCategory,setOpenUploadCategory] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categoryData, setCategoryData] = useState([])
  const [openEditCategory, setOpenEditCategory] = useState(false)
  const [editData, setEditData] = useState({
    name:"",
    image: ""
  })

  const [openConfirmBox, setOpenConfirmBox] = useState(false)
  const [deleteCategory, setDeleteCategory] = useState({
    _id: '',
  })



  const fetchCategory = async()=>{
    try {
      setLoading(true)

     const response = await Axios({
      ...SummaryApi.getCategory,
      // data : categoryData   ya get request wali api mn kabhi bhi nahi likhty.
     })

     const {data:responseData} = response

     if(responseData.error){
      toast.error(responseData.data.message)
     }
     if(responseData.success){
      setCategoryData(responseData.data)
     }

    } catch (error) {
      AxiosToastError(error)
      
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
      fetchCategory()
  },[])

 
  const handleDeleteCategory =async ()=>{
    try {
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data: deleteCategory,
      })

    const {data:responseData} = response

    if(responseData.error){
      toast.error(responseData.message)
    }
    if(responseData.success){
      toast.success(responseData.message)
      fetchCategory()
      setOpenConfirmBox(false)

    }

    } catch (error) {
      AxiosToastError(error)
    }
  }



  return (
    <section className='mt-22' >
      <div className='p-2  bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Category</h2>
            <button onClick={()=>setOpenUploadCategory(true)} className='text-sm border border-amber-200-200 bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded'>
                Add Category
            </button>
      </div>
    {
      !categoryData[0] && !loading &&(
        <NoData/>
      )
    }
    
    <div className='p-4 grid  grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'>
      {
        categoryData.map((category)=>{
          return(
            <div  key={category._id} className='w-32 h-56 rounded shadow-md'>
                <img
                src={category.image}
                alt={category.name}
                className='w-full object-scale-down'
                />

                {/* yahan name show krta hy */}
                <p className="text-sm font-medium mt-1">
                  {category.name}
                </p>

                <div className='flex gap-2 px-2 justify-between'>
                  <button onClick={()=>{
                          setOpenEditCategory(true)
                          setEditData (category)   // yahan py ham map sy wo category lay k edit k liay send kr rhy hn editcategory page mn 
                          // setEditData ({ _id: category._id }) agar ham istarhan likhain gy to ya zada behatar hoga
                        }}
                    className='bg-green-100 px-1 rounded cursor-pointer hover:bg-green-200' >
                    Edit
                  </button>
                  <button onClick={()=>{
                          setOpenConfirmBox(true)
                          setDeleteCategory(category) // yahan sy han map sy wo category ya item lay k send krty hn delete krny k liay
                          // setDeleteCategory({ _id: category._id })   agar ham istarhan likhain gy to ya zada behatar hoga
                        }} className='bg-red-100 px-1 rounded cursor-pointer hover:bg-red-200' >
                    Delete
                  </button>
                </div>

            </div>
          )
        })
      }
    </div>


    {
      loading && (
        <Loading/>
      )
    }

        {
          openUploadCategory && (
            <UploadCategoryModel  close={()=>setOpenUploadCategory(false)} fetchData={fetchCategory} />
          )
        }

        {
          openEditCategory && (
            <EditCategory editAbleData={editData} close={()=>setOpenEditCategory(false)} fetchData={fetchCategory} />
          )
        }

        {
          openConfirmBox && (
            <ConfirmBox close={()=>setOpenConfirmBox(false)} cancel={()=>setOpenConfirmBox(false)} confirm={handleDeleteCategory}/>
          )
        }

    </section>
  )
}

export default Category