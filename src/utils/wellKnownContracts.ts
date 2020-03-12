interface contractMetadata {
    name: string,
    symbol: string
}
interface contractInfo {
    [key:string]: contractMetadata
}

export interface IWellKnownContracts {
    [key: number]: contractInfo
}

export const wellKnownContracts:IWellKnownContracts = {
    // main network
    1: {
        '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359': {
            name: 'Sai Stablecoin',
            symbol: 'SAI',
        },
        '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': {
            name: 'Maker Token',
            symbol: 'MKR',
        },
        '0xecf8f87f810ecf450940c9f60066b4a7a501d6a7': {
            name: 'Old Wrapped Ether',
            symbol: 'WETH'
        },
        '0xc66ea802717bfb9833400264dd12c2bceaa34a6d': {
            name: 'Old Maker Token',
            symbol: 'MKR'
        },
        '0xbb9bc244d798123fde783fcc1c72d3bb8c189413': {
            name: 'TheDAO Token',
            symbol: 'TheDAO'
        }
    }
}

export default wellKnownContracts
