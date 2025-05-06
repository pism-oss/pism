import React, {useEffect, useRef} from 'react';
import {init} from '@waline/client';
import '@waline/client/style';
import {translate} from "@docusaurus/Translate";

const Waline = ({language, path}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 清理旧实例
    containerRef.current.innerHTML = '';

    // 初始化 Waline
    init({
      el: containerRef.current,
      serverURL: 'https://waline.pism.com.cn',
      path: path,
      emoji: [
        '//unpkg.com/@waline/emojis@1.1.0/weibo',
        '//unpkg.com/@waline/emojis@1.1.0/bilibili',
      ],
      lang: language,
      login: 'enable',
      locale: {reactionTitle: translate({message: '这个工具怎么样'})},
      noCopyright: true
    });
  }, []);

  return <div ref={containerRef} style={{marginTop: 40}}/>;
};

export default Waline;
