import React, { useEffect, useState } from 'react'
import { Divider, Segment } from 'semantic-ui-react'
import AllowancesListContainer from './AllowancesListContainer'
import AllowancesListFilter from '../allowancesListFilter/AllowancesListFilter'
import { useDispatch } from 'react-redux'
import { RootState } from '../../app/rootReducer'
import { fetchAllowancesThunk, QueryStates } from './AllowancesListSlice'
import EditAllowanceFormContainer from '../editAllowance/EditAllowanceFormContainer'
import { useAppSelector } from '../../app/hooks'

const AllowanceLister = () => {
  const dispatch = useDispatch()
  const { mobile } = useAppSelector((state: RootState) => state.respsonsive)
  const address = useAppSelector((state: RootState) => {
    if (state.addresses.checkAddressId) {
      return state.addresses.addressesById[state.addresses.checkAddressId]
    } else {
      return undefined
    }
  })
  const queryState = useAppSelector((state: RootState) => {
    if (address)
      return state.allowances.allowanceQueryStateByOwner[address.address]
    else return undefined
  })
  const showEditAllowanceModal = useAppSelector(
    (state: RootState) => state.editAllowance.showModal
  )

  const [showZeroAllowances, setShowZeroAllowances] = useState(true)
  const [addressFilter, setAddressFilter] = useState('')

  const toggleShowZeroAllowances = () => {
    setShowZeroAllowances(!showZeroAllowances)
  }

  const clearAddressFilter = () => {
    setAddressFilter('')
  }

  const handleAddressFilterChange = (e: React.FormEvent<EventTarget>) => {
    const { value } = e.target as HTMLInputElement
    setAddressFilter(value)
  }

  useEffect(() => {
    document.title = `TAC - ${address?.ensName ?? address?.address ?? ''}`
  }, [address])

  useEffect(() => {
    if (queryState && queryState.state === QueryStates.QUERY_STATE_INITIAL) {
      if (address) dispatch(fetchAllowancesThunk(address.address))
    }
  }, [queryState, dispatch, address])

  const loadAllowances = () => {
    if (address) {
      console.log(
        `Starting query for "${address?.ensName ?? address?.address}"`
      )
      dispatch(fetchAllowancesThunk(address.address))
    }
  }

  const handleRefreshClick = () => {
    loadAllowances()
  }

  if (!address) {
    return <div>No address set</div>
  }

  if (mobile) {
    return (
      <>
        <Divider />
        <AllowancesListFilter
          showZeroAllowances={showZeroAllowances}
          toggleShowZeroAllowances={toggleShowZeroAllowances}
          addressFilterValue={addressFilter}
          handleAddressFilterChange={handleAddressFilterChange}
          clearAddressFilter={clearAddressFilter}
          refresh={handleRefreshClick}
          mobile={mobile}
        />
        <Divider />
        <AllowancesListContainer
          ownerId={address.address}
          showZeroAllowances={showZeroAllowances}
          addressFilter={addressFilter}
        />
        {showEditAllowanceModal && <EditAllowanceFormContainer />}
      </>
    )
  } else {
    return (
      <React.Fragment>
        <Segment basic>
          <h2>Allowances of {address?.ensName ?? address?.address}:</h2>
        </Segment>
        <AllowancesListFilter
          showZeroAllowances={showZeroAllowances}
          toggleShowZeroAllowances={toggleShowZeroAllowances}
          addressFilterValue={addressFilter}
          handleAddressFilterChange={handleAddressFilterChange}
          clearAddressFilter={clearAddressFilter}
          refresh={handleRefreshClick}
          mobile={mobile}
        />
        <AllowancesListContainer
          ownerId={address.address}
          showZeroAllowances={showZeroAllowances}
          addressFilter={addressFilter}
        />
        {showEditAllowanceModal && <EditAllowanceFormContainer />}
      </React.Fragment>
    )
  }
}

export default AllowanceLister
