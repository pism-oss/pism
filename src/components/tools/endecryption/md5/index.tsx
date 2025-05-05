import {Button, Grid, Stack, TextField} from "@mui/material";
import Translate, {translate} from "@docusaurus/Translate";
import React, {useState} from "react";
import CryptoJS from 'crypto-js';
import Properties from "@site/src/components/Properties";
import {newFun} from "@site/src/utils/FunctionUtil";
import {copyToClipboard} from "@site/src/utils/CopyUtil";

const Md5 = () => {

  const [sourceStr, setSourceStr] = useState('${timestamp}|${random}');
  const [sourceRes, setSourceRes] = useState('');

  const [res, setRes] = useState('');

  const [properties, setProperties] = useState([])

  const getProps = () => {
    console.log(properties)
    return properties.reduce((acc, prop) => {
      acc[prop.key] = newFun(prop.value);
      return acc;
    }, {} as Record<string, string | number>);
  }

  const encrypt = () => {
    console.log(getProps())
    let sourceRes_ = replacePlaceholder(sourceStr, getProps());
    setSourceRes(sourceRes_)
    setRes(CryptoJS.MD5(sourceRes_).toString())
  }


  function replacePlaceholder(expression: string, params: Record<string, any>): string {
    return expression.replace(/\${(.*?)}/g, (_, key) => {
      return key in params ? String(params[key]) : `\${${key}}`;
    });
  }

  return (<>
    <Grid container spacing={2}>
      <Grid size={{lg: 12, xs: 12, sm: 12}}>
        <Stack spacing={2}>
          <Properties onDataChange={setProperties}></Properties>
        </Stack>

      </Grid>
      <Grid size={{lg: 12, xs: 12, sm: 12}}>
        <Stack spacing={2}>
          <TextField
            value={sourceStr}
            onChange={(e) => setSourceStr(e.target.value)}
            label={translate({message: "待加密数据"})}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{marginBottom: 2}}
          />
          <Button sx={{marginBottom: 2}} variant="contained" onClick={() => encrypt()}>
            <Translate>加密</Translate>
          </Button>
          <TextField
            label={translate({message: '被加密数据'})}
            value={sourceRes}
            fullWidth
            variant="outlined"
          />
          <TextField
            label={translate({message: '加密结果'})}
            onClick={e => copyToClipboard(res, '复制成功', '复制失败')}
            value={res}
            fullWidth
            variant="outlined"
          />
        </Stack>
      </Grid>

    </Grid>

  </>)
}

export default Md5;