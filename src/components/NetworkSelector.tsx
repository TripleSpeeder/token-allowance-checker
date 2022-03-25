import React, { SyntheticEvent } from 'react'
import { Button, Dropdown, DropdownProps } from 'semantic-ui-react'
import { RootState } from '../app/rootReducer'
import { useDispatch } from 'react-redux'
import { setRequiredNetworkIdThunk } from 'features/onboard/onboardSlice'
import { useAppSelector } from '../app/hooks'

const NetworkSelector = () => {
  const options = [
    { key: 1, text: 'Mainnet', value: 1 },
    { key: 2, text: 'Ropsten', value: 3 }
  ]

  const dispatch = useDispatch()
  const { requiredNetworkId, wallet } = useAppSelector(
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
    (value) => value.value === requiredNetworkId
  )
  const text = 'Network: ' + networkEntry?.text ?? 'select'

  return (
    <Dropdown
      as={Button}
      disabled={!wallet}
      text={text}
      options={options}
      onChange={handleChange}
      value={requiredNetworkId}
      fluid
    />
  )
}

export default NetworkSelector
