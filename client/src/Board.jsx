import { FaRegHandPaper } from "react-icons/fa";
import { TfiText } from "react-icons/tfi";
import { FaPencil } from "react-icons/fa6";
import { TbPointer } from "react-icons/tb";
import { useState, useRef, useEffect } from "react";
import TextBox from "./components/TextBox";

const Board = () => {
  const [toolSelected, setToolSelected] = useState(0);
  const [textBoxes, setTextBoxes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [lastPosition, setLastPosition] = useState(null);

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

  // Handle workspace click for text boxes
  const handleClick = (e) => {
    e.preventDefault();
    const { clientX, clientY } = e;

    if (toolSelected === 2) {
      setTextBoxes((prevBoxes) => [
        ...prevBoxes,
        { x: clientX, y: clientY, id: Date.now() },
      ]);
      setToolSelected(0);
    }
  };

  // Start drawing
  const handleMouseDown = (e) => {
    if (toolSelected === 3) {
      setIsDrawing(true);
      setLastPosition({ x: e.clientX, y: e.clientY });
    }
  };

  // Draw on the canvas
  const handleMouseMove = (e) => {
    if (!isDrawing || toolSelected !== 3) return;

    const ctx = ctxRef.current;
    const { x, y } = lastPosition;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  // Stop drawing
  const handleMouseUp = () => {
    if (toolSelected === 3) {
      setIsDrawing(false);
      setLastPosition(null);
    }
  };

  const removeTextBox = (id) => {
    setTextBoxes((prevTextBoxes) => prevTextBoxes.filter((textbox) => textbox.id !== id));
  };
  

  return (
    <div
      className={`app ${toolSelected === 1 && "grab"}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
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