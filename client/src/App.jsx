/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import Auth from "./Auth";
import Board from "./Board";

// Create a context for the socket
export const SocketContext = createContext();

const App = () => {
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server with id:", newSocket.id);
      setLoading(false);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      newSocket.close(); // Cleanup on unmount
    };
  }, []);

  if (loading) {
    return <div className="app">Loading...</div>;
  }

  return (
    <SocketContext.Provider value={socket}>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/board/:roomId" element={<Board />} />
          </Routes>
        </BrowserRouter>
      </div>
    </SocketContext.Provider>
  );
};

export default App;
