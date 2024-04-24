/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import {
  updateProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import ChangePassword from "../components/ChangeUserPassword";


export default function UpdateProfile({
  formData,
  setFormData,
  uploadPercentage,
  uploadError,
  setImage,
  setUpdateProfileSuccessful,
}) {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);

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
  return (
    <>
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
    </>
  );
}
