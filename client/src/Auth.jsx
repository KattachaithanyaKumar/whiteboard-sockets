import { Button, Input } from "antd";
import { useContext, useState } from "react";
import { SocketContext } from "./App";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const socket = useContext(SocketContext);
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (name && roomId) {
      socket.emit("join", { name, roomId });
      navigate(`/board/${roomId}`);
    }
  };

  return (
    <form className="auth" onSubmit={(e) => e.preventDefault()}>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        size="large"
        addonBefore="Name"
      />
      <Input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        size="large"
        addonBefore="Room"
      />
      <Button type="primary" onClick={handleLogin}>
        Go
      </Button>
    </form>
  );
};

export default Auth;
