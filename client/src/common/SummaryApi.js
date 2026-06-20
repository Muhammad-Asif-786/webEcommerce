export const baseURL = import.meta.env.VITE_API_URL || "http://13.49.228.189:5050";


const SummaryApi = {

    register : {
        url : '/api/user/register',
        method : 'post'
    },
    login : {
        url : '/api/user/login',
        method : 'post'
    },
    forgot_password: {
        url : '/api/user/forgot-password',
        method : 'put'
    },
    forgot_password_otp_verification: {
        url : '/api/user/verify-forgot-password-otp',
        method : 'put'
    },
    resetPassword: {
        url : '/api/user/reset-password',
        method : 'put'
    },
    userDetails: {
        url : '/api/user/user-details',
        method : 'get'
    },
    logout: {
        url : "/api/user/logout",
        method : "post"
    },
    uploadAvatar: {
        url : '/api/user/upload-avatar',
        method : 'put'
    },
    updateUserDetails : {
        url : '/api/user/update-user',
        method : 'put'
    },
    addCategory : {
        url : '/api/category/add-category',
        method : 'post'
    },
    uploadImage : {
        url : '/api/file/upload',
        method : 'post'
    },
    getCategory : {
        url :'/api/category/get-category',
        method : 'get'
    },
    updateCategory : {
        url :'/api/category/update-category',
        method : 'put'
    },
    deleteCategory : {
        url : '/api/category/delete-category',
        method : 'delete'
    },
    addSubCategory : {
        url : '/api/subCategory/addSubCategory',
        method : 'post'
    },
    getSubCategory : {
        url : '/api/subCategory/getSubCategory',
        method : 'get'
    },
    updateSubCategory : {
        url : '/api/subCategory/updateSubCategory',
        method : 'put'
    },
    deleteSubCategory : {
        url : '/api/subCategory/deleteSubCategory',
        method : 'delete' 
    },
    createProduct : {
        url : "/api/product/addProduct",
        method : "post"
    },
    getProduct : {
        url : "/api/product/getProduct",
        method : "get"
    },
    getProductByCategory : {
        url : "/api/product/get-product-by-category",
        method : "post"
    },
    getProductByCategoryAndSubCategory : {
        url : "/api/product/get-pruduct-by-category-and-subcategory",
        method : "post"
    },
    getProductDetails : {
        url : "/api/product/get-product-details",
        method : "post"
    },
    updateProductDetails : {
        url : "/api/product/update-product-details",
        method : "put"
    },
    deleteProduct : {
        url : "/api/product/delete-product",
        method : "delete"
    },
    searchProduct : {
        url : "/api/product/search-product",
        method : "post"
    },
    addToCart : {
        url : "/api/cart/add-Cart",
        method : "post"
    },
    getCartItem : {
        url : "/api/cart/get-Cart",
        method : "get"
    },
    updateCartItemQty : {
        url : "/api/cart/update-Cart-qty",
        method : "post"
    },
    deleteCartItem : {
        url : "/api/cart/delete-cart-item",
        method : "post"
    },
    addAddress : {
        url : "/api/address/add-address",
        method : "post"
    },
    getAddress : {
        url : "/api/address/get-address",
        method : "get"
    },
    updateAddress : {
        url : "/api/address/update-address",
        method : "put"
    },
    disableAddress : {
        url : "/api/address/disable-address",
        method : "delete"
    },
    cashOnDelivery : {
        url : "/api/order/cash-on-delivery",
        method : "post"
    },
    payment_url : {
        url : "/api/order/checkout",
        method : "post",
    },
    getOrderItems : {
        url : '/api/order/order-list',
        method : 'get'
    },
    updateOrderStatus : {
        url : '/api/order/:orderId/status',
        method : "put"
    }

}

export default SummaryApi