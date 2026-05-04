import io from "socket.io-client";

let socket = null;

export const initializeSocket = (userId) => {
  if (!socket) {
    const socketUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    socket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
      socket.emit("join", userId);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Owner notifications
export const onNewBooking = (callback) => {
  if (socket) {
    socket.on("new-booking", callback);
  }
};

export const offNewBooking = () => {
  if (socket) {
    socket.off("new-booking");
  }
};

// Customer notifications
export const onBookingApproved = (callback) => {
  if (socket) {
    socket.on("booking-approved", callback);
  }
};

export const offBookingApproved = () => {
  if (socket) {
    socket.off("booking-approved");
  }
};

export const onBookingRejected = (callback) => {
  if (socket) {
    socket.on("booking-rejected", callback);
  }
};

export const offBookingRejected = () => {
  if (socket) {
    socket.off("booking-rejected");
  }
};
