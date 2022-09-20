import * as React from 'react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
// mui
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { light, dark } from "../../theme"
import {
  Close, HelpOutline, CheckCircleOutline, ArrowForward, ArrowBack, ContentCopy, RocketLaunch,
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

const ProjectInfoModal = (props) => {
  const { projectInfo, modalOpen, setModalOpen } = props
  const mode = useSelector((state) => state.toogle.darkMode)
  const theme = mode === 'true' ? dark : light

  const analyseInfo = () => {
    if (!projectInfo) return null
    const date = new Date(projectInfo?.expiry_time)
    const networks = Object.keys(projectInfo)
      .filter((key) => key.includes("_address") && !!projectInfo[key])
    // .map((key) => key.split("_")[0])
    const currencies = Object.keys(projectInfo)
      .filter((key) => key.includes("amount_") && Number(projectInfo[key]) > 0)
    // .map((key) => key.split("_")[key.split("_").length - 1])

    return {
      id: projectInfo?.project_id,
      status: projectInfo?.status,
      usage: 'unknown',
      expires: date?.getHours() + ':' + date?.getMinutes() + ', ' + date?.toDateString()?.slice(4),
      networks: networks,
      currencies: currencies,
      tier: projectInfo?.tier
    }
  }

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
        sx={{ overflowX: 'hidden', overflowY: 'scroll' }}
      // scroll={scroll}
      >
        <Box sx={{ backgroundColor: theme.palette.warning.light, border: 'none !important' }} className={`${styles.modalBox}`}>
          <Stack direction='row' justifyContent='flex-end'>
            <Close sx={{ fontSize: '25px', cursor: 'pointer', color: '#98a2b3', margin: '-14px -14px 0px 0px' }} onClick={() => setModalOpen(false)} false />
          </Stack>
          <Typography id="modal-modal-title" variant="h2" component="h2"
            className={styles.title}
            color='common.black'
            sx={{ fontSize: '20px', marginTop: '-10px !important' }}
          >
            {title}
          </Typography>
          <div className={`${styles.divider}`} style={{ background: `${theme.palette.divider}` }} />
          <Typography className={styles.subTitle} color='common.black' sx={{ fontSize: '16px !important', fontWeight: '500 !important' }}>
            {tabIndex === 0 ? 'Your Project Details' : 'Section title'}
          </Typography>
          <Typography className={styles.desc} color='text.primary'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non.
          </Typography>

          {
            tabIndex === 0 ? ( // project info
              <div className={styles.tab3}>
                <Stack spacing={2} sx={{ p: 2.5, mt: 1.5, border: 'none', borderRadius: 2, background: theme.palette.warning.dark, color: theme.palette.text.primary }}>
                  <Stack direction='row' justifyContent={'space-between'} className={styles.mobileDisplay}>
                    <Stack direction={'row'} justifyContent='flex-start' alignItems="center" spacing={0.5}>
                      <div style={{ color: '#344054', fontWeight: 500 }}>Project ID: </div>
                      <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                    </Stack>
                    <div>{analyseInfo()?.id}</div>
                  </Stack>
                  <Stack direction='row' justifyContent={'space-between'} className={styles.mobileDisplay}>
                    <Stack direction={'row'} justifyContent='flex-start' alignItems="center" spacing={0.5}>
                      <div style={{ color: '#344054', fontWeight: 500 }}>Project Status: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                    </Stack>
                    <Chip label={analyseInfo()?.status} size='small' sx={{ color: '#027A48', backgroundColor: '#ECFDF3', padding: '2px 0px', borderRadius: '16px', fontSize: '12px', fontWeight: '500' }} />
                  </Stack>
                  {/* {
                    (projectInfoIndex === 1 || projectInfoIndex === 2) && ( */}
                  <>
                    <Stack direction={'row'} justifyContent='space-between' className={styles.mobileDisplay}>
                      <Stack direction={'row'} justifyContent='flex-start' alignItems="center" spacing={0.5}>
                        <div style={{ color: '#344054', fontWeight: 500 }}>Usage: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                      </Stack>
                      <div>60%</div>
                    </Stack>
                    <Stack direction={'row'} justifyContent='space-between' className={styles.mobileDisplay}>
                      <Stack direction={'row'} justifyContent='flex-start' alignItems="center" spacing={0.5}>
                        <div style={{ color: '#344054', fontWeight: 500 }}>Expires: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                      </Stack>
                      <div>{analyseInfo()?.expires}</div>
                    </Stack>
                    <Stack direction={'row'} justifyContent='space-between' className={styles.mobileDisplay}>
                      <Stack direction={'row'} justifyContent='flex-start' alignItems="center" spacing={0.5}>
                        <div style={{ color: '#344054', fontWeight: 500 }}>Supported Networks: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                      </Stack>
                      <Stack direction={'row'} justifyContent='flex-end' spacing={1}>
                        {analyseInfo()?.networks.map((network) => {
                          const colors = { 'eth': '#175cd3', 'avax': '#c01048', 'bsc': '#854a0e', 'nevm': '#854a0e' }
                          const bgColors = { 'eth': '#eff8ff', 'avax': '#fff1f3', 'bsc': '#fef7c3', 'nevm': '#fef7c3' }
                          return (
                            <Chip
                              size='small'
                              key={network.split('_')[0]}
                              label={network.split('_')[0].toUpperCase()}
                              sx={{
                                color: colors[network.split('_')[0]],
                                backgroundColor: bgColors[network.split('_')[0]]
                              }} />
                          )
                        })}
                      </Stack>
                    </Stack>
                    <Stack direction={'row'} justifyContent='space-between' className={styles.mobileDisplay}>
                      <Stack direction={'row'} justifyContent='flex-start' alignItems="center" spacing={0.5}>
                        <div style={{ color: '#344054', fontWeight: 500 }}>Accepted Payment Currencies </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                      </Stack>
                      <div>
                        {analyseInfo()?.currencies
                          .map((key) => key.split("_")[key.split("_").length - 1])?.join(', ')}</div>
                    </Stack>
                    <Stack direction={'row'} justifyContent='space-between' className={styles.mobileDisplay}>
                      <Stack direction={'row'} justifyContent='flex-start' alignItems="center" spacing={0.5}>
                        <div style={{ color: '#344054', fontWeight: 500 }}>Monthly cost in $USD: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                      </Stack>
                      <div style={{ fontSize: '14px' }}>$200</div>
                    </Stack>
                    <Stack direction={'row'} justifyContent='space-between' className={styles.mobileDisplay}>
                      <Stack direction={'row'} justifyContent='flex-start' alignItems="center" spacing={0.5}>
                        <div style={{ color: '#344054', fontWeight: 500 }}>Service Level: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                      </Stack>
                      <div style={{ fontSize: '14px' }}>Tier {analyseInfo()?.tier} - 32 million requests / month</div>
                    </Stack>
                  </>
                  {/* )
                 } */}

                </Stack>

              </div>
            ) : tabIndex === 1 || tabIndex === 2 ? (
              <div className={styles.tab3}>
                <Stack spacing={2} sx={{ p: 2.5, mt: 1.5, border: 'none', borderRadius: 2, background: theme.palette.warning.dark, color: theme.palette.text.primary }} >
                  <Stack direction='row' justifyContent={'space-between'} className={styles.mobileDisplay}>
                    <Stack direction={'row'} justifyContent='flex-start' alignItems="center" spacing={0.5}>
                      <div style={{ color: '#344054', fontWeight: 500 }}>Project ID: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                    </Stack>
                    <div>a357ab69-8ddc-4966-833f-4ddc38b8c11</div>
                  </Stack>
                  <Stack direction='row' justifyContent={'space-between'} className={styles.mobileDisplay}>
                    <Stack direction={'row'} justifyContent='flex-start' alignItems="center" spacing={0.5}>
                      <div style={{ color: '#344054', fontWeight: 500 }}>Project Status: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                    </Stack>
                    <Chip label="Active" size='small' sx={{ color: '#027A48', backgroundColor: '#ECFDF3', padding: '2px 0px', borderRadius: '16px', fontSize: '12px', fontWeight: '500' }} />
                  </Stack>

                  {
                    tabIndex === 1 && (
                      <>
                        <Stack direction={'row'} justifyContent='space-between' className={styles.mobileDisplay}>
                          <Stack direction={'row'} justifyContent='flex-start' alignItems="center" spacing={0.5}>
                            <div style={{ color: '#344054', fontWeight: 500 }}>Usage: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                          </Stack>
                          <div>60%</div>
                        </Stack>
                        <Stack direction={'row'} justifyContent='space-between' className={styles.mobileDisplay}>
                          <Stack direction={'row'} justifyContent='flex-start' alignItems="center" spacing={0.5}>
                            <div style={{ color: '#344054', fontWeight: 500 }}>Expires: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                          </Stack>
                          <div>{analyseInfo(projectInfo?.expiry_time)?.expires}</div>
                        </Stack>
                        <Stack direction={'row'} justifyContent='space-between' className={styles.mobileDisplay}>
                          <Stack direction={'row'} justifyContent='flex-start' alignItems="center" spacing={0.5}>
                            <div>Supported Networks: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                          </Stack>
                          <Stack direction={'row'} justifyContent='flex-end' spacing={1}>
                            {analyseInfo()?.networks.map((network) => {
                              const colors = { 'eth': '#175cd3', 'avax': '#c01048', 'bsc': '#854a0e', 'nevm': '#854a0e' }
                              const bgColors = { 'eth': '#eff8ff', 'avax': '#fff1f3', 'bsc': '#fef7c3', 'nevm': '#fef7c3' }
                              return (
                                <Chip
                                  size='small'
                                  key={network.split('_')[0]}
                                  label={network.split('_')[0].toUpperCase()}
                                  sx={{
                                    color: colors[network.split('_')[0]],
                                    backgroundColor: bgColors[network.split('_')[0]]
                                  }} />
                              )
                            })}
                          </Stack>
                        </Stack>
                        <Stack direction={'row'} justifyContent='space-between' className={styles.mobileDisplay}>
                          <Stack direction={'row'} justifyContent='flex-start' alignItems="center" spacing={0.5}>
                            <div style={{ color: '#344054', fontWeight: 500 }}>Accepted Payment Currencies </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                          </Stack>
                          <div>
                            {analyseInfo()?.currencies
                              .map((key) => key.split("_")[key.split("_").length - 1])?.join(', ')}</div>
                        </Stack>
                        <Stack direction={'row'} justifyContent='space-between' className={styles.mobileDisplay}>
                          <Stack direction={'row'} justifyContent='flex-start' alignItems="center" spacing={0.5}>
                            <div style={{ color: '#344054', fontWeight: 500 }}>Monthly cost in $USD: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                          </Stack>
                          <div style={{ fontSize: '14px' }}>$200</div>
                        </Stack>
                        <Stack direction={'row'} justifyContent='space-between' className={styles.mobileDisplay}>
                          <Stack direction={'row'} justifyContent='flex-start' alignItems="center" spacing={0.5}>
                            <div style={{ color: '#344054', fontWeight: 500 }}>Service Level: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                          </Stack>
                          <div style={{ fontSize: '14px' }}>Tier {analyseInfo()?.tier} - 32 million requests / month</div>
                        </Stack>
                      </>
                    )
                  }

                </Stack>

              </div>
            ) : (
              <div className={styles.tab2}>
                <Stack spacing={2} sx={{ padding: 2, borderRadius: 1, border: 'none', mt: 1.5, background: theme.palette.warning.dark, color: theme.palette.text.primary }}>
                  <Stack direction='row' justifyContent={'space-between'} className={styles.mobileDisplay}>
                    <Stack direction={'row'} justifyContent='flex-start' spacing={0.5}>
                      <div className={styles.left}>Project ID: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                    </Stack>
                    <div>{analyseInfo()?.id}</div>
                  </Stack>
                  <Stack direction='row' justifyContent={'space-between'} className={styles.mobileHidden}>
                    <Stack direction={'row'} justifyContent='flex-start' spacing={0.5}>
                      <div className={styles.left}>Supported Networks: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                    </Stack>
                    <Stack direction={'row'} justifyContent='flex-end' spacing={1}>
                      {analyseInfo()?.networks.map((network) => {
                        const colors = { 'eth': '#175cd3', 'avax': '#c01048', 'bsc': '#854a0e', 'nevm': '#854a0e' }
                        const bgColors = { 'eth': '#eff8ff', 'avax': '#fff1f3', 'bsc': '#fef7c3', 'nevm': '#fef7c3' }
                        return (
                          <Chip
                            size='small'
                            key={network.split('_')[0]}
                            label={network.split('_')[0].toUpperCase()}
                            sx={{
                              color: colors[network.split('_')[0]],
                              backgroundColor: bgColors[network.split('_')[0]]
                            }} />
                        )
                      })}
                    </Stack>
                  </Stack>
                  <Stack direction='row' justifyContent={'space-between'} className={styles.mobileHidden}>
                    <Stack direction={'row'} justifyContent='flex-start' spacing={0.5}>
                      <div className={styles.left}>Monthly cost in $USD: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                    </Stack>
                    <div style={{ fontSize: '14px' }}>$200</div>
                  </Stack>
                  <Stack direction='row' justifyContent={'space-between'} className={styles.mobileHidden}>
                    <Stack direction={'row'} justifyContent='flex-start' spacing={0.5}>
                      <div className={styles.left}>Service Level: </div><HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                    </Stack>
                    <div style={{ fontSize: '14px' }}>Tier {analyseInfo()?.tier} - 32 million requests / month</div>
                  </Stack>
                </Stack>

                <Typography className={styles.subTitle} color='common.black' sx={{ mt: 1.5 }}>
                  Payment Info
                </Typography>
                <Typography className={styles.desc} color='text.primary'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non.
                </Typography>

                <Stack sx={{ p: 3, mt: 1.5, border: 'none', borderRadius: 1, background: theme.palette.warning.dark, color: theme.palette.text.primary }} spacing={3}>
                  {/* <div className={styles.info}> */}
                  <Stack direction={'row'} justifyContent='space-between' className={styles.mobilePay}>
                    <Stack direction='row' justifyContent={'flex-start'} className={styles.payLeft}>
                      <div className={`${styles.left}`}>
                        Amount to pay:
                      </div>
                      <HelpOutline sx={{ fontSize: '16px' }} />
                    </Stack>
                    <Stack direction='column' justifyContent={'flex-start'} className={styles.payRight} alignItems={'flex-start'}>
                      {
                        analyseInfo()?.currencies.map((currency) => {
                          return (
                            <div key={currency}>
                              <span className={styles.right}>
                                {currency.split("_")[currency.split("_").length - 1].toUpperCase()}:&nbsp;
                              </span>{projectInfo[currency]}
                            </div>
                          )
                        })
                      }
                    </Stack>
                  </Stack>
                  <Stack direction='row' justifyContent={'space-between'} alignItems='center' className={styles.payAddress}>
                    <Stack
                      direction='row'
                      justifyContent={'flex-start'}
                      alignItems='center'
                      className={`${styles.left}`}
                      spacing={1}
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        width: '35%',
                        color: '#344054'
                      }}
                    >
                      Payment address: <HelpOutline sx={{ fontSize: '16px' }} />
                    </Stack>
                    <Stack direction='row' justifyContent={'flex-start'} alignItems='center' className={`${styles.right}`} spacing={1}>
                      {/* <ContentCopy sx={{ cursor: 'pointer' }} /> */}
                      <CopyToClipboard text={(projectInfo[analyseInfo()?.networks[0]])} onCopy={() => setCopyFlag(true)}>
                        <div className={styles.address}>
                          {projectInfo[analyseInfo()?.networks[0]]}
                          {copyFlag ? <CheckCircleOutline sx={{ cursor: 'pointer' }} /> : <ContentCopy sx={{ cursor: 'pointer' }} />}
                        </div>
                      </CopyToClipboard>
                    </Stack>
                  </Stack>
                  <Typography sx={{ fontStyle: 'italic' }}>
                    Text content to explain max 1 hour wait for pending tx and what happens next after payment has been made.
                  </Typography>
                  {/* </div> */}
                </Stack>
              </div>
            )
          }

          {/* {
            tabIndex === 3 ? ( // Step 3 && Ended

            ): 
            ) : 
          } */}

          {
            tabIndex === 0 && ( // Title Project Info
              <Stack direction={'row'} justifyContent='space-between' style={{ gap: '10px' }} sx={{ mt: 3, color: 'common.black' }} className={styles.mobileBtns}>
                <Button variant='outlined'
                  fullWidth
                  onClick={() => {
                    setTabIndex(1)
                  }}
                  sx={{ height: '44px', borderRadius: '6px', border: 'solid 1px #d0d5dd', backgroundColor: '#fff', color: '#344054' }}
                >
                  <Typography className={styles.bold} variant='h4'>
                    Cancel&nbsp;this&nbsp;project
                  </Typography>
                </Button>
                <Button variant='contained'
                  fullWidth
                  onClick={() => {
                    setTabIndex(3)
                  }}
                  sx={{ height: '44px', borderRadius: '6px' }}
                >
                  <Typography className={styles.bold} variant='h4'>
                    Extend&nbsp;this&nbsp;project
                  </Typography>
                </Button>
              </Stack>
            )
          }
          {
            (tabIndex === 1) && ( //cancel project
              <Stack direction={'row'} justifyContent='space-between' sx={{ mt: 3 }}>
                <Button variant='contained' fullWidth
                  onClick={() => {
                    setTabIndex(2)
                  }}
                  sx={{ bgcolor: '#d92d20', height: '44px', borderRadius: '6px', '&:hover': { bgcolor: '#c9665f' } }}
                >
                  <Typography className={styles.bold} variant='h4'>
                    Yes, cancel this project
                  </Typography>
                </Button>
              </Stack>
            )
          }
          {
            (tabIndex === 2) && ( // project cancelled
              <Stack direction={'row'} justifyContent='space-between' sx={{ mt: 3 }}
                className={styles.mobileBtns}
                style={{ gap: '10px' }}
              >
                <Button variant='outlined' endIcon={<RocketLaunch />}
                  fullWidth
                  onClick={() => {
                    // setTabIndex(tabIndex - 1)
                    setTabIndex(0)
                    setModalOpen(false)
                  }}
                  sx={{ height: '44px', borderRadius: '6px', border: 'solid 1px #d0d5dd', backgroundColor: '#fff', color: '#344054' }}
                >
                  <Typography className={styles.bold} variant='h4'>
                    Create&nbsp;new&nbsp;project
                  </Typography>
                </Button>
                <Button variant='contained' endIcon={<ArrowForward />}
                  fullWidth
                  onClick={() => {
                    setTabIndex(0)
                    setModalOpen(false)
                  }}
                  sx={{ height: '44px', borderRadius: '6px' }}
                >
                  <Typography className={styles.bold} variant='h4'>
                    Return&nbsp;to&nbsp;dashboard
                  </Typography>
                </Button>
              </Stack>
            )
          }

          {
            tabIndex === 3 && (
              <Stack direction={'row'} justifyContent='space-between' sx={{ mt: 3 }}>
                <Button variant='outlined' startIcon={<ArrowBack />}
                  sx={{ height: '44px', borderRadius: '6px', border: 'solid 1px #d0d5dd', backgroundColor: '#fff', color: '#344054' }}
                  onClick={() => {
                    setTabIndex(0)
                  }}
                >
                  <Typography className={styles.bold} variant='h4'>
                    Go&nbsp;back
                  </Typography>
                </Button>
                <Button variant='contained' endIcon={<ArrowForward />}
                  onClick={() => {
                    setTabIndex(0)
                    setModalOpen(false)
                  }}
                  sx={{ height: '44px' }}
                >
                  <Typography className={styles.bold} variant='h4'>
                    Return&nbsp;to&nbsp;dashboard
                  </Typography>
                </Button>
              </Stack>
            )
          }
        </Box>
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
    </div >
  )
}

export default ProjectInfoModal