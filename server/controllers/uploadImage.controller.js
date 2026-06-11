import uploadImageClodinary from "../utils/uploadImageClodinary.js"



export async function uploadImageController  (request, response){

    try {
        const file = request.file

        const uploadImage = await uploadImageClodinary(file)

        return response.json({
            message: "successfully image upload",
            error : false,
            success : true,
            data : uploadImage
        })
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error:true,
            success:false
        })
        
    }
}