import React, {useState, useEffect, useContext} from 'react'
import AddressInput from './AddressInput'
import {Web3Context} from './OnboardContext'
import {useHistory, useParams} from 'react-router-dom'
import {Form, Grid} from 'semantic-ui-react'

export const addressInputStates = {
    ADDRESS_INITIAL: 'address_initial', // no user interaction
    ADDRESS_RESOLVING: 'address_resolving', // valid ENS name entered, waiting for resolving
    ADDRESS_VALID: 'address_valid', // got a valid address
    ADDRESS_INVALID: 'address_invalid',
}

const AddressInputContainer = () => {
    const web3Context = useContext(Web3Context)
    const addressFromParams = (useParams().address || '')
    const history = useHistory()
    const [addressInputState, setAddressInputState] = useState(addressInputStates.ADDRESS_INITIAL)
    const [input, setInput] = useState(
        addressFromParams ? addressFromParams.toLowerCase() : ''
            /*(web3Context.address? web3Context.address.toLowerCase() : '')*/
    )
    const [address, setAddress] = useState('')
    const [prevWalletAddress, setPrevWalletAddress] = useState(web3Context.address ? web3Context.address.toLowerCase() : '')

    // verify address input
    useEffect(() => {
        const handleInput = async() => {
            if (input.length === 0) {
                setAddressInputState(addressInputStates.ADDRESS_INITIAL)
            } else {
                // check for valid input (raw address and ENS name)
                const validAddress = (/^(0x)?[0-9a-f]{40}$/i.test(input))
                const validENSName = (/.*\.eth$/i.test(input))
                if (validENSName) {
                    // resolve entered ENS name
                    setAddressInputState(addressInputStates.ADDRESS_RESOLVING)
                    try {
                        const resolvedAddress = await web3Context.web3.eth.ens.getAddress(input)
                        console.log(`Resolved ${input} to ${resolvedAddress}`)
                        setAddressInputState(addressInputStates.ADDRESS_VALID)
                        setAddress(resolvedAddress)
                    } catch (e) {
                        console.log('Could not resolve ' + input)
                        setAddressInputState(addressInputStates.ADDRESS_INVALID)
                    }
                }
                else if(validAddress) {
                    setAddress(input)
                    setAddressInputState(addressInputStates.ADDRESS_VALID)
                }
                else {
                    setAddressInputState(addressInputStates.ADDRESS_INVALID)
                }
            }
        }
        handleInput()
    }, [input, setAddress, web3Context.web3])

    // accept address from wallet depending on context
    useEffect(() => {
        const newWalletAddress = web3Context.address ? web3Context.address.toLowerCase() : ''
        // console.log(`fromParams: ${addressFromParams}`)
        // console.log(`newWallet : ${newWalletAddress}`)
        // console.log(`prevWallet: ${prevWalletAddress}`)
        if (newWalletAddress !== '') {
            if ((addressFromParams === '') || // in this case always take wallet address
                (newWalletAddress !== prevWalletAddress) // user actively changed wallet address
            ) {
                setInput(newWalletAddress)
                setPrevWalletAddress(newWalletAddress)
                history.push(`/address/${newWalletAddress}`)
            }
        }
    }, [web3Context.address, prevWalletAddress, addressFromParams, history])

    const error = (addressInputState === addressInputStates.ADDRESS_INVALID)
    const loading = (addressInputState === addressInputStates.ADDRESS_RESOLVING)
    const success = (addressInputState === addressInputStates.ADDRESS_VALID)

    const handleSubmit = () => {
        if (success) {
            console.log(`Submit! Address: ${address}`)
            history.push(`/address/${address}`)
        } else {
            console.log(`Submit with invalid address`)
        }
    }

    return (
        <Grid textAlign={'center'} centered columns={1}>
            <Grid.Row>
                <Grid.Column width={14}>
                    <Form
                        size={'huge'}
                        onSubmit={handleSubmit}
                        error = {error}
                        success= {success}
                        widths={'equal'}
                    >
                        <Form.Group>
                            <AddressInput handleInput={setInput}
                                          value={input}
                                          error={error}
                                          success={success}
                                          loading={loading}
                            />
                        </Form.Group>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

AddressInputContainer.propTypes = {
}

export default AddressInputContainer
