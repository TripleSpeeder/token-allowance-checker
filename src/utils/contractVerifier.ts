import { ERC20DetailedContract, ERC20DetailedInstance } from '../contracts'

interface VerifierParams {
    erc20Contract: ERC20DetailedContract
    contractAddress: string
}

const createAndVerifyERC20 = async ({
    erc20Contract,
    contractAddress,
}: VerifierParams) => {
    let contractInstance: ERC20DetailedInstance

    // instantiate contract
    try {
        contractInstance = await erc20Contract.at(contractAddress)
    } catch (error) {
        console.log(
            `Error instantiating contract at ${contractAddress}: ${error}`
        )
        return false
    }

    // check required methods by calling them
    try {
        await contractInstance.totalSupply()
        await contractInstance.balanceOf(contractAddress)
        await contractInstance.allowance(contractAddress, contractAddress)
        // TODO: Check if approve() method is available!
    } catch (error) {
        console.log(
            `Contract at ${contractAddress} does not implement required ERC20 methods.`
        )
        return false
    }

    return contractInstance
}

export default createAndVerifyERC20
