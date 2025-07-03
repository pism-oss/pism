import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  ClickAwayListener
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface VerificationCodeInputProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  title?: string;
  submitText?: string;
  cancelText?: string;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  open,
  onClose,
  onSubmit,
  title = '输入验证码',
  submitText = '确认',
  cancelText = '取消'
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { defaultMatches: true });
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Close tooltip when dialog closes
  useEffect(() => {
    if (!open) {
      setTooltipOpen(false);
      setHelpDialogOpen(false);
    }
  }, [open]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const handleTooltipClose = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    tooltipTimeoutRef.current = setTimeout(() => {
      setTooltipOpen(false);
    }, 300);
  };

  const handleSubmit = () => {
    onSubmit(verificationCode);
    setVerificationCode('');
  };

  const handleClose = () => {
    onClose();
    setVerificationCode('');
  };

  const HelpContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          1. 关注微信公众号：PISM
        </Typography>
        <Typography variant="body2" color="text.secondary">
          2. 发送 "主题+验证码" 获取验证码
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, color: 'primary.main' }}>
          例如：发送 "PISM验证码" 获取验证码
        </Typography>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}>
        <img 
          src={isMobile ? "/img/wechat_qr.jpg" : "/img/wechat_qr_code.png"}
          alt="PISM 公众号二维码"
          style={{ 
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '4px'
          }}
        />
      </Box>
    </Box>
  );

  const TooltipContent = () => (
    <Paper 
      sx={{ 
        p: 2, 
        width: 400,
        maxWidth: '90vw',
      }}
      onMouseEnter={() => {
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
        }
        setTooltipOpen(true);
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        如何获取验证码？
      </Typography>
      <HelpContent />
    </Paper>
  );

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="xs"
        fullWidth={isMobile}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : '320px',
          }
        }}
      >
                      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {title}
          {isMobile ? (
            <IconButton
              size="small"
              onClick={() => setHelpDialogOpen(true)}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(25, 118, 210, 0.04)' 
                }
              }}
            >
              <HelpOutlineIcon fontSize="small" color="primary" />
            </IconButton>
          ) : (
            <ClickAwayListener onClickAway={() => setTooltipOpen(false)}>
              <div>
                <Tooltip
                  open={tooltipOpen}
                  onClose={handleTooltipClose}
                  title={<TooltipContent />}
                  placement="right"
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'background.paper',
                        '& .MuiTooltip-arrow': {
                          color: 'background.paper',
                        },
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        width: '420px !important',
                        maxWidth: '90vw !important'
                      }
                    }
                  }}
                >
                  <IconButton
                    size="small"
                    onMouseEnter={() => setTooltipOpen(true)}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'rgba(25, 118, 210, 0.04)' 
                      }
                    }}
                  >
                    <HelpOutlineIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </div>
            </ClickAwayListener>
          )}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="验证码"
            type="text"
            fullWidth
            variant="outlined"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="请输入6位数字验证码"
            inputProps={{ 
              maxLength: 6,
              style: { textAlign: 'center', letterSpacing: '0.5em' }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{cancelText}</Button>
          <Button onClick={handleSubmit} variant="contained">{submitText}</Button>
        </DialogActions>
      </Dialog>

      {/* 移动端帮助对话框 */}
      <Dialog
        open={helpDialogOpen && isMobile}
        onClose={() => setHelpDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          如何获取验证码？
        </DialogTitle>
        <DialogContent>
          <HelpContent />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpDialogOpen(false)} variant="contained" fullWidth>
            我知道了
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VerificationCodeInput;