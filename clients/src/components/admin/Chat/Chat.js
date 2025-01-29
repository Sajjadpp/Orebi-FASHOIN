import React, { useEffect, useState, useCallback } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { userAxiosInstance } from '../../../redux/constants/AxiosInstance';

const SOCKET_URL = 'http://localhost:4001';

const AgentChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [activeChats, setActiveChats] = useState(new Map());
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const admin = useSelector((state) => state.userReducer.admin);

  // Initialize socket connection
  useEffect(() => {
    console.log('working')
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    // Notify server of the admin connection
    newSocket.emit('user-connected', admin?.email, 'admin');

    // Handle new user connections
    newSocket.on('setUsersChat', (data) =>{
      console.log('triggered', data)

    });
    console.log(availableUsers,"new users")
    // Handle incoming messages
    newSocket.on('receiveMessage', ({ senderId, message }) => {
      console.log({senderId, message})
      setActiveChats((prev) => {
        const updatedChats = new Map(prev);
        const chat = updatedChats.get(senderId) || { messages: [] };
        chat.messages.push({ sender: 'customer', text: message });
        updatedChats.set(senderId, chat);
        return updatedChats;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [admin]);

  // Send a message to the server and store it in the backend
  const sendMessage = useCallback(async () => {
    console.log('working')
    if (!message.trim() || !selectedCustomer || !socket) return;

    try {
      // Emit the message to the server
      socket.emit('sendMessage', {
        senderId: admin?.email,
        receiverId: selectedCustomer,
        role: 'admin',
        message,
      });

      // Save the message locally
      setActiveChats((prev) => {
        const updatedChats = new Map(prev);
        const chat = updatedChats.get(selectedCustomer) || { messages: [] };
        chat.messages.push({ sender: 'admin', text: message });
        updatedChats.set(selectedCustomer, chat);
        return updatedChats;
      });
      console.log(selectedCustomer," selected new customer")
      // Save the message to the backend
      await userAxiosInstance.post('/messages', {
        senderId: admin?.email,
        receiverId: selectedCustomer,
        message,
      });

      setMessage('');
    } catch (error) {
      console.error('Failed to send agent message:', error);
    }
  }, [admin?.email, message, selectedCustomer, socket]);

 

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[32rem] flex flex-col">
          <div className="bg-blue-600 p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-white font-medium">
              Agent Chat {activeChats.size > 0 ? `(${activeChats.size} active)` : ''}
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-blue-700 rounded-full p-1">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 flex">
            {/* Customer List */}
            <div className="w-1/3 border-r">
              {[...activeChats.entries()].map(([userId, chat]) => (
                <button
                  key={userId}
                  onClick={() => setSelectedCustomer(userId)}
                  className={`w-full p-3 text-left hover:bg-gray-100 ${
                    selectedCustomer === userId ? 'bg-blue-50' : ''
                  }`}
                >
                  Customer {userId} ({chat.messages.length} messages)
                </button>
              ))}
            </div>
            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {selectedCustomer &&
                  activeChats.get(selectedCustomer)?.messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                          msg.sender === 'admin'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="border-t p-4 flex gap-2"
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={selectedCustomer ? 'Type a message...' : 'Select a customer...'}
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
        <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700">
          <MessageCircle />
        </button>
      )}
    </div>
  );
};

export default AgentChatPopup;
