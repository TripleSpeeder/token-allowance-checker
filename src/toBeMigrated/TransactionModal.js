import React from 'react'
import PropTypes from 'prop-types'
import {Button, Icon, Message, Modal} from 'semantic-ui-react'

const TransactionModal = ({showModal, isConfirming, transactionHash, error, handleClose}) => {

    let message
    if (error) {
        message = <Message error icon>
            <Icon name='exclamation triangle' />
            <Message.Content>
                <Message.Header>Error</Message.Header>
                {error}
            </Message.Content>
        </Message>
    } else if (transactionHash) {
        message = <Message success icon>
            <Icon name='checkmark' />
            <Message.Content>
                <Message.Header>Allowance changed</Message.Header>
                <p>The new allowance is now set.</p>
                <p>Transaction Hash: {transactionHash}</p>
            </Message.Content>
        </Message>
    } else if (isConfirming) {
        message = <Message icon info>
            <Icon name='spinner' loading/>
            <Message.Content>
                <Message.Header>Waiting for confirmation</Message.Header>
                Transaction is being processed...
            </Message.Content>
        </Message>
    }

    return (
        <Modal
            open={showModal}
            size={'small'}
            onClose={handleClose}
        >
            <Modal.Content>
                {message}
            </Modal.Content>
            {!isConfirming && <Modal.Actions>
                <Button onClick={handleClose}>Dismiss</Button>
            </Modal.Actions>}
        </Modal>
    )
}

TransactionModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    isConfirming: PropTypes.bool.isRequired,
    transactionHash: PropTypes.string,
    error: PropTypes.string,
    handleClose: PropTypes.func.isRequired,
}

export default TransactionModal