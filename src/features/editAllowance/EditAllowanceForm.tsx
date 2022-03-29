import React from 'react'
import { Form, Grid, Header, Input, Message, Modal } from 'semantic-ui-react'
import AddressDisplay from '../../components/AddressDisplay'
import { EthAddress } from '../addressInput/AddressSlice'

interface EditAllowanceFormProps {
  mobile: boolean
  tokenName: string
  tokenSymbol: string
  tokenAddress: string
  spender: EthAddress
  currentAllowance: string
  newAllowance: string
  handleChange: (e: React.FormEvent<EventTarget>) => void
  handleClose: () => void
  handleSubmit: () => void
}

const EditAllowanceForm = ({
  mobile,
  tokenName,
  handleChange,
  tokenSymbol,
  spender,
  currentAllowance,
  newAllowance,
  handleClose,
  handleSubmit
}: EditAllowanceFormProps) => {
  const size = mobile ? 'small' : 'huge'
  const spenderAddressDisplay = (
    <AddressDisplay
      ethAddress={spender}
      mobile={mobile}
      chainId={'0x1'}
      inline={true}
    />
  )
  let inputElem
  if (mobile) {
    inputElem = (
      <>
        <label>New Allowance</label>
        <Input
          placeholder='Enter amount'
          type={'number'}
          name={'newAllowance'}
          onChange={handleChange}
          value={newAllowance}
          fluid={true}
        />
      </>
    )
  } else {
    inputElem = (
      <Input
        label={{
          tag: true,
          content: 'Enter new allowance'
        }}
        labelPosition='right'
        placeholder='Enter amount'
        type={'number'}
        name={'newAllowance'}
        onChange={handleChange}
        value={newAllowance}
      />
    )
  }
  return (
    <Modal open={true} size={'small'} onClose={handleClose}>
      <Header>Edit Allowance</Header>
      <Modal.Content>
        <Message size={size}>
          <Message.List>
            <Message.Item>
              Token: <strong>{tokenName}</strong>
            </Message.Item>
            <Message.Item>Spender: {spenderAddressDisplay}</Message.Item>
            <Message.Item>
              Current allowance:{' '}
              <strong>
                {currentAllowance} {tokenSymbol}
              </strong>
            </Message.Item>
          </Message.List>
        </Message>
        <Form size={'size'} onSubmit={handleSubmit}>
          <Form.Field required>{inputElem}</Form.Field>
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Form.Button
                  type={'button'}
                  fluid
                  size={size}
                  negative
                  onClick={handleClose}
                >
                  Cancel
                </Form.Button>
              </Grid.Column>
              <Grid.Column>
                <Form.Button type={'submit'} fluid size={size} positive>
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
