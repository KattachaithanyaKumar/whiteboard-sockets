import { useState, useRef, useEffect, useContext } from "react";
import { SocketContext } from "./App";
import { FaRegHandPaper } from "react-icons/fa";
import { TfiText } from "react-icons/tfi";
import { FaPencil } from "react-icons/fa6";
import { TbPointer } from "react-icons/tb";
import TextBox from "./components/TextBox";
import { useParams } from "react-router-dom";

const Board = () => {
  const socket = useContext(SocketContext);
  const [toolSelected, setToolSelected] = useState(0);
  const [textBoxes, setTextBoxes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [lastPosition, setLastPosition] = useState(null);
  const [cursors, setCursors] = useState({});

  const { roomId } = useParams();

  // console.log("Room Id: " + roomId);

  // Initialize the canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctxRef.current = ctx;
  }, []);

  // Emit cursor position
  const handleMouseMove = (e) => {
    if (toolSelected === 0) {
      const position = { x: e.clientX, y: e.clientY };
      console.log("current: ", position);

      socket.emit("cursor-move", { roomId, position });
    }
    if (!isDrawing || toolSelected !== 3) return;

    const ctx = ctxRef.current;
    const { x, y } = lastPosition;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  // Listen for cursor updates
  useEffect(() => {
    socket.on("cursor-update", ({ id, position }) => {
      // console.log("other cursor: ", position);

      setCursors((prev) => ({ ...prev, [id]: position }));
    });

    socket.on("disconnect", (id) => {
      setCursors((prev) => {
        const updatedCursors = { ...prev };
        delete updatedCursors[id];
        return updatedCursors;
      });
    });

    return () => {
      socket.off("cursor-update");
      socket.off("disconnect");
    };
  }, [socket]);

  const handleClick = (e) => {
    if (toolSelected === 2) {
      setTextBoxes((prevBoxes) => [
        ...prevBoxes,
        { x: e.clientX, y: e.clientY, id: Date.now() },
      ]);
      setToolSelected(0);
    }
  };

  const handleMouseDown = (e) => {
    if (toolSelected === 3) {
      setIsDrawing(true);
      setLastPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    if (toolSelected === 3) {
      setIsDrawing(false);
      setLastPosition(null);
    }
  };

  const removeTextBox = (id) => {
    setTextBoxes((prevTextBoxes) =>
      prevTextBoxes.filter((textbox) => textbox.id !== id)
    );
  };

  return (
    <div
      className={`app ${toolSelected === 1 && "grab"}`}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        className="canvas"
        style={{ pointerEvents: toolSelected === 2 ? "none" : "auto" }}
      ></canvas>
      <div className="workspace" onClick={handleClick}>
        {textBoxes.map((box) => (
          <TextBox
            key={box.id}
            x={box.x}
            y={box.y}
            toolSelected={toolSelected}
            onDelete={() => removeTextBox(box.id)}
          />
        ))}
        {Object.entries(cursors).map(([id, position]) => (
          <div
            key={id}
            className="cursor"
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
              pointerEvents: "none",
            }}
          >
            <div className="cursor-dot" />
            {/* <span>{id}</span> */}
          </div>
        ))}
      </div>
      <div className="toolbar">
        <div
          className={`tool ${toolSelected === 0 && "tool-selected"}`}
          onClick={() => setToolSelected(0)}
        >
          <TbPointer size={32} />
        </div>
        <div
          className={`tool ${toolSelected === 1 && "tool-selected"}`}
          onClick={() => setToolSelected(1)}
        >
          <FaRegHandPaper size={32} />
        </div>
        <div
          className={`tool ${toolSelected === 2 && "tool-selected"}`}
          onClick={() => setToolSelected(2)}
        >
          <TfiText size={32} />
        </div>
        <div
          className={`tool ${toolSelected === 3 && "tool-selected"}`}
          onClick={() => setToolSelected(3)}
        >
          <FaPencil size={32} />
        </div>
      </div>
    </div>
  );
};

export default Board;
