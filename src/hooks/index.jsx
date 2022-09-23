import api from "../apis"
import { ethers } from "ethers"
import { NEW_PROJECT_MSG } from "../configs"
import { useEffect, useState } from "react"
import { initWeb3Onboard } from "../services"
import { useConnectWallet } from "@web3-onboard/react"

export const useVerifySignature = () => {
  const [{ wallet }] = useConnectWallet()
  const [direct, setDirect] = useState(false)
  const [loading, setLoading] = useState(false)
  const [signature, setSignature] = useState(localStorage.getItem("signature"))

  const requestVerify = async (wallet) => {
    setLoading(true)
    try {
      const provider = new ethers.providers.Web3Provider(wallet.provider, 'any')
      const signer = provider.getSigner()
      const sign = await signer.signMessage(NEW_PROJECT_MSG)
      const response = await api.project.verifySignature({ signature: sign, wallet: wallet.accounts[0].address })
      if (response?.data?.success !== true) {
        setSignature("")
      }
      setSignature(sign)
      window.localStorage.setItem("signature", sign)
    } catch (error) {
      console.log("error occured in verify:", error)
    }
    setDirect(false)
    setLoading(false)
  }

  useEffect(() => {
    if ((wallet || direct) && window.location.pathname.includes('login') && !signature) {
      setLoading(true)
      requestVerify(wallet)
    }
  }, [direct, wallet]) // eslint-disable-line

  return {
    loading,
    signature,
    setDirect
  }
}

export const useEagerConnect = () => {
  const [loading, setLoading] = useState(false)
  const [{ wallet }] = useConnectWallet()
  const [web3Onboard] = useState(initWeb3Onboard)

  const previousWalletsSerialised = localStorage.getItem('connectedWallets')
  const previousWallets = previousWalletsSerialised
    ? JSON.parse(previousWalletsSerialised)
    : null;

  useEffect(() => {
    if (!wallet && previousWallets && web3Onboard) {
      setLoading(true)
      web3Onboard.connectWallet({
        autoSelect: {
          label: previousWallets[0],
          disableModals: true
        }
      }).then(() => {
        setLoading(false)
      })
    }
  }, [wallet, web3Onboard, previousWallets])

  return {
    preConnect: loading
  }
}