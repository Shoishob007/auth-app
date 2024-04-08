import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/user/userSlice";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleButton = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(loginSuccess(data));

      navigate("/");
    } catch (error) {
      console.log("Could not login with Google!", error);
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleButton}
      className="bg-red-600 text-white p-3 rounded-lg uppercase hover:bg-red-800 transition duration-200 cursor-pointer"
    >
      Continue with google
    </button>
  );
}
