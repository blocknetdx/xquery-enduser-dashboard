import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from '@emotion/styled'
import moment from 'moment'

// mui
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import {
  Close,
  CheckCircleOutline,
  ArrowForward,
  ArrowBack,
  ContentCopy,
  RocketLaunch
} from '@mui/icons-material'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

import { light, dark } from '../../theme'

import ApiKeySection from '../ApiKeySection'
import { calcualteApiUsage, capitalizeFirstLetter, filterMinAmount, getAcceptedCurrencyNames } from '../../utils/helper'
import { currencyNames } from '../../configs/constants'

import styles from './index.module.scss'
import useApiUsage from '../../hooks/useApiUsage'

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
  &:hover {
    background-color: '#c9665f';
  }
`

const TitleProjectInfo = styled(Stack)(({ theme }) => ({
  marginTop: '24px',
  gap: '10px',
  color: theme.palette.common.black
}))

const supportNetworks = {
  payment_avax_address: 'AVAX',
  payment_eth_address: 'ETH',
  payment_nevm_address: 'NEVM',
}

const ProjectInfoModal = props => {
  const { projectInfo, modalOpen, setModalOpen } = props
  const mode = useSelector(state => state.toogle.darkMode)
  const theme = mode === 'true' ? dark : light

  const {
    project_id: projectId,
    api_tokens_used: tokensUsed,
    api_tokens: tokens,
    status = '',
    api_key: apiKey,
  } = projectInfo || {};

  const [apiUsage] = useApiUsage({
    projectId,
    apiKey
  });

  const filterMinAmountData = filterMinAmount(projectInfo || {});

  const acceptedCurrencies = getAcceptedCurrencyNames(filterMinAmountData)
  const costApiCalls = '$0.0002';

  const analyseInfo = () => {
    if (!projectInfo) return null
    const networks = Object.keys(projectInfo).filter(
      key => key.includes('_address') && !!projectInfo[key] && key.includes('payment_')
    )

    return {
      expires: moment(projectInfo?.quote_expiry_time || new Date()).format('HH:MM, MMM DD, YYYY'),
      networks: networks,
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

  function renderSupportedNetworks(rootClass = 'mobileDisplay') {
    return (
      <Stack
        direction={'row'}
        justifyContent="space-between"
        className={styles[rootClass]}
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
        </Stack>
        <Stack
          direction={'row'}
          justifyContent="flex-end"
          spacing={1}
        >
          {analyseInfo()?.networks.map((network, index) => {
            const colors = {
              ETH: '#175cd3',
              AVAX: '#c01048',
              BSC: '#854a0e',
              NEVM: '#854a0e'
            }
            const bgColors = {
              ETH: '#eff8ff',
              AVAX: '#fff1f3',
              BSC: '#fef7c3',
              NEVM: '#fef7c3'
            }
            return (
              <Chip
                size="small"
                key={`${supportNetworks[network]} - ${index}`}
                label={supportNetworks[network]}
                sx={{
                  color: colors[supportNetworks[network]],
                  backgroundColor: bgColors[supportNetworks[network]]
                }}
              />
            )
          })}
        </Stack>
      </Stack>
    )
  }

  const renderProjectDetailCard = () => {
    return (
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
          </Stack>
          <div>{projectId}</div>
        </Stack>
        <ApiKeySection apiKey={apiKey || ''} />
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
          </Stack>
          <Chip
            label={capitalizeFirstLetter(status)}
            size="small"
            className={`${styles.analysisInfo, styles[`status-${status}`]}`}
          />
        </Stack>
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
            </Stack>
            <div>{`${ apiUsage || calcualteApiUsage(tokensUsed, tokens)}%`}</div>
          </Stack>
          { renderSupportedNetworks() }
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
              <div className={styles.label}>Cost per 1000 API calls </div>
            </Stack>
            <div className={styles.font14}>{costApiCalls}</div>
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
            </Stack>
            <div>{acceptedCurrencies}</div>
          </Stack>
        </>
      </ProjectOuter>
    );
  }

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
              //onClick={() => setModalOpen(false)}
              //false
              onClick={() => {
                setModalOpen(false)
                setTabIndex(0)
                setActive(0)
              }}
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
          {
            tabIndex !== 3 &&
            <React.Fragment>
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
            </React.Fragment>
          }

          {tabIndex === 0 ? ( // project info
            <div className={styles.tab3}>
              { renderProjectDetailCard() }
            </div>
          ) : tabIndex === 1 ? (
            <div className={styles.tab3}>
              { renderProjectDetailCard() }
            </div>
          ) : tabIndex === 2 ? (
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
                  </Stack>
                  <div>{projectId}</div>
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
                  </Stack>
                  <Chip
                    label={capitalizeFirstLetter(status)}
                    size="small"
                    className={`${[styles.analysisInfo, styles[`status-${status}`]]}`}
                  />
                </Stack>
                <Typography className={styles.desc} color="text.primary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                  aliquam, purus sit amet luctus venenatis, lectus magna fringilla
                  urna, porttitor rhoncus dolor purus non.
                </Typography>
              </ProjectOuter>
            </div>
          ) : (
            <div className={styles.tab2}>
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
                    alignItems={'flex-end'}
                  >
                    {
                      filterMinAmountData.map(currency => (
                        <div key={currency}>
                          <span>{`${projectInfo[currency]} ${currencyNames[currency]}`}</span>
                        </div>
                      ))
                    }
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

              <Typography className={`${styles.subTItle}`} color="common.black">
                Your Project Summary
              </Typography>
              <Typography className={styles.desc} color="text.primary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
                purus sit amet luctus venenatis, lectus magna fringilla urna,
                porttitor rhoncus dolor purus non.
              </Typography>
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
                  <div>{projectId || ''}</div>
                </Stack>
                <ApiKeySection apiKey={apiKey || ''} />
                { renderSupportedNetworks('mobileHidden') }
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
                    <div className={styles.left}>Cost per 1000 API calls </div>
                    {/* <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} /> */}
                  </Stack>
                  <div className={styles.font14}>{costApiCalls}</div>
                </Stack>
              </SmallOuter>


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
              className={styles.mt3}
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
