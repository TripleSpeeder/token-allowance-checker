import { AllowanceId } from './AllowancesListSlice'
import React from 'react'
import { Button, Icon, Popup } from 'semantic-ui-react'
import { openEditAllowanceModal } from '../editAllowance/EditAllowanceSlice'
import { TransactionStates } from '../transactionTracker/TransactionTrackerSlice'
import { useDispatch } from 'react-redux'
import { RootState } from '../../app/rootReducer'
import { useAppSelector } from '../../app/hooks'

interface TokenAllowanceItemActionsProps {
  allowanceId: AllowanceId
}
const TokenAllowanceItemActions = ({
  allowanceId
}: TokenAllowanceItemActionsProps) => {
  const dispatch = useDispatch()
  const allowance = useAppSelector(
    (state: RootState) => state.allowances.allowancesById[allowanceId]
  )
  const transaction = useAppSelector((state: RootState) =>
    allowance.editTransactionId
      ? state.transactions.transactionsById[allowance.editTransactionId]
      : undefined
  )
  const walletAddressId = useAppSelector(
    (state: RootState) => state.addresses.walletAddressId
  )

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    dispatch(openEditAllowanceModal(allowanceId))
  }

  let transactionContent
  if (transaction) {
    let icon
    let msg
    let header
    switch (transaction.transactionState) {
      case TransactionStates.CONFIRMED:
        icon = <Icon name={'check'} size={'large'} />
        header = 'Transaction confirmed'
        msg = `Transaction hash: ${transaction.transactionHash}`
        break
      case TransactionStates.FAILED:
        icon = (
          <Icon name={'exclamation triangle'} color={'red'} size={'large'} />
        )
        header = 'Transaction failed'
        msg = `${transaction.error}`
        break
      case TransactionStates.SUBMITTED:
        icon = <Icon name={'spinner'} loading size={'large'} />
        header = 'Transaction created'
        msg = `Waiting for confirmation...`
        break
      case TransactionStates.INITIAL:
      default:
        icon = <Icon name={'question'} size={'large'} />
        header = 'Transaction unknown'
        msg = 'Tx state INITIAL'
    }
    transactionContent = <Popup header={header} content={msg} trigger={icon} />
  }
  let actionContent
  if (transaction?.transactionState !== TransactionStates.SUBMITTED) {
    const editEnabled = allowance.ownerId === walletAddressId
    actionContent = (
      <Popup
        content={
          editEnabled
            ? 'edit allowance'
            : 'Only address owner can edit allowance'
        }
        trigger={
          <span>
            <Button
              icon={'edit'}
              size={'small'}
              compact
              primary
              disabled={!editEnabled}
              onClick={handleClick}
            />
          </span>
        }
      />
    )
  }

  return (
    <>
      {actionContent}&nbsp;{transactionContent}
    </>
  )
}

export default TokenAllowanceItemActions
