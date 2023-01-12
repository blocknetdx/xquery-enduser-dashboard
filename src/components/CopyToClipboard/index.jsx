import React from 'react';
import RTCopyToClipboard from 'react-copy-to-clipboard'

const CopyToClipboard = ({
    content = '',
    handleCopy = () => {},
    children,
}) => {
    const handleCopyClipboard = () => {
        handleCopy(true);

        setTimeout(() => {
            handleCopy(false);
        }, 3000);
    }
    return (
        <RTCopyToClipboard
            text={content}
            onCopy={handleCopyClipboard}
        >
            {children}
        </RTCopyToClipboard>
    );
}

export default CopyToClipboard