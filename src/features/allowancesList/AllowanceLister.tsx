import React, {useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import {Segment, Button} from 'semantic-ui-react'
import AllowancesListContainer from './AllowancesListContainer'
import AllowancesListFilter from '../../components/AllowancesListFilter'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../app/rootReducer'
import {fetchAllowancesThunk} from './AllowancesListSlice'


const AllowanceLister = () => {
    const dispatch = useDispatch()
    const {web3} = useSelector(
        (state: RootState) => state.onboard
    )
    const {address} = useParams()

    const [showZeroAllowances, setShowZeroAllowances] = useState(true)
    const [addressFilter, setAddressFilter] = useState('')

    const toggleShowZeroAllowances = () => {
        setShowZeroAllowances(!showZeroAllowances)
    }

    const clearAddressFilter = () => {
        setAddressFilter('')
    }

    const handleAddressFilterChange = (e: React.FormEvent<EventTarget>) => {
        let {value} = e.target as HTMLInputElement;
        setAddressFilter(value)
    }

    // TODO: Check this code
    useEffect(() => {
        document.title = `TAC - ${address}`
    }, [address])

    const loadAllowances = () => {
        if (address) {
            console.log(`Starting query for "${address}"`)
            dispatch(fetchAllowancesThunk(address))
        }
    }

    return (
        <React.Fragment>
            <Segment basic>
                <h2>Allowances of {address}:</h2>
            </Segment>
            <AllowancesListFilter showZeroAllowances={showZeroAllowances}
                                  toggleShowZeroAllowances={toggleShowZeroAllowances}
                                  addressFilterValue={addressFilter}
                                  handleAddressFilterChange={handleAddressFilterChange}
                                  clearAddressFilter={clearAddressFilter}
            />
            <Button onClick={loadAllowances}>load for ${address}</Button>
            <AllowancesListContainer
                owner={address?address:''}
                showZeroAllowances={showZeroAllowances}
                addressFilter={addressFilter}
            />
        </React.Fragment>
    )
}

export default AllowanceLister