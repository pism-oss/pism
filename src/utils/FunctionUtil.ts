import md5Lib from 'crypto-js/md5';
import forge from 'node-forge';

export const newFun = (content: string): string | number => {
  try {
    const fn = new Function(content);
    const result = fn();

    // 判断结果是否为字符串或数字，如果不是则返回空字符串
    if (typeof result !== 'string' && typeof result !== 'number') {
      return "";
    }

    return result;
  } catch (e) {
    return "";
  }
};

export function md5(str: string): string {
  return md5Lib(str).toString();
}

// 从密钥派生IV的函数
function deriveIVFromKey(key: string): string {
  try {
    if (!key) {
      throw new Error('密钥不能为空');
    }

    // 1. 将密钥分成两半
    const halfLength = Math.floor(key.length / 2);
    if (halfLength === 0) {
      throw new Error('密钥长度不足');
    }

    const firstHalf = key.slice(0, halfLength);
    const secondHalf = key.slice(halfLength);
    
    // 2. 对第一半进行MD5
    const md5First = md5(firstHalf);
    
    // 3. 对第二半进行SHA256
    const sha256Second = forge.md.sha256.create();
    sha256Second.update(secondHalf);
    const sha256Result = sha256Second.digest().getBytes();
    
    // 4. 交错合并两个结果的部分字节
    let combined = '';
    const md5Bytes = forge.util.createBuffer(forge.util.hexToBytes(md5First)).getBytes();
    
    // 确保有足够的字节可用
    if (md5Bytes.length < 16 || sha256Result.length < 16) {
      throw new Error('哈希结果长度不足');
    }

    for (let i = 0; i < 8; i++) {
      combined += md5Bytes[i * 2] + sha256Result[i * 2];
    }
    
    // 5. 最后再进行一次SHA256
    const finalHash = forge.md.sha256.create();
    finalHash.update(combined);
    const iv = finalHash.digest().getBytes();
    
    // 确保IV长度正确
    if (iv.length < 16) {
      throw new Error('生成的IV长度不足');
    }

    // 返回前16字节作为IV
    return iv.slice(0, 16);
  } catch (e) {
    console.error('IV派生失败:', e);
    throw new Error(`IV派生失败: ${e.message}`);
  }
}

// AES加密函数
export function aesEncrypt(key: string, content: string): string {
  try {
    if (!key || !content) {
      throw new Error('密钥或内容不能为空');
    }

    // 确保密钥是32字节（256位）
    const md = forge.md.sha256.create();
    md.update(key);
    const keyBytes = md.digest().getBytes();

    const cipher = forge.cipher.createCipher('AES-CBC', keyBytes);

    // 从密钥派生IV并确保是正确的字节格式
    const iv = deriveIVFromKey(keyBytes);
    cipher.start({iv: iv});

    // 将内容转换为UTF-8字节
    const contentBytes = forge.util.encodeUtf8(content);
    // 更新加密器并加密所有内容
    cipher.update(forge.util.createBuffer(contentBytes));
    const success = cipher.finish();
    
    if (!success) {
      throw new Error('加密过程失败');
    }
    
    // 直接返回加密后的内容的base64编码
    return forge.util.encode64(cipher.output.getBytes());
  } catch (e) {
    console.error('AES加密失败:', e);
    throw new Error(`加密失败: ${e.message}`);
  }
}

// AES解密函数
export function aesDecrypt(key: string, encryptedContent: string): string {
  try {
    // base64解码
    const encrypted = forge.util.decode64(encryptedContent);
    
    // 确保密钥是32字节（256位）
    const md = forge.md.sha256.create();
    md.update(key);
    const keyBytes = md.digest().getBytes();
    
    const decipher = forge.cipher.createDecipher('AES-CBC', keyBytes);
    
    // 从密钥派生IV并确保是正确的字节格式
    const iv = deriveIVFromKey(keyBytes);
    decipher.start({iv: iv});
    
    // 更新解密器并解密所有内容
    decipher.update(forge.util.createBuffer(encrypted));
    const success = decipher.finish();
    
    if (!success) {
      throw new Error('解密过程失败');
    }
    
    // 将解密后的字节转换回UTF-8字符串
    return forge.util.decodeUtf8(decipher.output.getBytes());
  } catch (e) {
    console.error('AES解密失败:', e);
    throw e;
  }
}