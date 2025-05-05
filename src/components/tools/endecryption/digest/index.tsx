import {Button, Checkbox, FormControlLabel, Grid, Stack, TextField} from "@mui/material";
import Translate, {translate} from "@docusaurus/Translate";
import React, {useEffect, useState} from "react";
import CryptoJS from "crypto-js";
import Properties from "@site/src/components/Properties";
import {newFun} from "@site/src/utils/FunctionUtil";
import {copyToClipboard} from "@site/src/utils/CopyUtil";

type Alg = {
  k: string;
  v: (content: string, key?: string) => string;
};

const algorithms: Alg[] = [
  {
    k: "md5",
    v: (content: string, key?: string) => {
      return key
        ? CryptoJS.HmacMD5(content, key).toString()
        : CryptoJS.MD5(content).toString();
    },
  },
  {
    k: "sha1",
    v: (content: string, key?: string) => {
      return key
        ? CryptoJS.HmacSHA1(content, key).toString()
        : CryptoJS.SHA1(content).toString();
    },
  },
  {
    k: "sha224",
    v: (content: string, key?: string) => {
      return key
        ? CryptoJS.HmacSHA224(content, key).toString()
        : CryptoJS.SHA224(content).toString();
    },
  },
  {
    k: "sha256",
    v: (content: string, key?: string) => {
      return key
        ? CryptoJS.HmacSHA256(content, key).toString()
        : CryptoJS.SHA256(content).toString();
    },
  },
  {
    k: "sha384",
    v: (content: string, key?: string) => {
      return key
        ? CryptoJS.HmacSHA384(content, key).toString()
        : CryptoJS.SHA384(content).toString();
    },
  },
  {
    k: "sha512",
    v: (content: string, key?: string) => {
      return key
        ? CryptoJS.HmacSHA512(content, key).toString()
        : CryptoJS.SHA512(content).toString();
    },
  },
  {
    k: "sha3",
    v: (content: string, key?: string) => {
      return key
        ? CryptoJS.HmacSHA3(content, key).toString()
        : CryptoJS.SHA3(content).toString();
    },
  },
  {
    k: "ripemd160",
    v: (content: string, key?: string) => {
      return key
        ? CryptoJS.HmacRIPEMD160(content, key).toString()
        : CryptoJS.RIPEMD160(content).toString();
    },
  },
];

const Digest = ({type = []}) => {
  const [sourceStr, setSourceStr] = useState("${timestamp}|${random}");
  const [sourceRes, setSourceRes] = useState("");
  const [properties, setProperties] = useState([]);
  const [selectedAlgs, setSelectedAlgs] = useState<Alg[]>(algorithms);
  const [results, setResults] = useState<Record<string, string>>({});
  const [useHmac, setUseHmac] = useState(false);
  const [hmacKey, setHmacKey] = useState("");

  useEffect(() => {
    if (Array.isArray(type) && type.length > 0) {
      setSelectedAlgs(algorithms.filter((al) => type.includes(al.k)));
    } else {
      setSelectedAlgs(algorithms);
    }
  }, [type]);

  const getProps = () => {
    return properties.reduce((acc, prop) => {
      acc[prop.key] = newFun(prop.value);
      return acc;
    }, {} as Record<string, string | number>);
  };

  const encrypt = () => {
    const resolved = replacePlaceholder(sourceStr, getProps());
    setSourceRes(resolved);
    const newResults = selectedAlgs.reduce((acc, alg) => {
      acc[alg.k] = alg.v(resolved, useHmac ? hmacKey : undefined);
      return acc;
    }, {} as Record<string, string>);
    setResults(newResults);
  };

  const replacePlaceholder = (
    expression: string,
    params: Record<string, any>
  ): string => {
    return expression.replace(/\${(.*?)}/g, (_, key) => {
      return key in params ? String(params[key]) : `\${${key}}`;
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{lg: 12, xs: 12, sm: 12}}>
        <Stack spacing={2}>
          <Properties onDataChange={setProperties}/>
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
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={useHmac}
                onChange={(e) => setUseHmac(e.target.checked)}
              />
            }
            label="使用 HMAC"
          />

          {useHmac && (
            <TextField
              value={hmacKey}
              onChange={(e) => setHmacKey(e.target.value)}
              label="HMAC 密钥"
              fullWidth
              variant="outlined"
            />
          )}

          <Button variant="contained" onClick={encrypt}>
            <Translate>加密</Translate>
          </Button>

          <TextField
            label={translate({message: "被加密数据"})}
            value={sourceRes}
            fullWidth
            variant="outlined"
          />

          {Object.entries(results).map(([alg, value]) => (
            <TextField
              key={alg}
              label={`${alg.toUpperCase()} ${translate({
                message: "加密结果",
              })}`}
              value={value}
              fullWidth
              variant="outlined"
              onClick={() =>
                copyToClipboard(
                  value,
                  translate({message: "复制成功"}),
                  translate({message: "复制失败"})
                )
              }
            />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Digest;
