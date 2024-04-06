import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);

  return (
    <div className="p-3 max-w-md mx-auto">
      <h1 className="text-center text-2xl font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.profilePicture}
          alt="profile"
          className="h-24 w-24 rounded-full self-center object-cover cursor-pointer mt-2"
        />
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
          defaultValue={currentUser.password}
          placeholder="Password"
          className="bg-slate-200 rounded-lg p-3"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-800 disabled:opacity-80 transition duration-200 cursor-pointer">
          Update Profile
        </button>

        <div className="flex justify-between mt-2 ">
          <span className="text-red-600 hover:text-red-800 hover:scale-105 transition duration-200">
            Delete Account
          </span>
          <span className="text-red-600 hover:text-red-800 hover:scale-105 transition duration-200">
            Sign Out
          </span>
        </div>
      </form>
    </div>
  );
}
