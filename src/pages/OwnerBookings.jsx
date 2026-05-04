import { useEffect, useState } from "react";
import API from "../api/axios";

function OwnerBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/bookings/owner").then(res => setBookings(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/bookings/${id}/status`, { status });
    alert("Status updated");
  };

  return (
    <div>
      <h2>Owner Bookings</h2>
      {bookings.map(b => (
        <div key={b.booking_id}>
          <p>{b.customer_name}</p>
          <button onClick={() => updateStatus(b.booking_id, "approved")}>Approve</button>
          <button onClick={() => updateStatus(b.booking_id, "rejected")}>Reject</button>
        </div>
      ))}
    </div>
  );
}

export default OwnerBookings;
