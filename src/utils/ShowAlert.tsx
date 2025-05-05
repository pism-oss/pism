import {createRoot} from 'react-dom/client';
import {Alert, Snackbar} from '@mui/material';
import React, {useEffect, useState} from 'react';

export function showGlobalAlert(
  message: string,
  severity: 'success' | 'info' | 'warning' | 'error' = 'success',
  duration = 3000
) {
  if (typeof window === 'undefined') return;

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  const AlertWrapper = () => {
    const [open, setOpen] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setOpen(false), duration);
      return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
      setOpen(false);
    };

    useEffect(() => {
      if (!open) {
        setTimeout(() => {
          root.unmount();
          if (container.parentNode) {
            container.parentNode.removeChild(container);
          }
        }, 300); // 等待 Snackbar 动画完成后移除
      }
    }, [open]);

    return (
      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <Alert onClose={handleClose} severity={severity} sx={{width: '100%'}}>
          {message}
        </Alert>
      </Snackbar>
    );
  };

  root.render(<AlertWrapper/>);
}
