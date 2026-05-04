import React, { useState, useEffect } from "react";
import API from "../api/axios";

function Chat({ bookingId, receiverId, carOwnerName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (bookingId && receiverId) {
      fetchMessages();
      const interval = setInterval(() => {
        if (autoRefresh) {
          fetchMessages();
        }
      }, 3000); // Refresh every 3 seconds
      return () => clearInterval(interval);
    }
  }, [bookingId, receiverId, autoRefresh]);

  const fetchMessages = async () => {
    try {
      const res = await API.get(`/chat/${bookingId}`);
      setMessages(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await API.post("/chat/send", {
        booking_id: bookingId,
        receiver_id: receiverId,
        message: newMessage
      });
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-96">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h3 className="text-lg font-bold">💬 Chat with {carOwnerName}</h3>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-3 py-1 rounded text-sm font-semibold transition ${
            autoRefresh ? "bg-green-500" : "bg-gray-500"
          }`}
        >
          {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {loading ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender_id == userId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender_id == userId
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-300 text-gray-900 rounded-bl-none"
                }`}
              >
                <p className="text-sm font-semibold">
                  {msg.sender_id == userId ? "You" : msg.sender_name}
                </p>
                <p>{msg.message_text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
