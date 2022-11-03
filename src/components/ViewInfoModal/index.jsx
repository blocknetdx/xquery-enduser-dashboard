import * as React from 'react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from '@emotion/styled'
// mui
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { light, dark } from '../../theme'
import {
  Close,
  CheckCircleOutline,
  ArrowForward,
  ArrowBack,
  ContentCopy,
  RocketLaunch
} from '@mui/icons-material'

import styles from './index.module.scss'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

const titles = [
  'Title - Project Info',
  'Title - Cancel Project',
  'Title - Project Cancelled',
  'Title - Extend Project - Payment'
]

const LightBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  border: 'none !important'
}))

const DividerDiv = styled.div(({ theme }) => ({
  backgroundColor: theme.palette.divider
}))

const ProjectOuter = styled(Stack)(({ theme }) => ({
  padding: '20px',
  marginTop: '12px',
  border: 'none',
  borderRadius: '16px',
  background: theme.palette.warning.dark,
  color: theme.palette.text.primary
}))

const SmallOuter = styled(Stack)(({ theme }) => ({
  padding: '16px',
  marginTop: '12px',
  border: 'none',
  borderRadius: '8px',
  background: theme.palette.warning.dark,
  color: theme.palette.text.primary
}))

const BigOuter = styled(Stack)(({ theme }) => ({
  padding: '24px',
  marginTop: '12px',
  border: 'none',
  borderRadius: '8px',
  background: theme.palette.warning.dark,
  color: theme.palette.text.primary
}))

const ConfirmCancelButton = styled(Button)`
  background-color: #d92d20;
  height: 44px;
  border-radius: 6px;
  &:hover: {
    background-color: '#c9665f';
  }
`

const TitleProjectInfo = styled(Stack)(({ theme }) => ({
  marginTop: '24px',
  gap: '10px',
  color: theme.palette.common.black
}))

const ProjectInfoModal = props => {
  const { projectInfo, modalOpen, setModalOpen } = props
  const mode = useSelector(state => state.toogle.darkMode)
  const theme = mode === 'true' ? dark : light

  const analyseInfo = () => {
    if (!projectInfo) return null
    const date = new Date(projectInfo?.expiry_time)
    const networks = Object.keys(projectInfo).filter(
      key => key.includes('_address') && !!projectInfo[key]
    )
    // .map((key) => key.split("_")[0])
    const currencies = Object.keys(projectInfo).filter(
      key => key.includes('amount_') && Number(projectInfo[key]) > 0
    )
    // .map((key) => key.split("_")[key.split("_").length - 1])

    return {
      id: projectInfo?.project_id,
      status: projectInfo?.status,
      usage: 'unknown',
      expires:
        date?.getHours() +
        ':' +
        date?.getMinutes() +
        ', ' +
        date?.toDateString()?.slice(4),
      networks: networks,
      currencies: currencies,
      tier: projectInfo?.tier
    }
  }

  const dots = [0, 1, 2]

  const [active, setActive] = useState(0)

  const [tabIndex, setTabIndex] = useState(0)
  const [title, setTitle] = useState(titles[0])
  const [copyFlag, setCopyFlag] = useState(false)

  useEffect(() => {
    setTitle(titles[tabIndex])
  }, [tabIndex])

  return (
    <div>
      <Modal
        open={modalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className={styles.verticalOverflow}
        // scroll={scroll}
      >
        <LightBox className={`${styles.modalBox}`}>
          <Stack direction="row" justifyContent="flex-end">
            <Close
              className={styles.closeIcon}
              onClick={() => setModalOpen(false)}
              false
            />
          </Stack>
          <Typography
            id="modal-modal-title"
            variant="h2"
            component="h2"
            className={`${styles.title}`}
            color="common.black"
          >
            {title}
          </Typography>
          <DividerDiv className={`${styles.divider}`} />
          <Typography
            className={`${styles.subTitle} ${styles.projectDetails}`}
            color="common.black"
          >
            {tabIndex === 0 ? 'Your Project Details' : 'Section title'}
          </Typography>
          <Typography className={styles.desc} color="text.primary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
            purus sit amet luctus venenatis, lectus magna fringilla urna,
            porttitor rhoncus dolor purus non.
          </Typography>

          {tabIndex === 0 ? ( // project info
            <div className={styles.tab3}>
              <ProjectOuter spacing={2}>
                <Stack
                  direction="row"
                  justifyContent={'space-between'}
                  className={styles.mobileDisplay}
                >
                  <Stack
                    direction={'row'}
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={0.5}
                  >
                    <div className={styles.label}>Project ID: </div>

                    {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                  </Stack>
                  <div>{analyseInfo()?.id}</div>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent={'space-between'}
                  className={styles.mobileDisplay}
                >
                  <Stack
                    direction={'row'}
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={0.5}
                  >
                    <div className={styles.label}>Project Status: </div>
                    {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                  </Stack>
                  <Chip
                    label={analyseInfo()?.status}
                    size="small"
                    className={styles.analysisInfo}
                  />
                </Stack>
                {/* {
                    (projectInfoIndex === 1 || projectInfoIndex === 2) && ( */}
                <>
                  <Stack
                    direction={'row'}
                    justifyContent="space-between"
                    className={styles.mobileDisplay}
                  >
                    <Stack
                      direction={'row'}
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={0.5}
                    >
                      <div className={styles.label}>Usage: </div>
                      {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                    </Stack>
                    <div>{projectInfo?.usage?.toFixed(0)}%</div>
                  </Stack>
                  <Stack
                    direction={'row'}
                    justifyContent="space-between"
                    className={styles.mobileDisplay}
                  >
                    <Stack
                      direction={'row'}
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={0.5}
                    >
                      <div className={styles.label}>Expires: </div>
                      {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                    </Stack>
                    <div>{analyseInfo()?.expires}</div>
                  </Stack>
                  <Stack
                    direction={'row'}
                    justifyContent="space-between"
                    className={styles.mobileDisplay}
                  >
                    <Stack
                      direction={'row'}
                      justifyContent="flex-start"
                      spacing={0.5}
                    >
                      <div
                        className={`${styles.label} ${styles.supportedNetworks}`}
                      >
                        Supported Networks:{' '}
                      </div>
                      {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                    </Stack>
                    <Stack
                      direction={'row'}
                      justifyContent="flex-end"
                      spacing={1}
                    >
                      {analyseInfo()?.networks.map(network => {
                        const colors = {
                          eth: '#175cd3',
                          avax: '#c01048',
                          bsc: '#854a0e',
                          nevm: '#854a0e'
                        }
                        const bgColors = {
                          eth: '#eff8ff',
                          avax: '#fff1f3',
                          bsc: '#fef7c3',
                          nevm: '#fef7c3'
                        }
                        return (
                          <Chip
                            size="small"
                            key={network.split('_')[0]}
                            label={network.split('_')[0].toUpperCase()}
                            sx={{
                              color: colors[network.split('_')[0]],
                              backgroundColor: bgColors[network.split('_')[0]]
                            }}
                          />
                        )
                      })}
                    </Stack>
                  </Stack>
                  <Stack
                    direction={'row'}
                    justifyContent="space-between"
                    className={styles.mobileDisplay}
                  >
                    <Stack
                      direction={'row'}
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={0.5}
                    >
                      <div className={styles.label}>
                        Accepted Payment Currencies{' '}
                      </div>
                      {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                    </Stack>
                    <div>
                      {analyseInfo()
                        ?.currencies.map(
                          key => key.split('_')[key.split('_').length - 1]
                        )
                        ?.join(', ')}
                    </div>
                  </Stack>
                  <Stack
                    direction={'row'}
                    justifyContent="space-between"
                    className={styles.mobileDisplay}
                  >
                    <Stack
                      direction={'row'}
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={0.5}
                    >
                      <div className={styles.label}>Monthly cost in $USD: </div>
                      {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                    </Stack>
                    <div className={styles.font14}>$200</div>
                  </Stack>
                  <Stack
                    direction={'row'}
                    justifyContent="space-between"
                    className={styles.mobileDisplay}
                  >
                    <Stack
                      direction={'row'}
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={0.5}
                    >
                      <div className={styles.label}>Service Level: </div>
                      {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                    </Stack>
                    <div className={styles.font14}>
                      Tier {analyseInfo()?.tier} - 32 million requests / month
                    </div>
                  </Stack>
                </>
                {/* )
                 } */}
              </ProjectOuter>
            </div>
          ) : tabIndex === 1 || tabIndex === 2 ? (
            <div className={styles.tab3}>
              <ProjectOuter spacing={2}>
                <Stack
                  direction="row"
                  justifyContent={'space-between'}
                  className={styles.mobileDisplay}
                >
                  <Stack
                    direction={'row'}
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={0.5}
                  >
                    <div className={styles.label}>Project ID: </div>
                    {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                  </Stack>
                  <div>a357ab69-8ddc-4966-833f-4ddc38b8c11</div>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent={'space-between'}
                  className={styles.mobileDisplay}
                >
                  <Stack
                    direction={'row'}
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={0.5}
                  >
                    <div className={styles.label}>Project Status: </div>
                    {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                  </Stack>
                  <Chip
                    label="Active"
                    size="small"
                    className={styles.analysisInfo}
                  />
                </Stack>

                {tabIndex === 1 && (
                  <>
                    <Stack
                      direction={'row'}
                      justifyContent="space-between"
                      className={styles.mobileDisplay}
                    >
                      <Stack
                        direction={'row'}
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={0.5}
                      >
                        <div className={styles.label}>Usage: </div>
                        {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                      </Stack>
                      <div>60%</div>
                    </Stack>
                    <Stack
                      direction={'row'}
                      justifyContent="space-between"
                      className={styles.mobileDisplay}
                    >
                      <Stack
                        direction={'row'}
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={0.5}
                      >
                        <div className={styles.label}>Expires: </div>
                        {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                      </Stack>
                      <div>
                        {analyseInfo(projectInfo?.expiry_time)?.expires}
                      </div>
                    </Stack>
                    <Stack
                      direction={'row'}
                      justifyContent="space-between"
                      className={styles.mobileDisplay}
                    >
                      <Stack
                        direction={'row'}
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={0.5}
                      >
                        <div className={`${styles.supportedNetworks}`}>
                          Supported Networks:{' '}
                        </div>
                        {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                      </Stack>
                      <Stack
                        direction={'row'}
                        justifyContent="flex-end"
                        spacing={1}
                      >
                        {analyseInfo()?.networks.map(network => {
                          const colors = {
                            eth: '#175cd3',
                            avax: '#c01048',
                            bsc: '#854a0e',
                            nevm: '#854a0e'
                          }
                          const bgColors = {
                            eth: '#eff8ff',
                            avax: '#fff1f3',
                            bsc: '#fef7c3',
                            nevm: '#fef7c3'
                          }
                          return (
                            <Chip
                              size="small"
                              key={network.split('_')[0]}
                              label={network.split('_')[0].toUpperCase()}
                              sx={{
                                color: colors[network.split('_')[0]],
                                backgroundColor: bgColors[network.split('_')[0]]
                              }}
                            />
                          )
                        })}
                      </Stack>
                    </Stack>
                    <Stack
                      direction={'row'}
                      justifyContent="space-between"
                      className={styles.mobileDisplay}
                    >
                      <Stack
                        direction={'row'}
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={0.5}
                      >
                        <div className={styles.label}>
                          Accepted Payment Currencies{' '}
                        </div>
                        {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                      </Stack>
                      <div>
                        {analyseInfo()
                          ?.currencies.map(
                            key => key.split('_')[key.split('_').length - 1]
                          )
                          ?.join(', ')}
                      </div>
                    </Stack>
                    <Stack
                      direction={'row'}
                      justifyContent="space-between"
                      className={styles.mobileDisplay}
                    >
                      <Stack
                        direction={'row'}
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={0.5}
                      >
                        <div className={styles.label}>
                          Monthly cost in $USD:{' '}
                        </div>
                        {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                      </Stack>
                      <div className={styles.font14}>$200</div>
                    </Stack>
                    <Stack
                      direction={'row'}
                      justifyContent="space-between"
                      className={styles.mobileDisplay}
                    >
                      <Stack
                        direction={'row'}
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={0.5}
                      >
                        <div className={styles.label}>Service Level: </div>
                        {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                      </Stack>
                      <div className={styles.font14}>
                        Tier {analyseInfo()?.tier} - 32 million requests / month
                      </div>
                    </Stack>
                  </>
                )}
              </ProjectOuter>
            </div>
          ) : (
            <div className={styles.tab2}>
              <SmallOuter className={styles.gap20}>
                <Stack
                  direction="row"
                  justifyContent={'space-between'}
                  className={styles.mobileDisplay}
                >
                  <Stack
                    direction={'row'}
                    justifyContent="flex-start"
                    spacing={0.5}
                  >
                    <div className={styles.left}>Project ID: </div>
                    {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                  </Stack>
                  <div>{analyseInfo()?.id}</div>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent={'space-between'}
                  className={styles.mobileHidden}
                >
                  <Stack
                    direction={'row'}
                    justifyContent="flex-start"
                    spacing={0.5}
                  >
                    <div
                      className={`${styles.left} ${styles.supportedNetworks} `}
                    >
                      Supported Networks:{' '}
                    </div>
                    {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                  </Stack>
                  <Stack
                    direction={'row'}
                    justifyContent="flex-end"
                    spacing={1}
                  >
                    {analyseInfo()?.networks.map(network => {
                      const colors = {
                        eth: '#175cd3',
                        avax: '#c01048',
                        bsc: '#854a0e',
                        nevm: '#854a0e'
                      }
                      const bgColors = {
                        eth: '#eff8ff',
                        avax: '#fff1f3',
                        bsc: '#fef7c3',
                        nevm: '#fef7c3'
                      }
                      return (
                        <Chip
                          size="small"
                          key={network.split('_')[0]}
                          label={network.split('_')[0].toUpperCase()}
                          sx={{
                            color: colors[network.split('_')[0]],
                            backgroundColor: bgColors[network.split('_')[0]]
                          }}
                        />
                      )
                    })}
                  </Stack>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent={'space-between'}
                  className={styles.mobileHidden}
                >
                  <Stack
                    direction={'row'}
                    justifyContent="flex-start"
                    spacing={0.5}
                  >
                    <div className={styles.left}>Monthly cost in $USD: </div>
                    {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                  </Stack>
                  <div className={styles.font14}>$200</div>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent={'space-between'}
                  className={styles.mobileHidden}
                >
                  <Stack
                    direction={'row'}
                    justifyContent="flex-start"
                    spacing={0.5}
                  >
                    <div className={styles.left}>Service Level: </div>
                    {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                  </Stack>
                  <div className={styles.font14}>
                    Tier {analyseInfo()?.tier} - 32 million requests / month
                  </div>
                </Stack>
              </SmallOuter>

              <Typography className={`${styles.subTItle}`} color="common.black">
                Payment Info
              </Typography>
              <Typography className={styles.desc} color="text.primary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                aliquam, purus sit amet luctus venenatis, lectus magna fringilla
                urna, porttitor rhoncus dolor purus non.
              </Typography>

              <BigOuter spacing={3}>
                {/* <div className={styles.info}> */}
                <Stack
                  direction={'row'}
                  justifyContent="space-between"
                  className={styles.mobilePay}
                >
                  <Stack
                    direction="row"
                    justifyContent={'flex-start'}
                    className={styles.payLeft}
                  >
                    <div className={`${styles.left}`}>Amount to pay:</div>
                    {/* <HelpOutline sx={{ fontSize: '16px' }} /> */}
                  </Stack>
                  <Stack
                    direction="column"
                    justifyContent={'flex-start'}
                    className={styles.payRight}
                    alignItems={'flex-start'}
                  >
                    {analyseInfo()?.currencies.map(currency => {
                      return (
                        <div key={currency}>
                          <span className={styles.right}>
                            {currency
                              .split('_')
                              [currency.split('_').length - 1].toUpperCase()}
                            :&nbsp;
                          </span>
                          {projectInfo[currency]}
                        </div>
                      )
                    })}
                  </Stack>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent={'space-between'}
                  alignItems="center"
                  className={styles.payAddress}
                >
                  <Stack
                    direction="row"
                    justifyContent={'flex-start'}
                    alignItems="center"
                    className={`${styles.left} ${styles.paymentAddress}`}
                    spacing={1}
                  >
                    Payment address:
                    {/* <HelpOutline sx={{ fontSize: '16px' }} /> */}
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent={'flex-start'}
                    alignItems="center"
                    className={`${styles.right}`}
                    spacing={1}
                  >
                    {/* <ContentCopy sx={{ cursor: 'pointer' }} /> */}
                    <CopyToClipboard
                      text={projectInfo[analyseInfo()?.networks[0]]}
                      onCopy={() => setCopyFlag(true)}
                    >
                      <div className={styles.address}>
                        {projectInfo[analyseInfo()?.networks[0]]}
                        {copyFlag ? (
                          <CheckCircleOutline
                            className={styles.cursorPointer}
                          />
                        ) : (
                          <ContentCopy className={styles.cursorPointer} />
                        )}
                      </div>
                    </CopyToClipboard>
                  </Stack>
                </Stack>
                <Typography className={styles.desc} color="text.primary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                  aliquam, purus sit amet luctus venenatis, lectus magna
                  fringilla urna, porttitor rhoncus dolor purus non.
                </Typography>
                {/* </div> */}
              </BigOuter>
            </div>
          )}

          {/* {
            tabIndex === 3 ? ( // Step 3 && Ended

            ): 
            ) : 
          } */}

          {tabIndex === 3 && (
            <Stack
              direction={'row'}
              justifyContent="center"
              gap="10px"
              className={`${styles.dotsBody} ${styles.mt30} ${styles.mb10}`}
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
          )}

          {tabIndex === 0 && ( // Title Project Info
            <TitleProjectInfo
              direction={'row'}
              justifyContent="space-between"
              className={styles.mobileBtns}
            >
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setTabIndex(1)
                }}
                className={styles.cancelProjectBtn}
              >
                <Typography className={styles.bold} variant="h4">
                  Cancel&nbsp;this&nbsp;project
                </Typography>
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setTabIndex(3)
                }}
                className={styles.extendProjectBtn}
              >
                <Typography className={styles.bold} variant="h4">
                  Extend&nbsp;this&nbsp;project
                </Typography>
              </Button>
            </TitleProjectInfo>
          )}
          {tabIndex === 1 && ( //cancel project
            <Stack
              direction={'row'}
              justifyContent="space-between"
              className={styles.mt3}
            >
              <ConfirmCancelButton
                variant="contained"
                fullWidth
                onClick={() => {
                  setTabIndex(2)
                }}
              >
                <Typography className={styles.bold} variant="h4">
                  Yes, cancel this project
                </Typography>
              </ConfirmCancelButton>
            </Stack>
          )}
          {tabIndex === 2 && ( // project cancelled
            <Stack
              direction={'row'}
              justifyContent="space-between"
              className={`${styles.mobileBtns} ${styles.mt3} ${styles.gap}`}
            >
              <Button
                variant="outlined"
                endIcon={<RocketLaunch />}
                fullWidth
                onClick={() => {
                  // setTabIndex(tabIndex - 1)
                  setTabIndex(0)
                  setModalOpen(false)
                }}
                className={styles.createNewProjectBtn}
              >
                <Typography className={styles.bold} variant="h4">
                  Create&nbsp;new&nbsp;project
                </Typography>
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                fullWidth
                onClick={() => {
                  setTabIndex(0)
                  setModalOpen(false)
                }}
                className={styles.returnToDashboardBtn}
              >
                <Typography className={styles.bold} variant="h4">
                  Return&nbsp;to&nbsp;dashboard
                </Typography>
              </Button>
            </Stack>
          )}

          {tabIndex === 3 && (
            <Stack
              direction={'row'}
              justifyContent="space-between"
              clasName={styles.mt3}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                className={styles.createNewProjectBtn}
                onClick={() => {
                  setTabIndex(0)
                }}
              >
                <Typography className={styles.bold} variant="h4">
                  Go&nbsp;back
                </Typography>
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() => {
                  setTabIndex(0)
                  setModalOpen(false)
                }}
                className={styles.height44}
              >
                <Typography className={styles.bold} variant="h4">
                  Return&nbsp;to&nbsp;dashboard
                </Typography>
              </Button>
            </Stack>
          )}
        </LightBox>
      </Modal>

      {/* <Box sx={style} className={styles.mobileBox}>
        <>
          <Stack direction='row' justifyContent='flex-end'>
            <Close sx={{ fontSize: '25px', cursor: 'pointer', color: 'common.black' }} onClick={handleClose} />
          </Stack>
          <Typography id="modal-modal-title" variant="h2" component="h2"
            className={styles.title}
            color='common.black'
          >
            {title}
          </Typography>
          <hr className={styles.hr} />
          <Typography className={styles.subTitle} color='common.black'>
            {tabIndex === 0 ? 'Your Project Detail1' : 'Section title'}
          </Typography>
          <Typography className={styles.desc} color='text.primary'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non.
          </Typography>
        </>
      </Box> */}
    </div>
  )
}

export default ProjectInfoModal
