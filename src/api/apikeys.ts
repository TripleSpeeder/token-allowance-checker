interface Credentials {
  endpoint: string
  apikey: string
}

type NetworkKeys = {
  [key: string]: Credentials
}

type Site = 'dfuse' | 'etherscan' | 'infura' | 'onboard'
type SiteCredentials = {
  [key in Site]: NetworkKeys
}

const apiKeys: SiteCredentials = {
  dfuse: {
    '0x1': {
      endpoint: 'mainnet.eth.dfuse.io',
      apikey: 'web_085aeaac9c520204b1a9dcaa357e5460'
    },
    '0x3': {
      endpoint: 'ropsten.eth.dfuse.io',
      apikey: 'web_085aeaac9c520204b1a9dcaa357e5460'
    }
  },
  etherscan: {
    '0x1': {
      apikey: 'THS8KWYM6KZ8WBP3DXKUDR7UKCRB8YIRGH',
      endpoint: 'api.etherscan.io'
    },
    '0x3': {
      apikey: 'THS8KWYM6KZ8WBP3DXKUDR7UKCRB8YIRGH',
      endpoint: 'api-ropsten.etherscan.io'
    }
  },
  infura: {
    '0x1': {
      apikey: '7f230a5ca832426796454c28577d93f2',
      endpoint: 'mainnet.infura.io/v3/'
    },
    '0x3': {
      apikey: '7f230a5ca832426796454c28577d93f2',
      endpoint: 'ropsten.infura.io/v3/'
    }
  },
  onboard: {
    '0x1': {
      apikey: 'f4b71bf0-fe50-4eeb-bc2b-b323527ed9e6',
      endpoint: ''
    },
    '0x3': {
      apikey: 'f4b71bf0-fe50-4eeb-bc2b-b323527ed9e6',
      endpoint: ''
    }
  }
}

export default apiKeys
