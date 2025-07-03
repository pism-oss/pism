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
  DialogActions,
  IconButton
} from '@mui/material';
import { Search as SearchIcon, ThumbUp as ThumbUpIcon, ThumbDown as ThumbDownIcon, ContentCopy as CopyIcon } from '@mui/icons-material';
import { sha256 } from '@site/src/utils/Sha256Util';
import { md5, aesDecrypt } from '@site/src/utils/FunctionUtil';
import VerificationCodeInput from '@site/src/components/VerificationCodeInput';

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
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [voteTarget, setVoteTarget] = useState<{ id: string; vote: 0 | 1 } | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewContent, setViewContent] = useState('');

  const formatTimestamp = (ts: string) => new Date(parseInt(ts)).toLocaleString('zh-CN');

  const handleQuery = () => {
    if (!subject) {
      onAlert('error', '请填写主题');
      return;
    }
    setQueryDialogOpen(true);
  };

  const handleQuerySubmit = async (code: string) => {
    setQueryDialogOpen(false);
    setLoading(true);
    try {
      // 1. 原文sha256 (用于API请求)
      const subjectHash = await sha256(subject);
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subjectHash, code }),
      });
      const result: ApiResponse<ContentItem[]> = await response.json();
      if (result.success) {
        // 解密过程 - 与Submit组件保持完全一致
        // 生成解密密钥: sha256(sha256(subject) + md5(subject))
        const hash1 = await sha256(subject);
        const hash2 = md5(subject);
        const decryptionKey = await sha256(hash1 + hash2);

        // 解密每条内容
        const decryptedResults = result.data.map(item => ({
          ...item,
          content: aesDecrypt(decryptionKey, item.content)
        }));

        setResults(decryptedResults || []);
        onAlert('success', `查询成功，找到 ${decryptedResults?.length || 0} 条记录`);
      } else {
        onAlert('error', result.msg || '查询失败');
      }
    } catch (error) {
      console.error('解密过程出错:', error);
      onAlert('error', '解密失败，请检查主题是否正确');
    } finally {
      setLoading(false);
    }
  };

  const handleVoteClick = (id: string, vote: 0 | 1) => {
    setVoteTarget({ id, vote });
    setVoteDialogOpen(true);
  };

  const handleVoteSubmit = async (code: string) => {
    if (!voteTarget) {
      onAlert('error', '投票目标无效');
      return;
    }
    setVoteDialogOpen(false);
    setLoading(true);
    try {
      const subjectHash = await sha256(subject);
      const response = await fetch(`${API_BASE_URL}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subjectHash, id: voteTarget.id, vote: voteTarget.vote, code }),
      });
      const result: ApiResponse<{ percent: number }> = await response.json();
      if (result.success) {
        onAlert('success', `投票成功！当前可信比例：${result.data.percent}%`);
        await handleQuerySubmit(code);
      } else {
        onAlert('error', result.msg || '投票失败');
      }
    } catch {
      onAlert('error', '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = (content: string) => {
    setViewContent(content);
    setViewDialogOpen(true);
  };

  // 复制内容并全局提示
  function globalCopy(text: string) {
    navigator.clipboard.writeText(text);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('global-toast', { detail: { type: 'success', message: '内容已复制' } }));
    }, 0);
  }

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
                  <Typography variant="caption" color="text.secondary">{formatTimestamp(item.ts)}</Typography>
                </Box>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ flex: 1, wordBreak: 'break-all' }}>
                    {item.content.length > 60 ? item.content.slice(0, 60) + '...' : item.content}
                  </Typography>
                  <IconButton size="small" color="primary" onClick={() => globalCopy(item.content)}>
                    <CopyIcon />
                  </IconButton>
                  {item.content.length > 60 && (
                    <Button size="small" onClick={() => handleViewAll(item.content)}>
                      查看全部
                    </Button>
                  )}
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption">可信度: {item.conf.percent}%</Typography>
                    <Typography variant="caption">{item.conf.true}/{item.conf.total} (可信/总数)</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.conf.percent}
                    sx={{ mb: 1, borderRadius: 1 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<ThumbUpIcon />}
                      onClick={() => handleVoteClick(item.id, 1)}
                      variant="outlined"
                      color="success"
                    >
                      可信
                    </Button>
                    <Button
                      size="small"
                      startIcon={<ThumbDownIcon />}
                      onClick={() => handleVoteClick(item.id, 0)}
                      variant="outlined"
                      color="error"
                    >
                      不可信
                    </Button>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <VerificationCodeInput
        open={queryDialogOpen}
        onClose={() => setQueryDialogOpen(false)}
        onSubmit={handleQuerySubmit}
        title="查询验证"
      />

      <VerificationCodeInput
        open={voteDialogOpen}
        onClose={() => setVoteDialogOpen(false)}
        onSubmit={handleVoteSubmit}
        title="投票验证"
      />

      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {viewContent}
          </Typography>
        </Box>
      </Dialog>
    </Stack>
  );
}
