import React, {useState, useEffect} from 'react';
import {
  Box,
  Button,
  TextField,
  Container,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import {v4 as uuidv4, v1 as uuidv1} from 'uuid';
import Translate, {translate} from "@docusaurus/Translate";

export default function UUID() {
  const [uuidList, setUuidList] = useState<string[]>([]);
  const [uuidVersion, setUuidVersion] = useState('v4');
  const [uppercase, setUppercase] = useState(false);
  const [removeHyphens, setRemoveHyphens] = useState(false);
  const [count, setCount] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Auto-generate UUID when the page loads
  useEffect(() => {
    generateUUIDs();
  }, []);

  const generateUUIDs = () => {
    const newUuidList: string[] = [];
    for (let i = 0; i < count; i++) {
      let newUuid = uuidVersion === 'v4' ? uuidv4() : uuidv1();

      if (removeHyphens) {
        newUuid = newUuid.replace(/-/g, '');
      }

      if (uppercase) {
        newUuid = newUuid.toUpperCase();
      } else {
        newUuid = newUuid.toLowerCase();
      }

      newUuidList.push(newUuid);
    }
    setUuidList(newUuidList);
  };

  const copyToClipboard = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setSnackbarSeverity('success');
      setSnackbarMessage(translate({message: 'UUID 复制成功！'}));
    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage(translate({message: '复制失败，请重试。'}));
    } finally {
      setSnackbarOpen(true);
    }
  };

  const copyAllToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uuidList.join('\n'));
      setSnackbarSeverity('success');
      setSnackbarMessage(translate({message: '所有 UUID 复制成功！'}));
    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage(translate({message: '批量复制失败，请重试。'}));
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleGenerate = () => {
    generateUUIDs();
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
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{width: '100%'}}>
              {snackbarMessage}
            </Alert>
          </Snackbar>

          <Box sx={{padding: 2, border: '1px solid #ddd', borderRadius: '8px', marginBottom: 4}}>
            <Typography variant="h6" gutterBottom>
              <Translate>UUID 配置</Translate>
            </Typography>

            {/* UUID Version */}
            <FormControl fullWidth sx={{marginBottom: 2}}>
              <InputLabel><Translate>UUID 版本</Translate></InputLabel>
              <Select
                value={uuidVersion}
                onChange={(e) => setUuidVersion(e.target.value)}
                label={translate({message: "UUID 版本"})}
              >
                <MenuItem value="v4"><Translate>v4 (随机生成)</Translate></MenuItem>
                <MenuItem value="v1"><Translate>v1 (基于时间戳)</Translate></MenuItem>
              </Select>
            </FormControl>

            {/* Uppercase Checkbox */}
            <FormControlLabel
              control={<Checkbox checked={uppercase} onChange={() => setUppercase(!uppercase)}/>}
              label={translate({message: "转为大写"})}
            />

            {/* Remove Hyphens Checkbox */}
            <FormControlLabel
              control={<Checkbox checked={removeHyphens} onChange={() => setRemoveHyphens(!removeHyphens)}/>}
              label={translate({message: "删除连接符"})}
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
              <Translate>生成 UUIDs</Translate>
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
              <Translate>批量复制所有 UUID</Translate>
            </Button>

            {/* Display UUIDs List */}
            <Stack spacing={2}>
              {uuidList.map((uuid, index) => (
                <Box key={index} sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <TextField
                    value={uuid}
                    fullWidth
                    variant="outlined"
                    onClick={() => copyToClipboard(uuid)}
                    InputProps={{
                      style: {cursor: 'pointer'},
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => copyToClipboard(uuid)}
                    sx={{marginLeft: 2}}
                  >
                    <Translate>复制</Translate>
                  </Button>
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>


    </Container>
  );
}
