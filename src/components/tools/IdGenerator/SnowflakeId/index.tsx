import React, {useState, useEffect} from 'react';
import {
  Box,
  Button,
  TextField,
  Container,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
} from '@mui/material';
import {Snowflake} from '@sapphire/snowflake';
import Translate, {translate} from "@docusaurus/Translate";

export default function SnowflakePage() {
  const [nanoidList, setNanoIDList] = useState<string[]>([]);
  const [epoch, setEpoch] = useState<string>('2020-01-01'); // Epoch 时间
  const [count, setCount] = useState<number>(1); // 生成数量
  const [workerId, setWorkerId] = useState<number>(0); // Worker ID
  const [processId, setProcessId] = useState<number>(1); // Process ID
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Auto-generate Snowflakes when the page loads
  useEffect(() => {
    generateSnowflakes();
  }, []);

  const generateSnowflakes = () => {
    const epochDate = new Date(epoch);
    const snowflakeGenerator = new Snowflake(epochDate);

    const newNanoIDList: string[] = [];
    for (let i = 0; i < count; i++) {
      const snowflake = snowflakeGenerator.generate({
        timestamp: Date.now(),
        workerId: BigInt(workerId),  // Convert number to bigint
        processId: BigInt(processId)
      });
      newNanoIDList.push(snowflake.toString());
    }

    setNanoIDList(newNanoIDList);
  };

  const copyToClipboard = async (nanoID: string) => {
    try {
      await navigator.clipboard.writeText(nanoID);
      setSnackbarSeverity('success');
      setSnackbarMessage(translate({message: 'Snowflake 复制成功！'}));
    } catch (error) {
      console.error('复制失败:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage(translate({message: '复制失败，请重试。'}));
    } finally {
      setSnackbarOpen(true);
    }
  };

  const copyAllToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(nanoidList.join('\n'));
      setSnackbarSeverity('success');
      setSnackbarMessage(translate({message: '所有 Snowflake 复制成功！'}));
    } catch (error) {
      console.error('批量复制失败:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage(translate({message: '批量复制失败，请重试。'}));
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleGenerate = () => {
    generateSnowflakes();
  };

  return (
    <Container maxWidth="lg" sx={{padding: 4}}>
      <Grid container spacing={2}>
        <Grid size={{xs: 12, md: 6, lg: 4}}>
          {/* Snackbar for copy success or error */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
              sx={{width: '100%'}}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>

          <Box sx={{padding: 2, border: '1px solid #ddd', borderRadius: '8px', marginBottom: 4}}>
            <Typography variant="h6" gutterBottom>
              <Translate>Snowflake 配置</Translate>
            </Typography>

            {/* Epoch Input */}
            <TextField
              value={epoch}
              onChange={(e) => setEpoch(e.target.value)}
              label={translate({message: "Epoch 时间"})}
              fullWidth
              variant="outlined"
              sx={{marginBottom: 2}}
            />

            {/* Worker ID Input */}
            <TextField
              type="number"
              value={workerId}
              onChange={(e) => setWorkerId(Number(e.target.value))}
              label="Worker ID"
              fullWidth
              variant="outlined"
              sx={{marginBottom: 2}}
            />

            {/* Process ID Input */}
            <TextField
              type="number"
              value={processId}
              onChange={(e) => setProcessId(Number(e.target.value))}
              label="Process ID"
              fullWidth
              variant="outlined"
              sx={{marginBottom: 2}}
            />

            {/* Count Input */}
            <TextField
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              label={translate({message: "生成个数"})}
              fullWidth
              variant="outlined"
              sx={{marginBottom: 2}}
            />

            {/* Generate Button */}
            <Button variant="contained" color="primary" fullWidth onClick={handleGenerate}>
              <Translate>
                生成 Snowflakes
              </Translate>
            </Button>
          </Box>
        </Grid>
        <Grid size={{xs: 12, md: 6, lg: 8}}>
          <Box sx={{padding: 2, border: '1px solid #ddd', borderRadius: '8px'}}>
            {/* Batch Copy Button */}
            <Button
              variant="outlined"
              color="secondary"
              sx={{marginBottom: 2}}
              fullWidth
              onClick={copyAllToClipboard}
            >
              <Translate>批量复制所有 Snowflake</Translate>
            </Button>

            {/* Display Snowflakes List */}
            <div>
              {nanoidList.map((nanoID, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}
                >
                  <TextField
                    value={nanoID}
                    fullWidth
                    variant="outlined"
                    onClick={() => copyToClipboard(nanoID)}
                    InputProps={{
                      style: {cursor: 'pointer'},
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => copyToClipboard(nanoID)}
                    sx={{marginLeft: 2}}
                  >
                    <Translate>复制</Translate>
                  </Button>
                </Box>
              ))}
            </div>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
