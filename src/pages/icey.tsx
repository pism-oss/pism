import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { Container, Tabs, Tab, Box, LinearProgress, Typography, Backdrop, CircularProgress, Snackbar, Alert } from '@mui/material';
import Submit from '@site/src/components/tools/Icey/Submit';
import Query from '@site/src/components/tools/Icey/Query';
import Delete from '@site/src/components/tools/Icey/Delete';

export default function IceyPage() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, type: 'success', message: '' });

  const handleTabChange = (_event, newValue) => {
    setTabValue(newValue);
  };

  const showAlert = (type, message) => {
    setSnackbar({ open: true, type, message });
    setTimeout(() => setSnackbar(s => ({ ...s, open: false })), 3000);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.detail && e.detail.type && e.detail.message) {
        showAlert(e.detail.type, e.detail.message);
      }
    };
    window.addEventListener('global-toast', handler);
    return () => window.removeEventListener('global-toast', handler);
  }, []);

  return (
    <Layout 
      title="冰鉴"
      description="冰鉴 - 全加密应用工具"
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          冰鉴
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          全加密应用工具
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="提交内容" />
            <Tab label="查询内容" />
            <Tab label="删除内容" />
          </Tabs>
        </Box>

        {loading && <LinearProgress sx={{ mb: 2 }} />}
        
        <Snackbar
          open={snackbar.open}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          autoHideDuration={3000}
        >
          <Alert severity={snackbar.type} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Box hidden={tabValue !== 0}>
          <Submit onAlert={showAlert} loading={loading} setLoading={setLoading} />
        </Box>
        
        <Box hidden={tabValue !== 1}>
          <Query onAlert={showAlert} loading={loading} setLoading={setLoading} />
        </Box>
        
        <Box hidden={tabValue !== 2}>
          <Delete onAlert={showAlert} loading={loading} setLoading={setLoading} />
        </Box>
      </Container>
    </Layout>
  );
}
