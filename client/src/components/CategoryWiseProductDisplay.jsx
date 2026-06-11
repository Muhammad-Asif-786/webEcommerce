import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { useSelector } from 'react-redux'
import CardLoading from './CardLoading'
import AxiosToastError from '../utils/AxiosToastError'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'



const CategoryWiseProductDisplay = ({ id, name }) => {
    
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const [loading, setLoading] = useState(false)
    const loadingCardNumber = new Array(6).fill(null)
    const [ data, setData] = useState([])
    const containerRef = useRef()


    const fetchCategoryWiseProduct = async()=>{
      try {
            setLoading(true)

        const response = await Axios({
           ...SummaryApi.getProductByCategory,
           data : { id }  // ✅ ye wahi id hai jo props se aayi
        })

       const {data:responseData} = response

       if(responseData.error){
        toast.error(responseData.data.message)
       }
       if(responseData.success){
        setData(responseData.data)
        // toast.success(responseData.data.message)
       }
        
      } catch (error) {
        AxiosToastError(error)
      }finally{
        setLoading(false)
      }
    }


    useEffect(()=>{
      fetchCategoryWiseProduct()
    },[])


    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 200
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 200
    }


// //✅ note:category py to ham ny click kia hy lakin ab ham dakhna chah rhy hn k is category sy related koi item subcategory mn hy ya nahi ya id sy match kr rha hy
// //✅ Hum subcategory ke andar category isliye dhundh sakte hain kyunki tumhare DB me har subcategory ke andar uski parent category ka ID stored hota hai.

    const handleRedirectProductListpage = (catId, catName) => {

    const subcategory = subCategoryData.find(sub =>
             sub.category.some(cat => cat?._id == catId)
         )

        if (!subcategory) {
            // console.warn("⚠ No subcategory found for", catId);
            return; // Yahan break kar dena chahiye
            }

        const url = `/${valideURLConvert(catName)}-${catId}/${valideURLConvert(subcategory.name)}-${subcategory._id}`
        return url
    }

    // 🔧 FIXED: Now passing correct parameters
    const redirectURL = handleRedirectProductListpage(id, name)

    
    return (
        <div>
            <div className='container mx-auto p-4 flex items-center justify-between gap-4'>
                <h3 className='font-semibold text-lg md:text-xl'>{name}</h3>
                <Link  to={redirectURL} className='text-green-600 hover:text-green-400'>See All</Link>
            </div>
            <div className='relative flex items-center '>
                <div ref={containerRef} className=' flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth'> {/* overflow-hidden */}
                  {
                    loading && (
                       loadingCardNumber.map((__,index)=>{
                        return(
                          <CardLoading key={"CategorywiseProductDisplay123" + index} />
                        )
                       }))
                      }
                      {
                        data.map((product, index) => {
                            return (
                                <CardProduct
                                    data={product}
                                    key={product?._id + "CategorywiseProductDisplay" + index}
                                />
                                
                            )
                        })
                    }
                </div>
                <div className='w-full left-0 right-0 container mx-auto  px-2  absolute hidden lg:flex justify-between'>  {/* agar mobile py bhi chahiay to hidden lg:flex */}
                   <button  onClick={handleScrollLeft} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full' >
                     <FaAngleLeft /> 
                    </button>    
                   <button  onClick={handleScrollRight} className='z-10 relative  bg-white hover:bg-gray-100 shadow-lg p-2 text-lg rounded-full'>
                    <FaAngleRight />
                    </button>                    

                </div>
            </div>
        </div>
    )
}

export default CategoryWiseProductDisplay











// import React from 'react'
// import { Link } from 'react-router-dom'
// import { valideURLConvert } from '../utils/valideURLConvert'
// import { useSelector } from 'react-redux'

// const CategoryWiseProductDisplay = (id,name) => {
    
//     const subCategoryData = useSelector(state => state.product.allSubCategory)


//       const handleRedirectProductListpage = (id, catName)=>{
    
//           const subcategory = subCategoryData.find(sub =>{
//             const filterData = sub.category.some(c => {
//               return c._id == id
//             })
    
//               return filterData ? true : null
//           })

//           const url = `/${valideURLConvert(catName)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`
    
//           return url
//       }

//       const redirectURL = handleRedirectProductListpage(id, name)
//     //   link py jb click kia to yahan id ur names ko lay k aya pr ya function k pass gia pr url bna



//   return (
//     <div>
//         <div className='flex justify-between px-6'>
//             <p className='font-bold'>{name}</p>
//             <Link to={redirectURL} className='font-bold'>See All</Link>
//         </div>
//     </div>
//   )
// }

// export default CategoryWiseProductDisplay