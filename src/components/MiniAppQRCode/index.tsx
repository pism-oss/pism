import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const MiniAppQRCode: React.FC = () => {
  return (
    <Paper elevation={2} sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mt: 4,
      p: 2,
      background: '#fafbfc',
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <Box
        component="img"
        src="/img/mini_app_code/index.jpg"
        alt="PISM 小程序二维码"
        sx={{ width: 180, height: 180, borderRadius: 2, mb: 1.5 }}
      />
      <Typography variant="subtitle1" color="text.secondary" align="center">
        手机微信扫码，体验 PISM 小程序<br />
        <Box component="span" sx={{ color: '#f44336', fontWeight: 500 }}>建议在手机上使用</Box>
      </Typography>
    </Paper>
  );
};

export default MiniAppQRCode; 