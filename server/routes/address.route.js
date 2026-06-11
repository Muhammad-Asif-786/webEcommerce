import {Router} from "express";
import { addAddressController, deleteAddresscontroller, getAddressController, updateAddressController } from "../controllers/address.controller.js";
import auth from "../middleware/auth.js";



 
const addressRouter = Router()

addressRouter.post("/add-address",auth , addAddressController)
addressRouter.get("/get-address",auth, getAddressController)
addressRouter.put('/update-address',auth,updateAddressController)
addressRouter.delete("/disable-address",auth,deleteAddresscontroller)




export default addressRouter