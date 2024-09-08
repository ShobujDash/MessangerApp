import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import uploadFile from "../helpers/UploadFile";
import { setUser } from "../redux/userSlice";
import Avatar from "./Avatar";
import Divider from "./Divider";

function EditUserDetails({ onClose, user }) {
  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user?.profile,
  });

  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setData((prev) => {
      return {
        ...prev,
        ...user,
      };
    });
  }, [user]);
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    const uploadPhoto = await uploadFile(file);

    setData((prev) => {
      return {
        ...prev,
        profile_pic: uploadPhoto?.url,
      };
    });
  };

  const handleOpenUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    uploadPhotoRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api/update-user`;

      const response = await axios({
        method: "POST",
        url: URL,
        data: data,
        withCredentials: true,
      });

      toast.success(response?.data?.message);

      if (response?.data?.success) {
        dispatch(setUser(response?.data?.data));
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white p-4 py-6 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile Details</h2>
        <p className="text-sm">Edit user details</p>

        <form onSubmit={handleSubmit} className="grid gap-3 mt-3">
          <div>
            <label htmlFor="name">Name : </label>
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleOnChange}
              className="w-full py-1 px-2  focus:outline-primary border"
            />
          </div>
          <div>
            <div>Photo : </div>
            <div className="my-1 flex items-center ">
              <Avatar
                width={40}
                height={40}
                imageUrl={data?.profile_pic}
                name={data?.name}
              />
              <label htmlFor="profile_pic">
                <button
                  onClick={handleOpenUploadPhoto}
                  className="font-semibold px-4"
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  id="profile_pic"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>

          <Divider />
          <div className="flex gap-2 w-fit ml-auto mt-3">
            <button
              onClick={onClose}
              className="border-primary text-primary border px-4 py-1 rounded hover:bg-primary hover:text-white"
            >
              Cancle
            </button>
            <button
              type="submit"
              className="border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserDetails;
