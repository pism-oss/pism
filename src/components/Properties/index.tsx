import React, {useEffect, useState} from "react";
import Translate, {translate} from "@docusaurus/Translate";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import {Editor} from "@monaco-editor/react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import FullScreen from "@site/src/components/FullScreen";
import {newFun} from "@site/src/utils/FunctionUtil";

const defaultProperties = [{
  name: translate({message: "随机数"}),
  key: 'random',
  value: `return Math.floor(100000 + Math.random() * 900000)`,
  canRemove: false
}, {
  name: translate({message: "时间戳"}),
  key: 'timestamp',
  value: `return new Date().getTime()`,
  canRemove: false
}]

const Properties = ({onDataChange}) => {

  const [attrs, setAttrs] = useState([])

  const removeAttr = (key) => {
    setAttrs(attrs.filter(item => {
      return item.key !== key || !item.canRemove
    }))
  }

  useEffect(() => {
    setAttrs(getLocalProperties())
    onDataChange(getLocalProperties())
  }, []);

  useEffect(() => {
    updateLocalProperties(attrs)
    onDataChange(getLocalProperties())
  }, [attrs]);

  const getLocalProperties = () => {
    let item = localStorage.getItem("pism:script:properties");
    if (item) {
      let parse = JSON.parse(item);
      console.log(parse.length != 0)
      if (parse.length != 0) {
        return parse;
      } else {
        return defaultProperties;
      }
    } else {
      return defaultProperties;
    }
  }

  const updateLocalProperties = (props) => {
    localStorage.setItem("pism:script:properties", JSON.stringify(props))
  }

  const addAttr = (attr) => {
    setAttrs([...attrs, attr]);
  };

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleEditorChange = (value: string | undefined, key: string) => {
    setAttrs(prev => prev.map(attr => {
      if (attr.key === key) {
        return {...attr, value: value};
      }
      return attr;
    }));

  };


  const [attrName, setAttrName] = useState('');
  const [attrKey, setAttrKey] = useState('');
  const [code, setCode] = useState(`return 'value';`);
  const [attrNameError, setAttrNameError] = useState(false);
  const [attrKeyError, setAttrKeyError] = useState(false);

  const createAttr = () => {
    if (!attrName) {
      setAttrNameError(true)
      return;
    }
    if (!attrKey) {
      setAttrKeyError(true);
      return;
    }
    addAttr({
      name: attrName,
      key: attrKey,
      value: code,
      canRemove: true
    })

    handleClose()

    setAttrKeyError(false);
    setAttrNameError(false);
    setAttrName('');
    setAttrKey('')
    setCode(`return 'value';`)

  }


  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const resetProperties = () => {
    setAttrs(defaultProperties)
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Stack spacing={2}>
        <Box>
          <Grid container={true} spacing={2}>
            <Button variant="outlined" onClick={handleClickOpen}><Translate>添加属性</Translate></Button>
            <Button variant="outlined" onClick={resetProperties}><Translate>重置属性</Translate></Button>
          </Grid>
        </Box>
        <div>
          {attrs.map(attr => {
            return <Accordion key={attr.key} expanded={expanded === attr.key} onChange={handleChange(attr.key)}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls={attr.key + "bh-content"}
                id={attr.key + "bh-header"}
              >
                <Typography component="span" sx={{width: '30%', flexShrink: 0}}>
                  {attr.name}
                </Typography>
                <Typography component="span" sx={{width: '30%', color: 'text.secondary'}}>
                  {attr.key}
                </Typography>
                <Typography component="span" sx={{width: '30%', color: 'text.secondary'}}>
                  {newFun(attr.value)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FullScreen height={"100px"} btn={translate({message: '全屏编辑'})}
                            btns={attr.canRemove && <Button color={'error'}
                                                            variant="text"
                                                            onClick={(event) => removeAttr(attr.key)}>
                                删除
                            </Button>}>
                  <Editor
                    height="100%"
                    value={attr.value.toString()}
                    defaultLanguage="javascript"
                    onChange={(v) => handleEditorChange(v, attr.key)}
                    // defaultValue={attr.value.toString()}
                    // onMount={handleEditorDidMount}
                    options={{
                      fontSize: 14, theme: 'light', scrollbar: {
                        horizontal: "auto",
                      },
                    }}
                  />
                </FullScreen>

              </AccordionDetails>
            </Accordion>
          })}

        </div>
      </Stack>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <Translate>添加属性</Translate>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} marginTop={2}>
            <Grid size={{lg: 12, sm: 12, md: 12}}>
              <TextField
                required
                fullWidth
                label="属性名"
                error={attrNameError}
                helperText={attrNameError && '必填'}
                value={attrName}
                onChange={(e) => setAttrName(e.target.value)}
              />
            </Grid>
            <Grid size={{lg: 12, sm: 12, md: 12}}>
              <TextField
                required
                fullWidth
                error={attrKeyError}
                helperText={attrKeyError && '必填'}
                label="属性 Key"
                value={attrKey}
                onChange={(e) => setAttrKey(e.target.value)}
              />
            </Grid>
            <Grid size={{lg: 12, sm: 12, md: 12}}>
              <Typography variant="subtitle1" gutterBottom>属性代码（JavaScript）</Typography>
              <Box sx={{height: '300px', border: '1px solid #ccc'}}>
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  options={{
                    minimap: {enabled: false},
                    fontSize: 14,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>

          <Button autoFocus onClick={createAttr}>
            确定
          </Button>
        </DialogActions>
      </Dialog>

    </>
  )
}

export default Properties;