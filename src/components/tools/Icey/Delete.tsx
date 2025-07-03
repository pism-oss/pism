import React, { useState } from 'react';
import {
  Stack,
  Typography,
  TextField,
  Button,
  Box
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import IceyApiUtil from '@site/src/utils/IceyApiUtil';
import VerificationCodeInput from '@site/src/components/VerificationCodeInput';

interface ApiResponse<T> {
  success: boolean;
  msg: string;
  data: T;
}

const API_BASE_URL = 'https://api.icey.pism.com.cn';

export default function Delete({ onAlert, loading, setLoading }) {
  const [subject, setSubject] = useState('');
  const [token, setToken] = useState('');
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);

  const handleDelete = () => {
    if (!subject || !token) {
      onAlert('error', '请填写所有必填字段');
      return;
    }

    setCodeDialogOpen(true);
  };

  const handleCodeSubmit = async (verificationCode: string) => {
    if (!/^[0-9]{6}$/.test(verificationCode)) {
      onAlert('error', '验证码必须是6位数字');
      return;
    }
    setCodeDialogOpen(false);
    setLoading(true);
    try {
      await IceyApiUtil.deleteContent(subject, token, verificationCode);
      onAlert('success', '内容删除成功');
      setSubject('');
      setToken('');
    } catch (error) {
      onAlert('error', error instanceof Error ? error.message : '删除失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6">删除内容</Typography>
      <Typography variant="body2" color="text.secondary">
        输入原始主题文本和删除令牌，系统会自动进行SHA256加密后删除。
      </Typography>
      <TextField
        label="主题"
        value={subject}
        onChange={e => setSubject(e.target.value)}
        placeholder="请输入原始主题文本"
        fullWidth
        required
      />
      <TextField
        label="删除令牌"
        value={token}
        onChange={e => setToken(e.target.value)}
        placeholder="请输入删除令牌"
        fullWidth
        required
      />
      <Button
        variant="contained"
        color="error"
        onClick={handleDelete}
        disabled={loading}
        startIcon={<DeleteIcon />}
        fullWidth
      >
        删除内容
      </Button>

      {/* Verification Code Input */}
      <VerificationCodeInput
        open={codeDialogOpen}
        onClose={() => setCodeDialogOpen(false)}
        onSubmit={handleCodeSubmit}
        title="删除验证"
        submitText="确认删除"
      />
    </Stack>
  );
}
