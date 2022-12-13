import * as React from 'react'
import { useState } from 'react'

import Typography from '@mui/material/Typography'

import {
  HelpOutline,
  VisibilityOutlined,
  VisibilityOffOutlined,
} from '@mui/icons-material'

import { createStyles, makeStyles } from '@mui/styles'

import styles from './index.module.scss'

import Stack from '@mui/material/Stack'

const useStyles = makeStyles(theme =>
    createStyles({
      key: {
        fontSize: '14px',
        [theme.breakpoints.down(576)]: {
          fontSize: '12px',
          wordWrap: 'break-word !important',
          width: '265px !important'
        }
      }
    })
  )
  

const ApiKeySection = ({
  apiKey = '',
}) => {
  const [keyVisibility, setKeyVisibility] = useState(false)
  const classes = useStyles()

  const recover = len => {
    const ch = '*'
    let pass = ''
    for (let i = 0; i < len; i++) pass += ch
    return pass
  }

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      className={styles.mobileDisplay}
    >
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={0.5}
      >
        <Typography className={styles.projectInfoLabel}>
          API Key:
        </Typography>
        <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <span className={classes.key}>
          {keyVisibility
            ? apiKey
            : recover(apiKey?.length)}
        </span>
        {keyVisibility ? (
          <VisibilityOutlined
            className={styles.cursorPointer}
            onClick={() => setKeyVisibility(false)}
          />
        ) : (
          <VisibilityOffOutlined
            className={styles.cursorPointer}
            onClick={() => setKeyVisibility(true)}
          />
        )}
      </Stack>
    </Stack>
  );
}

export default ApiKeySection;
