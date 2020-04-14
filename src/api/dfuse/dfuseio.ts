import { createDfuseClient } from '@dfuse/client'
import apiKeys from '../apikeys'

interface CreateClientParams {
    networkId: number
}

const getDfuseClient = ({ networkId }: CreateClientParams) => {
    const credentials = apiKeys.dfuse[networkId]
    if (!credentials) {
        throw Error(`Network ${networkId} not supported by dfuse.io`)
    }

    return createDfuseClient({
        apiKey: credentials.apikey,
        network: credentials.endpoint,
    })
}

export { getDfuseClient }
