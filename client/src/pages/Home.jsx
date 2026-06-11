import React from 'react'
import bannerWeb from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import {useSelector} from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

const Home = () => {

  const loadingCategory = useSelector ((state)=>state.product.loadingCategory)
  const categoryData = useSelector ((state)=>state.product.allCategory)
  const subCategoryData = useSelector (state => state.product.allSubCategory)
  const navigate = useNavigate()



// //✅ note:category py to ham ny click kia hy lakin ab ham dakhna chah rhy hn k is category sy related koi item subcategory mn hy ya nahi ya id sy match kr rha hy
// //✅ Hum subcategory ke andar category isliye dhundh sakte hain kyunki tumhare DB me har subcategory ke andar uski parent category ka ID stored hota hai.
  // const handleRedirectProductListpage = (id,cat)=>{
     

  //     const subcategory = subCategoryData.find(sub =>
  //       sub.category.some(c => c._id == id),
  //     )

  //     if (!subcategory) {
  //       // console.warn("⚠ No subcategory found for category:")
  //       return
  //     }

  //     if(subcategory) {
  //       const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`
        
  //       navigate(url)     // hahan sy ham url ko Browser k url py navigate kar rhy hn.
  //     }
  // }
//   const handleRedirectProductListpage = (categoryId, categoryName) => {
//   // Category ki subcategories filter karo
//   const subcategories = subCategoryData.filter(sub =>
//     sub.category.some(c => c._id === categoryId)
//   )

//   if (!subcategories.length) return

//   // Pehli subcategory ka slug (ya tum chaaho to multiple options show kar sakte ho)
//   const subcategory = subcategories[0]

//   // URL me category slug use karo, product nahi
//   const url = `/${valideURLConvert(categoryName)}-${categoryId}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

//   navigate(url)
// }

  const handleRedirectProductListpage = (id,cat)=>{

      const subcategory = subCategoryData.find(sub =>{
        const filterData = sub.category.some(c => {
          return c._id == id
        })

          return filterData ? true : null
      })
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

      navigate(url)
      // console.log(url)
  }



  return (
     <section className='mt-24'>
      <div className='bg-blue-50'>
        <div className='px-4'>
          <img src={bannerWeb} alt={bannerWeb} className='w-full hidden md:block'/>
          <img src={bannerMobile} alt={bannerMobile} className='w-full md:hidden '/>
        </div>
      </div>

        <div className='container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10  gap-2'>
            {
              loadingCategory ? (
                new Array(10).fill(null).map((c, index)=>(
                  <div key={index+"loadingCategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                    <div className='bg-blue-200 min-h-24 rounded'></div>
                    <div className='bg-blue-200 h-8 rounded'></div>
                  </div>
                ))
              ):(
                categoryData.map((cat,index)=>(     // ya yahan py categories ko dikha rha hy ref:(uper wali,jin py click krny sy list open hoti hy)
                  <div 
                    key={cat._id+"displayCategory", index} 
                    className='w-full h-full'
                    onClick={()=>handleRedirectProductListpage(cat._id,cat.name)}
                  >
                    <img
                        src={cat.image}
                        className='w-full h-full object-scale-down'
                    />
                  </div>
                ))
              )
            }
        </div>

        {
          categoryData?.map((cat,index)=>(      // ya categorywise products ko show kar rha hy yahan sy component mn lay jata hy props k through 
            <CategoryWiseProductDisplay 
                key={cat._id+"CategorywiseProduct", index}
                id={cat._id}  // ✅ ye wahi id hai jo props me ja rahi
                name={cat.name}
            />
          ))
        }
     </section>    
  )
}

export default Home










