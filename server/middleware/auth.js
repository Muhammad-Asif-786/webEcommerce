import jwt from 'jsonwebtoken'

const auth = (request, response, next) => {
    try {
        const token =
            request.cookies.accessToken ||
            request?.headers?.authorization?.split(" ")[1]

        // ❌ No token
        if (!token) {
            return response.status(401).json({
                message: "You have not login",
                error: true,
                success: false
            })
        }

        // ✅ Verify token
        const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)

        // ❌ Invalid token (edge case)
        if (!decode || !decode.id) {
            return response.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            })
        }

        // ✅ Pass userId
        request.userId = decode.id

        next()

    } catch (error) {
        // ❌ Token expired / invalid
        return response.status(401).json({
            message: "Invalid or expired token",
            error: true,
            success: false
        })
    }
}

export default auth



// import jwt from 'jsonwebtoken'

// const auth = async(request,response,next)=>{
//     try {
//         const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1]
       
//         if(!token){
//             return response.status(401).json({
//                 message : "Provide token"
//             })
//         }

//         const decode = await jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)

//         if(!decode){
//             return response.status(401).json({
//                 message : "unauthorized access",
//                 error : true,
//                 success : false
//             })
//         }

//         request.userId = decode.id     //ya wali userId hy jo controllers mn middlewar sy jati hy ur 

//         next()

//     } catch (error) {
//         return response.status(500).json({
//             message : "You have not login",///error.message || error,
//             error : true,
//             success : false
//         })
//     }
// }

// export default auth



// Bahut accha sawal 👏 — chalo isko ek chhoti si kahani ki tarah samajhte hain 👇

// 🌟 Kahani: “User aur Token ka Safar”

// Ek din ek user ne tumhari website kholi —
// wo login page pe gaya aur apna email aur password likha.

// 🧠 Step 1: Login Controller

// Backend ne uska data database se verify kiya.
// Email aur password sahi nikle, to system ne uske liye ek JWT token banaya.

// 👉 Ye token ek digital ID card jaisa hai, jisme likha hota hai:

// “Ye user sach mein hamara registered member hai, aur uska id ye hai.”

// Phir backend ne ye token cookies me store kar diya (ya React Native app ke case me header me bhej diya).

// User ab “verified” ho gaya 🎉

// 🚪 Step 2: User ne Secure Page khola

// Ab user ne ek protected page khola, jaise:

// “/api/orders” ya “/api/profile”

// Frontend ne request bheji backend ko —
// lekin is baar request ke saath token bhi bheja (ya to cookie me ya header me).

// 🕵️ Step 3: Auth Middleware Entry

// Ab kahani me entry hoti hai auth middleware ki —
// ye gatekeeper hai 🔐

// Wo request dekh kar kehta hai:

// “Ruko zara! Token dikhao!”

// Middleware check karta hai:

// request.cookies.accessToken || request.headers.authorization


// Agar token nahi mila, gatekeeper turant bolta hai:

// “Bina ID ke andar nahi ja sakte”
// aur 401 Unauthorized bhej deta hai 🚫

// 🔍 Step 4: Token Verification

// Agar token mil gaya, to gatekeeper (auth middleware) kehta hai:

// “Thik hai, ab dekhte hain ye ID asli hai ya nakli.”

// Phir wo jsonwebtoken.verify() ka use karke token ko decode karta hai
// aur backend ke SECRET_KEY_ACCESS_TOKEN se milata hai.

// Agar dono match kar gaye — to gatekeeper samajh jata hai:

// “Haan, ye user hamara apna hi hai.” ✅

// Aur token ke andar likha hota hai:

// { id: '665a8c1b7e23...' }


// To wo ye ID le kar request me chipka deta hai:

// request.userId = decode.id

// 🚦 Step 5: Access Granted

// Ab gatekeeper (middleware) bolta hai:

// “Sab sahi hai, andar jao.”

// Aur next() call karke control controller ko de deta hai.

// Controller ab request.userId se samajh jata hai:

// “Ye request kis user ki hai.”

// Phir wo us user ke liye database me jaake uska data nikalta hai
// jaise: profile info, order list, cart items, etc.

// 💡 Step 6: Error Wala Scene

// Agar kahin koi problem ho jaaye —
// jaise token expire ho gaya, galat sign key hai, ya user ne token bheja hi nahi —
// to gatekeeper chillata hai:

// “You have not login 😠”
// aur response deta hai:

// {
//   message: "You have not login",
//   error: true,
//   success: false
// }

// 🌈 The End

// Is tarah har baar jab user koi secure API call karta hai,
// ye gatekeeper (auth middleware) uska token verify karke hi usse andar jaane deta hai.

// Yani har request pe ek chhoti si checking hoti hai:

// “ID card valid hai to welcome, warna no entry.” 🚫✅