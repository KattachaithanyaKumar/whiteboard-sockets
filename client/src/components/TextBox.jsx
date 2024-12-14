import { useState, useRef, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

const TextBox = (props) => {
  // eslint-disable-next-line react/prop-types
  const { x, y, toolSelected, onDelete } = props;
  const [value, setValue] = useState("");
  const [option, setOption] = useState("edit");
  const [isFocused, setIsFocused] = useState(true);

  const [position, setPosition] = useState({ x: x, y: y });
  const [isDragging, setIsDragging] = useState(false);

  const textboxRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (toolSelected === 0 && option === "edit" && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [option, toolSelected]);

  const handleTextboxClick = () => {
    if (toolSelected === 0) {
      setIsFocused(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (textboxRef.current && !textboxRef.current.contains(event.target)) {
        setIsFocused(false);
        setOption("view");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleButtonClick = () => {
    setOption(option === "edit" ? "view" : "edit");
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Automatically delete if value is empty
    if (newValue.trim() === "" && onDelete) {
      onDelete();
    }

    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  const renderContentWithBreaks = (content) => {
    return content.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  const handleDoubleClick = () => {
    if (option === "view") {
      setOption("edit");
    }
  };

  // Dragging Handlers
  const handleDragStart = () => {
    if (option === "view" && toolSelected === 0) {
      setIsDragging(true);
    }
  };

  const handleDragMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);

    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging]);

  const handleDelete = () => {
    // if (onDelete) {
    onDelete();
    // }
  };

  return (
    <div
      className="textbox"
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%)`,
        cursor: option === "view" ? "move" : "default",
      }}
      ref={textboxRef}
      onMouseDown={handleDragStart}
      onClick={handleTextboxClick}
      onDoubleClick={handleDoubleClick}
    >
      <div>
        {option === "edit" ? (
          <textarea
            ref={textAreaRef}
            onChange={handleChange}
            value={value}
            style={{ overflow: "hidden", resize: "none" }}
          ></textarea>
        ) : (
          <p className={isFocused ? "focused" : ""}>
            {renderContentWithBreaks(value)}
          </p>
        )}
      </div>

      {isFocused && (
        <div className="edit-panel">
          <button
            className="tool"
            onClick={handleButtonClick}
            aria-label={
              option === "edit" ? "Switch to view mode" : "Switch to edit mode"
            }
          >
            <FaEdit />
          </button>

          <button className="tool" onClick={handleDelete}>
            <MdOutlineDelete />
          </button>
        </div>
      )}
    </div>
  );
};

export default TextBox;
