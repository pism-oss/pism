import React, {useState} from 'react';
import {TextField, Button, Box, Typography, Stack, Alert} from '@mui/material';
import Translate, {translate} from "@docusaurus/Translate";

const PasswordComplexityCalculator = () => {
  const defaultUppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const defaultNumbers = '0123456789';
  const defaultSymbols = '!@#$%^&*()-_=+[]{}|;:,.<>?/';

  const [password, setPassword] = useState('');
  const [complexity, setComplexity] = useState('');
  const [crackTime, setCrackTime] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

    // 格式化时间输出
    const formattedTime = `${years}年 ${months}月 ${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;

    // 计算复杂度颜色
    let complexityLevel = '';
    if (years > 0) complexityLevel = 'strong';
    else if (months > 0) complexityLevel = 'medium';
    else complexityLevel = 'weak';

    setCrackTime(formattedTime);
    setComplexity(complexityLevel);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{padding: 3}}>
      <Typography variant="h6" gutterBottom>
        <Translate>密码复杂度计算器</Translate>
      </Typography>

      <TextField
        label={translate({message: "输入密码"})}
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{marginBottom: 2}}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => calculateCrackTime(password)}
      >
        <Translate>计算密码复杂度</Translate>
      </Button>

      {snackbarOpen && (
        <Box sx={{marginTop: 2}}>
          <Typography variant="body1" sx={{marginBottom: 1}}>
            <Translate>密码破解时间</Translate>: {crackTime}
          </Typography>
          <Alert severity={complexity === 'strong' ? 'success' : complexity === 'medium' ? 'warning' : 'error'}>
            <Translate>密码复杂度</Translate>: {complexity === 'strong' ? translate({message: '强'}) : complexity === 'medium' ? translate({message: '中'}) : translate({message: '弱'})}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default PasswordComplexityCalculator;
