import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function AddCar() {
  const navigate = useNavigate();
  const [carName, setCarName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [carImage, setCarImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    if (!token) {
      alert("Please login first to add a car");
      navigate("/login");
    } else if (userRole !== "owner") {
      alert("Only car owners can add cars");
      navigate("/cars");
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCarImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addCar = async (e) => {
    e.preventDefault();
    setError("");

    if (!carName || !location || !price || !carImage) {
      setError("Please fill all fields including the car image");
      return;
    }

    if (isNaN(price) || price <= 0) {
      setError("Price must be a valid positive number");
      return;
    }

    const formData = new FormData();
    formData.append("car_name", carName);
    formData.append("location", location);
    formData.append("price_per_km", price);
    formData.append("car_image", carImage);

    setLoading(true);
    try {
      await API.post("/cars/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Car added successfully 🚗");
      setCarName("");
      setLocation("");
      setPrice("");
      setCarImage(null);
      setImagePreview(null);
      navigate("/owner-dashboard");
    } catch (err) {
      console.error("Error adding car:", err);
      const errorMsg = err.response?.data?.error || err.message || "Failed to add car";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
            <h1 className="text-4xl font-bold mb-2">Add Your Car</h1>
            <p className="text-blue-100">List your car and start earning today!</p>
          </div>

          {/* Form */}
          <form onSubmit={addCar} className="p-8 space-y-6">
            {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Car Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Car Name / Model
              </label>
              <input
                type="text"
                placeholder="e.g., Toyota Innova, Honda CRV"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., Mumbai, Delhi, Bangalore"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Price Per KM */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Price Per KM (₹)
              </label>
              <input
                type="number"
                placeholder="e.g., 15"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="1"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Car Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden w-full"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                  ) : (
                    <>
                      <div className="text-5xl mb-2">📸</div>
                      <p className="text-gray-600">Click to upload car image</p>
                      <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Adding Car...
                </>
              ) : (
                <>
                  <span className="mr-2">🚗</span>
                  Add Car Now
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="bg-blue-50 border-t border-blue-200 p-6">
            <h3 className="font-bold text-gray-900 mb-2">✓ Tips for Success:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Use a clear, high-quality photo of your car</li>
              <li>• Set competitive daily rates based on location</li>
              <li>• Mention exact location for easier bookings</li>
              <li>• Keep your rating high by providing good service</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCar;