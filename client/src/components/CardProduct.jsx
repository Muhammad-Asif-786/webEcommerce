import React from 'react'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({ data }) => { // is card py click krny sy display page py jana hy 

    // calculate final price
    const finalPrice = data.price && data.discount
        ? data.price - (data.price * data.discount / 100)
        : data.price

    // ya /product/ ya path hy jb path py jaiy ga to wahan sy element py jaiy ga element joky ProductDisplayPage hy, mny apny pas sy khud hi likha hy taky url ko dakh k hi pata chal jaiy k ya hamri product hy
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`    

    
    // console.log(url)



    return (

        //link isliay lagaya hy k product waly card py jb click krta hy to display page py lay jata hy.
        <Link to={url} className='border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white'>
            
            {/* Product Image */}
            <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden'>
                <img src={data.image[0]} alt={data.name} className='w-full h-full object-cover' />
            </div>

            {/* Discount and delivery time */}
            <div className='flex items-center gap-1'>
                <div className='rounded text-xs w-fit py-px px-2 text-green-600 bg-green-50'>
                        {data.deliveryTime || "10 min"}
                </div>
                <div>
                    <p className='text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full'>
                        {data.discount || 0} % Discount
                    </p>
                </div>
            </div>

            {/* Product Name */}
            <p className='px-2 lg:px-0 font-medium text-sm lg:text-base line-clamp-2'>
                {data.name}
            </p>

            {/* Original Price */}
            <p className='px-2 lg:px-0 text-sm lg:text-base line-through text-gray-500'>
                Rs. {data.price}
            </p>

            {/* Final Price after discount */}
            <div className='flex flex-row  md:gap-2 lg:gap-6 items-center'>
                <div className='px-2 lg:px-0 flex items-center justify-between text-sm lg:text-base'>
                    <p className='font-semibold'>
                        Rs. {finalPrice}
                    </p>
                </div>
                <div>
                    {
                        data.stock == 0 ? (
                            <p className='text-red-500 text-sm text-center'>Out of stock</p>
                        ):(
                            <div className='' >
                                <AddToCartButton data={data} />
                            </div>
                        )
                    }
                </div>
            </div>

        </Link>
    )
}

export default CardProduct
