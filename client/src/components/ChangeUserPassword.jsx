/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePasswordStart,
  updatePasswordSuccess,
  updatePasswordFailure,
} from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function ChangePassword({ loading, error }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      console.log("Please fill in all the password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      console.log("New password and confirm password must match");
      return;
    }

    try {
      dispatch(updatePasswordStart());

      const res = await fetch(`/api/user/changePassword/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      console.log("Response received:", res);

      const data = await res.json();
      console.log("Data received:", data);

      if (data.success === false) {
        dispatch(updatePasswordFailure(data));
        return;
      }
      dispatch(updatePasswordSuccess(data));
      console.log("Password changed successfully");

      navigate("/login");
    } catch (error) {
      dispatch(updatePasswordFailure(error));
      console.log("Error:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <input
          type="password"
          required
          className="bg-slate-200 rounded-lg p-3"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          required
          className="bg-slate-200 rounded-lg p-3"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <input
          type="password"
          required
          className="bg-slate-200 rounded-lg p-3"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-800 disabled:opacity-80 transition duration-200 cursor-pointer"
          type="submit"
          onClick={handleSubmit}
        >
          {loading ? "Loading..." : "Change Password"}
        </button>
      </div>
    </div>
  );
}
