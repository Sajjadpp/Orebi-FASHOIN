import React, { useEffect, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:4001";

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "admin" },
  ]);
  const user = useSelector((state) => state.userReducer.user);
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    console.log('working1')
    if(!user?._id)return 
    console.log('working2')
    newSocket.on("connect", () => {
      setConnectionStatus("connected");
      newSocket.emit("user-connected", user?._id, "user");
    });

    // Handle incoming messages from the admin
    newSocket.on("receiveMessage", ({ userId, message }) => {
      setMessages((prev) => [
        ...prev,
        { text: message, sender: userId === user?._id ? "user" : "admin" },
      ]);
    });

    newSocket.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  // Send message handler
  const sendMessage = (message) => {
    if (!socket || !message.trim()) return;
    console.log(user,"emit send message")
    socket.emit("sendMessage", {
      username: user.username,
      userId: user?._id,
      message,
    });

    // Append the user's message to the chat locally
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);
    setMessage("");
  };

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case "disconnected":
        return "Connecting...";
      case "connected":
        return "Chat Support";
      case "error":
        return "Connection Error";
      default:
        return "Chat Support";
    }
  };

  const isInputDisabled = connectionStatus !== "connected";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[32rem] flex flex-col">
          <div className="bg-blue-600 p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-white font-medium">{getStatusMessage()}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 rounded-full p-1"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isInputDisabled ? "Waiting for agent..." : "Type a message..."}
              disabled={isInputDisabled}
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isInputDisabled}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        >
          <MessageCircle />
        </button>
      )}
    </div>
  );
};

export default ChatPopup;
