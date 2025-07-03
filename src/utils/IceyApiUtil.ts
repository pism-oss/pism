import { sha256 } from './Sha256Util';
import { md5, aesEncrypt, aesDecrypt } from './FunctionUtil';

interface ApiResponse<T> {
  success: boolean;
  msg: string;
  data: T;
}

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

interface VoteResult {
  percent: number;
}

interface SubmitResult {
  token: string;
}

const API_BASE_URL = 'https://api.icey.pism.com.cn';

export default class IceyApiUtil {
  /**
   * 生成加密密钥
   * @param subject 原始主题
   * @returns Promise<string> 加密密钥
   */
  private static async generateEncryptionKey(subject: string): Promise<string> {
    const hash1 = await sha256(subject);
    const hash2 = md5(subject);
    return sha256(hash1 + hash2);
  }

  /**
   * 查询内容
   * @param subject 原始主题
   * @param code 验证码
   * @returns Promise<ContentItem[]> 解密后的内容列表
   */
  public static async queryContent(subject: string, code: string): Promise<ContentItem[]> {
    const subjectHash = await sha256(subject);
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: subjectHash, code }),
    });

    const result: ApiResponse<ContentItem[]> = await response.json();
    if (!result.success) {
      throw new Error(result.msg || '查询失败');
    }

    // 解密内容
    const decryptionKey = await this.generateEncryptionKey(subject);
    return result.data.map(item => ({
      ...item,
      content: aesDecrypt(decryptionKey, item.content)
    }));
  }

  /**
   * 提交内容
   * @param subject 原始主题
   * @param content 要提交的内容
   * @param code 验证码
   * @returns Promise<string> 删除令牌
   */
  public static async submitContent(subject: string, content: string, code: string): Promise<string> {
    const subjectHash = await sha256(subject);
    const encryptionKey = await this.generateEncryptionKey(subject);
    const encryptedContent = aesEncrypt(encryptionKey, content);

    const response = await fetch(`${API_BASE_URL}/commit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: subjectHash,
        content: encryptedContent,
        code,
      }),
    });

    const result: ApiResponse<SubmitResult> = await response.json();
    if (!result.success) {
      throw new Error(result.msg || '提交失败');
    }

    return result.data.token;
  }

  /**
   * 删除内容
   * @param subject 原始主题
   * @param token 删除令牌
   * @param code 验证码
   */
  public static async deleteContent(subject: string, token: string, code: string): Promise<void> {
    const subjectHash = await sha256(subject);
    const response = await fetch(`${API_BASE_URL}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: subjectHash,
        token,
        code,
      }),
    });

    const result: ApiResponse<null> = await response.json();
    if (!result.success) {
      throw new Error(result.msg || '删除失败');
    }
  }

  /**
   * 投票
   * @param subject 原始主题
   * @param id 内容ID
   * @param vote 投票类型（0: 不可信, 1: 可信）
   * @param code 验证码
   * @returns Promise<number> 更新后的可信度百分比
   */
  public static async vote(subject: string, id: string, vote: 0 | 1, code: string): Promise<number> {
    const subjectHash = await sha256(subject);
    const response = await fetch(`${API_BASE_URL}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: subjectHash,
        id,
        vote,
        code,
      }),
    });

    const result: ApiResponse<VoteResult> = await response.json();
    if (!result.success) {
      throw new Error(result.msg || '投票失败');
    }

    return result.data.percent;
  }
} 