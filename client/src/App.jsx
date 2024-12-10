import { FaRegHandPaper } from "react-icons/fa";
import { TfiText } from "react-icons/tfi";
import { FaPencil } from "react-icons/fa6";
import { useState } from "react";
import TextBox from "./components/TextBox";

const App = () => {
  const [toolSelected, setToolSelected] = useState(0); // Tracks which tool is selected
  const [textBoxes, setTextBoxes] = useState([]); // Stores the positions of the textboxes

  // Handle workspace click
  const handleClick = (e) => {
    e.preventDefault();
    const { clientX, clientY } = e;

    if (toolSelected === 1) {
      // If text tool is selected
      // Add a new text box at the clicked position
      setTextBoxes((prevBoxes) => [
        ...prevBoxes,
        { x: clientX, y: clientY, id: Date.now() },
      ]);
      setToolSelected(0); // Reset tool selection after placing the text box
    }
  };

  return (
    <div className={`app ${toolSelected === 0 && "grab"}`}>
      <div className="workspace" onClick={handleClick}>
        {textBoxes.map((box) => (
          <TextBox key={box.id} x={box.x} y={box.y} />
        ))}
      </div>
      <div className="toolbar">
        {/* Grab tool */}
        <div
          className={`tool ${toolSelected === 0 && "tool-selected"}`}
          onClick={() => setToolSelected(0)}
        >
          <FaRegHandPaper size={32} />
        </div>
        {/* Text tool */}
        <div
          className={`tool ${toolSelected === 1 && "tool-selected"}`}
          onClick={() => setToolSelected(1)}
        >
          <TfiText size={32} />
        </div>
        {/* Pencil tool */}
        <div
          className={`tool ${toolSelected === 2 && "tool-selected"}`}
          onClick={() => setToolSelected(2)}
        >
          <FaPencil size={32} />
        </div>
      </div>
    </div>
  );
};

export default App;
