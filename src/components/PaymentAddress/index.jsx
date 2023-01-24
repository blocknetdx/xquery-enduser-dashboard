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
        <React.Fragment>
            <Stack
                justifyContent={'flex-start'}
                alignItems="flex-start"
                className={`${styles.left} ${styles.paymentAddress}`}
                spacing={1}
            >
                Payment address:
                {/* <HelpOutline sx={{ fontSize: '16px' }} /> */}
            </Stack>

            {
                addresses.map(({name, address}) => (
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
                            {name}
                            {/* <HelpOutline sx={{ fontSize: '16px' }} /> */}
                        </Stack>
                        <AddressClipboard content={address} />
                    </Stack>
                ))
            }
        </React.Fragment>
    );
}

export default PaymentAddress