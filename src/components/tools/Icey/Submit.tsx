import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Stack,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Send as SendIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { sha256 } from '@site/src/utils/Sha256Util';

interface ApiResponse<T> {
  success: boolean;
  msg: string;
  data: T;
}

const API_BASE_URL = 'https://api.icey.pism.com.cn';

interface SubmitProps {
  onAlert: (type: 'success' | 'error' | 'info', message: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function Submit({ onAlert, loading, setLoading }: SubmitProps) {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [token, setToken] = useState('');
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onAlert('success', '已复制到剪贴板');
  };

  const handleSubmit = () => {
    if (!subject || !content) {
      onAlert('error', '请填写所有必填字段');
      return;
    }

    if (subject.length < 6) {
      onAlert('error', '主题必须至少包含6个字符');
      return;
    }

    setCodeDialogOpen(true);
  };

  const handleCodeSubmit = async () => {
    if (!/^[0-9]{6}$/.test(verificationCode)) {
      onAlert('error', '验证码必须是6位数字');
      return;
    }

    setCodeDialogOpen(false);
    setLoading(true);

    try {
      const subjectHash = await sha256(subject);
      const response = await fetch(`${API_BASE_URL}/commit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subjectHash,
          content: content,
          code: verificationCode,
        }),
      });

      const result: ApiResponse<{ token: string }> = await response.json();

      if (result.success) {
        setToken(result.data.token);
        onAlert('success', '内容提交成功！请保存删除令牌');
        setSubject('');
        setContent('');
        setVerificationCode('');
      } else {
        onAlert('error', result.msg || '提交失败');
      }
    } catch (error) {
      onAlert('error', '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6">提交新内容</Typography>
      <Typography variant="body2" color="text.secondary">
        提交内容到系统，主题将自动进行SHA256加密，点击提交后需要输入验证码。
      </Typography>

      <TextField
        label="主题"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="请输入主题（至少6个字符）"
        fullWidth
        required
      />

      <TextField
        label="内容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="请输入要提交的内容"
        multiline
        rows={4}
        fullWidth
        required
      />

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        startIcon={<SendIcon />}
        fullWidth
      >
        提交内容
      </Button>

      {token && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" color="success.main" gutterBottom>
              提交成功！
            </Typography>
            <Typography variant="body2" gutterBottom>
              请保存以下删除令牌，用于后续删除操作：
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                value={token}
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
              />
              <IconButton
                onClick={() => copyToClipboard(token)}
                color="primary"
              >
                <CopyIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Verification Code Dialog */}
      <Dialog open={codeDialogOpen} onClose={() => setCodeDialogOpen(false)}>
        <DialogTitle>输入验证码</DialogTitle>
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
            inputProps={{ maxLength: 6 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCodeDialogOpen(false)}>取消</Button>
          <Button onClick={handleCodeSubmit} variant="contained">
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
