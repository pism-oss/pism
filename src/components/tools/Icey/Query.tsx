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
import IceyApiUtil from '@site/src/utils/IceyApiUtil';
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
      const results = await IceyApiUtil.queryContent(subject, code);
      setResults(results);
      onAlert('success', `查询成功，找到 ${results.length} 条记录`);
    } catch (error) {
      console.error('查询失败:', error);
      onAlert('error', error instanceof Error ? error.message : '查询失败');
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
      const percent = await IceyApiUtil.vote(subject, voteTarget.id, voteTarget.vote, code);
      onAlert('success', `投票成功！当前可信比例：${percent}%`);
      // 重新查询以更新列表
      await handleQuerySubmit(code);
    } catch (error) {
      onAlert('error', error instanceof Error ? error.message : '投票失败');
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
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<ThumbUpIcon />}
                      onClick={() => handleVoteClick(item.id, 1)}
                      color="success"
                    >
                      可信
                    </Button>
                    <Button
                      size="small"
                      startIcon={<ThumbDownIcon />}
                      onClick={() => handleVoteClick(item.id, 0)}
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

      {/* 验证码输入对话框 - 查询 */}
      <VerificationCodeInput
        open={queryDialogOpen}
        onClose={() => setQueryDialogOpen(false)}
        onSubmit={handleQuerySubmit}
        title="查询验证"
        submitText="确认查询"
      />

      {/* 验证码输入对话框 - 投票 */}
      <VerificationCodeInput
        open={voteDialogOpen}
        onClose={() => setVoteDialogOpen(false)}
        onSubmit={handleVoteSubmit}
        title="投票验证"
        submitText="确认投票"
      />

      {/* 查看全部内容对话框 */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>完整内容</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {viewContent}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => globalCopy(viewContent)} startIcon={<CopyIcon />}>
            复制
          </Button>
          <Button onClick={() => setViewDialogOpen(false)}>
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
