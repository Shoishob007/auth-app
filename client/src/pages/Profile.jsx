import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  updateProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  logout,
} from "../redux/user/userSlice";
import ChangePassword from "../components/ChangeUserPassword";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateProfileSuccessful, setUpdateProfileSuccessful] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPercentage(Math.round(progress));
      },
      // eslint-disable-next-line no-unused-vars
      (error) => {
        setUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({
            ...formData,
            profilePicture: downloadURL,
          });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateProfileStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateProfileFailure(data));
        return;
      }

      dispatch(updateProfileSuccess(data));
      setUpdateProfileSuccessful(true);
    } catch (error) {
      dispatch(updateProfileFailure(error));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log(data);
      if (data.success == false) {
        dispatch(deleteFailure(data));
        return;
      }

      dispatch(deleteSuccess(data));
      localStorage.removeItem("token");

      alert("Account deleted permanently");

      navigate("/login");
    } catch (error) {
      dispatch(deleteFailure(error));
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout");

      dispatch(logout());
      alert("Signed out!");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-md mx-auto">
      <h1 className="text-center text-2xl font-semibold my-5">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt="profile"
          className="h-24 w-24 rounded-full self-center object-cover cursor-pointer mt-2"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {uploadError ? (
            <span className="text-red-500">Error uploading image!</span>
          ) : uploadPercentage > 0 && uploadPercentage < 100 ? (
            <span className="text-yellow-500">{`Uploading : ${uploadPercentage}%`}</span>
          ) : uploadPercentage === 100 ? (
            <span className="text-emerald-500">
              Image uploaded successfully!
            </span>
          ) : (
            " "
          )}{" "}
        </p>
        <input
          type="text"
          id="userName"
          defaultValue={currentUser.userName}
          placeholder="Username"
          className="bg-slate-200 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          defaultValue={currentUser.email}
          placeholder="Email"
          className="bg-slate-200 rounded-lg p-3"
          onChange={handleChange}
        />

        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-800 disabled:opacity-80 transition duration-200 cursor-pointer">
          {loading ? "Loading..." : "Update Profile"}
        </button>
        {!showChangePassword && (
          <button
            type="button"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-800 disabled:opacity-80 transition duration-200 cursor-pointer"
            onClick={() => setShowChangePassword(true)}
          >
            Change Password
          </button>
        )}
        {showChangePassword && (
          <ChangePassword loading={loading} error={error} />
        )}
      </form>

      <div className="flex justify-between mt-2 ">
        <span
          className="text-red-500 hover:scale-105 transition duration-200"
          onClick={handleDelete}
        >
          Delete Account
        </span>
        <span
          className="text-red-500 hover:scale-105 transition duration-200"
          onClick={handleLogout}
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-500 mt-4"> {error && "Something went wrong!"}</p>
      <p className="text-emerald-500 mt-4">
        {updateProfileSuccessful && "User has been updated successfully"}
      </p>
    </div>
  );
}
