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