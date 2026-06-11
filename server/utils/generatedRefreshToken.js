import UserModel from "../models/user.model.js"
import jwt from 'jsonwebtoken'

const generatedRefreshToken = async(userId)=>{
    const token = await jwt.sign({ id : userId},
        process.env.SECRET_KEY_REFRESH_TOKEN,
        { expiresIn : '7d'}
    )

    const updateRefreshTokenUser = await UserModel.updateOne({ _id : userId}, { refresh_token : token })

    return token
}

export default generatedRefreshToken






// ✅ Sahi concept:

// 👉 Access token aur refresh token dono login ke time ek sath generate hote hain

// 🔥 Flow correct wala:
// User login karta hai
// 👉 tum dete ho:
// access token (5h)
// refresh token (7d)
// Jab access token expire ho jata hai
// 👉 frontend refresh token bhejta hai
// Backend:
// refresh token verify karta hai
// DB se match karta hai
// ✅ phir naya access token generate karta hai