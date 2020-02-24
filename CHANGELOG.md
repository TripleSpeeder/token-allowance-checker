## [1.1.1](https://github.com/TripleSpeeder/token-allowance-checker/compare/v1.1.0...v1.1.1) (2020-02-22)


### Bug Fixes

* change string 'unknown ERC20' to 'unnamed ERC20' ([3719183](https://github.com/TripleSpeeder/token-allowance-checker/commit/3719183cb21dfe8eba86bc1571f8703a723a0fc4))

# 1.0.0 (2020-02-20)


### Bug Fixes

* dont spam console with "reverse name not found" messages ([6dd6497](https://github.com/TripleSpeeder/token-allowance-checker/commit/6dd6497bc8c6255bc3e27ce751bf3eb4883bbbc3))
* make sure to get all results by using paginated graphql query ([863876d](https://github.com/TripleSpeeder/token-allowance-checker/commit/863876dd56d5fffc4cd736b1960763b0ed964983))
* modify query to not rely on transaction.signer ([9638007](https://github.com/TripleSpeeder/token-allowance-checker/commit/96380073a0d0bfdd3ead6560ffc5105e3cc95578)), closes [#6](https://github.com/TripleSpeeder/token-allowance-checker/issues/6)
* prevent change of unmmounted component ([8bfcf8c](https://github.com/TripleSpeeder/token-allowance-checker/commit/8bfcf8cf57dd4d620cfe0b435c1c42dea4f08945))
* quick fix to remove token contracts that are not ERC20 but still log Approve-events with the same signature ([cc93a06](https://github.com/TripleSpeeder/token-allowance-checker/commit/cc93a061732e5ab0f6f8cb34209555498347b3b1))
* use dedicated api key for web requests ([69bb99b](https://github.com/TripleSpeeder/token-allowance-checker/commit/69bb99b4c48339734148246f8eefd42a32201dfd))
