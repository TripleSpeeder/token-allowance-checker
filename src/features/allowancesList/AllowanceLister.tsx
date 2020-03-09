import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import {Segment, Button} from 'semantic-ui-react'
import AllowancesListContainer from './AllowancesListContainer'
import AllowancesListFilter from '../allowancesListFilter/AllowancesListFilter'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../app/rootReducer'
import {fetchAllowancesThunk, QueryStates} from './AllowancesListSlice'
import {CheckboxProps} from 'semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox'


const AllowanceLister = () => {
    const dispatch = useDispatch()
    const {address:addressFromParams} = useParams()
    const {web3} = useSelector(
        (state: RootState) => state.onboard
    )
    const queryState = useSelector((state:RootState) => {
        if (addressFromParams)
            return state.allowances.allowanceQueryStateByOwner[addressFromParams]
        else
            return undefined
    })

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

    // TODO: Check this code
    useEffect(() => {
        document.title = `TAC - ${addressFromParams}`
    }, [addressFromParams])

    useEffect(() => {
        if (queryState && (queryState.state === QueryStates.QUERY_STATE_INITIAL)) {
            loadAllowances()
        }
    }, [queryState])

    const loadAllowances = () => {
        if (addressFromParams) {
            console.log(`Starting query for "${addressFromParams}"`)
            dispatch(fetchAllowancesThunk(addressFromParams))
        }
    }

    return (
        <React.Fragment>
            <Segment basic>
                <h2>Allowances of {addressFromParams}:</h2>
            </Segment>
            <AllowancesListFilter showZeroAllowances={showZeroAllowances}
                                  toggleShowZeroAllowances={toggleShowZeroAllowances}
                                  addressFilterValue={addressFilter}
                                  handleAddressFilterChange={handleAddressFilterChange}
                                  clearAddressFilter={clearAddressFilter}
            />
            <Button onClick={loadAllowances}>refresh allowances</Button>
            <AllowancesListContainer
                owner={addressFromParams?addressFromParams:''}
                showZeroAllowances={showZeroAllowances}
                addressFilter={addressFilter}
            />
        </React.Fragment>
    )
}

export default AllowanceLister