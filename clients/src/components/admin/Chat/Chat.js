import React, { useEffect, useState, useCallback } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const SOCKET_URL = 'http://localhost:3009';

const AgentChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [activeChats, setActiveChats] = useState(new Map()); // customerSocketId -> messages
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const admin = useSelector(state => state.userReducer.admin)
  // Initialize socket connection
  useEffect(() => {
    console.log('Initializing agent socket connection...');
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Agent socket connected');
      // Register as an agent when connected
      newSocket.emit('registerAgent', 'agent456');
      console.log('Agent registered');
    });

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up agent socket connection');
      newSocket.disconnect();
    };
  }, []);

  // Set up chat event listeners
  useEffect(() => {
    if (!socket) return;

    // Handle new customer chat requests
    const handleNewChat = ({ customerId, customerSocketId }) => {
      console.log(`New chat request from customer: ${customerId} (${customerSocketId})`);
      setActiveChats(prev => {
        const updated = new Map(prev);
        updated.set(customerSocketId, {
          customerId,
          messages: [
            { text: `Customer ${customerId} connected`, sender: 'system' }
          ]
        });
        return updated;
      });
    };

    // Handle incoming messages
    const handleReceiveMessage = ({ senderId, message }) => {
      console.log(`Received message from ${senderId}: ${message}`);
      setActiveChats(prev => {
        const updated = new Map(prev);
        const chat = updated.get(senderId);
        if (chat) {
          chat.messages.push({ text: message, sender: 'customer' });
          updated.set(senderId, chat);
        }
        return updated;
      });
    };

    socket.on('newChat', handleNewChat);
    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('newChat', handleNewChat);
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket]);

  // Send message handler
  const sendMessage = useCallback((messageText) => {
    if (!messageText.trim() || !selectedCustomer || !socket) return;

    try {
      socket.emit('sendMessage', {
        userId: '1234223',
        role: 'admin'
      });

      // Update local state
      setActiveChats(prev => {
        const updated = new Map(prev);
        const chat = updated.get(selectedCustomer);
        if (chat) {
          chat.messages.push({ text: messageText, sender: 'agent' });
          updated.set(selectedCustomer, chat);
        }
        return updated;
      });

      console.log('Agent message sent successfully');
    } catch (error) {
      console.error('Failed to send agent message:', error);
    }
  }, [socket, selectedCustomer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    sendMessage(message);
    setMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[32rem] flex flex-col">
          <div className="bg-blue-600 p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-white font-medium">
              Agent Chat {activeChats.size > 0 ? `(${activeChats.size} active)` : ''}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 rounded-full p-1"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 flex">
            {/* Customer list */}
            <div className="w-1/3 border-r">
              {Array.from(activeChats.entries()).map(([customerSocketId, chat]) => (
                <button
                  key={customerSocketId}
                  onClick={() => setSelectedCustomer(customerSocketId)}
                  className={`w-full p-3 text-left hover:bg-gray-100 ${
                    selectedCustomer === customerSocketId ? 'bg-blue-50' : ''
                  }`}
                >
                  Customer {chat.customerId}
                </button>
              ))}
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {selectedCustomer && activeChats.get(selectedCustomer)?.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        msg.sender === 'agent'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : msg.sender === 'system'
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
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
                  placeholder={selectedCustomer ? "Type a message..." : "Select a customer..."}
                  disabled={!selectedCustomer}
                  className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={!selectedCustomer}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
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

export default AgentChatPopup;