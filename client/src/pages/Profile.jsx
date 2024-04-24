import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import Logout from "./Logout";
import DeleteAccount from "../components/DeleteAccount";
import UpdateProfile from "../components/UpdateProfile";

export default function Profile() {
  const [image, setImage] = useState(undefined);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateProfileSuccessful, setUpdateProfileSuccessful] = useState(false);

  const { error } = useSelector((state) => state.user);

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
      <h1 className="text-center text-2xl font-semibold my-5">Profile</h1>

      <UpdateProfile
        formData={formData}
        setFormData={setFormData}
        uploadPercentage={uploadPercentage}
        uploadError={uploadError}
        setImage={setImage}
        setUpdateProfileSuccessful={setUpdateProfileSuccessful}
      />
      <div className="flex justify-between mt-2 ">
        <DeleteAccount />
        <Logout />
      </div>
      <p className="text-red-500 mt-4"> {error && "Something went wrong!"}</p>
      <p className="text-emerald-500 mt-4">
        {updateProfileSuccessful && "User has been updated successfully"}
      </p>
    </div>
  );
}
