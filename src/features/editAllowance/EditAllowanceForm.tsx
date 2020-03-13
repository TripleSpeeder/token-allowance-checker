import React from 'react'
import { Form, Grid, Header, Input, Message, Modal } from 'semantic-ui-react'

interface EditAllowanceFormProps {
    tokenName: string
    tokenSymbol: string
    tokenAddress: string
    spenderAddress: string
    spenderENSName: string
    currentAllowance: string
    newAllowance: string
    handleChange: (e: React.FormEvent<EventTarget>) => void
    handleClose: () => void
    handleSubmit: () => void
}

const EditAllowanceForm = ({
    tokenName,
    handleChange,
    tokenAddress,
    spenderAddress,
    currentAllowance,
    newAllowance,
    handleClose,
    handleSubmit,
}: EditAllowanceFormProps) => {
    let headline = tokenName
    if (headline === '') {
        headline = `Unnamed ERC20 at ${tokenAddress}`
    }
    return (
        <Modal open={true} size={'small'} onClose={handleClose}>
            <Header>Edit Allowance</Header>
            <Modal.Content>
                <Message size={'huge'}>
                    <Message.List>
                        <Message.Item>Token: {headline}</Message.Item>
                        <Message.Item>Spender: {spenderAddress}</Message.Item>
                        <Message.Item>
                            Current allowance: {currentAllowance}
                        </Message.Item>
                    </Message.List>
                </Message>
                <Form size={'huge'} onSubmit={handleSubmit}>
                    <Form.Field required>
                        <Input
                            label={{
                                tag: true,
                                content: 'Enter new allowance',
                            }}
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
                                <Form.Button
                                    type={'button'}
                                    fluid
                                    size={'huge'}
                                    negative
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Form.Button>
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Button
                                    type={'submit'}
                                    fluid
                                    size={'huge'}
                                    positive
                                >
                                    Set allowance
                                </Form.Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form>
            </Modal.Content>
        </Modal>
    )
}

export default EditAllowanceForm
