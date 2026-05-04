import { useEffect, useState } from "react";
import API from "../api/axios";
import Footer from "../components/Footer";

function OwnerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("bookings");

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/owner");
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (bookingId, status) => {
    try {
      await API.put(`/bookings/${bookingId}/status`, { status });
      alert(`Booking ${status}!`);
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to update booking");
    }
  };

  const getFilteredBookings = () => {
    if (filter === "all") return bookings;
    return bookings.filter(b => b.status === filter);
  };

  const getStatusColor = (status) => {
    const colors = {
      "pending": "bg-yellow-100 text-yellow-800",
      "approved": "bg-green-100 text-green-800",
      "rejected": "bg-red-100 text-red-800",
      "completed": "bg-blue-100 text-blue-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: "📊", color: "blue" },
    { label: "Pending", value: bookings.filter(b => b.status === "pending").length, icon: "⏳", color: "yellow" },
    { label: "Approved", value: bookings.filter(b => b.status === "approved").length, icon: "✅", color: "green" },
    { label: "Completed", value: bookings.filter(b => b.status === "completed").length, icon: "🏁", color: "purple" }
  ];

  const filteredBookings = getFilteredBookings();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-40 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-40 blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Owner Dashboard</h1>
          <p className="text-xl text-gray-600">Manage bookings, track earnings, and list your cars</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:border-blue-300/50 transition duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{stat.icon}</span>
                <div className={`w-12 h-12 rounded-full bg-${stat.color}-100/50 backdrop-blur-sm flex items-center justify-center`}></div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white/80 backdrop-blur-xl rounded-2xl p-2 border border-gray-200/50 shadow-lg w-fit">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-3 font-semibold rounded-xl transition duration-300 ${
              activeTab === "bookings"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
           📋 Bookings
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-6 py-3 font-semibold rounded-xl transition duration-300 ${
              activeTab === "upload"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            🚗 Add Car
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            <div className="mb-8 flex gap-2 flex-wrap">
              {["all", "pending", "approved", "completed"].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-2 rounded-lg font-semibold transition duration-300 ${
                    filter === status
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "bg-white/80 border border-gray-200/50 text-gray-900 hover:border-gray-300 backdrop-blur-sm"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-r-transparent"></div>
                </div>
                <p className="text-gray-600 text-lg mt-4">Loading bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-12 text-center shadow-lg">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-600 text-lg font-semibold">No bookings found</p>
                <p className="text-gray-500 text-sm mt-2">When someone books your car, it will appear here</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:border-blue-300/50 transition duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-2xl font-bold text-gray-900">{booking.car_name}</h3>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(booking.status)}`}>
                            {booking.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-base">👤 {booking.customer_name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 py-6 border-t border-b border-gray-200/50">
                      <div>
                        <p className="text-gray-600 text-sm font-medium mb-1">📅 Start Date</p>
                        <p className="font-bold text-gray-900 text-lg">{booking.start_date}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm font-medium mb-1">📅 End Date</p>
                        <p className="font-bold text-gray-900 text-lg">{booking.end_date}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm font-medium mb-1">📆 Duration</p>
                        <p className="font-bold text-gray-900 text-lg">{booking.duration || "-"} days</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm font-medium mb-1">⏱️ Status</p>
                        <p className="font-bold text-blue-600 text-lg capitalize">{booking.status}</p>
                      </div>
                    </div>

                    {booking.status === "pending" && (
                      <div className="flex gap-4 pt-4">
                        <button
                          onClick={() => updateStatus(booking.id, "approved")}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg text-white py-3 rounded-lg font-bold transition duration-300"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => updateStatus(booking.id, "rejected")}
                          className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-lg text-white py-3 rounded-lg font-bold transition duration-300"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                    {booking.status === "approved" && (
                      <button
                        onClick={() => updateStatus(booking.id, "completed")}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white py-3 rounded-lg font-bold transition duration-300 mt-6"
                      >
                        🏁 Mark as Completed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upload Car Tab */}
        {activeTab === "upload" && (
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Add a New Car</h2>
            <p className="text-gray-600 text-lg mb-8">Fill in the details to list your car on our platform</p>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-6 mb-8">
              <p className="text-blue-900 text-base font-semibold">💡 Pro Tip: Clear, high-quality car photos increase bookings by up to 80%</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default OwnerDashboard;
