import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import uploadImage from "../utils/UploadImage";

const EditCategory = ({ close, fetchData, editAbleData }) => {
  const [imgLoading, setImgLoading] = useState(false);

  // 🔥 FIX 1 → Submit loading alag rakho
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    _id: editAbleData._id, //important: is id sy catch kry ga k ya wohi data hy jisko ham edit kr rhy hn. editAbleData ya jahan ham ny click kia wahan sy arha hy.
    name: editAbleData.name,
    image: editAbleData.image,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔥 FIX 2 → Spinner image upload ke waqt chale
  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImgLoading(true); // 🔥 spinner start

      const response = await uploadImage(file);
      const { data: ImageResponse } = response;

      setImgLoading(false); // 🔥 spinner stop

      setData((prev) => ({
        ...prev,
        image: ImageResponse.data.url,
      }));
    } catch (error) {
      AxiosToastError(error);
      // console.log(error);
    } finally {
      setImgLoading(false); // 🔥 spinner stop
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔥 FIX 3 → yahan imgLoading nahi chalana, submit loading chalana hai
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.updateCategory,
        data: data,
      });

      const { data: responseData } = response;
      if (responseData.error) {
        toast.error(responseData.message);
      }
      if (responseData.success) {
        toast.success(responseData.message);
        fetchData();
        close();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-500 z-50 bg-opacity-60 flex items-center justify-center">
      <div className="bg-white max-w-4xl w-full p-4 rounded">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Edit Category</h1>
          <button onClick={close} className="w-fit block ml-auto">
            <IoClose size={25} />
          </button>
        </div>

        <form className="my-3 grid gap-2" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label id="categoryName">Name</label>
            <input
              type="text"
              id="categoryName"
              placeholder="Enter category name"
              name="name"
              value={data.name}
              onChange={handleChange}
              className="bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded"
            />
          </div>

          <div className="grid gap-1">
            <p>Image</p>

            <div className="flex gap-4 flex-col lg:flex-row items-center">
              <div className="border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded">
                {/* 🔥 FIX — Image Upload Spinner */}
                {imgLoading ? (
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : data.image ? (
                  <img
                    alt="category"
                    src={data.image}
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">No Image</p>
                )}
              </div>

              <label htmlFor="uploadCategoryImage">
                <div
                  className={` ${data.name ? "bg-amber-300 hover:amber-400" : "bg-gray-200"} px-4 py-2 rounded cursor-pointer border font-medium`}
                >
                  {imgLoading ? "Image Loading..." : "Upload Image"}
                </div>

                <input
                  disabled={!data.name}
                  onChange={handleUploadCategoryImage}
                  type="file"
                  id="uploadCategoryImage"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            className={`${!(data.name && data.image) || loading ? "bg-gray-200" : "bg-amber-300 hover:bg-amber-400 "} py-2 font-semibold`}
          >
            {loading ? "Adding..." : "Update Category"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditCategory;
