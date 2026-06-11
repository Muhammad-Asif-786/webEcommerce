import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import stripe from "../config/stripe.js";
import { PriceWithDiscount } from "../utils/PriceWithDiscount.js";
import { v4 as uuidv4 } from "uuid";



/*** CASH ON DELIVERY ***/
export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId;
    const { list_items, addressId, subTotalAmt, totalAmt } = request.body;

    const orderId = "ORD-" + uuidv4(); // ✅ unique orderId for this order

    const payload = list_items.map(item => ({
      userId,
      orderId: "ORD-" + uuidv4(), // ✅ unique per item
      productId: item.productId._id,
      product_details: {
        name: item.productId.name,
        image: item.productId.image,
        quantity: item.quantity,
        price: item.productId.price
      },
      paymentId: "",
      payment_status: "CASH ON DELIVERY",
      delivery_address: addressId,
      subTotalAmt,
      totalAmt,
    }));

    const generatedOrder = await OrderModel.insertMany(payload);

    
    // Clear cart
    await CartProductModel.deleteMany({ userId });

    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });
    
    return response.json({
      message: "Order placed successfully",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}


/*** ONLINE PAYMENT ***/
export async function paymentController(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

    const user = await UserModel.findById(userId);

    const line_items = list_items.map((item) => {
      return {
        price_data: {
          currency: "pkr",
          product_data: {
            name: item.productId.name,
            images: item.productId.image,
            metadata: {
              productId: item.productId._id,
            },
          },
          unit_amount: PriceWithDiscount(item.productId.price, item.productId.discount) * 100 },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
        quantity: item.quantity,
      };
    });

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId,
        addressId: addressId,
      },
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await stripe.checkout.sessions.create(params);

    return response.status(200).json(session);
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

/*** HELPER: GET ORDER ITEMS FROM STRIPE LINE ITEMS ***/
const getOrderProductItems = async ({ lineItems, userId, addressId, paymentId, payment_status }) => {
  const productList = [];

  if (lineItems?.data?.length) {
    const orderId = "ORD-" + uuidv4(); // ✅ same orderId for all items in this payment

    for (const item of lineItems.data) {
      const product = await stripe.products.retrieve(item.price.product);

      const payload = {
        userId,
        orderId,
        productId: product.metadata.productId,
        product_details: { name: product.name, image: product.images },
        paymentId,
        payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_total / 100),
        totalAmt: Number(item.amount_total / 100),
      };

      productList.push(payload);
    }
  }

  return productList;
};


/*** STRIPE WEBHOOK    ya wala switch wala code strip doc sy liya hy.***************************/
export async function webhookStripe(request, response) {
  const sig = request.headers['stripe-signature'];
  const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

  let event;

  try {
    // Use raw body for verification
    event = stripe.webhooks.constructEvent(request.rawBody, sig, endPointSecret);
  } catch (err) {
    console.log('Webhook signature verification failed:', err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Verified event:', event.type);

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const userId = session.metadata.userId;

      console.log('userIduserIduserId:', userId)

      const orderProduct = await getOrderProductItems({
        lineItems: lineItems,
        userId: userId,
        addressId: session.metadata.addressId,
        paymentId: session.payment_intent,
        payment_status: session.payment_status,
      });

      const order = await OrderModel.insertMany(orderProduct);
      
      // if (order) {
      //   const removeCartItems = await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
      //   const removeCartProductDB = await CartProductModel.deleteMany({userId})
      // }
      if (order) {
          await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });
        await CartProductModel.deleteMany({ userId });
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({ received: true });
}


/*** GET ORDER DETAILS ***/
export async function getOrderDetailsController(request, response) {
  try {
    const userId = request.userId;

    const orderlist = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    return response.json({
      message: "Order list",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

/*** UPDATE ORDER STATUS ***/
export async function updateOrderStatusController(request, response) {
  try {
    const { orderId } = request.params;
    const { status } = request.body;

    const validStatus = ["Pending", "Processing", "Delivered"];
    if (!validStatus.includes(status)) {
      return response.status(400).json({ success: false, message: "Invalid status" });
    }

    const updated = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updated) {
      return response.status(404).json({ success: false, message: "Order not found" });
    }

    response.json({ success: true, message: "Status updated", data: updated });
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
}
