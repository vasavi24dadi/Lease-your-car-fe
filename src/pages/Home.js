import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Footer from "../components/Footer";

function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await API.get("/cars");
      setCars(res.data.slice(0, 6));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleBook = (carId) => {
    if (!token) {
      alert("Please login to book a car");
      window.location.href = "/login";
      return;
    }
    window.location.href = `/cars?selectedCar=${carId}`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/cars?location=${searchLocation}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-40 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-40 blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Find & Lease Cars <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Near You
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with verified car owners. Rent quality vehicles at fair prices. Owners earn extra income.
            </p>
          </div>

          {/* Search Bar with Shadow */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-3 shadow-2xl rounded-xl p-2 bg-white">
              <input
                type="text"
                placeholder="Search by location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="flex-1 px-6 py-4 rounded-lg border-0 focus:outline-none text-gray-900 placeholder-gray-500"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition duration-300 whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>

          {/* CTA Buttons with Enhanced Styling */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cars"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl text-white font-semibold rounded-xl transition duration-300 text-center shadow-lg"
            >
              Browse All Cars
            </Link>
            {!token && (
              <Link
                to="/register?role=owner"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-xl transition duration-300 text-center"
              >
                List Your Car
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-3">Featured Cars</h2>
            <p className="text-lg text-gray-600">Browse our newest and most popular listings</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-r-transparent"></div>
              </div>
              <p className="text-gray-600 text-lg mt-4">Loading cars...</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="bg-slate-50 p-12 rounded-2xl text-center border border-slate-200">
              <p className="text-gray-600 text-lg">No cars available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-2xl transition duration-300 overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {car.car_image ? (
                      <img
                        src={`http://localhost:5000/uploads/${car.car_image}`}
                        alt={car.car_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-gray-100 to-gray-200">🚗</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{car.car_name}</h3>
                    <div className="space-y-2 mb-4 text-gray-600">
                      <p className="flex items-center gap-2">
                        <span className="text-lg">📍</span> {car.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-lg">✓</span> Available
                      </p>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-bold text-blue-600">₹{car.price_per_day}</span>
                      <span className="text-gray-600 text-sm font-medium">/day</span>
                    </div>
                    <button
                      onClick={() => handleBook(car.id)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white font-semibold py-3 rounded-lg transition duration-300"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/cars"
              className="inline-block px-10 py-4 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition duration-300 shadow-lg"
            >
              View All Cars →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-lg text-gray-600">Simple steps to rent or list your car</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Owners List Cars",
                desc: "Upload vehicle details and availability",
                icon: "📋"
              },
              {
                step: 2,
                title: "Customers Browse",
                desc: "Search cars by location and price",
                icon: "🔍"
              },
              {
                step: 3,
                title: "Book & Connect",
                desc: "Chat with owner and arrange pickup",
                icon: "💬"
              },
              {
                step: 4,
                title: "Enjoy & Earn",
                desc: "Drive, return, and leave reviews",
                icon: "✨"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition duration-300 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                  {item.step}
                </div>
                <p className="text-6xl mb-4">{item.icon}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "✅",
                title: "Verified Owners",
                desc: "All car owners are verified for your safety"
              },
              {
                icon: "💰",
                title: "Best Prices",
                desc: "Direct from owners - no hidden fees"
              },
              {
                icon: "🛡️",
                title: "Safe & Secure",
                desc: "Secure payment and dispute support"
              }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of users booking quality cars</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cars"
              className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-bold rounded-xl transition duration-300 shadow-lg"
            >
              Browse Cars
            </Link>
            {!token && (
              <Link
                to="/register?role=owner"
                className="px-8 py-4 border-2 border-white text-white hover:bg-white/10 font-bold rounded-xl transition duration-300"
              >
                Become an Owner
              </Link>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


export default Home;