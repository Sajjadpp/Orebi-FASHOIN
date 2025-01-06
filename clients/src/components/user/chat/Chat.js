import React, { useEffect, useState, useCallback } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:3009";

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "admin" },
  ]);
  const user = useSelector(state => state.userReducer.user)
  const [socket, setSocket] = useState(null);
  const [agentSocketId, setAgentSocketId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Initialize socket connection
  useEffect(() => {
    console.log('Initializing socket connection...');
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setConnectionStatus('connected');
      newSocket.emit("startChat", "customer123");
      console.log('Sent startChat event');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionStatus('error');
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnectionStatus('disconnected');
      setAgentSocketId(null);
    });

    return () => {
      console.log('Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleChatAssigned = (data) => {
      console.log('Chat assigned data received:', data);
      if (data.agentSocketId) {
        setAgentSocketId(data.agentSocketId);
        setConnectionStatus('agent_connected');
        console.log('Agent connected:', data.agentSocketId);
      } else {
        console.error('No agent socket ID in response:', data);
      }
    };

    const handleReceiveMessage = ({ senderId, message }) => {
      console.log('Received message:', { senderId, message });
      setMessages(prev => [...prev, { text: message, sender: senderId }]);
    };

    socket.on("chatAssigned", handleChatAssigned);
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("chatAssigned", handleChatAssigned);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket]);

  // Send message handler
  const sendMessage = useCallback((messageText) => {
    if (!messageText.trim()) return;
    
    console.log('Sending message...', {
      socketConnected: socket?.connected,
      agentSocketId,
      connectionStatus
    });

    if (!socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    if (!agentSocketId) {
      console.log('No agent assigned yet');
      setMessages(prev => [...prev, { 
        text: "Please wait for an agent to be connected.", 
        sender: "system",
        error: true 
      }]);
      return;
    }

    try {
      setMessages(prev => [...prev, { text: messageText, sender: "user" }]);

      socket.emit("sendMessage", {
        senderId: user.username,
        recipientSocketId: agentSocketId,
        message: messageText,
      });
      console.log('Message sent successfully');
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => [...prev, { 
        text: "Failed to send message. Please try again.", 
        sender: "system",
        error: true 
      }]);
    }
  }, [socket, agentSocketId, connectionStatus]);

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case 'disconnected':
        return 'Connecting...';
      case 'connected':
        return 'Waiting for agent...';
      case 'agent_connected':
        return 'Chat Support';
      case 'error':
        return 'Connection Error';
      default:
        return 'Chat Support';
    }
  };

  const isInputDisabled = connectionStatus !== 'agent_connected';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[32rem] flex flex-col">
          <div className="bg-blue-600 p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-white font-medium">
              {getStatusMessage()}
            </h3>
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
                      : msg.error
                      ? "bg-red-100 text-red-800 rounded-bl-none"
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