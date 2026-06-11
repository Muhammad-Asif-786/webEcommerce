import UserModel from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import sendEmail from "../config/sendEmail.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import uploadImageClodinary from "../utils/uploadImageClodinary.js";
import generatedOtp from "../utils/generatedOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from "jsonwebtoken"




export async function registerUserController(request, response) {
try {
    const { name, email, password } = request.body;
    if (!name || !email || !password ) {

      return response.status(400).json({
        message: "provide email, name, password",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });

    if (user) {
      return response.json({
        message: "Already register email",
        error: true,
        success: false,
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URI}/verify-email?code=${save?._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from webEcommerce",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    if (!verifyEmail) {
        return response.json({
            message: "Email not sent, please try again",
            error: true,
            success: false,
        });
}

  return response.json({
    message : "user register successfully",
    error : false,
    success : true,
    data : save
  })



} catch (error) {
    return response.status(500).json({
        message:error.message || error,
        error:true,
        success:false
    })
    
}
    
}

export async function verifyEmailController(request, response) {
    try {

        const {code} = request.body
        //jo email jati hy us mn link pr click krny sy code milta hy ya wo hy

        const user = await UserModel.findOne({ _id : code})

        if(!user){
            return response.status(400).json({
                message : "Invalid code",
                error : true,
                success : false
            })
        }
       const updateUser = await UserModel.updateOne(
            { _id: code },
            { verify_email: true }
        );

        if (updateUser.modifiedCount === 0) {
            return response.status(400).json({
                message: "Email verification failed",
                error: true,
                success: false,
            });
        }
        //{
        //   acknowledged: true,
        //   modifiedCount: 1, // kitne documents change hue , line No.105 dakho.
        //   upsertedId: null,
        //   upsertedCount: 0,
        //   matchedCount: 1 // kitne documents match hue query se
        // }

        return response.json({
            message : "Email verification Done",
            success : true,
            error : false
        })
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
        
    }
}

export async function loginController(request, response) {
    try {
        const { email , password } = request.body

        if(!email || !password){
            return response.status(400).json({
                message : "provide email, password",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "User not register",
                error : true,
                success : false
            })
        }

        if(user.status !== "Active"){
            return response.status(400).json({
                message : "Contact to Admin",
                error : true,
                success : false
            })
        }

        const checkPassword = await bcryptjs.compare(password,user.password)

        if(!checkPassword){
            return response.status(400).json({
                message : "Check your password",
                error : true,
                success : false
            })
        }
        const accesstoken = await generatedAccessToken(user._id)
        const refreshToken = await generatedRefreshToken(user._id)

        const cookiesOption = {
            httpOnly : true,
            // secure : true,
            secure: process.env.NODE_ENV === "production",
            sameSite : "None"
        }

        response.cookie('accessToken',accesstoken,cookiesOption)
        response.cookie('refreshToken',refreshToken,cookiesOption)

        return response.json({
            message : "Login successfully",
            error : false,
            success : true,
            data : {
                accesstoken,
                refreshToken
            }
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        }) 
    }
}

export async function logoutController(request, response) {
    try {
        const userid = request.userId

        const cookiesOption = {
            httpOnly : true,
            // secure : true,
            secure: process.env.NODE_ENV === "production",
            sameSite : "None"
        }

        response.clearCookie("accessToken",cookiesOption)
        response.clearCookie("refreshToken",cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token : ""
        })

        return response.json({
            message : "Logout successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async  function uploadAvatar(request,response){
    try {
        const userId = request.userId // auth middlware
        const image = request.file  // multer middleware

        const upload = await uploadImageClodinary(image)
        
        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            avatar : upload.url // Jab upload complete hoti hai, Cloudinary tumhe ek response object bhejta hai jisme details hoti hain, jaise:
                                //    {
                                //         asset_id: "abc123",
                                //         public_id: "user_avatar_01",
                                //    **** url: "https://res.cloudinary.com/yourname/image/upload/v173090/image.png",
                                //         secure_url: "https://res.cloudinary.com/yourname/image/upload/v173090/image.png",
                                //         format: "png",
                                //         width: 512,
                                //         height: 512
                                //     }
        })

        return response.json({
            message : "upload profile",
            success : true,
            error : false,
            data : {
                _id : userId,
                avatar : upload.url
            }
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async function updateUserDetails(request,response){
    try {
        const userId = request.userId //auth middleware
        const { name, email, mobile, password } = request.body 

        let hashPassword = ""

        if(password){
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password,salt)
        }

        const updateUser = await UserModel.updateOne({ _id : userId},{
            ...(name && { name : name }),
            ...(email && { email : email }),
            ...(mobile && { mobile : mobile }),
            ...(password && { password : hashPassword })
        })

        return response.json({
            message : "Updated successfully",
            error : false,
            success : true,
            data : updateUser
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async function forgotPasswordController(request,response) {
    try {
        const { email } = request.body 

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const otp = generatedOtp()
        // const expireTime = new Date() + 60 * 60 * 1000 // 1hr
        const expireTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour later

        const update = await UserModel.findByIdAndUpdate(
            user._id,{
                    forgot_password_otp : otp,
                    forgot_password_expiry : new Date(expireTime).toISOString()
                    })

        await sendEmail({
            sendTo : email,
            subject : "Forgot password from webEcommerce",
            html : forgotPasswordTemplate({
                name : user.name,
                otp : otp
            })
        })

        return response.json({
            message : "check your email",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body;

        // 1️⃣ Check required fields
        if (!email || !otp) {
            return response.status(400).json({
                message: "Provide required fields: email and otp.",
                error: true,
                success: false
            });
        }

        // 2️⃣ Find user
        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            });
        }

        // 3️⃣ Expiry check (use Date comparison)
        const currentTime = new Date();
        const expiryTime = new Date(user.forgot_password_expiry);

        if (expiryTime < currentTime) {
            return response.status(400).json({
                message: "OTP is expired",
                error: true,
                success: false
            });
        }

        // 4️⃣ OTP check
        if (otp !== user.forgot_password_otp) {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            });
        }

        // 5️⃣ OTP valid → clear it from DB
        await UserModel.findByIdAndUpdate(
            user._id,
            {
                forgot_password_otp: "",
                forgot_password_expiry: ""
            },
            { new: true }
        );

        // 6️⃣ Send success response
        return response.json({
            message: "OTP verified successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function resetpassword(request, response) {
    try {
        const { email, newPassword, confirmPassword } = request.body;

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "Provide required fields: email, newPassword, confirmPassword",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email is not available",
                error: true,
                success: false
            });
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "newPassword and confirmPassword must be same.",
                error: true,
                success: false
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(newPassword, salt);

        await UserModel.findOneAndUpdate(
            { _id: user._id }, // ✅ correct syntax
            { password: hashPassword }
        );

        return response.json({
            message: "Password updated successfully.",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function refreshToken(request,response){
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]

        if(!refreshToken){
            return response.status(401).json({
                message : "Invalid token",
                error  : true,
                success : false
            })
        }

        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return response.status(401).json({
                message : "token is expired",
                error : true,
                success : false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.cookie('accessToken',newAccessToken,cookiesOption)

        return response.json({
            message : "New Access token generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async function userDetails(request,response){
    try {
        const userId  = request.userId

        console.log(userId)

        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message : 'successfully update user details',
            data : user,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : "Something is wrong",
            error : true,
            success : false
        })
    }
}













// refreshToken:✅✅✅✅✅✅✅✅✅✅refreshToken:✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅

// Ek baar ek user tha 👤 jo apni website (ya app) pe login hua tha.
// Jab wo login hua, server ne usko do tokens diye —

// 🟢 accessToken — chhoti validity ka, jisse wo turant request bhej sakta hai.

// 🔵 refreshToken — lambi validity ka, jisse wo naya access token le sakta hai jab pehla expire ho jaye.

// Ab kahani ka scene yeh hai 👇
// Access token expire ho gaya ⏳
// User ne server se kaha:

// “Bhai, mera access token expire ho gaya, lekin mere paas refresh token hai. Kya mujhe naya access token mil sakta hai?”

// Server ne kaha,

// “Thik hai, pehle mujhe tera refresh token dikhana padega.”

// Code ka pehla part:

// const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]


// Server refresh token ko cookies ya headers se nikalta hai. Agar refresh token na mile, to wo turant bolta hai:

// “Bhai, token invalid hai, mai madad nahi kar sakta.” (401 Unauthorized)

// Agar token mil gaya, to server verify karta hai:

// const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)


// Yani wo dekhta hai ke yeh token asli hai ya jhoota, aur expiry to nahi ho gayi.

// Agar verify ho gaya ✅
// To server refresh token ke andar se userId nikalta hai:

// const userId = verifyToken?._id


// Phir wo ek naya fresh access token bana deta hai 🍀

// const newAccessToken = await generatedAccessToken(userId)


// Aur naya token cookies mein daal deta hai:

// response.cookie('accessToken', newAccessToken, cookiesOption)


// cookiesOption mein likha hai:

// httpOnly: true → JavaScript se token chori nahi ho sakta

// secure: true → sirf HTTPS pe chalega

// sameSite: "None" → cross-site requests mein bhi chalega (useful for frontend-backend on different domains)

// Finally server bolta hai:

// “Lo bhai! 🎫 Naya access token mil gaya, ab tum phir se request bhej sakte ho.”

// Aur response send karta hai:

// {
//   message: "New Access token generated",
//   success: true,
//   data: { accessToken: newAccessToken }
// }


// Agar kahin beech mein koi dikkat aa jaye (for example, token galat ho, expire ho gaya ho, ya system error ho jaye) to server error message bhej deta hai.

// 🧩 Summary of Kahani:
// Ye code ek “refresh token system” banata hai —
// jab access token expire ho jata hai, user refresh token ke zariye naya access token le sakta hai, bina dobara login kiye.


