import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";

/* =========================
   Fetch Orders (Get List)
========================= */
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios({
        ...SummaryApi.getOrderItems,
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

/* =========================
   Initial State
========================= */
const initialState = {
  order: [],
  status: "idle",
  error: null,
};

/* =========================
   Slice
========================= */
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    clearOrder: (state) => {
      state.order = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { setOrder, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
