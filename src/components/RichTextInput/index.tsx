import React, { useState, useRef } from "react";
import { Box, Chip } from "@mui/material";
import { render } from "react-dom";
import { createRoot } from "react-dom/client";
import './index.css';

const RichTextInput = () => {
  const inputRef = useRef(null);
  const [inputContent, setInputContent] = useState("");

  const handleInput = (event) => {
    const content = event.target.innerHTML;
    setInputContent(content);

    const regex = /\${([^}]*)}/g;
    let match;
    while ((match = regex.exec(content))!== null) {
      const range = window.getSelection()?.getRangeAt(0);
      if (range) {
        const chipElement = document.createElement("span");
        chipElement.classList.add("chip-container");
        const reactRoot = document.createElement("div");
        chipElement.appendChild(reactRoot);

        const handleDelete = () => {
          chipElement.remove();
          setInputContent(inputRef.current.innerHTML);
        };

        const root = createRoot(reactRoot);
        root.render(
          <Chip
            label={match[1]}
            variant="outlined"
            onDelete={handleDelete}
          />
        );

        const startIndex = match.index;
        const endIndex = startIndex + match[0].length;
        const beforeContent = content.slice(0, startIndex);
        const afterContent = content.slice(endIndex);
        const newContent = beforeContent + chipElement.outerHTML + afterContent;
        setInputContent(newContent);
        inputRef.current.innerHTML = newContent;
      }
    }
  };

  return (
    <Box>
      <div
        ref={inputRef}
        contentEditable
        onInput={handleInput}
        className="input-field"
        dangerouslySetInnerHTML={{ __html: inputContent }}
      ></div>
    </Box>
  );
};

export default RichTextInput;