import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900/95 to-black backdrop-blur-xl text-white py-20 mt-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          {/* Brand */}
          <div className="group">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              🚗 LeaseYourCar
            </div>
            <p className="text-gray-400 leading-relaxed text-base">
              The easiest way to rent and lease cars directly from verified owners near you.
            </p>
            <div className="flex gap-4 mt-8">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-blue-500/30 text-gray-300 hover:text-blue-300 transition duration-300 flex items-center justify-center font-bold">
                f
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-blue-500/30 text-gray-300 hover:text-blue-300 transition duration-300 flex items-center justify-center font-bold">
                𝕏
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-blue-500/30 text-gray-300 hover:text-blue-300 transition duration-300 flex items-center justify-center font-bold">
                in
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/cars" className="text-gray-400 hover:text-blue-300 transition duration-300 text-base">
                  🔍 Browse Cars
                </Link>
              </li>
              <li>
                <Link to="/register?role=owner" className="text-gray-400 hover:text-blue-300 transition duration-300 text-base">
                  📝 Become an Owner
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-300 transition duration-300 text-base">
                  ❓ How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-300 transition duration-300 text-base">
                  💰 Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Company</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-300 transition duration-300 text-base">
                  📖 About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-300 transition duration-300 text-base">
                  📰 Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-300 transition duration-300 text-base">
                  💼 Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-300 transition duration-300 text-base">
                  📞 Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Legal</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-300 transition duration-300 text-base">
                  🔐 Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-300 transition duration-300 text-base">
                  📋 Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-300 transition duration-300 text-base">
                  🍪 Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-300 transition duration-300 text-base">
                  🛡️ Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm gap-4">
            <p className="font-medium">&copy; 2024 LeaseYourCar. All rights reserved.</p>
            <p className="font-medium">Built with ❤️ for car lovers & owners</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
