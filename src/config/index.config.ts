import {translate} from "@docusaurus/Translate";
import {ReactNode} from "react";
import UUID from "@site/src/components/tools/IdGenerator/Uuid";
import NanoID from "@site/src/components/tools/IdGenerator/NanoId";
import SnowflakeIDGenerator from "@site/src/components/tools/IdGenerator/SnowflakeId";
import RandomPasswordGenerator from "@site/src/components/tools/PasswordGenerate";
import passwordComplexityCalculator from "@site/src/components/tools/PasswordComplexityCalculator";
import Md5 from "@site/src/components/tools/endecryption/md5";

export type Card = {
  id: string,
  show?: boolean | true,
  name: string,
  desc?: string,
  href: string,
  component?: () => ReactNode
}

export type CardGroup = {
  id: string,
  name: string,
  desc?: string,
  cards: Card[]
}

export const indexCard: CardGroup[] = [{
  id: 'id_gen',
  name: translate({message: '在线id生成器'}),
  desc: translate({message: '在线批量生成id'}),
  cards: [
    {
      id: 'uuid',
      name: translate({message: 'UUID'}),
      desc: translate({message: '随机生成uuid'}),
      href: '/docs/tools/id_generator/uuid',
      component: UUID,
    }, {
      id: 'nanoid',
      name: translate({message: 'NanoID'}),
      desc: translate({message: '随机生成NanoId'}),
      href: '/docs/tools/id_generator/nanoid',
      component: NanoID,
    }, {
      id: 'snowflakeId',
      name: translate({message: '雪花id'}),
      desc: translate({message: '随机生成雪花id'}),
      href: '/docs/tools/id_generator/snowflakeid',
      component: SnowflakeIDGenerator,
    }
  ]
}, {
  id: 'password',
  name: translate({message: '加密'}),
  cards: [
    {
      id: 'md5',
      name: translate({message: 'MD5'}),
      desc: translate({message: '高自由度的MD5工具'}),
      href: 'docs/tools/endecryption/md5',
      component: Md5,
    },
    {
      id: 'sha',
      name: translate({message: 'SHA'}),
      desc: translate({message: '高自由度的SHA工具'}),
      href: 'docs/tools/endecryption/sha',
      component: Md5,
    },
    {
      id: 'digest',
      name: translate({message: '摘要算法'}),
      desc: translate({message: '在线使用高自由度的摘要算法'}),
      href: 'docs/tools/endecryption/digest',
      component: Md5,
    },
    {
      id: 'password',
      name: translate({message: '随机密码生成器'}),
      desc: translate({message: '生成安全性高的密码'}),
      href: '/docs/tools/password_generator',
      component: RandomPasswordGenerator,
    },
    {
      id: 'password_cal',
      name: translate({message: '密码复杂度计算器'}),
      desc: translate({message: '计算密码的复杂度以及安全性'}),
      href: '/docs/tools/password_complexity_calculator',
      component: passwordComplexityCalculator,
    }
  ]
}, {
  id: 'content_management',
  name: translate({message: '内容管理'}),
  desc: translate({message: '安全的内容管理系统'}),
  cards: [
    {
      id: 'icey',
      name: translate({message: '冰鉴'}),
      desc: translate({message: '全加密应用工具'}),
      href: '/icey',
    }
  ]
}]