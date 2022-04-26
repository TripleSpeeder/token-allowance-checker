import Web3 from 'web3'

/*
 * See https://github.com/trustwallet/assets for more info on assets
 */
const buildTokenLogoUrl = (contractAddress: string) => {
  const host = 'https://raw.githubusercontent.com'
  const path = `/trustwallet/assets/master/blockchains/ethereum/assets/${Web3.utils.toChecksumAddress(
    contractAddress
  )}/logo.png`
  return `${host}${path}`
}

export default buildTokenLogoUrl
