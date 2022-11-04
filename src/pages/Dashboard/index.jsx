import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useMedia } from 'react-use'
import { useNotifications, useConnectWallet } from '@web3-onboard/react'
import { Button, IconButton, Typography } from '@mui/material'
import styled from '@emotion/styled'
import {
  ApexChart,
  Card,
  FlexColumn,
  FlexRow,
  StyledTable
} from '../../components'
import { MenuItem as CustomMenuItem } from '../../assets/styles/chart'
import { light, dark } from '../../theme'
import styles from './index.module.scss'
import logo from '../../assets/logo.svg'
import rocket from '../../assets/icons/rocket.svg'
import launch from '../../assets/icons/launch.svg'
import twitter from '../../assets/icons/twitter.svg'
import reddit from '../../assets/icons/reddit.svg'
import discord from '../../assets/icons/discord.svg'
import telegram from '../../assets/icons/telegram.svg'
import github from '../../assets/icons/github.svg'
import book from '../../assets/icons/book.svg'
import website from '../../assets/icons/website.svg'
// import darkIcon from "../../assets/icons/dark.svg"
// import lightIcon from "../../assets/icons/light.svg"
// import avatar1 from "../../assets/avatar/avatar1.png"

import ProjectModal from '../../components/Modal'

// mui select
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { ContentCopy, DateRangeOutlined, Check } from '@mui/icons-material'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { makeStyles } from '@mui/styles'
import { useEagerConnect, useVerifySignature } from '../../hooks'

const Code = `curl http://<NODE-URL>/xrs/evm_passthrough/AVAX/<PROJECT-ID> \\
  - X POST \\
  -H "Content-Type: application/json" \\
  -H "Api-Key: <API-KEY>" \\
  -d
'{"jsonrpc":"2.0","method":"eth_blockNumber","params": [],"id":1}`

const JsonInfo = `{
    "jsonrpc" : "2.0",
    "id": 1,
    "result": "0x16c131ea72" 
}`

const HeaderContainer = styled.div(({ theme }) => ({
  background: theme.palette.info.light,
  borderBottom: `1px solid ${theme.palette.background.paper}`
}))

const DashboardContainer = styled.div(({ theme }) => ({
  background: theme.palette.info.main,
  paddingTop: '48px'
}))

const CodeTag = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.warning.main,
  marginTop: '20px',
  padding: '16px',
  borderRadius: '16px',
  wordBreak: 'break-all',
  position: 'relative'
}))

const WhitePre = styled.pre(({ theme }) => ({
  color: theme.palette.common.white
}))

const RequestDetails = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.warning.main,
  padding: '16px',
  borderRadius: '16px',
  wordBreak: 'break-all',
  position: 'relative'
}))

const DividerDiv = styled.div(({ theme }) => ({
  background: `${theme.palette.divider}`
}))

const Header = ({ signature, customNotification }) => {
  const mode = useSelector(state => state.toogle.darkMode)
  const theme = mode === 'true' ? dark : light
  // const dispatch = useDispatch()

  const [createOpen, setCreateOpen] = useState(false)
  const handleOpen = () => setCreateOpen(true)
  const handleClose = () => setCreateOpen(false)

  // const toogleTheme = () => {
  //   localStorage.setItem('darkMode', mode === 'true' ? 'false' : 'true')
  //   dispatch(setDarkMode(mode === 'true' ? 'false' : 'true'))
  // }

  return (
    <HeaderContainer>
      <div className={`${styles.header}`}>
        <img src={logo} alt="logo" width={115} height={36} />
        <div className={`${styles.innerFlex}`}>
          {/* <IconButton sx={{ width: '40px', height: '40px' }} onClick={() => toogleTheme()}>
            <img src={mode === 'true' ? darkIcon : lightIcon} alt='mode' width={32} height={32} />
          </IconButton> */}
          <Button variant="contained" onClick={handleOpen}>
            <span className={styles.newProject}>New Project</span>
            <img src={rocket} alt="rocket" />
          </Button>
          {/* <img src={avatar1} alt='avatar' width={40} height={40} /> */}
        </div>
      </div>
      <ProjectModal
        customNotification={customNotification}
        open={createOpen}
        signature={signature}
        handleClose={handleClose}
      />
    </HeaderContainer>
  )
}

const useStyles = makeStyles(theme => ({
  formControl: {
    m: 1,
    minWidth: 200,
    minHieght: 2,
    height: 20,
    mb: 3,
    width: '100%'
  },
  formSelect: {
    position: 'relative',
    width: '100%',
    paddingLeft: '35px',
    height: '40px',
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '8px'
  },
  dateIcon: {
    position: 'absolute',
    top: '8px',
    left: '15px',
    zIndex: 10,
    color: `${theme.palette.common.black} !important`
  },
  button: {
    boxShadow: 'none !important'
  },
  overview: {
    [theme.breakpoints.down(960)]: {
      fontSize: '20px !important',
      fontWeight: '500 !important',
      lineHeight: '1.5 !important'
    }
  }
}))

const Chart = () => {
  const [activeStatus, setActiveStatus] = useState(0)
  const durations = ['12 months', '3 months', '30 days', '7 days', '24 hours']
  const classes = useStyles()

  const changeStatus = newStatus => {
    setActiveStatus(newStatus)
  }

  const [value, setValue] = useState(0)

  const handleChange = event => {
    setValue(event.target.value)
  }

  return (
    <Card className={`${styles.chart}`}>
      <Typography variant="h3" color="common.black">
        Chart data coming soon...
      </Typography>
      <div className={styles.mobileSelect}>
        <FormControl className={classes.formControl}>
          <DateRangeOutlined className={classes.dateIcon} />

          <Select disabled
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={value}
            // label="Select Period"
            onChange={handleChange}
            IconComponent={props => (
              <ExpandMoreIcon className={styles.expandMoreIcon} />
            )}
            className={classes.formSelect}
          >
            {durations.map((duration, index) => {
              return (
                <MenuItem key={index} value={index}>
                  {duration}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </div>
      <div className={styles.desktopSelect}>
        <FlexRow>
          {durations.map((duration, index) => {
            return (
              <CustomMenuItem
                key={index}
                variant="contained"
                // active={activeStatus === index ? 'true' : 'false'}
                active="false"
                onClick={() => changeStatus(index)}
              >
                {duration}
              </CustomMenuItem>
            )
          })}
        </FlexRow>
      </div>
      <ApexChart />
    </Card>
  )
}

const Dashboard = () => {
  const classes = useStyles()
  const isMobile = useMedia('(max-width: 576px)')
  const mode = useSelector(state => state.toogle.darkMode)
  const theme = mode === 'true' ? dark : light
  const [modalOpen, setModalOpen] = useState(false)
  const [copyFlag, setCopyFlag] = useState(false)
  const [customNotification] = useNotifications()
  const { preConnect } = useEagerConnect()
  const [{ wallet }] = useConnectWallet()
  const { signature } = useVerifySignature()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('auth info:', { wallet, signature })
    if (!preConnect && (!wallet || !signature)) {
      console.log('redirecting:', { preConnect, wallet, signature })
      navigate('/login')
    }
    // if (!!wallet) {
    //   connect()
    // }
  }, [preConnect, wallet, signature, navigate])

  const copyClip = () => {
    if (!Code) {
      return
    }
    let textField = document.createElement('textarea')
    textField.innerText = Code
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()

    setCopyFlag(true)
  }

  return (
    <>
      <Header signature={signature} customNotification={customNotification} />
      <DashboardContainer className={`${styles.content}`}>
        <div className={styles.container}>
          <Typography
            className={classes.overview}
            variant="h1"
            color="common.black"
            mb="4px"
          >
            Projects Overview
          </Typography>
          <Typography variant="h4" color="text.primary" mb="30px">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
            purus sit
          </Typography>
          <FlexRow className={`${styles.subContainer} ${styles.gap}`}>
            <FlexColumn className={`${styles.leftSubContainer} ${styles.gap}`}>
              <Chart />            
              <StyledTable
                theme={theme}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
              />
            </FlexColumn>
            <FlexColumn className={`${styles.rightSubContainer} ${styles.gap}`}>
              <Card className={`${styles.about}`}>
                <div className={styles.aboutHead}>
                  <Typography
                    variant="h4"
                    color="common.black"
                    className={styles.title}
                  >
                    Getting Started with XQuery
                  </Typography>
                </div>
                <div className={styles.aboutBody1}>
                  <Typography variant="p" color="text.primary">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Rhoncus elit interdum aliquet.
                  </Typography>
                  <FlexRow className={`${styles.spaceBetween}`}>
                    <Button
                      href="https://api.blocknet.org/#xquery-api"
                      target="_blank"
                      variant="outlined"
                      className={styles.commonBtn}
                    >
                      <span className={styles.iconBtnSpace}>Support docs</span>
                      <img
                        src={launch}
                        width="20px"
                        height="20px"
                        alt="launch"
                      />
                    </Button>
                    <Button
                      href="https://discord.gg/mZ6pTneMx3"
                      target="_blank"
                      variant="outlined"
                      className={styles.commonBtn}
                    >
                      <span className={styles.iconBtnSpace}>Join Discord</span>
                      <img
                        src={launch}
                        width="20px"
                        height="20px"
                        alt="launch"
                      />
                    </Button>
                  </FlexRow>
                </div>
              </Card>
              <Card className={`${styles.about2}`}>
                <Accordion className={styles.transparentBg}>
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon className={styles.blackColor} />
                    }
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={styles.accordionSummary}
                  >
                    <div>
                      <Typography
                        variant="h4"
                        color="common.black"
                        className={`${styles.title} ${styles.mb16}`}
                      >
                        Your First Request
                      </Typography>
                      <Typography
                        variant="p"
                        color="text.primary"
                        className={styles.requestText}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Quis sit facilisi non, suspendisse.
                      </Typography>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails className={styles.requestDetails}>
                    {/* <Typography sx={{ mb: 2 }} variant='h4' color='text.primary'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis sit facilisi non, suspendisse.</Typography> */}
                    <CodeTag variant="p" color="common.white">
                      <WhitePre className={styles.codes}>{Code}</WhitePre>
                      {copyFlag ? (
                        <Check className={styles.check} />
                      ) : (
                        <Button
                          onClick={() => copyClip()}
                          variant="contained"
                          size="small"
                          className={styles.check}
                        >
                          <ContentCopy className={styles.font16} /> Copy
                        </Button>
                      )}
                    </CodeTag>
                    <Typography variant="p" color="text.primary">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Quis sit facilisi non, suspendisse.
                    </Typography>
                    <RequestDetails variant="p">
                      <WhitePre className={classes.codes}>{JsonInfo}</WhitePre>
                    </RequestDetails>
                  </AccordionDetails>
                </Accordion>
              </Card>
              <Card className={`${styles.about}`}>
                <div className={styles.aboutHead}>
                  <Typography
                    variant="h4"
                    color="common.black"
                    className={styles.title}
                  >
                    Get the latest updates
                  </Typography>
                </div>
                <div className={styles.aboutBody2}>
                  <Typography variant="p" color="text.primary">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Quis sit facilisi non, suspendisse.
                  </Typography>
                  <FlexRow className={`${styles.flexStart}`}>
                    <IconButton
                      href="https://twitter.com/The_Blocknet"
                      target="_blank"
                    >
                      <img src={twitter} alt="twitter" />
                    </IconButton>
                    <IconButton
                      href="https://www.reddit.com/r/theblocknet/"
                      target="_blank"
                    >
                      <img src={reddit} alt="reddit" />
                    </IconButton>
                    <IconButton
                      href="https://discord.gg/mZ6pTneMx3"
                      target="_blank"
                    >
                      <img src={discord} alt="discord" />
                    </IconButton>
                    <IconButton href="https://t.me/Blocknet" target="_blank">
                      <img src={telegram} alt="telegram" />
                    </IconButton>
                    <IconButton
                      href="https://github.com/blocknetdx/"
                      target="_blank"
                    >
                      <img src={github} alt="github" />
                    </IconButton>
                  </FlexRow>
                </div>
              </Card>
              <Card className={`${styles.about1}`}>
                <div className={styles.verticalAlign}>
                  <Typography
                    variant="h4"
                    color="common.black"
                    className={styles.title}
                  >
                    About XQuery
                  </Typography>
                  <Typography
                    variant="p"
                    color="text.primary"
                    sx={{
                      lineHeight: '1.43 !important',
                      marginTop: isMobile ? '-15px' : '0px'
                    }}
                  >
                    XQuery decentralizes access to indexed blockchain data,
                    removing a critical burden of trust from the blockchain
                    stack: centralized data providers.
                  </Typography>
                  <DividerDiv className={`${styles.divider}`} />
                </div>
                <div className={`${styles.verticalAlignSmall}`}>
                  <Typography
                    variant="h4"
                    color="common.black"
                    className={styles.title}
                  >
                    Built by The Blocknet
                  </Typography>
                  <Typography
                    variant="p"
                    color="text.primary"
                    className={styles.blocknet}
                  >
                    Dolor enim eu tortor urna sed duis nulla. Aliquam
                    vestibulum, nulla odio nisl vitae. In aliquet pellentesque
                    aenean hac vestibulum turpis mi bibendum diam. Tempor
                    integer aliquam in vitae malesuada fringilla. Elit nisi in
                    eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo
                    consectetur convallis risus.
                  </Typography>
                  <FlexRow className={`${styles.flexStart}`}>
                    <img src={website} alt="website" />
                    <a
                      className={`${styles.link}`}
                      href="https://blocknet.org"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Blocknet.org
                    </a>
                  </FlexRow>
                  <FlexRow className={`${styles.flexStart}`}>
                    <img src={book} alt="book" />
                    <a
                      className={`${styles.link}`}
                      href="https://docs.blocknet.org"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      docs.blocknet.org
                    </a>
                  </FlexRow>
                  <FlexRow className={`${styles.flexStart}`}>
                    <img src={discord} alt="discord" />
                    <a
                      className={`${styles.link}`}
                      href="https://discord.gg/mZ6pTneMx3"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Discord
                    </a>
                    {/* eslint-disable-line */}
                  </FlexRow>
                  <FlexRow className={`${styles.flexStart}`}>
                    <img src={telegram} alt="telegram" />
                    <a
                      className={`${styles.link}`}
                      href="https://t.me/Blocknet"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Telegram
                    </a>
                    {/* eslint-disable-line */}
                  </FlexRow>
                </div>
              </Card>
            </FlexColumn>
          </FlexRow>
        </div>
      </DashboardContainer>
    </>
  )
}

export default Dashboard
