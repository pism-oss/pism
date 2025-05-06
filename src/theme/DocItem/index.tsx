import React, {type ReactNode} from 'react';
import {HtmlClassNameProvider} from '@docusaurus/theme-common';
import {DocProvider} from '@docusaurus/plugin-content-docs/client';
import DocItemMetadata from '@theme/DocItem/Metadata';
import DocItemLayout from '@theme/DocItem/Layout';
import type {Props} from '@theme/DocItem';
import Waline from "@site/src/components/Waline";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

function substringFromStart(originalString, startString) {
  const startIndex = originalString.indexOf(startString);
  if (startIndex === -1) {
    return null;
  }
  return originalString.slice(startIndex);
}

export default function DocItem(props: Props): ReactNode {
  const docHtmlClassName = `docs-doc-id-${props.content.metadata.id}`;
  const MDXComponent = props.content;
  const {i18n: {currentLocale}} = useDocusaurusContext();
  return (
    <DocProvider content={props.content}>
      <HtmlClassNameProvider className={docHtmlClassName}>
        <DocItemMetadata/>
        <DocItemLayout>
          <MDXComponent/>
          {/*添加的评论区*/}
          <Waline language={currentLocale} path={substringFromStart(props.location.pathname, '/docs')}/>
        </DocItemLayout>
      </HtmlClassNameProvider>
    </DocProvider>
  );
}
