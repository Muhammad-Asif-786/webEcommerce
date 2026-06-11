import React, { useEffect } from 'react';
import { Outlet } from "react-router-dom"
import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';
import toast, { Toaster } from "react-hot-toast";
import fetchUserDetails from './utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './reduxStore/userSlice';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';
import AxiosToastError from './utils/AxiosToastError';
import { setAllCategory,
  setAllSubCategory,
  //  setAllSubCategory, 
   setLoadingCategory } from './reduxStore/productSlice';
import GlobalProvider from './provider/GlobalProvider';

function App() {

   const dispatch = useDispatch()

   const fetchUser = async()=>{
      const userData = await fetchUserDetails()
      dispatch(setUserDetails(userData.data))
  }

  const fetchCategory = async()=>{
    try {
      dispatch(setLoadingCategory(true))
     const response = await Axios({
      ...SummaryApi.getCategory,
     })
     const {data:responseData} = response

    if(responseData.error){
      toast.error(responseData.data.message)
     }
    if(responseData.success){
      dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
     }

    } catch (error) {
      AxiosToastError(error)
      
    }finally{
      dispatch(setLoadingCategory(false))
    }
  }

  const fetchSubCategory = async ()=>{

  try {
    const response = await Axios({
      ...SummaryApi.getSubCategory
    })

    
    if(response.data.error){
      toast.error(response.data.message)
    }
    
    if(response.data.success){
      // setSubCategoryData(response.data.data)
      // console.log("Osubcategoryresponsechecking123",response.data.data)
      dispatch(setAllSubCategory(response.data.data))
      

      // ✅ Check store state here
  // console.log("Redux store after dispatch:", store.getState())


    }
    
  } catch (error) {
    AxiosToastError(error)
  }
}

    useEffect(()=>{
      fetchUser(),
      fetchCategory(),
      fetchSubCategory()
    }, [])

  return (
    <GlobalProvider>
        <Header/>
          <main className='h-120' >
            <Outlet /> 
          </main>
        <Footer/>
        <Toaster/>
    </GlobalProvider>
  )
}

export default App
