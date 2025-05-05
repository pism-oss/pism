import React, {useState} from 'react';
import {Dialog, DialogContent, IconButton, Box, Button} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {translate} from "@docusaurus/Translate";

interface FullScreenWrapperProps {
  children: React.ReactNode;
  height?: string | number; // 支持 300、'300px'、'50%' 等
  btn?: string,
  btns?: React.ReactNode
}

const FullScreenWrapper = ({
                             children,
                             height = '300px',
                             btn = translate({message: '进入全屏'}),
                             btns
                           }: FullScreenWrapperProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 原始区域展示 */}
      <Box
        sx={{
          height,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #ccc',
          borderRadius: 2,
          p: 2,
        }}
      >
        {children}
      </Box>
      <Box mt={1}>
        <Button
          size="small"
          onClick={() => setOpen(true)}
        >
          {btn}
        </Button>
        {btns}
      </Box>


      {/* 全屏 Dialog 展示 */}
      <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => setOpen(false)}
          sx={{position: 'absolute', top: 16, right: 16, zIndex: 1301}}
        >
          <CloseIcon/>
        </IconButton>

        <DialogContent sx={{mt: 4}}>
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FullScreenWrapper;
