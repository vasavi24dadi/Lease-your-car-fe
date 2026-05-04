import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Footer from "../components/Footer";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      alert("Login successful! Redirecting...");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">Welcome Back</h1>
            <p className="text-lg text-gray-600">Sign in to your LeaseYourCar account</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">📧 Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 placeholder-gray-400 text-gray-900"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-900">🔐 Password</label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot?
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 placeholder-gray-400 text-gray-900"
                  required
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-blue-600"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition duration-300 mt-8"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-200/50"></div>
              <span className="px-4 text-sm text-gray-600">or</span>
              <div className="flex-1 border-t border-gray-200/50"></div>
            </div>

            {/* Social Login (Optional) */}
            <div className="flex gap-4">
              <button className="flex-1 py-3 border border-gray-200 rounded-lg hover:bg-gray-50/50 transition font-semibold text-gray-900">
                Google
              </button>
              <button className="flex-1 py-3 border border-gray-200 rounded-lg hover:bg-gray-50/50 transition font-semibold text-gray-900">
                GitHub
              </button>
            </div>

            {/* Register Link */}
            <div className="mt-8 text-center pt-8 border-t border-gray-200/50">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl mb-2">🚗</p>
              <p className="text-sm text-gray-600 font-medium">Browse Cars</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-2">✅</p>
              <p className="text-sm text-gray-600 font-medium">Verified Owners</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-2">💰</p>
              <p className="text-sm text-gray-600 font-medium">Best Prices</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;
