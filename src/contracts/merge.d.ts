declare global {
    namespace Truffle {
        interface Artifacts {
            require(
                name: 'ERC20Detailed'
            ): TruffleContracts.ERC20DetailedContract
        }
    }
}
