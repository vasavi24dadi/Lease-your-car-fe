import React, { useState, useEffect } from "react";
import API from "../api/axios";

function Rating({ bookingId, carId }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [existingRating, setExistingRating] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [carRatings, setCarRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchRating();
    fetchCarRatings();
  }, [bookingId, carId]);

  const fetchRating = async () => {
    try {
      const res = await API.get(`/ratings/${bookingId}`);
      if (res.data) {
        setExistingRating(res.data);
        setRating(res.data.rating);
        setReview(res.data.review);
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };

  const fetchCarRatings = async () => {
    try {
      const res = await API.get(`/ratings/car/${carId}`);
      setCarRatings(res.data.ratings);
      setAverageRating(res.data.averageRating);
    } catch (error) {
      console.error("Error fetching car ratings:", error);
    }
  };

  const submitRating = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    try {
      await API.post("/ratings/add", {
        booking_id: bookingId,
        rating: rating,
        review: review
      });
      setSubmitted(true);
      alert("Rating submitted successfully!");
      fetchCarRatings();
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">Rate This Car</h3>

      {averageRating > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-lg font-semibold">
            Average Rating: {"⭐".repeat(Math.round(averageRating))} ({averageRating.toFixed(1)}/5)
          </p>
          <p className="text-gray-600">Based on {carRatings.length} reviews</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Your Rating</label>
          <div className="flex gap-2 text-4xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => !submitted && setRating(star)}
                className="cursor-pointer transition transform hover:scale-110"
                disabled={submitted}
              >
                <span className={rating >= star ? "text-yellow-400" : "text-gray-300"}>
                  ⭐
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Your Review</label>
          <textarea
            value={review}
            onChange={(e) => !submitted && setReview(e.target.value)}
            placeholder="Share your experience with this car..."
            disabled={submitted}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            rows="4"
          />
        </div>

        {!submitted && (
          <button
            onClick={submitRating}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Submit Rating
          </button>
        )}

        {submitted && (
          <p className="text-green-600 font-semibold">✓ Your rating has been submitted</p>
        )}
      </div>

      {/* Other Reviews */}
      {carRatings.length > 0 && (
        <div className="mt-8">
          <h4 className="text-xl font-bold mb-4">Other Reviews</h4>
          <div className="space-y-4">
            {carRatings.slice(0, 5).map((r, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">{r.reviewer_name}</p>
                  <p className="text-yellow-400">{"⭐".repeat(r.rating)}</p>
                </div>
                <p className="text-gray-600">{r.review}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Rating;
