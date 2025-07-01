import React, { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  TextField,
  List,
  ListItem,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Search as SearchIcon, ThumbUp as ThumbUpIcon, ThumbDown as ThumbDownIcon } from '@mui/icons-material';
import { sha256 } from '@site/src/utils/Sha256Util';

interface ContentItem {
  content: string;
  id: string;
  ts: string;
  conf: {
    total: number;
    true: number;
    false: number;
    percent: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  msg: string;
  data: T;
}

const API_BASE_URL = 'https://api.icey.pism.com.cn';

export default function Query({ onAlert, loading, setLoading }) {
  const [subject, setSubject] = useState('');
  const [results, setResults] = useState<ContentItem[]>([]);
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [voteTarget, setVoteTarget] = useState<{ id: string; vote: 0 | 1 } | null>(null);

  const formatTimestamp = (ts: string) => new Date(parseInt(ts)).toLocaleString('zh-CN');

  const handleQuery = () => {
    if (!subject) {
      onAlert('error', '请填写主题');
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
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subjectHash, code: verificationCode }),
      });
      const result: ApiResponse<ContentItem[]> = await response.json();
      if (result.success) {
        setResults(result.data || []);
        onAlert('success', `查询成功，找到 ${result.data?.length || 0} 条记录`);
      } else {
        onAlert('error', result.msg || '查询失败');
      }
    } catch {
      onAlert('error', '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleVoteClick = (id: string, vote: 0 | 1) => {
    setVoteTarget({ id, vote });
    setVoteDialogOpen(true);
  };

  const handleVoteDialogSubmit = async () => {
    if (!voteTarget || !/^[0-9]{6}$/.test(verificationCode)) {
      onAlert('error', '请填写6位数字验证码');
      return;
    }
    setVoteDialogOpen(false);
    setLoading(true);
    try {
      const subjectHash = await sha256(subject);
      const response = await fetch(`${API_BASE_URL}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subjectHash, id: voteTarget.id, vote: voteTarget.vote, code: verificationCode }),
      });
      const result: ApiResponse<{ percent: number }> = await response.json();
      if (result.success) {
        onAlert('success', `投票成功！当前可信比例：${result.data.percent}%`);
        // 重新查询刷新数据
        setVerificationCode('');
        await handleCodeSubmit();
      } else {
        onAlert('error', result.msg || '投票失败');
      }
    } catch {
      onAlert('error', '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6">查询内容</Typography>
      <Typography variant="body2" color="text.secondary">
        输入原始主题文本，系统会自动进行SHA256加密后查询。主题不能为空。
      </Typography>
      <TextField
        label="主题"
        value={subject}
        onChange={e => setSubject(e.target.value)}
        placeholder="请输入原始主题文本"
        fullWidth
        required
      />
      <Button
        variant="contained"
        onClick={handleQuery}
        disabled={loading}
        startIcon={<SearchIcon />}
        fullWidth
      >
        查询内容
      </Button>
      {results.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            查询结果 ({results.length} 条)
          </Typography>
          <List>
            {results.map((item, index) => (
              <ListItem key={index} divider sx={{ flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">ID: {item.id}</Typography>
                  <Typography variant="caption" color="text.secondary">{formatTimestamp(item.ts)}</Typography>
                </Box>
                <Typography variant="body1" sx={{ width: '100%' }}>{item.content}</Typography>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption">可信度: {item.conf.percent}%</Typography>
                    <Typography variant="caption">{item.conf.true}/{item.conf.total} (可信/总数)</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={item.conf.percent} sx={{ height: 8, borderRadius: 4, mb: 1 }} />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" color="success" startIcon={<ThumbUpIcon />} onClick={() => handleVoteClick(item.id, 1)}>可信</Button>
                    <Button size="small" variant="outlined" color="error" startIcon={<ThumbDownIcon />} onClick={() => handleVoteClick(item.id, 0)}>不可信</Button>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      {/* 查询验证码弹窗 */}
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
            onChange={e => setVerificationCode(e.target.value)}
            placeholder="请输入6位数字验证码"
            inputProps={{ maxLength: 6 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCodeDialogOpen(false)}>取消</Button>
          <Button onClick={handleCodeSubmit} variant="contained">确认</Button>
        </DialogActions>
      </Dialog>
      {/* 投票验证码弹窗 */}
      <Dialog open={voteDialogOpen} onClose={() => setVoteDialogOpen(false)}>
        <DialogTitle>投票验证</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>请输入验证码以完成投票操作</Typography>
          <TextField
            autoFocus
            margin="dense"
            label="验证码"
            type="text"
            fullWidth
            variant="outlined"
            value={verificationCode}
            onChange={e => setVerificationCode(e.target.value)}
            placeholder="请输入6位数字验证码"
            inputProps={{ maxLength: 6 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVoteDialogOpen(false)}>取消</Button>
          <Button onClick={handleVoteDialogSubmit} variant="contained">确认投票</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
