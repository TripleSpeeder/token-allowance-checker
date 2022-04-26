import React from 'react'
import { Icon, Popup, Item } from 'semantic-ui-react'
import { EthAddress } from 'features/addressInput/AddressSlice'

interface AddressDisplayProps {
  ethAddress: EthAddress
  mobile: boolean
  chainId: string
  inline?: boolean
}

const AddressDisplay = ({
  ethAddress,
  mobile,
  chainId,
  inline
}: AddressDisplayProps) => {
  const { address, ensName, esContractName } = ethAddress
  const setClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(
      function () {
        /* clipboard successfully set */
      },
      function () {
        console.log(`failed to set clipboard`)
      }
    )
  }

  let contractName
  if (ensName) {
    contractName = `${ensName}`
  } else if (esContractName) {
    contractName = `${esContractName}`
  }

  let etherscanUrl: string
  switch (chainId) {
    case '0x3': // Ropsten
      etherscanUrl = `https://ropsten.etherscan.io/address/${address}`
      break
    case '0x1':
      etherscanUrl = `https://etherscan.io/address/${address}`
      break
    default:
      etherscanUrl = `https://etherscan.io/address/${address}`
  }

  if (mobile) {
    const shortAddress = address.substr(0, 6) + '...' + address.substr(-6, 6)
    const contractNameString = esContractName && (
      <div>
        Contract name: <strong>{esContractName}</strong>
      </div>
    )
    const ensNameString = ensName && (
      <div>
        ENS name: <strong>{ensName}</strong>
      </div>
    )
    const popupContent = (
      <Item>
        <Item.Content>
          <Item.Header>{address}</Item.Header>
          <Item.Content>
            {contractNameString}
            {ensNameString}
          </Item.Content>
          <Item.Extra>
            <Icon
              link
              circular
              name={'copy outline'}
              onClick={() => {
                setClipboard(address)
              }}
            />
            <Icon
              link
              circular
              name={'external square'}
              onClick={() => {
                window.open(etherscanUrl, '_blank')
              }}
            />
          </Item.Extra>
        </Item.Content>
      </Item>
    )
    let popupTrigger
    if (inline) {
      popupTrigger = <strong>{contractName ?? shortAddress}</strong>
    } else {
      popupTrigger = (
        <div>
          <strong>{contractName ?? shortAddress}</strong>
        </div>
      )
    }
    return <Popup on={'click'} content={popupContent} trigger={popupTrigger} />
  } else {
    const copyPopup = (
      <Popup
        mouseEnterDelay={500}
        content={'Copy to clipboard'}
        trigger={
          <Icon
            circular
            name={'copy outline'}
            size={'small'}
            onClick={() => {
              setClipboard(address)
            }}
          />
        }
      />
    )
    const etherscanPopup = (
      <Popup
        mouseEnterDelay={500}
        content={'View on Etherscan'}
        trigger={
          <Icon
            circular
            name={'external square'}
            size={'small'}
            onClick={() => {
              window.open(etherscanUrl, '_blank')
            }}
          />
        }
      />
    )

    if (contractName) {
      if (inline) {
        return (
          <>
            <strong>{contractName}</strong> (
            <small>
              {address}&nbsp;
              {copyPopup}
              {etherscanPopup}
            </small>
            )
          </>
        )
      } else {
        return (
          <>
            <div>
              <strong>{contractName}</strong>
            </div>
            <div>
              <small>
                {address}&nbsp;
                {copyPopup}
                {etherscanPopup}
              </small>
            </div>
          </>
        )
      }
    } else {
      if (inline) {
        return (
          <span>
            {address}&nbsp;
            {copyPopup}
            {etherscanPopup}
          </span>
        )
      } else {
        return (
          <div>
            {address}&nbsp;
            {copyPopup}
            {etherscanPopup}
          </div>
        )
      }
    }
  }
}

export default AddressDisplay
