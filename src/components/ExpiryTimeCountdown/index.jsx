import React from 'react'
// mui
import Typography from '@mui/material/Typography'

import {
  HelpOutline,
} from '@mui/icons-material'

// local file
import styles from './index.module.scss'
import Stack from '@mui/material/Stack'

import CountdownTimer from '../CountDown/CountdownTimer'

export default function ExpiryTimeCountdown({
    expiryTime = new Date(),
}) {
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
                    Quote expiry time:
                </Typography>
                <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
            </Stack>
            <CountdownTimer targetDate={expiryTime} />
        </Stack>
    );
}