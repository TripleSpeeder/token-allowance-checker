import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

const OfflineModal = () => {
  return (
    <Modal size={'large'} open={true}>
      <Modal.Header>TAC is offline</Modal.Header>
      <Modal.Content>
        <p>
          Since the dfuse.io backend service is not available anymore, Token
          Allowance Checker remains offline for now.
        </p>
        <p>
          I&#39;m working on a replacement service to retrieve allowances but it
          is unclear when this will be available.
        </p>
      </Modal.Content>
    </Modal>
  )
}

export default OfflineModal
