import React, {useEffect, useState} from 'react'
import 'semantic-ui-css/semantic.min.css'
import {Segment} from 'semantic-ui-react'
import AllowancesListContainer from './AllowancesListContainer'
import AllowancesListFilter from '../allowancesListFilter/AllowancesListFilter'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../app/rootReducer'
import {fetchAllowancesThunk, QueryStates} from './AllowancesListSlice'
import {CheckboxProps} from 'semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox'
import EditAllowanceFormContainer from '../editAllowance/EditAllowanceFormContainer'


const AllowanceLister = () => {
    const dispatch = useDispatch()
    const address = useSelector(
        (state:RootState) => {
            if (state.addresses.checkAddressId) {
                return state.addresses.addressesById[state.addresses.checkAddressId]
            } else {
                return undefined
            }
        }
    )
    const queryState = useSelector((state:RootState) => {
        if (address)
            return state.allowances.allowanceQueryStateByOwner[address.address]
        else
            return undefined
    })
    const showEditAllowanceModal = useSelector((state:RootState) => state.editAllowance.showModal)

    const [showZeroAllowances, setShowZeroAllowances] = useState(true)
    const [addressFilter, setAddressFilter] = useState('')

    const toggleShowZeroAllowances = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        setShowZeroAllowances(!showZeroAllowances)
    }

    const clearAddressFilter = () => {
        setAddressFilter('')
    }

    const handleAddressFilterChange = (e: React.FormEvent<EventTarget>) => {
        let {value} = e.target as HTMLInputElement;
        setAddressFilter(value)
    }

    const handleRefreshClick = (e: React.MouseEvent) => {
        loadAllowances()
    }

    useEffect(() => {
        document.title = `TAC - ${address?.ensName ?? address?.address}`
    }, [address])

    useEffect(() => {
        if (queryState && (queryState.state === QueryStates.QUERY_STATE_INITIAL)) {
            if (address)
                dispatch(fetchAllowancesThunk(address.address))
        }
    }, [queryState, dispatch, address])

    const loadAllowances = () => {
        if (address) {
            console.log(`Starting query for "${address?.ensName ?? address?.address}"`)
            dispatch(fetchAllowancesThunk(address.address))
        }
    }

    if (!address) {
        return <div>No address set</div>
    }

    return (
        <React.Fragment>
            <Segment basic>
                <h2>Allowances of {address?.ensName ?? address?.address}:</h2>
            </Segment>
            <AllowancesListFilter showZeroAllowances={showZeroAllowances}
                                  toggleShowZeroAllowances={toggleShowZeroAllowances}
                                  addressFilterValue={addressFilter}
                                  handleAddressFilterChange={handleAddressFilterChange}
                                  clearAddressFilter={clearAddressFilter}
                                  refresh={handleRefreshClick}
            />
            <AllowancesListContainer
                ownerId={address.address}
                showZeroAllowances={showZeroAllowances}
                addressFilter={addressFilter}
            />
            {showEditAllowanceModal && <EditAllowanceFormContainer/>}
        </React.Fragment>
    )
}

export default AllowanceLister