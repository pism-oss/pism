import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { Container, Tabs, Tab, Box, Alert, LinearProgress, Typography } from '@mui/material';
import Submit from '@site/src/components/tools/Icey/Submit';
import Query from '@site/src/components/tools/Icey/Query';
import Delete from '@site/src/components/tools/Icey/Delete';

export default function IceyPage() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleTabChange = (_event, newValue) => {
    setTabValue(newValue);
    setAlert(null);
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <Layout 
      title="冰鉴"
      description="冰鉴 - 全加密应用工具"
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
        
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

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
