import React from 'react'
import { Message, Segment } from 'semantic-ui-react'

interface DisplayMessageProps {
  mobile: boolean
  info?: boolean
  warning?: boolean
  error?: boolean
  success?: boolean
  icon?: React.ReactNode
  header?: string
  body: React.ReactNode | string
}

const DisplayMessage = ({
  mobile,
  info,
  warning,
  error,
  success,
  icon,
  header,
  body
}: DisplayMessageProps) => {
  const desktop = !mobile
  const padded = desktop && 'very'
  const withIcon = !!icon
  const size = mobile ? 'small' : 'huge'
  const textAlign = mobile ? 'left' : 'center'

  return (
    <Segment basic padded={padded} textAlign={textAlign}>
      <Message
        warning={warning}
        info={info}
        error={error}
        success={success}
        icon={withIcon}
        size={size}
      >
        {withIcon && icon}
        <Message.Content>
          <Message.Header>{header}</Message.Header>
          {body}
        </Message.Content>
      </Message>
    </Segment>
  )
}

export default DisplayMessage
