import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  const { currentUser } = useSelector((state) => state.user);

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

  return (
    <div className="p-3 max-w-md mx-auto">
      <h1 className="text-center text-2xl font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
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
          id="username"
          defaultValue={currentUser.userName}
          placeholder="Username"
          className="bg-slate-200 rounded-lg p-3"
        />
        <input
          type="email"
          id="email"
          defaultValue={currentUser.email}
          placeholder="Email"
          className="bg-slate-200 rounded-lg p-3"
        />
        <input
          type="password"
          id="password"
          defaultValue=""
          placeholder="Password"
          className="bg-slate-200 rounded-lg p-3"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-800 disabled:opacity-80 transition duration-200 cursor-pointer">
          Update Profile
        </button>

        <div className="flex justify-between mt-2 ">
          <span className="text-red-500 hover:scale-105 transition duration-200">
            Delete Account
          </span>
          <span className="text-red-500 hover:scale-105 transition duration-200">
            Sign Out
          </span>
        </div>
      </form>
    </div>
  );
}
