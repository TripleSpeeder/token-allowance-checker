import React, { useState } from 'react'
import AddressInput from './AddressInput'
import { useHistory } from 'react-router-dom'
import { Form, Grid } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../app/rootReducer'
import { addAddress, addAddressThunk, redirectToAddress } from './AddressSlice'

export const addressInputStates = {
    ADDRESS_INITIAL: 'address_initial', // no user interaction
    ADDRESS_RESOLVING: 'address_resolving', // valid ENS name entered, waiting for resolving
    ADDRESS_VALID: 'address_valid', // got a valid address
    ADDRESS_INVALID: 'address_invalid',
}

const AddressInputContainer = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { web3 } = useSelector((state: RootState) => state.onboard)
    const [addressInputState, setAddressInputState] = useState(
        addressInputStates.ADDRESS_INITIAL
    )
    const [input, setInput] = useState('')
    const [addressId, setAddressId] = useState('')
    const [ensName, setEnsName] = useState<string | undefined>(undefined)

    const handleInput = async (input: string) => {
        setInput(input)
        setEnsName(undefined)
        if (input.length === 0) {
            setAddressInputState(addressInputStates.ADDRESS_INITIAL)
        } else {
            // check for valid input (raw address and ENS name)
            const validAddress = /^(0x)?[0-9a-f]{40}$/i.test(input)
            const validENSName = /.*\.eth$/i.test(input)
            if (validENSName && web3) {
                // resolve entered ENS name
                setAddressInputState(addressInputStates.ADDRESS_RESOLVING)
                try {
                    const resolvedAddress = await web3.eth.ens.getAddress(input)
                    console.log(`Resolved ${input} to ${resolvedAddress}`)
                    setAddressInputState(addressInputStates.ADDRESS_VALID)
                    setAddressId(resolvedAddress)
                    setEnsName(input)
                } catch (e) {
                    console.log('Could not resolve ' + input)
                    setAddressInputState(addressInputStates.ADDRESS_INVALID)
                }
            } else if (validAddress) {
                // use entered ethereum address
                const addressId = input.toLowerCase()
                setAddressId(addressId)
                setAddressInputState(addressInputStates.ADDRESS_VALID)
            } else {
                setAddressInputState(addressInputStates.ADDRESS_INVALID)
            }
        }
    }
    /*
    // keep address input field in sync with address provided by wallet or url
    useEffect(() => {
        if (checkAddress) {
            console.log(`Updating input field with ${checkAddress.address} (${checkAddress.ensName})`)
            setInput(checkAddress.ensName ?? checkAddress.address)
        }
    }, [checkAddress])
 */
    const error = addressInputState === addressInputStates.ADDRESS_INVALID
    const loading = addressInputState === addressInputStates.ADDRESS_RESOLVING
    const validInput = addressInputState === addressInputStates.ADDRESS_VALID

    const handleSubmit = () => {
        if (validInput) {
            if (ensName) {
                dispatch(addAddress(addressId, ensName))
                dispatch(redirectToAddress(addressId, history))
            } else {
                // dispatch thunk to add address, check reverse ENS name and redirect
                dispatch(addAddressThunk(addressId, history))
            }
            setInput('')
            setEnsName(undefined)
        }
    }

    return (
        <Grid textAlign={'center'} centered columns={1}>
            <Grid.Row>
                <Grid.Column width={14}>
                    <Form
                        size={'huge'}
                        onSubmit={handleSubmit}
                        error={error}
                        success={validInput}
                        widths={'equal'}
                    >
                        <Form.Group>
                            <AddressInput
                                handleInput={handleInput}
                                value={input}
                                error={error}
                                success={validInput}
                                loading={loading}
                            />
                        </Form.Group>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default AddressInputContainer
