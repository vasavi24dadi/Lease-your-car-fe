import React, { useState, useEffect } from "react";
import { 
  onNewBooking, 
  offNewBooking,
  onBookingApproved,
  offBookingApproved,
  onBookingRejected,
  offBookingRejected
} from "../services/socketService";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    // Owner: Listen for new booking notifications
    if (userRole === "owner") {
      onNewBooking((data) => {
        console.log("New booking notification received:", data);
        addNotification({
          type: "new-booking",
          ...data,
          icon: "📖"
        });
      });
    }

    // Customer: Listen for booking approved/rejected
    if (userRole === "customer") {
      onBookingApproved((data) => {
        console.log("Booking approved:", data);
        addNotification({
          type: "approved",
          ...data,
          icon: "✅"
        });
      });

      onBookingRejected((data) => {
        console.log("Booking rejected:", data);
        addNotification({
          type: "rejected",
          ...data,
          icon: "❌"
        });
      });
    }

    return () => {
      offNewBooking();
      offBookingApproved();
      offBookingRejected();
    };
  }, [userRole]);

  const addNotification = (notif) => {
    const id = Date.now();
    setNotifications((prev) => [
      {
        id,
        ...notif,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev
    ]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition"
        title="Notifications"
      >
        <span className="text-2xl">🔔</span>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Notifications</h3>
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No new notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-4 hover:bg-blue-50 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Owner notification - new booking */}
                      {notif.type === "new-booking" && (
                        <>
                          <p className="font-semibold text-gray-900">
                            📖 {notif.car_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            New booking from <strong>{notif.customer_name}</strong>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notif.start_date} to {notif.end_date}
                          </p>
                        </>
                      )}

                      {/* Customer notification - booking approved */}
                      {notif.type === "approved" && (
                        <>
                          <p className="font-semibold text-green-700">
                            ✅ Booking Approved!
                          </p>
                          <p className="text-sm text-gray-600">
                            Your booking for <strong>{notif.car_name}</strong> has been approved
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notif.start_date} to {notif.end_date}
                          </p>
                        </>
                      )}

                      {/* Customer notification - booking rejected */}
                      {notif.type === "rejected" && (
                        <>
                          <p className="font-semibold text-red-700">
                            ❌ Booking Rejected
                          </p>
                          <p className="text-sm text-gray-600">
                            Your booking for <strong>{notif.car_name}</strong> has been rejected
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notif.start_date} to {notif.end_date}
                          </p>
                        </>
                      )}

                      <p className="text-xs text-gray-400 mt-1">
                        {notif.timestamp}
                      </p>
                    </div>
                    <span className="text-xl">{notif.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Toast Notification (appears on top-right) */}
      <div className="fixed top-20 right-4 space-y-2 z-50 pointer-events-none">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`${
              notif.type === "approved"
                ? "bg-green-500"
                : notif.type === "rejected"
                ? "bg-red-500"
                : "bg-blue-500"
            } text-white px-4 py-3 rounded-lg shadow-lg animate-pulse pointer-events-auto`}
          >
            {notif.type === "new-booking" && (
              <>
                <p className="font-semibold">New Booking! 🎉</p>
                <p className="text-sm">{notif.customer_name} booked {notif.car_name}</p>
              </>
            )}
            {notif.type === "approved" && (
              <>
                <p className="font-semibold">Approved! ✅</p>
                <p className="text-sm">Your booking for {notif.car_name} is approved</p>
              </>
            )}
            {notif.type === "rejected" && (
              <>
                <p className="font-semibold">Rejected ❌</p>
                <p className="text-sm">Your booking for {notif.car_name} was rejected</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
