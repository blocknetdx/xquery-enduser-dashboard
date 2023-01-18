import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useConnectWallet, useWallets } from '@web3-onboard/react'
import { createStyles, makeStyles } from '@mui/styles'
import { Box, Button, Typography } from '@mui/material'
import styled from '@emotion/styled'
import { FlexColumn } from '../../components/Layout'
import styles from './index.module.scss'
import logo from '../../assets/logo.svg'
import { dark, light } from '../../theme'
import { useEagerConnect, useVerifySignature } from '../../hooks'
import api from '../../apis'

const MainDiv = styled.div(({ theme }) => ({
  background: `${theme.palette.info.main}`
}))

const useStyles = makeStyles(theme =>
  createStyles({
    logTitle: {
      textAlign: 'center !important',
      marginTop: '30px !important',
      marginBottom: '12px !important',
      [theme.breakpoints.down(960)]: {
        fontSize: '20px !important',
        fontWeight: '500 !important'
      }
    },
    logo: {
      width: '194px',
      height: '61px',
      [theme.breakpoints.down(960)]: {
        width: '160px',
        height: '50px'
      }
    },
    connectBtn: {
      [theme.breakpoints.down(960)]: {
        fontSize: '14px !important'
      }
    },
    verify: {
      background: 'rgb(0, 0, 0, 0.4)',
      zIndex: 100000,
      position: 'fixed',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  })
)

const Login = () => {
  const mode = useSelector(state => state.toogle.darkMode)
  const theme = mode === 'true' ? dark : light
  const classes = useStyles()

  const [{ wallet }, connect] = useConnectWallet() // eslint-disable-line
  const connectedWallets = useWallets()
  const { preConnect, setStartConnect } = useEagerConnect()
  const { loading, signature, setDirect, setStartVerification } =
    useVerifySignature()
  const navigate = useNavigate()

  useEffect(() => {
    if (!connectedWallets.length) return

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    )
    window.localStorage.setItem(
      'connectedWallets',
      JSON.stringify(connectedWalletsLabelArray)
    )
  }, [connectedWallets, wallet])

  useEffect(() => {
    if (!preConnect && !!wallet && !!signature) {
      createUser(wallet);
    }
  }, [preConnect, wallet, signature, navigate])

  async function createUser(wallet) {
    if (!wallet?.accounts || wallet?.accounts.length === 0) return;

    const data = {
      wallet_address: wallet?.accounts[0]?.address,
      user_created_date: new Date(),
    }

    const response = await api.user.createUser(data);

    localStorage.setItem('userid', response?.data?.data || null)

    navigate('/')
  }

  const handleConnect = async () => {
    if (!wallet) {
      setStartConnect(true)
      setStartVerification(true)
      await connect()
    } else {
      setStartVerification(true)
      setDirect(true)
    }
    // if (!wallet) {
    //   await connect()
    // } else {
    //   setDirect(true)
    // }
  }

  // console.log('auth info:', { wallet, signature })

  return (
    <>
      {loading && <div className={classes.verify} />}
      <MainDiv className={styles.back}>
        <Box className={styles.wrapper}>
          <FlexColumn className={styles.alignCenter}>
            <img
              className={classes.logo}
              src={logo}
              alt="logo"
              width={194}
              height={61}
            />
            <Typography
              className={classes.logTitle}
              variant="h2"
              color="common.black"
              textAlign="center"
              mt="30px"
            >
              Let's get started
            </Typography>
            <Typography
              className={styles.subtitle}
              variant="h4"
              color="text.primary"
            >
              Connect a wallet to login to the XQuery dashboard app.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              className={styles.connectWalletButton}
              onClick={() => handleConnect()}
            >
              <Typography
                className={classes.connectBtn}
                variant="button"
                color="white"
              >
                Connect Wallet
              </Typography>
            </Button>
          </FlexColumn>
        </Box>
      </MainDiv>
    </>
  )
}

export default Login
