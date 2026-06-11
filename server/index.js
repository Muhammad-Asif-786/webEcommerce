import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './routes/user.route.js'
import uploadRouter from './routes/upload.route.js'
import categoryRouter from './routes/category.route.js'
import subCategoryRouter from './routes/subCategory.route.js'
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'
import addressRouter from './routes/address.route.js'
import orderRouter from './routes/order.route.js'
import { webhookStripe } from "./controllers/order.controller.js";
//1 == path module import for __dirname ==
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config()

const app = express()

//2 == FIX __dirname (ES MODULE) ==
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    credentials : true,
    origin : process.env.FRONTEND_URL
}))

//orderRouter se ye line delete karo:Webhook sirf index.js me hi rehna chahiye
app.post(
  "/api/order/webhook",
  express.raw({ type: "application/json" }),
  webhookStripe
);


app.use(express.json())
app.use(cookieParser())
// app.use(morgan())
app.use(morgan("dev"));
app.use(helmet({
    crossOriginResourcePolicy: false,
}))


const PORT = process.env.PORT || 5050;

app.get("/",(request,response)=>{
    ///server to client
    response.json({
        message : "Server is running " + PORT
    })
})

app.use("/api/user", userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/file", uploadRouter)
app.use("/api/subCategory", subCategoryRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/address", addressRouter)
app.use("/api/order", orderRouter)

//3 == FRONTEND SERVE ==
const clientPath = path.join(__dirname, "../client/dist");

//4 Serve static files
app.use(express.static(clientPath));

//5 React Router support
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
});



connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running",PORT)
    })
})

