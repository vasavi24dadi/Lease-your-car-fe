import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const initialRole = searchParams.get("role") || "customer";
    setRole(initialRole);
  }, [searchParams]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        phone,
        password,
        role
      });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userRole", role);
      
      alert("Registered successfully! Welcome to LeaseYourCar 🎉");
      navigate(role === "owner" ? "/add-car" : "/cars");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🚗</div>
          <h1 className="text-3xl font-bold text-gray-900">LeaseYourCar</h1>
          <p className="text-gray-600 mt-2">Join our community</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`py-3 px-4 rounded-lg font-semibold transition ${
              role === "customer"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }`}
          >
            👤 Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`py-3 px-4 rounded-lg font-semibold transition ${
              role === "owner"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }`}
          >
            🏢 Owner
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-800">
              Login
            </Link>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg text-xs text-gray-700 border border-green-200">
          <p className="font-semibold mb-2">Registering as {role === "owner" ? "Car Owner" : "Customer"}?</p>
          {role === "owner" ? (
            <ul className="space-y-1">
              <li>✓ List unlimited cars</li>
              <li>✓ Approve/Reject bookings</li>
              <li>✓ Chat with customers</li>
              <li>✓ Earn money daily</li>
            </ul>
          ) : (
            <ul className="space-y-1">
              <li>✓ Browse all available cars</li>
              <li>✓ Book cars easily</li>
              <li>✓ Chat with owners</li>
              <li>✓ Rate your experience</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
