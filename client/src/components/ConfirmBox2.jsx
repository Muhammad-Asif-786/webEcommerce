import React from "react";
import { IoClose } from "react-icons/io5";

const ConfirmBox2 = ({ close, cancel, confirm }) => {

  return (
    <section className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm p-4 rounded shadow-lg">
        
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">Confirm Delete</h2>
          <button onClick={close}>
            <IoClose size={24} />
          </button>
        </div>

        <p className="text-gray-700 mb-5">
          Are you sure you want to delete this category?
        </p>

        <div className="flex justify-end gap-3">
          <button 
            onClick={cancel}
            className="px-4 py-1 border rounded hover:bg-green-400 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={confirm}
            className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
          >
            Yes, Delete
          </button>
        </div>

      </div>
    </section>
  );
};

export default ConfirmBox2;
