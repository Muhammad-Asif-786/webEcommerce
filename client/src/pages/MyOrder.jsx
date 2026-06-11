// most professional according my mind



// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import NoData from "../components/NoData.jsx";
// import { fetchOrders } from "../reduxStore/orderSlice.js";
// import Axios from "../utils/Axios"; // Backend call ke liye

// const MyOrders = () => {
//   const { order, status } = useSelector((state) => state.order);
//   const dispatch = useDispatch();
//   const [openAddress, setOpenAddress] = useState(null);

//   useEffect(() => {
//     dispatch(fetchOrders());
//   }, [dispatch]);

//   // Group Orders by Address
//   const groupedOrders = order?.reduce((acc, curr) => {
//     const addressId = curr?.delivery_address?._id;

//     if (!acc[addressId]) {
//       acc[addressId] = {
//         address: curr.delivery_address,
//         orders: [],
//       };
//     }

//     acc[addressId].orders.push(curr);

//     return acc;
//   }, {});

//   // ✅ Function to update status to Pending / Processing / Delivered
//   const updateStatus = async (orderId, status) => {
//     try {
//       await Axios.put(`/api/order/${orderId}/status`, { status });
//       dispatch(fetchOrders());
//     } catch (error) {
//       console.error("Status update failed:", error);
//     }
//   };

//   return (
//     <div className="p-4">
//       <div className="bg-white shadow-md p-4 font-semibold mb-4 rounded">
//         <h1 className="text-lg md:text-xl">My Orders</h1>
//       </div>

//       {status === "loading" && <p>Loading...</p>}
//       {!order?.length && status !== "loading" && <NoData />}

//       <div className="space-y-4">
//         {groupedOrders &&
//           Object.entries(groupedOrders).map(([addressId, data]) => {
//             const arrowColor =
//               data.orders.every((o) => o.status === "Delivered")
//                 ? "text-green-600"
//                 : data.orders.some((o) => o.status === "Processing")
//                 ? "text-yellow-600"
//                 : "text-red-600";

//             return (
//               <div key={addressId} className="bg-white shadow rounded p-4">
//                 {/* Address Header */}
//                 <div
//                   className="cursor-pointer font-semibold flex justify-between items-center"
//                   onClick={() =>
//                     setOpenAddress(
//                       openAddress === addressId ? null : addressId
//                     )
//                   }
//                 >
//                   <span className="text-blue-600 flex items-center gap-2">
//                     🏠 {data.address?.address_line}
//                   </span>

//                   <span className={`text-sm font-semibold ${arrowColor}`}>
//                     {openAddress === addressId ? "▲" : "▼"}
//                   </span>
//                 </div>

//                 {/* Expand Products */}
//                 {openAddress === addressId && (
//                   <div className="mt-4 space-y-3">
//                     {data.orders.map((item, index) => {
//                       const qty = item?.product_details?.quantity || 1;
//                       const price = item?.product_details?.price || 0;

//                       return (
//                         <div
//                           key={index}
//                           className="flex flex-col md:flex-row justify-between items-start md:items-center border p-3 rounded gap-3"
//                         >
//                           <div className="flex gap-3 items-center">
//                             <img
//                               src={
//                                 item?.product_details?.image?.[0] ||
//                                 "/placeholder.png"
//                               }
//                               className="w-16 h-16 rounded"
//                               alt={item?.product_details?.name || "product"}
//                             />
//                             <div>
//                               <p className="font-medium">
//                                 {item?.product_details?.name}
//                               </p>
//                               <p className="text-sm text-gray-500">
//                                 Qty: {qty}
//                               </p>
//                               <p className="text-sm">
//                                 rs: {price.toLocaleString()}
//                               </p>
//                             </div>
//                           </div>

//                           {/* Status + 3 Buttons */}
//                           <div className="flex flex-col items-start md:items-end gap-2">
//                             <p className="font-semibold">
//                               rs: {item?.totalAmt?.toLocaleString() || 0}
//                             </p>

//                             {/* ✅ Current Status */}
//                             <p
//                               className={`font-semibold ${
//                                 item?.status === "Delivered"
//                                   ? "text-green-600"
//                                   : item?.status === "Processing"
//                                   ? "text-yellow-600"
//                                   : "text-red-600"
//                               }`}
//                             >
//                               {item?.status}
//                             </p>

//                             {/* ✅ 3 Buttons */}
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={() =>
//                                   updateStatus(item._id, "Pending")
//                                 }
//                                 className="px-3 py-1 text-sm rounded-md bg-red-100 text-red-600 hover:bg-red-200"
//                               >
//                                 Pending
//                               </button>

//                               <button
//                                 onClick={() =>
//                                   updateStatus(item._id, "Processing")
//                                 }
//                                 className="px-3 py-1 text-sm rounded-md bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
//                               >
//                                 Processing
//                               </button>

//                               <button
//                                 onClick={() =>
//                                   updateStatus(item._id, "Delivered")
//                                 }
//                                 className="px-3 py-1 text-sm rounded-md bg-green-100 text-green-600 hover:bg-green-200"
//                               >
//                                 Delivered
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//       </div>
//     </div>
//   );
// };

// export default MyOrders;





import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import NoData from "../components/NoData.jsx";
import { fetchOrders } from "../reduxStore/orderSlice.js";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { order = [], status } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="p-4">
      <div className="bg-white shadow-sm p-4 font-semibold mb-4 rounded-lg">
        <h1 className="text-lg md:text-xl">My Orders</h1>
      </div>

      {/* Loading State */}
      {status === "loading" && (
        <p className="text-center text-gray-500">Loading orders...</p>
      )}

      {/* No Orders */}
      {status !== "loading" && order.length === 0 && <NoData />}

      {/* Orders List */}
      <div className="space-y-4">
        {order.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-lg rounded-lg p-4 md:p-6 flex flex-col md:flex-row md:justify-between gap-4"
          >
            {/* Product Info */}
            <div className="flex gap-4 items-center md:flex-1">
              <img
                src={item?.product_details?.image?.[0] || "/placeholder.png"}
                alt={item?.product_details?.name || "Product"}
                className="w-16 h-16 object-cover rounded-md border"
              />

              <div>
                <p className="font-medium text-gray-800">
                  {item?.product_details?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Qty: {item?.product_details?.quantity || 0}
                </p>
                <p className="text-sm font-medium text-gray-800">
                  Price:{" "}
                  {item?.product_details?.price
                    ? `${item.product_details.price.toLocaleString()} PKR`
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Order Info */}
            <div className="text-sm text-gray-700 md:flex-1 space-y-1">
              <p>
                <span className="font-semibold">Order No:</span>{" "}
                {item?.orderId || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Order Date:</span>{" "}
                {item?.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <span className="font-semibold">Delivery Address:</span>{" "}
                {item?.delivery_address?.address_line ||
                  "No delivery address"}
              </p>
              <p>
                <span className="font-semibold">Payment:</span>{" "}
                {item?.paymentMethod || "COD"}
              </p>
              <p>
                <span className="font-semibold">Total Qty:</span>{" "}
                {item?.totalQty || 0}
              </p>
              <p className="font-semibold">
                Total Amount:{" "}
                {item?.totalAmt
                  ? `${item.totalAmt.toLocaleString()} PKR`
                  : "0 PKR"}
              </p>
            </div>

            {/* Status */}
            <div className="flex items-start md:justify-end">
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  item?.status === "Delivered"
                    ? "bg-green-100 text-green-600"
                    : item?.status === "Pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {item?.status || "Pending"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;






