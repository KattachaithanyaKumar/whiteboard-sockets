import { useState, useRef, useEffect } from "react";
import { FaEdit } from "react-icons/fa";

const TextBox = (props) => {
  // eslint-disable-next-line react/prop-types
  const { x, y } = props;
  const [value, setValue] = useState("");
  const [option, setOption] = useState("edit");
  const [isFocused, setIsFocused] = useState(true); // State to track if the textbox is focused

  const textboxRef = useRef(null);
  const textAreaRef = useRef(null); // Reference for the textarea

  // Automatically focus the textarea when the component is created
  useEffect(() => {
    if (option === "edit" && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [option]);

  // Show the edit panel when the textbox is clicked
  const handleTextboxClick = () => {
    setIsFocused(true);
  };

  // Hide the edit panel when clicking outside the textbox
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (textboxRef.current && !textboxRef.current.contains(event.target)) {
        setIsFocused(false); // Hide the edit panel when clicked outside
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

  // Update textarea height dynamically based on content
  const handleChange = (e) => {
    setValue(e.target.value);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset height before recalculating
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Adjust height based on content
    }
  };

  // Render content with line breaks in view mode
  const renderContentWithBreaks = (content) => {
    return content.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div
      className="textbox"
      style={{
        position: "absolute",
        left: `${x - 50}px`,
        top: `${y - 25}px`,
      }}
      ref={textboxRef}
      onClick={handleTextboxClick} // Show the edit panel when clicked
    >
      <div>
        {option === "edit" ? (
          <textarea
            ref={textAreaRef} // Use the ref for the textarea
            onChange={handleChange}
            value={value}
            style={{ overflow: "hidden", resize: "none" }} // Prevent resizing by user
          ></textarea>
        ) : (
          <p
            style={{
              border: `1px solid ${isFocused ? "#7c7c7c" : "white"}`,
            }}
          >
            {renderContentWithBreaks(value)}
          </p>
        )}
      </div>

      {/* Only show the edit panel if the textbox is focused */}
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
        </div>
      )}
    </div>
  );
};

export default TextBox;
