import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteStart,
  deleteSuccess,
  deleteFailure,
} from "../redux/user/userSlice";

export default function DeleteAccount() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

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
  return (
    <>
      <span
        className="text-red-500 hover:scale-105 transition duration-200"
        onClick={handleDelete}
      >
        Delete Account
      </span>
    </>
  );
}
