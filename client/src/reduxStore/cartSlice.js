import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cartItem',
  initialState: initialValue,
  reducers: {
    handleAddCartItem: (state, action) => {
      state.cart = [...action.payload];
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { handleAddCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;






// import { createSlice } from "@reduxjs/toolkit";

// const initialValue = {

//         cart : [],
//     }

// const cartSlice = createSlice({
//     name : 'cartItem',
//     initialState : initialValue,

//     reducers : {
//         handleAddCartItem : (state,action)=>{
//             state.cart = [...action.payload]
//         },
      
//     }
// })

// export const  { handleAddCartItem } = cartSlice.actions

// export default cartSlice.reducer