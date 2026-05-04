import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "./Notifications";
import { initializeSocket, closeSocket } from "../services/socketService";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("userRole");

  // Initialize Socket connection for logged-in users
  useEffect(() => {
    if (token && userId) {
      initializeSocket(userId);
    }

    return () => {
      if (!token) {
        closeSocket();
      }
    };
  }, [token, userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    closeSocket();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
              🚗 LeaseYourCar
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200">
              Home
            </Link>
            <Link to="/cars" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200">
              Cars
            </Link>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200">
              How It Works
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200">
              About
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <>
                {/* Show notifications for both owners and customers */}
                {(role === "owner" || role === "customer") && (
                  <Notifications />
                )}
                {role === "owner" && (
                  <Link
                    to="/owner-dashboard"
                    className="px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 font-medium hover:bg-blue-100 transition duration-200"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200/50 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-4">
            <Link to="/" className="block text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link to="/cars" className="block text-gray-700 hover:text-blue-600 font-medium">
              Cars
            </Link>
            <a href="#how-it-works" className="block text-gray-700 hover:text-blue-600 font-medium">
              How It Works
            </a>
            {token ? (
              <>
                {role === "owner" && (
                  <Link to="/owner-dashboard" className="block text-gray-700 hover:text-blue-600 font-medium">
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-gray-700 hover:text-blue-600 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link to="/login" className="block text-gray-700 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link to="/register" className="block text-blue-600 font-medium">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
