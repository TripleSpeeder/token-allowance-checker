import React, { useEffect, useState } from 'react'
import {
    Header,
    Segment,
    Table,
    Placeholder,
    Icon,
    Divider,
    Image,
} from 'semantic-ui-react'
import AddressDisplay from '../../components/AddressDisplay'
import BN from 'bn.js'
import { AddressId } from '../addressInput/AddressSlice'
import { AllowanceId, QueryStates } from './AllowancesListSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'app/rootReducer'
import TokenAllowanceItem from './TokenAllowanceItem'
import { addBalanceThunk, buildBalanceId } from '../balances/BalancesSlice'
import bn2DisplayString from '@triplespeeder/bn2string'
import buildTokenLogoUrl from '../../utils/tokenMeta'
import { useAppSelector } from '../../app/hooks'

interface TokenAllowanceItemProps {
    tokenId: AddressId
    ownerId: AddressId
    allowanceIds: Array<AllowanceId>
}

const TokenAllowancesItem = ({
    tokenId,
    ownerId,
    allowanceIds,
}: TokenAllowanceItemProps) => {
    const dispatch = useDispatch()
    const { mobile } = useAppSelector((state: RootState) => state.respsonsive)
    const { networkId } = useAppSelector((state: RootState) => state.onboard)
    const tokenContract = useAppSelector(
        (state: RootState) => state.tokenContracts.contractsById[tokenId]
    )
    const tokenAddress = useAppSelector(
        (state: RootState) => state.addresses.addressesById[tokenId]
    )
    const ownerBalance = useAppSelector((state: RootState) => {
        const balanceId = buildBalanceId(ownerId, tokenId)
        return state.balances.balancesById[balanceId]
    })
    const [collapsed, setCollapsed] = useState(true)
    const [tokenLogoUrl, setTokenLogoUrl] = useState<string | undefined>(
        undefined
    )

    // lazy-load owner balance when contract instance is available
    useEffect(() => {
        if (!ownerBalance && tokenContract?.contractInstance) {
            dispatch(addBalanceThunk(ownerId, tokenId))
        }
    }, [ownerBalance, ownerId, tokenId, tokenContract, dispatch])

    useEffect(() => {
        if (tokenAddress) {
            setTokenLogoUrl(buildTokenLogoUrl(tokenAddress.address))
        }
    }, [tokenAddress])

    const toggleCollapse = () => {
        setCollapsed(!collapsed)
    }

    // return placeholder if contract is not yet loaded
    if (!tokenContract) {
        return (
            <Segment raised>
                <Placeholder>
                    <Placeholder.Header>
                        <Placeholder.Line />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder.Paragraph>
                </Placeholder>
            </Segment>
        )
    }

    let tokenName = tokenContract.name
    if (tokenName === '') {
        tokenName = `Unnamed ERC20`
    }

    const roundToDecimals = new BN(2)
    let tokenBalance
    if (
        !ownerBalance ||
        ownerBalance.queryState === QueryStates.QUERY_STATE_RUNNING
    ) {
        tokenBalance = '(loading...)'
    } else {
        const { rounded } = bn2DisplayString({
            value: ownerBalance.value,
            decimals: tokenContract.decimals,
            roundToDecimals,
        })
        tokenBalance = `(${rounded} ${tokenContract.symbol})`
    }

    // populate rows with one entry per allowance from allowanceIds
    const rows: Array<React.ReactNode> = []
    allowanceIds.forEach((allowanceId) => {
        rows.push(
            <TokenAllowanceItem key={allowanceId} allowanceId={allowanceId} />
        )
    })

    // Set fallback token log image url
    const onTokenLogoError = () => {
        setTokenLogoUrl('/icon_noText.png')
    }

    const logoImage = <Image src={tokenLogoUrl} onError={onTokenLogoError} />

    if (mobile) {
        let table
        if (!collapsed) {
            table = (
                <Table basic={'very'} celled unstackable compact size={'small'}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Spender</Table.HeaderCell>
                            <Table.HeaderCell
                                textAlign={'center'}
                                style={{ paddingBottom: 0 }}
                            >
                                Allowance
                                <Divider fitted />
                                <small>Last modified</small>
                            </Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>{rows}</Table.Body>
                </Table>
            )
        }
        const toggleButton = (
            <Icon
                style={{ float: 'right' }}
                name={collapsed ? 'chevron down' : 'chevron up'}
                size={'mini'}
                onClick={toggleCollapse}
            />
        )
        return (
            <Segment raised>
                <Header size={'small'}>
                    {toggleButton}
                    {logoImage}
                    <Header.Content style={{ maxWidth: '75%' }}>
                        {tokenName} {tokenBalance}
                        <Header.Subheader>
                            <AddressDisplay
                                ethAddress={tokenAddress}
                                mobile={mobile}
                                networkId={networkId}
                            />
                        </Header.Subheader>
                    </Header.Content>
                </Header>
                {table}
            </Segment>
        )
    } else {
        return (
            <Segment raised>
                <Header size={'medium'}>
                    {logoImage}
                    <Header.Content>
                        {tokenName} {tokenBalance}
                        <Header.Subheader>
                            <AddressDisplay
                                ethAddress={tokenAddress}
                                mobile={mobile}
                                networkId={networkId}
                            />
                        </Header.Subheader>
                    </Header.Content>
                </Header>
                <Table basic={'very'} celled selectable>
                    <Table.Header>
                        <Table.Row textAlign={'center'}>
                            <Table.HeaderCell>Spender</Table.HeaderCell>
                            <Table.HeaderCell textAlign={'center'}>
                                Allowance
                            </Table.HeaderCell>
                            <Table.HeaderCell textAlign={'center'}>
                                Last Change
                            </Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>{rows}</Table.Body>
                </Table>
            </Segment>
        )
    }
}

export default TokenAllowancesItem
