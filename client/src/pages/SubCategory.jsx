import React, { useEffect } from 'react'
import { useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import AxiosToastError from '../utils/AxiosToastError'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { createColumnHelper } from '@tanstack/react-table'
import { HiPencil } from "react-icons/hi";
import { MdDelete  } from "react-icons/md";
import DisplayTable from '../components/DisplayTable'
import ViewImage from '../components/ViewImage'
import EditSubCategory from '../components/EditSubCategory'
import ConfirmBox from '../components/ConfirmBox'
import { useDispatch } from 'react-redux'
import { setAllSubCategory } from '../reduxStore/productSlice'
import Axios from '../utils/Axios'
import { store } from '../reduxStore/store'

const SubCategory = () => {

const [openUploadSubCategoryModel, setOpenUploadSubCategoryModel] = useState(false)
const [subCategoryData, setSubCategoryData] = useState([])
const columnHelper = createColumnHelper()
const [ImageURL,setImageURL] = useState("")
const [openEdit,setOpenEdit] = useState(false)
const [editData, setEditData] = useState ({ _id : "" })
const [deleteSubCategory, setDeleteSubCategory] = useState({ _id:"" })
const [openDeleteConfirmBox,setOpenDeleteConfirmBox] = useState(false)
const dispatch = useDispatch()

const fetchSubCategory = async ()=>{

  try {
    const response = await Axios({
      ...SummaryApi.getSubCategory
    })

    
    if(response.data.error){
      toast.error(response.data.message)
    }
    
    if(response.data.success){
      setSubCategoryData(response.data.data)
      // console.log("Osubcategoryresponsechecking123",response.data.data)
      dispatch(setAllSubCategory(response.data.data))
      

      // ✅ Check store state here
  console.log("Redux store after dispatch:", store.getState())


    }
    
  } catch (error) {
    AxiosToastError(error)
  }
}


useEffect(()=>{
  fetchSubCategory()
 }, [])

// Tanstack/react-table:
// pehly subcategory ko receive krain gy pr isko show krain gy
// do cheezain agy table mn send krni hy props k through (1-column, 2-data)

  const column = [
    columnHelper.accessor('name',{
      header : "Name"
    }),
    columnHelper.accessor('image',{
      header : "Image",
      cell : ({row})=>{
        console.log("row",)
        return <div className='flex justify-center items-center'>
            <img 
                src={row.original.image}
                alt={row.original.name}
                className='w-8 h-8 cursor-pointer'
                onClick={()=>{
                  setImageURL(row.original.image)
                }}      
            />
        </div>
      }
    }),
    columnHelper.accessor("category",{
       header : "Category",
       cell : ({row})=>{
        return(
          <>
            {
              row.original.category.map((c)=>{
                return(
                  <p key={c._id+"table"} className='shadow-md px-1 inline-block'>{c.name}</p>
                )
              })
            }
          </>
        )
       }
    }),
    columnHelper.accessor("_id",{
      header : "Action",
      cell : ({row})=>{
        return(
          <div className='flex items-center justify-center gap-3'>
              <button onClick={()=>{
                  setOpenEdit(true)
                  setEditData(row.original)
              }} className='p-2 bg-green-100 rounded-full hover:text-green-600'>
                  <HiPencil size={20}/>
              </button>
              <button onClick={()=>{
                setOpenDeleteConfirmBox(true)
                setDeleteSubCategory(row.original)
              }} className='p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600'>
                  <MdDelete  size={20}/>
              </button>
          </div>
        )
      }
    })
  ]


  const handleDeleteSubCategory = async ()=>{
     try {
         const response = await Axios({
          ...SummaryApi.deleteSubCategory,
          data : deleteSubCategory
         })

         const {data:responseData} = response

         if(responseData.error){
          toast.error(responseData.message)
         }
         if(responseData.success){
          toast.success(responseData.message)
          setDeleteSubCategory({_id:""})
          fetchSubCategory()
          setOpenDeleteConfirmBox(false)
         }

     } catch (error) {
      AxiosToastError(error)
     }
  }



  return (
    <section className=''>
      <div className='p-2 mt-22 bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Add SubCategory</h2>
            <button onClick={()=>setOpenUploadSubCategoryModel(true)} className='text-sm border border-amber-200-200 bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded'>
                Add SubCategory
            </button>
      </div>

     <div className='overflow-auto w-full max-w-[95vw]'>
      <DisplayTable
          data={subCategoryData}
          column={column}
      />
     </div>

     {
        ImageURL &&
        <ViewImage url={ImageURL} close={()=>setImageURL("")}/>
      }


      {
        openEdit && (
          <EditSubCategory
           close={()=>setOpenEdit(false)}
           editAbleData={editData}
           fetchData={fetchSubCategory}
          />
        )
      }

      {
        openDeleteConfirmBox && (
          <ConfirmBox 
          close={()=>setOpenDeleteConfirmBox(false)}
          cancel={()=>setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
          image={deleteSubCategory.image} // ✅ pass image
          name={deleteSubCategory.name}   // ✅ pass name
          />
        )
      }

      {/* {
        openDeleteConfirmBox && (
          <ConfirmBox 
           close={()=>setOpenDeleteConfirmBox(false)}
           cancel={()=>setOpenDeleteConfirmBox(false)}
           confirm={handleDeleteSubCategory}
          />
        )
      } */}

     {
      openUploadSubCategoryModel && (
        <UploadSubCategoryModel 
        close={()=> setOpenUploadSubCategoryModel(false)}
        fetchData={fetchSubCategory}
        />
      )
     }

    </section>  
  )
}

export default SubCategory