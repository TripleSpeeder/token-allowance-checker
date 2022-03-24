import Web3 from 'web3'

export const topicHashApprove =
    '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'

export const eventABI = [
    {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
    },
    {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
    },
    {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
    },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkLogTopic = (logEntry: any) => {
    // Apparently dfuse query results based on topic sometimes return wrong topics. Double-check that the
    // logEntry actually is of the expected topic.
    if (logEntry.topics[0] !== topicHashApprove) {
        console.log(
            `Skipping log event. Topic is wrong, expected ${topicHashApprove}, got ${logEntry.topics[0]}.`
        )
        return false
    }
    return true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const decodeLog = (logEntry: any, web3: Web3) => {
    if (logEntry.data === '0x') {
        console.log(
            `Detected bad contract at ${logEntry.address}: LogEntry.data is missing.`
        )
        return false
    }
    let decoded
    try {
        decoded = web3.eth.abi.decodeLog(
            eventABI,
            logEntry.data,
            logEntry.topics.slice(1)
        )
    } catch (e) {
        console.log(
            `Detected bad contract at ${logEntry.address}: Can not decode logEntry:`
        )
        console.log(logEntry)
        return false
    }
    return decoded
}

export const checkDecodedData = (
    spender: string,
    owner: string,
    expectedOwner: string
) => {
    // check if spender is not zero. Some contracts emit logs with spender 0x0...
    if (!parseInt(spender)) {
        console.log(`Skipping log event: Invalid spender ${spender}`)
        return false
    }

    if (owner.toLowerCase() !== expectedOwner.toLowerCase()) {
        console.log(
            `Skipping log event due to owner mismatch. Expected ${expectedOwner}, got ${owner}`
        )
        return false
    }

    return true
}
