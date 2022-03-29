import { createDfuseClient } from '@dfuse/client'
import apiKeys from '../apikeys'

interface CreateClientParams {
  chainId: string
}

const getDfuseClient = ({ chainId }: CreateClientParams) => {
  const credentials = apiKeys.dfuse[chainId]
  if (!credentials) {
    throw Error(`Network ${chainId} not supported by dfuse.io`)
  }

  return createDfuseClient({
    apiKey: credentials.apikey,
    network: credentials.endpoint
  })
}

export { getDfuseClient }
