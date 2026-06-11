import Axios from "./Axios"
import SummaryApi from "../common/SummaryApi"

const uploadImage = async(images)=>{        // images can be a single File or array of Files
    try {
        const formData = new FormData()

        if(Array.isArray(images)){
            images.forEach(img => formData.append('image[]', img))
        } else {
            formData.append('image[]', images)
        }

        const response = await Axios({
            ...SummaryApi.uploadImage,
            data : formData
        })
        return response

    } catch (error) {
        return error
    }
}

export default uploadImage




// import Axios from "./Axios"
// import SummaryApi from "../common/SummaryApi"

// const uploadImage = async(image)=>{
//     try {
//         const formData = new FormData()
//         formData.append('image',image)

//         const response = await Axios({
//             ...SummaryApi.uploadImage,
//             data : formData
//         })
//         return response

//     } catch (error) {
//         return error
//     }
// }

// export default uploadImage