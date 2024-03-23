import Link from "next/link";

function Header() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-gray-800">
            TherHappy
          </a>
          <ul className="flex space-x-4">
            <li>
              <Link href="/login" className="text-gray-600 hover:text-gray-800">
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/signUp"
                className="text-gray-600 hover:text-gray-800"
              >
                SignUp
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
