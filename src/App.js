import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';  
import Chat from './Chat';

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || 'https://hatbot-backend.onrender.com';

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  const joinRoom = () => {
    if (username.trim() !== '' && room.trim() !== '' && socket) {
      socket.emit('join_room', room);
      setHasJoinedRoom(true);
    }
  };

  return (

    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-black p-4 overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        <div className="animate-meteor absolute top-10 left-1/4 w-1 h-1 bg-white rounded-full shadow-lg"></div>
        <div className="animate-meteor delay-1000 absolute top-20 left-1/3 w-1 h-1 bg-white rounded-full shadow-lg"></div>
        <div className="animate-meteor delay-2000 absolute top-40 left-2/3 w-1 h-1 bg-white rounded-full shadow-lg"></div>
      </div>

      {!hasJoinedRoom ? (

        <div className="z-10 bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-[0_20px_50px_rgba(255,255,255,0.2)] max-w-xl w-full border border-white/30 animate-float ">

          <h4 className="text-2xl font-bold text-fuchsia-100  font-serif mb-6 text-center drop-shadow-md tracking-wider">
            Enter the Galaxy Chat
          </h4>
          <input
            className="w-full p-3 mb-4 rounded-xl bg-white/70 placeholder-gray-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-md"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full p-3 mb-4 rounded-xl bg-white/70 placeholder-gray-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-md"
            placeholder="Enter room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button
            onClick={joinRoom}
            className="w-full bg-gradient-to-r from-pink-400 to-purple-500  font-bold py-3 rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg hover:ring-4 hover:ring-fuchsia-200
"
          >
           🚀 Launch Into Chat
          </button>
        </div>
      ) : (
        socket && <Chat socket={socket} username={username} room={room} hasJoinedRoom={hasJoinedRoom} />
      )}
    </div>
  );
}

export default App;
