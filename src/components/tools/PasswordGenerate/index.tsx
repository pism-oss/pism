import React, {useEffect, useState} from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Snackbar,
  Stack,
  TextField,
  Typography
} from '@mui/material';

export default function RandomPasswordGenerator() {
  const defaultUppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const defaultNumbers = '0123456789';
  const defaultSymbols = '!@#$%^&*()-_=+[]{}|;:,.<>?/';

  const [passwordList, setPasswordList] = useState<string[]>([]);
  const [length, setLength] = useState(12);
  const [uppercase, setUppercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [notRep, setNotRep] = useState(false);
  const [customUppercase, setCustomUppercase] = useState(defaultUppercase);
  const [customNumbers, setCustomNumbers] = useState(defaultNumbers);
  const [customSymbols, setCustomSymbols] = useState(defaultSymbols);
  const [excludeChars, setExcludeChars] = useState('');
  const [count, setCount] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');


  useEffect(() => {
    generatePassword();
  }, []);

  const getValidCharset = (customCharset: string, defaultCharset: string) => {
    return customCharset.trim() === '' ? defaultCharset : customCharset;
  };


  const calculateCrackTime = (password: string) => {
    let availableCharset = 'abcdefghijklmnopqrstuvwxyz'; // 默认小写字母

    // 检查密码字符集
    const length = password.length;

    if (/[A-Z]/.test(password)) availableCharset += defaultUppercase; // 如果包含大写字母
    if (/\d/.test(password)) availableCharset += defaultNumbers; // 如果包含数字
    if (/[^a-zA-Z0-9]/.test(password)) availableCharset += defaultSymbols; // 如果包含符号

    const charsetSize = availableCharset.length;

    // 假设每秒尝试 10 亿次
    const attemptsPerSecond = 1e9;

    // 计算总的密码空间
    const totalCombinations = Math.pow(charsetSize, length);

    // 计算破解时间（秒）
    const timeInSeconds = totalCombinations / attemptsPerSecond;

    // 将秒数转化为年、月、天、小时、分钟、秒的格式
    const years = Math.floor(timeInSeconds / (60 * 60 * 24 * 365));
    const months = Math.floor(timeInSeconds / (60 * 60 * 24 * 30));
    const days = Math.floor(timeInSeconds / (60 * 60 * 24));
    const hours = Math.floor((timeInSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((timeInSeconds % (60 * 60)) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return {
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      totalSeconds: timeInSeconds, // 返回总秒数
    };
  };
// 获取密码复杂度的颜色
  const getPasswordComplexityColor = (crackTime: {
    totalSeconds: number,
    years: number,
    months: number,
    days: number,
    hours: number,
    minutes: number,
    seconds: number
  }): string => {
    const {years, months, days, hours, minutes, seconds} = crackTime;

    if (years > 0) {
      // 如果破解时间超过1年，则返回强
      return 'success';
    } else if (months > 0) {
      // 如果破解时间在1个月到1年之间，则返回中
      return 'success';
    } else if (days > 0) {
      // 如果破解时间在1天到1个月之间，则返回警告
      return 'warning';
    } else if (hours > 0 || minutes > 10) {
      // 如果破解时间在10分钟到1天之间，则返回警告
      return 'warning';
    } else if (seconds < 60) {
      // 如果破解时间少于1分钟，则返回错误
      return 'error';
    }

    return 'error'; // 默认返回错误
  };

// 格式化时间
  const formatCrackTime = (time: {
    years: number,
    months: number,
    days: number,
    hours: number,
    minutes: number,
    seconds: number
  }) => {
    if (time.years > 0) return `${time.years}年 ${time.months}月`;
    if (time.months > 0) return `${time.months}月 ${time.days}天`;
    if (time.days > 0) return `${time.days}天 ${time.hours}小时`;
    if (time.hours > 0) return `${time.hours}小时 ${time.minutes}分钟`;
    if (time.minutes > 0) return `${time.minutes}分钟 ${time.seconds}秒`;
    return `${time.seconds}秒`;
  };

  const generatePassword = () => {
    let availableCharset = 'abcdefghijklmnopqrstuvwxyz';

    // 根据配置添加字符集
    if (uppercase) availableCharset += getValidCharset(customUppercase, defaultUppercase);
    if (numbers) availableCharset += getValidCharset(customNumbers, defaultNumbers);
    if (symbols) availableCharset += getValidCharset(customSymbols, defaultSymbols);

    // 排除不需要的字符
    const filteredCharset = availableCharset.replace(new RegExp(`[${excludeChars}]`, 'g'), '');

    // 存储生成的密码列表
    const newPasswordList: string[] = [];

    for (let i = 0; i < count; i++) {
      let password = '';

      // 如果 notRep 为 true 且密码长度小于可用字符集的长度，保证没有重复字符
      const charsetArray = filteredCharset.split('');
      if (notRep && length <= charsetArray.length) {
        // 随机打乱字符集并取出前 length 个字符
        const shuffledCharset = [...charsetArray].sort(() => Math.random() - 0.5);
        password = shuffledCharset.slice(0, length).join('');
      } else {
        // 如果允许重复字符
        for (let j = 0; j < length; j++) {
          const randomIndex = Math.floor(Math.random() * filteredCharset.length);
          password += filteredCharset[randomIndex];
        }
      }

      newPasswordList.push(password);
    }

    setPasswordList(newPasswordList);
  };


  const copyToClipboard = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password);
      setSnackbarSeverity('success');
      setSnackbarMessage('密码复制成功！');
    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage('复制失败，请重试。');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const copyAllToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(passwordList.join('\n'));
      setSnackbarSeverity('success');
      setSnackbarMessage('所有密码复制成功！');
    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage('批量复制失败，请重试。');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleGenerate = () => {
    generatePassword();
  };

  return (
    <Container maxWidth="lg" sx={{padding: 4}}>
      <Grid container spacing={2}>
        <Grid size={{xs: 12, md: 6, lg: 4}}>
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
              随机密码生成配置
            </Typography>

            <TextField
              type="number"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              label="密码长度"
              fullWidth
              variant="outlined"
              sx={{marginBottom: 2}}
            />

            <FormControlLabel
              control={<Checkbox checked={uppercase} onChange={() => setUppercase(!uppercase)}/>}
              label="包含大写字母"
            />
            {uppercase && (
              <TextField
                value={customUppercase}
                onChange={(e) => setCustomUppercase(e.target.value)}
                label="自定义大写字母"
                fullWidth
                variant="outlined"
                sx={{marginBottom: 2}}
              />
            )}

            <FormControlLabel
              control={<Checkbox checked={numbers} onChange={() => setNumbers(!numbers)}/>}
              label="包含数字"
            />
            {numbers && (
              <TextField
                value={customNumbers}
                onChange={(e) => setCustomNumbers(e.target.value)}
                label="自定义数字"
                fullWidth
                variant="outlined"
                sx={{marginBottom: 2}}
              />
            )}

            <FormControlLabel
              control={<Checkbox checked={symbols} onChange={() => setSymbols(!symbols)}/>}
              label="包含特殊字符"
            />
            {symbols && (
              <TextField
                value={customSymbols}
                onChange={(e) => setCustomSymbols(e.target.value)}
                label="自定义特殊字符"
                fullWidth
                variant="outlined"
                sx={{marginBottom: 2}}
              />
            )}

            <FormControlLabel
              control={<Checkbox checked={notRep} onChange={() => setNotRep(!notRep)}/>}
              label="字符不重复"
            />

            <TextField
              value={excludeChars}
              onChange={(e) => setExcludeChars(e.target.value)}
              label="排除字符"
              fullWidth
              variant="outlined"
              sx={{marginBottom: 2}}
            />

            <TextField
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              label="生成个数"
              fullWidth
              variant="outlined"
              sx={{marginBottom: 2}}
            />

            <Button variant="contained" color="primary" fullWidth onClick={handleGenerate}>
              生成密码
            </Button>
          </Box>
        </Grid>

        <Grid size={{xs: 12, md: 6, lg: 8}}>
          <Box sx={{padding: 2, border: '1px solid #ddd', borderRadius: '8px'}}>
            <Button
              variant="outlined"
              color="secondary"
              sx={{marginBottom: 2}}
              fullWidth
              onClick={copyAllToClipboard}
            >
              批量复制所有密码
            </Button>

            <Stack spacing={2}>
              {passwordList.map((password, index) => {
                const crackTime = calculateCrackTime(password);
                const formattedTime = formatCrackTime(crackTime);
                const complexityColor = getPasswordComplexityColor(crackTime);

                return (
                  <>
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: complexityColor === 'error' ? '#FFCDD2' : complexityColor === 'warn' ? '#FFF59D' : '#C8E6C9',
                        padding: 2,
                        borderRadius: '4px'
                      }}
                    >
                      <TextField
                        value={password}
                        fullWidth
                        variant="outlined"
                        onClick={() => copyToClipboard(password)}
                        InputProps={{
                          style: {cursor: 'pointer'}
                        }}
                      />

                      <Button
                        variant="outlined"
                        onClick={() => copyToClipboard(password)}
                        sx={{marginLeft: 2}}
                      >
                        复制
                      </Button>
                    </Box>
                    <Box>
                      <Typography variant="body2"
                                  sx={{color: complexityColor === 'error' ? '#d32f2f' : complexityColor === 'warn' ? '#fbc02d' : '#388e3c'}}>
                        破解时间: {formattedTime}
                      </Typography>
                    </Box>
                  </>
                );
              })}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
