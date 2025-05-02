import {translate} from "@docusaurus/Translate";
import {ReactNode} from "react";
import UUID from "@site/src/components/tools/IdGenerator/Uuid";
import NanoID from "@site/src/components/tools/IdGenerator/NanoId";
import SnowflakeIDGenerator from "@site/src/components/tools/IdGenerator/SnowflakeId";
import RandomPasswordGenerator from "@site/src/components/tools/PasswordGenerate";
import passwordComplexityCalculator from "@site/src/components/tools/PasswordComplexityCalculator";

export type Card = {
  id: string,
  show?: boolean | true,
  name: string,
  desc?: string,
  href: string,
  component?: () => ReactNode
}

export type CardGroup = {
  name: string,
  desc?: string,
  cards: Card[]
}

export const indexCard: CardGroup[] = [{
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
  name: translate({message: '加密'}),
  cards: [
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
      desc: translate({message: '计算秘密的复杂度以及安全性'}),
      href: '/docs/tools/password_complexity_calculator',
      component: passwordComplexityCalculator,
    }
  ]
}]