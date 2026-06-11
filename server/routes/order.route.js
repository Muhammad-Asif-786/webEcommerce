




import { Router } from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController,
    getOrderDetailsController,
     paymentController,
    // webhookStripe,
     updateOrderStatusController,
} from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery", auth, CashOnDeliveryOrderController)
orderRouter.post("/checkout", auth, paymentController)
// orderRouter.post("/webhook", webhookStripe) //orderRouter se ye line delete karo:Webhook sirf index.js me hi rehna chahiye
orderRouter.get("/order-list", auth, getOrderDetailsController)
orderRouter.put("/:orderId/status", auth, updateOrderStatusController);    // ✅ New route for updating status

export default orderRouter
