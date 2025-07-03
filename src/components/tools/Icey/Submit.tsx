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
import { md5, aesEncrypt } from '@site/src/utils/FunctionUtil';
import VerificationCodeInput from '@site/src/components/VerificationCodeInput';

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
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onAlert('success', '已复制到剪贴板');
  };

  const handleSubmit = () => {
    if (!subject || !content) {
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
      // 1. 原文sha256 (用于API请求)
      const subjectHash = await sha256(subject);
      // 2. 生成加密密钥: sha256(sha256(subject) + md5(subject))
      const hash1 = await sha256(subject);
      const hash2 = md5(subject);
      const encryptionKey = await sha256(hash1 + hash2);
      // 5. 使用AES加密内容
      const encryptedContent = aesEncrypt(encryptionKey, content);

      console.log('准备发送请求，数据:', {
        subject: subjectHash,
        contentLength: encryptedContent.length,
        code: verificationCode
      });

      const response = await fetch(`${API_BASE_URL}/commit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subjectHash,
          content: encryptedContent,
          code: verificationCode,
        }),
      });

      const result: ApiResponse<{ token: string }> = await response.json();

      if (result.success) {
        setToken(result.data.token);
        setTokenDialogOpen(true);
        onAlert('success', '内容提交成功！请保存删除令牌');
        setSubject('');
        setContent('');
      } else {
        onAlert('error', result.msg || '提交失败');
      }
    } catch (error) {
      console.error('提交过程出错:', error);
      if (error instanceof Error) {
        console.error('错误详情:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
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

      {/* Token Dialog 替换原有 Card 展示 */}
      <Dialog open={tokenDialogOpen} onClose={() => setTokenDialogOpen(false)}>
        <DialogTitle>提交成功</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="error" gutterBottom>
            删除令牌<strong>只显示一次</strong>，请妥善保存！遗失将无法删除内容。
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
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => setTokenDialogOpen(false)}>
            我已保存删除令牌
          </Button>
        </DialogActions>
      </Dialog>

      {/* Verification Code Input */}
      <VerificationCodeInput
        open={codeDialogOpen}
        onClose={() => setCodeDialogOpen(false)}
        onSubmit={handleCodeSubmit}
        title="提交验证"
        submitText="确认提交"
      />
    </Stack>
  );
}
