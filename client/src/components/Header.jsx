import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser.profilePicture);

  return (
    <div className="bg-gradient-to-r from-red-300 to-red-300 via-red-300">
      <div className="flex justify-between items-center mx-auto max-w-6xl px-8 py-4">
        <Link to="/">
          <h1 className="font-bold">Authentication</h1>
        </Link>

        <ul className="flex gap-4">
          <Link to="/">
            <li>Home</li>{" "}
          </Link>
          <Link to="/about">
            <li>About</li>{" "}
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.profilePicture}
                alt="profile"
                className="h-7 w-7 rounded-full"
              />
            ) : (
              <li>Login</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
