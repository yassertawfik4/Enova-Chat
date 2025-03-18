import { Link } from "react-router";

function Navbar() {
  return (
    <div className="bg-white py-6 shadow-lg sticky top-0">
      <div className="container mx-auto px-2">
        <div className="flex justify-between items-center ">
          <div>
            <h2>Enova Ai</h2>
          </div>
          <div className="flex gap-5 items-center">
            <Link
              to="/user/login"
              className="font-semibold border px-5 py-2 rounded-lg"
            >
              Login
            </Link>
            <Link
              to="/user/register"
              className="font-semibold border px-5 py-2 rounded-lg"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
