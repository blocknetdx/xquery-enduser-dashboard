import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import usePagination from '@mui/material/usePagination'
import { useSelector } from 'react-redux'
import { useMedia } from 'react-use'
import styled from '@emotion/styled'
import { Button, Typography, IconButton } from '@mui/material'
import { FlexColumn } from '../Layout'
import { createStyles, makeStyles } from '@mui/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import ProgressBar from '../ProgressBar'
import { Card } from '../Card'
import { light, dark } from '../../theme'
import styles from './index.module.scss'
import searchIcon from '../../assets/icons/search.svg'
import info from '../../assets/icons/info.svg'
import forward from '../../assets/icons/forward.svg'
import backward from '../../assets/icons/backward.svg'
import { Stack } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { FilterList, Close } from '@mui/icons-material'
import OutlinedInput from '@mui/material/OutlinedInput'
// custom components
import ProjectInfoModal from '../ViewInfoModal'
import api from '../../apis'
import useApiUsage from '../../hooks/useApiUsage'

// const useStyles = makeStyles(theme =>
//     createStyles({
//         cell: {
//             width: '86px !important',
//             borderBottom: `1px solid ${theme.palette.divider} !important`,
//             whiteSpace: 'nowrap',
//             textAlign: 'left',
//             [theme.breakpoints.up(960)]: {
//                 width: '15% !important'
//             }
//         },
//         rowInline: {
//             [theme.breakpoints.up(960)]: {
//                 maxHeight: '66px !important',
//                 display: 'inline !important'
//             }
//         },
//         stacks: {
//             [theme.breakpoints.down(960)]: {
//                 minWidth: '100%',
//                 flexWrap: 'wrap'
//             }
//         },
//     })
// )

export default function ProjectTableRow({ 
    data, 
    index, 
    useStyles,
    handleGetInfo = () => {} 
}) {
    const classes = useStyles()
    const { projectId, apiKey } = data;
    const [apiUsage] = useApiUsage({
        projectId,
        apiKey
    });

    return (
        <TableRow className={classes.rowInline} key={index}>
            <TableCell
                className={classes.cell}
                padding="none"
                component="th"
                scope="row"
            >
                <FlexColumn
                    className={`${styles.column} ${styles.flexStart}`}
                >
                    <Typography
                        className={`${styles.title}`}
                        color="common.black"
                        variant="h6"
                    >
                        Project ID
                    </Typography>
                    <Typography
                        variant="h6"
                        color="#475467"
                        className={styles.fontWeight400}
                    >
                        {data.projectId.slice(0, 8).concat('...')}
                    </Typography>
                </FlexColumn>
            </TableCell>
            <TableCell
                className={classes.cell}
                padding="none"
                align="right"
            >
                <FlexColumn
                    className={`${styles.column} ${styles.flexStart}`}
                >
                    <Typography
                        className={`${styles.title}`}
                        color="common.black"
                        variant="h6"
                    >
                        Status
                    </Typography>
                    <Typography variant="h6" color="#475467">
                        {data.status}
                    </Typography>
                </FlexColumn>
            </TableCell>
            <TableCell
                className={classes.cell}
                padding="none"
                align="right"
            >
                <FlexColumn
                    className={`${styles.column} ${styles.flexStart}`}
                >
                    <Typography
                        className={`${styles.title}`}
                        color="common.black"
                        variant="h6"
                    >
                        Usage
                    </Typography>
                    <ProgressBar process={apiUsage || data.usage} />
                </FlexColumn>
            </TableCell>
            <TableCell
                className={`${classes.cell} ${classes.paddingRight}`}
                align="right"
            >
                <Button
                    variant="contained"
                    onClick={() => handleGetInfo(data.projectId, data.apiKey)}
                    className={styles.viewProjectInfoBtn}
                >
                    <span className={styles.infoBtnSpace}>
                        View project info
                    </span>
                    <img src={info} alt="info" />
                </Button>
            </TableCell>
        </TableRow>
    );
}