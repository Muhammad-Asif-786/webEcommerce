import { createContext, useContext, useEffect, useState } from "react";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { handleAddCartItem } from "../reduxStore/cartSlice";
import { PriceWithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../reduxStore/addressSlice";

export const GlobalContext = createContext(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const [notDiscountTotalPrice,setNotDiscountTotalPrice] = useState(0)
  const [totalQty, setTotalQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0)


  const fetchCartItem = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCartItem,
      });

      const { data: responseData } = response;

      if (responseData.error) {
        toast.error(responseData.message);
      }

      if (responseData.success) {
        dispatch(handleAddCartItem(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const updateCartItem = async (id,qty) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data:{
           _id : id,
          qty : qty
        }                     // ya backend sy ayi hn
        
      })

      const { data:responseData } = response

      if(responseData.error){
        toast.error(responseData.message)
      }
      if(responseData.success){
        toast.success(responseData.message)
        fetchCartItem()
        return responseData

      }
      
    } catch (error) {
      AxiosToastError(error)
    }
  };

  const deleteCartItem = async(cartId)=>{
      try {
          const response = await Axios({
            ...SummaryApi.deleteCartItem,
            data : {
              _id : cartId
            }
          })
          const { data : responseData} = response

          if(responseData.success){
            toast.success(responseData.message)
            fetchCartItem()
          }
      } catch (error) {
         AxiosToastError(error)
      }
  };


    useEffect(() => {
      const qty = cartItem.reduce((preve, curr) => preve + curr.quantity, 0); //reduce = accumulate karna ✔️
      setTotalQty(qty);

      const tPrice = cartItem.reduce((preve, curr)=>{
        const priceAfterDiscount = PriceWithDiscount(curr?.productId?.price, curr?.productId?.discount)

        return preve + (priceAfterDiscount * curr.quantity)
        },0)
        setTotalPrice(tPrice)

      const notDiscountPrice = cartItem.reduce((preve,curr)=>{
          return preve + (curr?.productId?.price * curr.quantity)
        },0)
        setNotDiscountTotalPrice(notDiscountPrice)

    }, [cartItem]);



        const fetchAddress = async()=>{
      try {
        const response = await Axios({
          ...SummaryApi.getAddress
        })
        console.log("addressresponseData",response)
        
        const { data : responseData } = response

        if(responseData.success){
          dispatch(handleAddAddress(responseData.data))

        }
      } catch (error) {
          AxiosToastError(error)
      }
    }


  useEffect(() => {
    fetchCartItem();
    fetchAddress()
  }, []);

  return (                            //jo bhi cheez application mn kahin bhi send krni hy yahan sy ya send ho rhi hy.
    <GlobalContext.Provider value={{ fetchCartItem, totalQty, totalPrice, updateCartItem, deleteCartItem, notDiscountTotalPrice,
                                     fetchAddress }}> 
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
