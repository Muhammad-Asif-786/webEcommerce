import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from '../pages/Register';
import Login from '../pages/Login';
import Home from '../pages/Home';
import SearchPage from '../pages/SearchPage';
import ForgotPassword from '../pages/ForgotPassword';
import OtpVerification from '../pages/OtpVerification';
import ResetPassword from '../pages/ResetPassword';
import UserMenuMobile from '../pages/UserMenuMobile';
import Dashboard from '../layouts/Dashboard';
import Profile from '../pages/Profile';
import MyOrder from '../pages/MyOrder';
import Product from '../pages/Product';
import UploadProduct from '../pages/UploadProduct';
import Category from '../pages/Category';
import SubCategory from '../pages/SubCategory';
import Address from '../pages/Address';
import AdminPermision from '../layouts/AdminPermision';
import ProductListPage from '../pages/ProductListPage';
import ProductDisplayPage from '../pages/ProductDisplayPage';
import DisplayCart from '../pages/DisplayCart';
import CheckoutPage from '../pages/CheckoutPage';
import Success from '../pages/Success';
import Cancel from '../pages/Cancel';

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path: "register",
                element: <Register/>
            },
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "home",
                element: <Home/>
            },
            {
                path: "searchpage",
                element: <SearchPage/>
            },
            {
                path: "forgot-password",
                element: <ForgotPassword/>
            },
            {
                path: "verification-otp",
                element: <OtpVerification/>
            },
            {
                path: "reset-password",
                element: <ResetPassword/>
            },
            {
                path:"usermenu",
                element: <UserMenuMobile/>
            },
            {
                path: "dashboard",
                element: <Dashboard/>,
                children:[
                    {
                        path: "profile",
                        element: <Profile/>
                    },
                    {
                        path: "category",
                        element: <AdminPermision> <Category/> </AdminPermision> 
                    },
                    {
                        path: "subcategory",
                        element: <AdminPermision> <SubCategory/> </AdminPermision>
                    },
                    {
                        path: "upload-product",
                        element: <AdminPermision> <UploadProduct/> </AdminPermision>
                    },
                    {
                        path: "product",
                        element: <AdminPermision> <Product/> </AdminPermision>
                    },
                    {
                        path: "myorders",
                        element: <MyOrder/>
                    },
                    {
                        path: "address",
                        element: <Address/>
                    }
                ]
            },
            {
                path:":category",
                children:[
                    {
                        path:":subCategory",
                        element: <ProductListPage/>
                    }
                ]
            },
            {
                path : "product/:product",
                element : <ProductDisplayPage/>
            },
            {
                path : "cart",
                element: <DisplayCart/>
            },
            {
                path : "checkout",
                element : <CheckoutPage/>
            },
            {
                path : "success",
                element : <Success/>
            },
            {
                path : "cancel",
                element : <Cancel/>
            }
           

            
        ]
    }
])

export default router