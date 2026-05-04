import { useEffect, useState } from "react";
import API from "../api/axios";

function Cars() {
  const [cars, setCars] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await API.get("/cars");
        setCars(response.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Book Car
  const bookCar = async (carId) => {
    if (!startDate || !endDate) {
      alert("Please select start and end dates");
      return;
    }

    try {
      const response = await API.post("/bookings", {
        car_id: carId,
        start_date: startDate,
        end_date: endDate,
      });

      alert("Car booked successfully 🚗");
      console.log(response.data);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed");
    }
  };

  if (loading) {
    return <h2>Loading cars...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Cars</h2>

      {cars.length > 0 ? (
        cars.map((car) => (
          <div
            key={car.id}
            style={{
              border: "1px solid black",
              margin: "15px 0",
              padding: "15px",
            }}
          >
            <h3>{car.car_name}</h3>
            <p>Location: {car.location}</p>
            <p>Price per day: ₹{car.price_per_day}</p>

            <div style={{ marginTop: "10px" }}>
              <input
                type="datetime-local"
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                style={{ marginLeft: "10px" }}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button
              style={{ marginTop: "10px" }}
              onClick={() => bookCar(car.id)}
            >
              Book Now
            </button>
          </div>
        ))
      ) : (
        <p>No cars available</p>
      )}
    </div>
  );
}

export default Cars;
