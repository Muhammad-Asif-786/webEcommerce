import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddSubCategoryController, deleteSubCategoryController, getSubCategoryController, updateSubCategoryController } from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router()

subCategoryRouter.post('/addSubCategory',auth,AddSubCategoryController)
subCategoryRouter.get('/getSubCategory',getSubCategoryController)
subCategoryRouter.put("/updateSubCategory", auth, updateSubCategoryController)
subCategoryRouter.delete('/deleteSubCategory',auth,deleteSubCategoryController)

export default subCategoryRouter