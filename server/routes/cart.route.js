import {Router} from "express";
import { addToCartItemController, deleteCartItemQtyController, getCartItemController, updateCartItemQtyController } from "../controllers/cart.controller.js";
import auth from "../middleware/auth.js";


 
const cartRouter = Router()

cartRouter.post("/add-Cart",auth , addToCartItemController)
cartRouter.get("/get-Cart",auth, getCartItemController)
cartRouter.post('/update-Cart-qty',auth, updateCartItemQtyController)
cartRouter.post('/delete-cart-item',auth, deleteCartItemQtyController)




export default cartRouter