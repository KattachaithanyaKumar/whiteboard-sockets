import { FaRegHandPaper } from "react-icons/fa";
import { TfiText } from "react-icons/tfi";
import { FaPencil } from "react-icons/fa6";
import { useState } from "react";
import TextBox from "./components/TextBox";

const App = () => {
  const [toolSelected, setToolSelected] = useState(0); 
  const [textBoxes, setTextBoxes] = useState([]); 

  // Handle workspace click
  const handleClick = (e) => {
    e.preventDefault();
    const { clientX, clientY } = e;

    if (toolSelected === 1) {
      setTextBoxes((prevBoxes) => [
        ...prevBoxes,
        { x: clientX, y: clientY, id: Date.now() },
      ]);
      setToolSelected(0); 
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
        <div
          className={`tool ${toolSelected === 0 && "tool-selected"}`}
          onClick={() => setToolSelected(0)}
        >
          <FaRegHandPaper size={32} />
        </div>
        <div
          className={`tool ${toolSelected === 1 && "tool-selected"}`}
          onClick={() => setToolSelected(1)}
        >
          <TfiText size={32} />
        </div>
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
