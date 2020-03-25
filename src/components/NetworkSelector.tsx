import React, { SyntheticEvent } from 'react'
import { Dropdown, DropdownProps } from 'semantic-ui-react'
import { RootState } from '../app/rootReducer'
import { useDispatch, useSelector } from 'react-redux'
import { setRequiredNetworkIdThunk } from 'features/onboard/onboardSlice'

const NetworkSelector = () => {
    const options = [
        { key: 1, text: 'Mainnet', value: 1 },
        { key: 2, text: 'Ropsten', value: 3 },
    ]

    const dispatch = useDispatch()
    const { requiredNetworkId, walletSelected } = useSelector(
        (state: RootState) => state.onboard
    )

    const handleChange = (
        event: SyntheticEvent<HTMLElement, Event>,
        data: DropdownProps
    ) => {
        const { value } = data
        console.log(`Selected value: ${value}`)
        dispatch(setRequiredNetworkIdThunk(parseInt(`${value}`)))
    }

    const networkEntry = options.find(
        value => value.value === requiredNetworkId
    )
    const text = networkEntry?.text ?? 'select network'

    return (
        <Dropdown
            disabled={!walletSelected}
            text={text}
            options={options}
            onChange={handleChange}
            value={requiredNetworkId}
        />
    )
}

export default NetworkSelector
