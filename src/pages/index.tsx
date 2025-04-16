import React, {ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Project from "@site/src/components/Project";
import { Analytics } from "@vercel/analytics/react"

// 定义 CSS 动画
const fadeInAnimation = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  const words = ["Plan", "Implement", "Simplify", "Master"];

  const projects = [
    {
      title: 'ezasse',
      desc: '项目脚本管理方案',
      tags: ["版本管理", "java", "sql"],
      url: 'https:ezasse.pism.com.cn',
      logo: '/img/ezasse-bg.svg'
    },
    {
      title: 'Batslog',
      desc: 'mybatis 日志插件',
      tags: ["mybatis", "sql"],
      url: 'https://github.com/PerccyKing/batslog',
      logo: '/img/batslog.svg'
    }
  ]

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="pism"
    >
      <style>{fadeInAnimation}</style>
      <main>
        <div className="row" style={{margin: '0em'}}>
          <div className={clsx('col col--6')}>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
              {words.map((word, index) => (
                <h1
                  key={index}
                  className="text-9xl font-bold text-blue-600 mb-8 animate-bounce delay-[200ms*var(--i)]"
                  style={{
                    ...({'--i': index} as any),
                    animation: `fadeIn 1s ease-out ${index * 0.2}s both`
                  }}
                >
                  {word}
                </h1>
              ))}
            </div>
          </div>
          <div className={clsx('col col--6')} style={{padding: '2em'}}>
            <div style={{
              padding: '3rem 0rem'
            }}>
              <div style={{
                margin: '0 auto'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2rem'
                }}>
                  {projects.map((project, index) => {
                    return <Project
                      key={index}
                      title={project.title}
                      description={project.desc}
                      tags={project.tags}
                      url={project.url}
                      image={project.logo}
                    />
                  })}

                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Analytics />
    </Layout>
  );
}