import React, { useState } from 'react';

import {
    CheckCircleOutline,
    ContentCopy,
} from '@mui/icons-material'

import { Stack } from '@mui/material';

// import CopyToClipboard from 'react-copy-to-clipboard';
import CopyToClipboard from '../CopyToClipboard';
import styles from './index.module.scss';

const AddressClipboard = ({
    content = '',
}) => {
    const [copyFlag, setCopyFlag] = useState(false);
    return (
        <CopyToClipboard
            content={content}
            handleCopy={setCopyFlag}
        >
            <div className={styles.address}>
                {content}
                {copyFlag ? (
                    <CheckCircleOutline
                        className={styles.cursorPointer}
                    />
                ) : (
                    <ContentCopy className={styles.cursorPointer} />
                )}
            </div>
        </CopyToClipboard>
    );
}

const PaymentAddress = ({
    addresses = [],
}) => {
    return (
        <Stack
            direction="row"
            justifyContent={'space-between'}
            alignItems="center"
            className={styles.payAddress}
        >
            <Stack
                direction="row"
                justifyContent={'flex-start'}
                alignItems="flex-start"
                className={`${styles.left} ${styles.paymentAddress}`}
                spacing={1}
            >
                Payment address:
                {/* <HelpOutline sx={{ fontSize: '16px' }} /> */}
            </Stack>
            <Stack
                direction="column"
                justifyContent={'flex-start'}
                alignItems="flex-end"
                className={`${styles.right}`}
                spacing={1}
            >
                {
                    addresses.map(address => (
                        <AddressClipboard content={address} />
                    ))
                }
            </Stack>
        </Stack>
    );
}

export default PaymentAddress