import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-2xl hover:text-blue-200 transition">
            <span className="text-3xl">🚗</span>
            <span>LeaseYourCar</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="hover:text-blue-200 transition">Home</Link>
            <Link to="/cars" className="hover:text-blue-200 transition">Browse Cars</Link>

            {!token ? (
              <>
                <Link
                  to="/login"
                  className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {userRole === "owner" && (
                  <>
                    <Link to="/add-car" className="hover:text-blue-200 transition">Add Car</Link>
                    <Link to="/owner-dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
                  </>
                )}
                <Link to="/my-bookings" className="hover:text-blue-200 transition">My Bookings</Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block hover:bg-blue-700 px-4 py-2 rounded">Home</Link>
            <Link to="/cars" className="block hover:bg-blue-700 px-4 py-2 rounded">Browse Cars</Link>

            {!token ? (
              <>
                <Link to="/login" className="block hover:bg-blue-700 px-4 py-2 rounded">Login</Link>
                <Link to="/register" className="block hover:bg-blue-700 px-4 py-2 rounded">Sign Up</Link>
              </>
            ) : (
              <>
                {userRole === "owner" && (
                  <>
                    <Link to="/add-car" className="block hover:bg-blue-700 px-4 py-2 rounded">Add Car</Link>
                    <Link to="/owner-dashboard" className="block hover:bg-blue-700 px-4 py-2 rounded">Dashboard</Link>
                  </>
                )}
                <Link to="/my-bookings" className="block hover:bg-blue-700 px-4 py-2 rounded">My Bookings</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
