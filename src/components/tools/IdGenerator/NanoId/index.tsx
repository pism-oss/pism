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
import {customAlphabet, nanoid} from 'nanoid';
import Translate, {translate} from "@docusaurus/Translate";
import DocCard from "@theme/DocCard";

export default function NanoID() {
  const [nanoidList, setNanoIDList] = useState<string[]>([]);
  const [customAlphabetStr, setCustomAlphabetStr] = useState('');
  const [length, setLength] = useState(21);
  const [uppercase, setUppercase] = useState(false);
  const [count, setCount] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Auto-generate NanoID when the page loads
  useEffect(() => {
    generateNanoIDs();
  }, []);

  const generateNanoIDs = () => {
    const newNanoIDList: string[] = [];
    const nanoIDGenerator = customAlphabetStr
      ? customAlphabet(customAlphabetStr, length)
      : () => nanoid(length);

    for (let i = 0; i < count; i++) {
      let newNanoID = nanoIDGenerator();

      newNanoID = uppercase ? newNanoID.toUpperCase() : newNanoID.toLowerCase();

      newNanoIDList.push(newNanoID);
    }
    setNanoIDList(newNanoIDList);
  };

  const copyToClipboard = async (nanoID: string) => {
    try {
      await navigator.clipboard.writeText(nanoID);
      setSnackbarSeverity('success');
      setSnackbarMessage(translate({message: 'NanoID 复制成功！'}));
    } catch (error) {
      console.error(translate({message: '复制失败:'}), error);
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
      setSnackbarMessage(translate({message: '所有 NanoID 复制成功！'}));
    } catch (error) {
      console.error(translate({message: '批量复制失败:'}), error);
      setSnackbarSeverity('error');
      setSnackbarMessage(translate({message: '批量复制失败，请重试。'}));
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleGenerate = () => {
    generateNanoIDs();
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
              <Translate>
                NanoID 配置
              </Translate>
            </Typography>

            {/* Custom Alphabet Input */}
            <TextField
              value={customAlphabetStr}
              onChange={(e) => setCustomAlphabetStr(e.target.value)}
              label={translate({message: "自定义字符集"})}
              fullWidth
              variant="outlined"
              sx={{marginBottom: 2}}
            />

            {/* Length Input */}
            <TextField
              type="number"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              label={translate({message: "ID 长度"})}
              fullWidth
              variant="outlined"
              sx={{marginBottom: 2}}
            />

            {/* Uppercase Checkbox */}
            <FormControlLabel
              control={<Checkbox checked={uppercase} onChange={() => setUppercase(!uppercase)}/>}
              label="转为大写"
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
              <Translate>生成 NanoIDs</Translate>
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
              <Translate>
                批量复制所有 NanoID
              </Translate>
            </Button>

            {/* Display NanoIDs List */}
            <Stack spacing={2}>
              {nanoidList.map((nanoID, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <TextField
                    value={nanoID}
                    fullWidth
                    variant="outlined"
                    onClick={() => copyToClipboard(nanoID)}
                    InputProps={{
                      style: {cursor: 'pointer'}
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => copyToClipboard(nanoID)}
                    sx={{marginLeft: 2}}
                  >
                    <Translate>
                      复制
                    </Translate>
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