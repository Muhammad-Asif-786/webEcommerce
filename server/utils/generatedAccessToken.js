import jwt from 'jsonwebtoken'

const generatedAccessToken = async(userId)=>{
    const token = await jwt.sign({ id : userId}, process.env.SECRET_KEY_ACCESS_TOKEN, { expiresIn : '5h'})

    return token
}

export default generatedAccessToken


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