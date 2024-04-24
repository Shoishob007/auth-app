import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/user/userSlice";

export default function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    <>
      <span
        className="text-red-500 hover:scale-105 transition duration-200"
        onClick={handleLogout}
      >
        Sign Out
      </span>
    </>
  );
}
