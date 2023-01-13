import * as React from 'react'
import api from '../../apis'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// mui
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import styled from '@emotion/styled'
import { light, dark } from '../../theme'
import { createStyles, makeStyles } from '@mui/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Avatar } from '@mui/material'

import {
  FilterList,
  Close,
  HelpOutline,
  CheckCircleOutline,
  //RadioButtonUnchecked,
  ArrowForward,
  ArrowBack,
  ContentCopy,
  CheckCircle
} from '@mui/icons-material'

// local file
import info from '../../assets/icons/info.svg'
import styles from './index.module.scss'
import layer2 from '../../assets/icons/layer2.svg'
import help from '../../assets/icons/help.svg'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { setProject } from '../../redux/slice/projectSlice'

import ApiKeySection from '../ApiKeySection'
import { currencyNames } from '../../configs/constants';
import { 
  filterMinAmount, 
  getAcceptedCurrencyNames, 
  getPaymentAddresses 
} from '../../utils/helper'
import ExpiryTimeCountdown from '../ExpiryTimeCountdown'
import PaymentAddress from '../PaymentAddress'
// import { useConnectWallet } from '@web3-onboard/react'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.warning.dark,
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const PaletteDividerBg = styled.div(({ theme }) => ({
  background: `${theme.palette.divider}`
}))

const FilterSelect = styled(Select)(({ theme }) => ({
  boxSizing: 'border-box',
  color: theme.palette.common.black,
  borderRadius: '6px',
  backgroundColor: '#ffffff',
  width: '133px',
  height: '36px'
}))

const ProjectInfoPanel = styled(Stack)(({ theme }) => ({
  padding: '24px',
  marginTop: '12px',
  border: 'none',
  borderRadius: '8px',
  background: theme.palette.warning.dark,
  color: theme.palette.text.primary
}))

const ServiceLevel = styled(Stack)(({ theme }) => ({
  marginTop: '12px',
  color: theme.palette.common.black
}))

const BlackButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.black
}))

const Step3Outer = styled(Stack)(({ theme }) => ({
  padding: '24px',
  marginTop: '12px',
  border: 'none',
  borderRadius: '8px',
  background: theme.palette.warning.dark,
  color: theme.palette.text.primary
}))

const PaymentInfo = styled(Stack)(({ theme }) => ({
  padding: '24px',
  marginTop: '12px',
  border: 'none',
  borderRadius: '8px',
  background: theme.palette.warning.dark,
  color: theme.palette.text.primary
}))

const useStyles = makeStyles(theme =>
  createStyles({
    table: {
      // minWidth: 650
    },
    sticky: {
      position: 'sticky',
      right: 0,
      //background: theme.palette.info.dark,
      padding: '10px',
      background: 'none !important'
    },
    cell: {
      width: '86px !important',
      borderBottom: `1px solid ${theme.palette.divider} !important`,
      whiteSpace: 'nowrap',
      textAlign: 'left',
      [theme.breakpoints.up(860)]: {
        width: '15% !important'
      }
    },
    rowInline: {
      [theme.breakpoints.up(860)]: {
        display: 'inline !important'
      }
    },
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: '#F2F4F7 !important',
    color: theme.palette.primary.text
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

const rows = [
  {
    ip: ['65.119.157.65', '02qb4032...'],
    networks: ['ETH', 'AVAX', 'BSC'],
    cost: [35, 200]
  },
  {
    ip: ['65.119.157.65', '02qb4032...'],
    networks: ['ETH', 'AVAX', 'BSC'],
    cost: [35, 200]
  },
  {
    ip: ['65.119.157.65', '02qb4032...'],
    networks: ['ETH', 'AVAX', 'BSC'],
    cost: [35, 200]
  },
  {
    ip: ['65.119.157.65', '02qb4032...'],
    networks: ['ETH', 'AVAX', 'BSC'],
    cost: [35, 200]
  },
  {
    ip: ['65.119.157.65', '02qb4032...'],
    networks: ['ETH', 'AVAX', 'BSC'],
    cost: [35, 200]
  }
]

const titles = [
  'New Project - Step 1 Title',
  'New Project - Step 2 Title',
  'New Project - Step 3 Title',
  'Title - Project Info',
  'Title - Cancel Project',
  'Title - Project Cancelled',
  'Title - Extend Project - Payment'
]

const filterlist = ['ETH', 'AVAX', 'BSC', 'SYS']

const hasNetwork = (row, filters) => {
  for (let i = 0; i < filters.length; ++i) {
    if (row.networks.findIndex(network => network === filters[i]) >= 0) {
      return true
    }
  }
  return false
}

const capitalizeFirstLetter = (string = '') => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const ProjectModal = props => {
  const { open, signature, handleClose } = props
  // const [{ wallet }] = useConnectWallet()

  const mode = useSelector(state => state.toogle.darkMode)
  const dispatch = useDispatch()
  const theme = mode === 'true' ? dark : light

  const classes = useStyles()

  const dots = [0, 1, 2]

  const [active, setActive] = useState(0)
  const [tabIndex, setTabIndex] = useState(0)
  const [serviceLevel, setServiceLevel] = useState(0)

  const [projectDetail, setProjectDetail] = useState(null);

  const [state, setState] = useState({
    costApiCall: '$0.0002',
    acceptedCurrencies: [],
    quoteExpiryTime: null,
  })
  const [snodes, setSnodes] = useState([]);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);

  // const [scroll, setScroll] = React.useState<DialogProps['scroll']>('body');

  // const [loading, setLoading] = useState(false)

  useEffect(() => {
    getSNodes();
  }, [props])

  async function getSNodes() {
    try {
      const response = await api.project.getSNodes();
      console.log('CreateProjectModal response: ', response);
      setSnodes(response.data?.data || []);
    } catch (error) {
      toast(`Backend server error occured: ${error?.message}`)
    }
  }

  const onClickDetail = async (index) => {
    // console.log('onClickDetail', index);
    if (signature) {
      const body = {
        id: 1,
        method: 'request_project',
        params: [{"XQuery": "True"}]
      }
      const userid = localStorage.getItem('userid');
      try {
        const result = await api.project.createProject(body, userid)
        console.log('create project modal result: ', result);
        dispatch(setProject(result?.data?.data))
        setSelectedNodeIndex(index);
        setProjectDetail(result?.data?.data);

        setState(pre => ({
          ...pre,
          acceptedCurrencies: filterMinAmount(result?.data?.data),
        }))
        setTabIndex(1)
      } catch (error) {
        // console.log(typeof error?.message)
        toast(`Backend server error occured: ${error?.message}`)
      }
    }
  }

  const [copyFlag, setCopyFlag] = useState(false)

  useEffect(() => {
    if (tabIndex === 0) {
      setActive(0)
    } else if (tabIndex === 1) {
      setActive(1)
    } else {
      setActive(2)
    }
  }, [tabIndex])

  const [toFilter, setToFilter] = useState([])
  const [fromFilter, setFromFilter] = useState(filterlist)

  useEffect(() => {
    setActive(0)
    setTabIndex(0)
    setServiceLevel(0)
    setCopyFlag(false)
    setToFilter([])
    setFromFilter(filterlist)
  }, [open])

  const handleChange = event => {
    let fromTemp = fromFilter
    let toTemp = toFilter

    toTemp.push(event.target.value)
    setToFilter(toTemp)
    fromTemp = fromFilter.filter(item => item !== event.target.value)
    setFromFilter(fromTemp)
  }

  const handleDelete = newValue => {
    let fromTemp = fromFilter
    let toTemp = toFilter

    fromTemp.push(newValue)
    setFromFilter(fromTemp)
    toTemp = toFilter.filter(item => item !== newValue)
    setToFilter(toTemp)
  }

  return (
    <div>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        // scroll={scroll}
        className={styles.verticalScrollModal}
      >
        <Box className={styles.modalNewBox}>
          <Stack direction="row" justifyContent="flex-end">
            <Close className={styles.closeIcon} onClick={handleClose} />
          </Stack>
          <Typography
            id="modal-modal-title"
            variant="h2"
            component="h2"
            className={styles.title}
            color="common.black"
          >
            {tabIndex === 0
              ? titles[0]
              : tabIndex === 1
              ? titles[1]
              : titles[2]}
          </Typography>
          <PaletteDividerBg className={styles.divider} />
          {
            tabIndex !== 2 &&
            <React.Fragment>            
              <Typography className={`${styles.chooseLabel}`}>
                Your Project Details
              </Typography>
              <Typography
                className={`${styles.desc} ${styles.mb10}`}
                color="text.primary"
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
                purus sit amet luctus venenatis, lectus magna fringilla urna,
                porttitor rhoncus dolor purus non.
              </Typography>
            </React.Fragment>
          }
          {tabIndex === 0 && (
            <div className={styles.tab0}>
              <div className={styles.tableBox}>
                {/* <div className={styles.tableFilter} >
                    <Stack direction="row" spacing={1} sx={{ color: 'common.black' }}>
                      <Chip label="ETH" color="primary" sx={{ bgcolor: '#b9a7e1', color: '#7f56d9', fontWeight: 'bold' }} onDelete={handleDelete} />
                      <Chip label="AVAX" color="primary" onDelete={handleDelete} />
                      <Button variant='outlined'><FilterList />Filters</Button>
                    </Stack>
                  </div> */}

                <div className={styles.tableFilter}>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    className={styles.gap}
                  >
                    {toFilter.map(item => (
                      <button className={styles.toModalFilterBtn} key={item}>
                        {item}{' '}
                        <Close
                          className={styles.smallCloseIcon}
                          onClick={() => handleDelete(item)}
                        />
                      </button>
                    ))}
                    <FilterSelect
                      id="demo-simple-select-autowidth"
                      value={0}
                      onChange={handleChange}
                      autoWidth
                    >
                      <MenuItem value={0} className={styles.hide}>
                        <Stack direction="row" gap="8px" alignItems="center">
                          <FilterList />
                          <div>Filters</div>
                        </Stack>
                      </MenuItem>
                      {fromFilter.map(item => (
                        <MenuItem
                          key={item}
                          value={item}
                          className={styles.menuItem}
                        >
                          {item}
                        </MenuItem>
                      ))}
                    </FilterSelect>
                  </Stack>
                </div>

                <TableContainer
                  component={Paper}
                  className={`${styles.tableBody} ${styles.fullWidth}`}
                >
                  <Table
                    className={styles.projectTable}
                    aria-label="customized table"
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell
                          className={`${styles.headItem} ${styles.headItem1}`}
                        >
                          Host Server IP
                          <img
                            src={help}
                            className={styles.helpIcon}
                            width="16px"
                            height="16px"
                            alt="help"
                          />
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          className={`${styles.headItem} ${styles.headItem2}`}
                        >
                          Supported Networks
                          <img
                            src={help}
                            className={styles.helpIcon}
                            width="16px"
                            height="16px"
                            alt="help"
                          />
                        </StyledTableCell>
                        {/* <StyledTableCell
                          align="left"
                          className={`${styles.headItem} ${styles.headItem3}`}
                        >
                          Monthly cost
                          <img
                            src={help}
                            className={styles.helpIcon}
                            width="16px"
                            height="16px"
                            alt="help"
                          />
                        </StyledTableCell> */}
                        <StyledTableCell
                          align="left"
                          className={`${`${styles.headItem} ${styles.headItem4}`} ${
                            classes.sticky
                          }`}
                        >
                          Server info
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className={styles.whiteBg}>
                      {snodes
                        .filter(
                          row =>
                            toFilter.length === 0 || hasNetwork(row, toFilter)
                        )
                        .map((row, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                              <Stack direction="column">
                                <div className={styles.ip1}>{row.ip[0]}</div>
                                <div className={styles.ip2}>{row.ip[1]}</div>
                              </Stack>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <Stack
                                display="flex"
                                gap="5px"
                                flexDirection="row"
                              >
                                {
                                  row.networks.map((network) => {
                                    return <Chip key={network} label={network} size='small' className={styles[`chip${capitalizeFirstLetter(network)}`]} />
                                  })
                                }
                              </Stack>
                            </StyledTableCell>
                            {/* <StyledTableCell align="left">
                              <Stack direction="column">
                                <div className={styles.tier}>
                                  Tier 1: ${row.cost[0]}
                                </div>
                                <div className={styles.tier}>
                                  Tier 2: ${row.cost[1]}
                                </div>
                              </Stack>
                            </StyledTableCell> */}
                            <StyledTableCell
                              align="left"
                              className={classes.sticky}
                            >
                              <Button
                                variant="contained"
                                className={styles.detailsButton}
                                onClick={() => onClickDetail(index)}
                              >
                                <span className={styles.infoBtnSpace}>
                                  View details
                                </span>
                                <img
                                  src={info}
                                  alt="info"
                                  width={20}
                                  height={20}
                                />
                              </Button>
                              <Button
                                variant="contained"
                                className={styles.infoMobile}
                                onClick={() => onClickDetail(index)}
                              >
                                <img
                                  src={info}
                                  alt="info"
                                  width={15.7}
                                  height={15.7}
                                />
                              </Button>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          )}
          {tabIndex === 1 && ( // Step 2
            <div className={styles.tab1}>
              <ProjectInfoPanel
                spacing={3}
                className={`${styles.projectInfoPanel} ${styles.mb30}`}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  className={styles.apiKey}
                >
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={0.5}
                  >
                    <Typography className={styles.projectInfoLabel}>
                      Host Server IP:
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <div>{snodes.length > selectedNodeIndex && snodes[selectedNodeIndex]?.ip[0]}</div>
                </Stack>
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
                      Supported Networks:
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={1}
                    className={styles.mixBlendMode}
                  >
                    {
                      snodes.length > 0 && snodes.length > selectedNodeIndex &&
                      snodes[selectedNodeIndex]?.networks.map(network => (
                        <Chip key={network} label={network} size='small' className={styles[`darkChip${capitalizeFirstLetter(network)}`]} />
                      ))
                    }
                  </Stack>
                </Stack>
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
                      Accepted Payment Currencies:
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <div>{ getAcceptedCurrencyNames(state?.acceptedCurrencies) }</div>
                </Stack>
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
                      Cost per 1000 API calls:
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <div>{state?.costApiCall}</div>
                </Stack>
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
                      Project ID: 
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <div>{projectDetail?.project_id}</div>
                </Stack>
                <ApiKeySection apiKey={projectDetail?.api_key} />
                <ExpiryTimeCountdown expiryTime={projectDetail?.quote_expiry_time} />
              </ProjectInfoPanel>
              <div className={styles.detail}>
                <Typography className={`${styles.chooseLabel}`}>
                  Payment Info
                </Typography>
                <Typography className={styles.desc} color="text.primary">
                  Text content to explain max 1 hour wait for pending tx and what happens next after payment has been made.
                </Typography>
              </div>
            </div>
          )}
          {tabIndex === 2 && ( // Step 3
            <div className={styles.tab2}>
              <div className={styles.detail}>
                <Typography
                  className={`${styles.subTitle} ${styles.marginTopHalf}`}
                  color="common.black"
                >
                  Payment Info
                </Typography>
                <Typography className={styles.desc} color="text.primary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                  aliquam, purus sit amet luctus venenatis, lectus magna
                  fringilla urna, porttitor rhoncus dolor purus non.
                </Typography>
              </div>
              <PaymentInfo spacing={3} className={styles.mb30}>
                {/* <div className={styles.info}> */}
                <Stack
                  direction={'row'}
                  justifyContent="space-between"
                  className={styles.amount}
                >
                  <Stack
                    direction="row"
                    justifyContent={'flex-start'}
                    className={styles.amountLeft}
                    spacing={1}
                  >
                    <div className={`${styles.subTItle} ${styles.m0}`}>
                      Amount to pay:
                    </div>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <Stack
                    direction="column"
                    justifyContent={'flex-end'}
                    className={styles.amountRight}
                    alignItems={'flex-end'}
                  >
                    {
                      state?.acceptedCurrencies.map(currency => (
                        <div key={currency}>
                          <span>{`${projectDetail[currency]} ${currencyNames[currency]}`}</span>
                        </div>
                      ))
                    }
                  </Stack>
                </Stack>
                <ExpiryTimeCountdown expiryTime={projectDetail?.quote_expiry_time} />
                <PaymentAddress addresses={getPaymentAddresses(projectDetail)} />
                <Typography className={`${styles.fontItalic}`}>
                  Text content to explain{' '}
                  <b className={styles.tierInServiceLevel}>
                    max 1 hour wait for pending tx
                  </b>{' '}
                  and what happens next after payment has been made.
                </Typography>
                {/* </div> */}
              </PaymentInfo>
              <div className={styles.detail}>
                <Typography
                   className={`${styles.chooseLabel}`}
                  color="common.black"
                >
                  Your Project Summary
                </Typography>
                <Typography className={styles.desc} color="text.primary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                  aliquam, purus sit amet luctus venenatis, lectus magna
                  fringilla urna, porttitor rhoncus dolor purus non.
                </Typography>
              </div>
              <ProjectInfoPanel
                spacing={3}
                className={`${styles.projectInfoPanel} ${styles.mb30}`}
              >
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
                      Project ID:
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <div>{projectDetail?.project_id}</div>
                </Stack>
                <ApiKeySection apiKey={projectDetail?.api_key} />
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
                      Supported Networks:
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={1}
                    className={styles.mixBlendMode}
                  >
                    {
                      snodes.length > 0 && snodes.length > selectedNodeIndex &&
                      snodes[selectedNodeIndex]?.networks.map(network => (
                        <Chip key={network} label={network} size='small' className={styles[`darkChip${capitalizeFirstLetter(network)}`]} />
                      ))
                    }
                  </Stack>
                </Stack>
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
                      Cost per 1000 API calls:
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <div>{state?.costApiCall}</div>
                </Stack>
              </ProjectInfoPanel>
            </div>
          )}

          <Stack
            direction={'row'}
            justifyContent="center"
            gap="10px"
            className={styles.dotsBody}
          >
            {dots.map((item, index) => {
              return (
                <button
                  key={index}
                  className={styles.dot}
                  style={{
                    backgroundColor: index === active ? '#b692f6' : '#e9d7fe'
                  }}
                ></button>
              )
            })}
          </Stack>

          {tabIndex === 0 && (
            <div className={`${styles.fullWidth} ${styles.contentCenter}`}>
              <BlackButton
                className={styles.cancelBtn}
                variant="outlined"
                onClick={handleClose}
              >
                Cancel
              </BlackButton>
            </div>
          )}

          {tabIndex === 1 && (
            <Stack direction={'row'} justifyContent="space-between">
              <BlackButton
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => {
                  setTabIndex(0)
                  setActive(0)
                }}
              >
                <Typography variant="h4">Go&nbsp;back</Typography>
              </BlackButton>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() => setTabIndex(2)}
                className={styles.height44}
              >
                <Typography variant="h4">
                  Continue&nbsp;to&nbsp;payment
                </Typography>
              </Button>
            </Stack>
          )}

          {tabIndex === 2 && (
            <Stack
              direction={'row'}
              justifyContent="space-between"
              className={styles.marginTop}
            >
              <BlackButton
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => {
                  setTabIndex(1)
                  setActive(1)
                }}
              >
                <Typography variant="h4">Go&nbsp;back</Typography>
              </BlackButton>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() => {
                  setTabIndex(0)
                  handleClose()
                }}
                className={styles.height44}
              >
                <Typography variant="h4">
                  Return&nbsp;to&nbsp;dashboard
                </Typography>
              </Button>
            </Stack>
          )}
        </Box>
      </Modal>
    </div>
  )
}

export default ProjectModal
