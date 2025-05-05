import React, {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {Analytics} from "@vercel/analytics/react"
import {Button, Grid, Popover, Stack, Typography} from "@mui/material";
import Translate, {translate} from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import CardInfo from "@site/src/components/CardInfo";

import {indexCard} from "@site/src/config/index.config";

// import { useColorMode } from '@docusaurus/theme-common';


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

  const [anchorEl, setAnchorEl] = React.useState<object>({});


  const words = ["Plan", "Implement", "Simplify", "Master"];

  const projects = [
    {
      title: 'ezasse',
      desc: translate({message: '项目脚本管理方案'}),
      tags: [translate({message: '版本管理'}), "java", "sql"],
      url: 'https:ezasse.pism.com.cn',
      logo: '/img/ezasse-bg.svg'
    },
    {
      title: 'Batslog',
      desc: translate({message: 'mybatis 日志插件'}),
      tags: ["mybatis", "sql"],
      url: 'https://github.com/PerccyKing/batslog',
      logo: '/img/batslog.svg'
    }
  ]

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    const newAnchorEl = {...anchorEl};
    newAnchorEl[id] = event.currentTarget;
    setAnchorEl(newAnchorEl);
  };

  const handlePopoverClose = (id: string) => {
    const newAnchorEl = {...anchorEl};
    newAnchorEl[id] = null;
    setAnchorEl(newAnchorEl);
  };

  return (
    <Layout
      title={`${translate({message: siteConfig.title})}`}
      description="PISM 开源平台提供丰富的在线开发工具，包括 UUID、Snowflake ID、NanoID 批量生成器，以及在线加密、解密、格式转换等实用功能，助力开发者高效构建与管理项目。"
    >
      <style>{fadeInAnimation}</style>
      <main>
        <Grid container spacing={2}>
          <Grid size={{xs: 12, md: 6, lg: 4}}>
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
          </Grid>
          <Grid size={{xs: 12, md: 6, lg: 8}}>

            <Stack spacing={6} style={{margin: "10px"}}>
              <Link
                to="/docs/id_gen">
                <Button variant="contained"><Translate>全部在线工具</Translate></Button>
              </Link>
              {indexCard.map(cardGroup => {
                return (<Grid key={cardGroup.id} rowSpacing={2}>
                  <Typography variant="h5" component="div">
                    <b>{cardGroup.name}</b>
                  </Typography>
                  <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 14}}>
                    {cardGroup.desc}
                  </Typography>
                  <Grid container spacing={2}>

                    {cardGroup.cards.map(card => {
                      return (<Grid
                        key={card.id}
                        size={{xs: 12, md: 6, lg: 4}}>
                        <div
                          aria-owns={Boolean(anchorEl[card.id]) ? 'mouse-over-popover' : undefined}
                          aria-haspopup="true"
                          // onMouseEnter={(e) => handlePopoverOpen(e, card.id)}
                          // onMouseLeave={(e) => handlePopoverClose(card.id)}
                        >
                          <CardInfo
                            item={{
                              type: "link",
                              label: card.name,
                              href: card.href,
                              docId: card.id,
                              description: card.desc,
                              unlisted: true
                            }}
                          ></CardInfo>
                        </div>

                        <Popover
                          key={card.id}
                          id={card.id}
                          sx={{pointerEvents: 'none'}}
                          open={Boolean(anchorEl[card.id])}
                          anchorEl={anchorEl[card.id]}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                          onClose={(e) => handlePopoverClose(card.id)}
                          disableRestoreFocus
                        >
                          {React.createElement(card.component)}
                        </Popover>
                      </Grid>)
                    })}


                  </Grid>
                </Grid>)
              })}
            </Stack>
          </Grid>

        </Grid>
      </main>
      <Analytics/>
    </Layout>
  );
}
