import React, { useState, useRef } from "react";
import { Box, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, Typography, IconButton } from "@mui/material";
import { createRoot } from "react-dom/client";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import './index.css';

const RichTextInput = () => {
  const inputRef = useRef(null);
  const [inputContent, setInputContent] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);

  const handleInput = (event) => {
    const content = event.target.innerHTML;
    setInputContent(content);

    const regex = /\${([^}]*)}/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
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

  const handleHelpOpen = () => {
    setHelpOpen(true);
  };

  const handleHelpClose = () => {
    setHelpOpen(false);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          需要验证码？
        </Typography>
        <IconButton
          size="small"
          onClick={handleHelpOpen}
          sx={{ ml: 0.5 }}
        >
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
      <div
        ref={inputRef}
        contentEditable
        onInput={handleInput}
        className="input-field"
        dangerouslySetInnerHTML={{ __html: inputContent }}
      />
      <Dialog
        open={helpOpen}
        onClose={handleHelpClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          如何获取验证码
        </DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <Box sx={{ mb: 2 }}>
              请按以下步骤获取验证码：
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <img 
                src="/img/wechat_qr_code.png" 
                alt="PISM 公众号二维码"
                style={{ 
                  width: '200px',
                  height: '200px',
                  objectFit: 'contain'
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                1. 扫描上方二维码关注 PISM 公众号<br />
                2. 发送 "PISM验证码" 获取验证码<br />
                3. 将收到的验证码输入到输入框中
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RichTextInput;