import React, { useState, useEffect, useCallback } from "react";
import API from "../api/axios";
import Footer from "../components/Footer";

function Cars() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [distance, setDistance] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState(100);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState("price");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCars();
  }, []);

  const filterCars = useCallback(() => {
    let filtered = cars;

    if (location) {
      filtered = filtered.filter(car =>
        car.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (maxPrice) {
      filtered = filtered.filter(car => car.price_per_km <= maxPrice);
    }

    if (sortBy === "price") {
      filtered.sort((a, b) => a.price_per_km - b.price_per_km);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price_per_km - a.price_per_km);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.car_name.localeCompare(b.car_name));
    }

    setFilteredCars(filtered);
  }, [cars, location, maxPrice, sortBy]);

  useEffect(() => {
    filterCars();
  }, [filterCars]);

  const fetchCars = async () => {
    try {
      const res = await API.get("/cars");
      setCars(res.data);
      setFilteredCars(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setLoading(false);
    }
  };

  const bookCar = async (car) => {
    if (!startDate || !endDate || !distance || !startTime || !endTime) {
      alert("Please fill all booking details (dates, times, and distance)");
      return;
    }

    if (isNaN(distance) || distance <= 0) {
      alert("Distance must be a positive number");
      return;
    }

    try {
      await API.post("/bookings", {
        car_id: car.id,
        start_date: startDate,
        start_time: startTime,
        end_date: endDate,
        end_time: endTime,
        distance: parseFloat(distance)
      });

      alert("Booking request sent! Waiting for owner approval.");
      setShowModal(false);
      setSelectedCar(null);
      setDistance("");
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-8">You need to be logged in to browse and book cars.</p>
            <a
              href="/login"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white font-semibold rounded-xl transition shadow-md"
            >
              Sign In
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-40 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-40 blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Browse Cars</h1>
          <p className="text-xl text-gray-600">Find the perfect car for your next adventure</p>
        </div>
      </section>

      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 sticky top-24 h-fit shadow-lg hover:shadow-xl transition">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Filters</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Location</label>
                  <input
                    type="text"
                    placeholder="Enter city..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Max Price: <span className="text-blue-600 font-bold">₹{maxPrice}/km</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-3 font-medium">
                    <span>₹5</span>
                    <span>₹100</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                  />
                </div>

                <div className="pt-6 border-t border-gray-200/50">
                  <p className="text-sm text-gray-600 font-semibold mb-3">📊 Found <span className="text-blue-600 font-bold">{filteredCars.length}</span> cars</p>
                  <button
                    onClick={() => {
                      setLocation("");
                      setMaxPrice(100);
                      setStartDate("");
                      setEndDate("");
                      setStartTime("09:00");
                      setEndTime("17:00");
                      setDistance("");
                    }}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-white/80 transition font-semibold"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            {/* Sort Bar */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-gray-600 font-semibold text-lg">Showing <span className="text-blue-600 font-bold">{filteredCars.length}</span> cars</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold bg-white/80 backdrop-blur-sm"
              >
                <option value="price">💰 Price: Low to High</option>
                <option value="price-high">💰 Price: High to Low</option>
                <option value="name">🅰️ Car Name</option>
              </select>
            </div>

            {/* Cars Grid */}
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-r-transparent"></div>
                </div>
                <p className="text-gray-600 text-lg mt-4">Loading cars...</p>
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 p-12 rounded-2xl text-center shadow-sm">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600 text-lg font-semibold">No cars match your criteria</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or browse all available cars</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredCars.map((car) => (
                  <div
                    key={car.id}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 hover:border-blue-300/50 hover:shadow-2xl transition duration-300 overflow-hidden group shadow-lg"
                  >
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      {car.car_image ? (
                        <img
                          src={`http://localhost:5000/uploads/${car.car_image}`}
                          alt={car.car_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-gray-100 to-gray-200">🚗</div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-blue-600 shadow-md">
                        ₹{car.price_per_km}/km
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{car.car_name}</h3>
                      <div className="space-y-2 mb-6 text-gray-600">
                        <p className="flex items-center gap-2 text-base">
                          <span className="text-lg">📍</span> {car.location}
                        </p>
                        <p className="flex items-center gap-2 text-base">
                          <span className="text-lg">✅</span> <span className="font-semibold">Available</span>
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCar(car);
                          setShowModal(true);
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white font-semibold py-3 rounded-lg transition duration-300"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && selectedCar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200/50 max-h-screen overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Book <span className="text-blue-600">{selectedCar.car_name}</span></h2>
              <p className="text-gray-600 text-sm mt-1">Complete your booking in seconds</p>
            </div>

            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">📅 Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">⏰ Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">📅 End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">⏰ End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">🛣️ Distance (km)</label>
                <input
                  type="number"
                  placeholder="Enter total distance"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  step="0.5"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-8 border border-blue-200/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">💰 Price per km</p>
                  <p className="text-xl font-bold text-blue-600">₹{selectedCar.price_per_km}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">📏 Distance</p>
                  <p className="text-xl font-bold text-blue-600">{distance ? `${distance} km` : "--"}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200/50">
                <p className="text-sm text-gray-600 mb-1">💵 Total Price</p>
                <p className="text-3xl font-bold text-green-600">
                  {distance ? `₹${(parseFloat(distance) * selectedCar.price_per_km).toFixed(2)}` : "₹0"}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => bookCar(selectedCar)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white py-3 rounded-lg font-bold transition duration-300"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedCar(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-bold transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Cars;
