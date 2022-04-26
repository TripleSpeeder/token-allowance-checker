import React from 'react'
import { Container, Icon } from 'semantic-ui-react'
import DisplayMessage from './DisplayMessage'

export default {
  title: 'DisplayMessage',
  component: DisplayMessage,
  decorators: [
    (story: () => React.ReactNode) => <Container>{story()}</Container>
  ]
}

const loadingIcon = <Icon name='circle notched' loading />
const errorIcon = <Icon name='exclamation triangle' />
const infoIcon = <Icon name='info' />
const header = 'Header text'
const body = 'Header body lorem ipsum dolor bla bla blubber more bla'

export const infoMobile = () => (
  <DisplayMessage
    mobile={true}
    info={true}
    icon={infoIcon}
    header={header}
    body={body}
  />
)
export const infoDesktop = () => (
  <DisplayMessage
    mobile={false}
    info={true}
    icon={infoIcon}
    header={header}
    body={body}
  />
)
export const errorMobile = () => (
  <DisplayMessage
    mobile={true}
    error={true}
    icon={errorIcon}
    header={header}
    body={body}
  />
)
export const errorDesktop = () => (
  <DisplayMessage
    mobile={false}
    error={true}
    icon={errorIcon}
    header={header}
    body={body}
  />
)
export const warningLoadingMobile = () => (
  <DisplayMessage
    mobile={true}
    warning={true}
    icon={loadingIcon}
    header={header}
    body={body}
  />
)
export const warningLoadingDesktop = () => (
  <DisplayMessage
    mobile={false}
    warning={true}
    icon={loadingIcon}
    header={header}
    body={body}
  />
)
