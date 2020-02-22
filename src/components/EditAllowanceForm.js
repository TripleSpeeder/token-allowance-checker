import React from 'react'
import PropTypes from 'prop-types'
import {Form, Grid, Header, Input, Message, Modal} from 'semantic-ui-react'

const EditAllowanceForm = ({showModal, tokenName, tokenAddress, spenderAddress, currentAllowance, newAllowance, handleClose, handleSubmit, handleChange}) => {
    let headline = tokenName
    if (headline === '') {
        headline = `Unnamed ERC20 at ${tokenAddress}`
    }
    return (
        <Modal
            open={showModal}
            size={'small'}
            onClose={handleClose}
        >
            <Header>Edit Allowance</Header>
            <Modal.Content>
                <Message size={'huge'}>
                    <Message.List>
                        <Message.Item>Token: {headline}</Message.Item>
                        <Message.Item>Spender: {spenderAddress}</Message.Item>
                        <Message.Item>Current allowance: {currentAllowance}</Message.Item>
                    </Message.List>
                </Message>
                <Form size={'huge'} onSubmit={handleSubmit}>
                    <Form.Field required>
                        <Input
                            label={{ tag: true, content: 'Set new allowance' }}
                            labelPosition='right'
                            placeholder='Enter amount'
                            type={'number'}
                            name={'newAllowance'}
                            onChange={handleChange}
                            value={newAllowance}
                        />
                    </Form.Field>
                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column>
                                <Form.Button type={'button'} fluid size={'huge'} negative onClick={handleClose}>Cancel</Form.Button>
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Button type={'submit'} fluid size={'huge'} positive>Okay</Form.Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form>
            </Modal.Content>
        </Modal>
    )
}

EditAllowanceForm.propTypes = {
    tokenName: PropTypes.string.isRequired,
    tokenSymbol: PropTypes.string.isRequired,
    tokenAddress: PropTypes.string.isRequired,
    spenderAddress: PropTypes.string.isRequired,
    spenderENSName: PropTypes.string,
    currentAllowance: PropTypes.string.isRequired,
    newAllowance: PropTypes.string,
    showModal: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
}

export default EditAllowanceForm