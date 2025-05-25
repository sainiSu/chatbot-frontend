import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';  // use named import for socket.io-client
import Chat from './Chat';

// Updated: Use environment variable for backend URL (better practice)
const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || 'https://hatbot-backend.onrender.com';

// Updated: Initialize socket inside the component or in useEffect to avoid stale connections and duplicate sockets
function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Create socket connection only once when component mounts
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    setSocket(newSocket);

    // Cleanup socket connection on unmount
    return () => newSocket.disconnect();
  }, []);

  const joinRoom = () => {
    if (username.trim() !== '' && room.trim() !== '' && socket) {
      socket.emit('join_room', room);
      setHasJoinedRoom(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-50 via-blue-200 to-sky-200 p-4">
      {!hasJoinedRoom ? (
        <div className="bg-white/30 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-full border border-white/20">
          <h2 className="text-3xl font-bold text-black mb-6 text-center drop-shadow-md">🎧 Join a Chat Room</h2>
          <input
            className="w-full p-3 mb-4 rounded-xl bg-white/80 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white shadow-md"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full p-3 mb-4 rounded-xl bg-white/80 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white shadow-md"
            placeholder="Enter room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button
            onClick={joinRoom}
            className="w-full bg-white text-purple-700 font-bold py-3 rounded-xl hover:bg-pink-100 transition duration-300 shadow-lg"
          >
            Join Room
          </button>
        </div>
      ) : (
        // Pass socket only if initialized
        socket && <Chat socket={socket} username={username} room={room} hasJoinedRoom={hasJoinedRoom} />
      )}
    </div>
  );
}

export default App;
