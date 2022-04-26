import React from 'react'
import AddressDisplay from './AddressDisplay'
import { Container } from 'semantic-ui-react'
import {
  EthAddress,
  ResolvingStates
} from '../features/addressInput/AddressSlice'

export default {
  title: 'AddressDisplay',
  component: AddressDisplay,
  decorators: [
    (story: () => React.ReactNode) => <Container>{story()}</Container>
  ]
}

const resolvingEns: EthAddress = {
  address: '0x0D0707963952f2fBA59dD06f2b425ace40b492Fe',
  resolvingState: ResolvingStates.ResolvingForward
}
const withEns: EthAddress = {
  address: '0x0D0707963952f2fBA59dD06f2b425ace40b492Fe',
  ensName: 'cool.stuff.eth',
  resolvingState: ResolvingStates.Resolved
}
const withEsName: EthAddress = {
  address: '0x0D0707963952f2fBA59dD06f2b425ace40b492Fe',
  esContractName: 'Payroll',
  resolvingState: ResolvingStates.Resolved
}
const withAllNames: EthAddress = {
  address: '0x0D0707963952f2fBA59dD06f2b425ace40b492Fe',
  ensName: 'cool.stuff.eth',
  esContractName: 'Payroll',
  resolvingState: ResolvingStates.Resolved
}
const withoutEns: EthAddress = {
  address: '0x0D0707963952f2fBA59dD06f2b425ace40b492Fe',
  resolvingState: ResolvingStates.Resolved
}

const AddressDisplayProps = {
  resolvedAddress: withEns,
  resolvingAddress: resolvingEns,
  resolvedWithoutEns: withoutEns,
  resolvedWithEsName: withEsName,
  resolvedWithAllNames: withAllNames
}

export const resolving = () => (
  <AddressDisplay
    ethAddress={AddressDisplayProps.resolvingAddress}
    mobile={false}
    networkId={1}
  />
)

export const noENS = () => (
  <AddressDisplay
    ethAddress={AddressDisplayProps.resolvedWithoutEns}
    mobile={false}
    networkId={1}
  />
)

export const withENS = () => (
  <AddressDisplay
    ethAddress={AddressDisplayProps.resolvedAddress}
    mobile={false}
    networkId={1}
  />
)

export const withEs = () => (
  <AddressDisplay
    ethAddress={AddressDisplayProps.resolvedWithEsName}
    mobile={false}
    networkId={1}
  />
)

export const withEnsAndEs = () => (
  <AddressDisplay
    ethAddress={AddressDisplayProps.resolvedWithAllNames}
    mobile={false}
    networkId={1}
  />
)

export const mobileResolving = () => (
  <AddressDisplay
    ethAddress={AddressDisplayProps.resolvingAddress}
    mobile={true}
    networkId={1}
  />
)

export const mobileNoENS = () => (
  <AddressDisplay
    ethAddress={AddressDisplayProps.resolvedWithoutEns}
    mobile={true}
    networkId={1}
  />
)

export const mobileWithENS = () => (
  <AddressDisplay
    ethAddress={AddressDisplayProps.resolvedAddress}
    mobile={true}
    networkId={1}
  />
)

export const mobileWithEs = () => (
  <AddressDisplay
    ethAddress={AddressDisplayProps.resolvedWithEsName}
    mobile={true}
    networkId={1}
  />
)

export const mobileWithEnsAndEs = () => (
  <AddressDisplay
    ethAddress={AddressDisplayProps.resolvedWithAllNames}
    mobile={true}
    networkId={1}
  />
)
