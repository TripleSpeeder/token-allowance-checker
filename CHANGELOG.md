# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.3.1](https://github.com/TripleSpeeder/token-allowance-checker/compare/v1.3.0...v1.3.1) (2020-03-02)


### Bug Fixes

* handle failing allowance() calls ([bbf6796](https://github.com/TripleSpeeder/token-allowance-checker/commit/bbf6796697b2bc231144531cae8921cc6afdc3f7))
* handle logEntries with empty data (0x) ([5ca31e1](https://github.com/TripleSpeeder/token-allowance-checker/commit/5ca31e1b0f0a03cc2d14f218f87e3c58cdba2ba3))
* improve detection of non-ERC20 contracts ([a4d1756](https://github.com/TripleSpeeder/token-allowance-checker/commit/a4d17560993091bac30e120f56ab8d9b5d808040))

## [1.3.0](https://github.com/TripleSpeeder/token-allowance-checker/compare/v1.2.0...v1.3.0) (2020-02-27)


### Features

* support Trezor and Ledger ([1352998](https://github.com/TripleSpeeder/token-allowance-checker/commit/13529986ccd15f3e49e94653a738467e5b784faa))


### Bug Fixes

* don't autofocus on tokenFilter ([cc59442](https://github.com/TripleSpeeder/token-allowance-checker/commit/cc594429b86e0fbbd5bffe79c7b968f02dc2f255))
* reload allowance after editing ([9f576a5](https://github.com/TripleSpeeder/token-allowance-checker/commit/9f576a568467464b4508bdadc94002180c3a1e7a)), closes [#18](https://github.com/TripleSpeeder/token-allowance-checker/issues/18)
* set initial value '0' in EditAllowanceFormContainer.js ([6b54805](https://github.com/TripleSpeeder/token-allowance-checker/commit/6b5480529434a2f487134ee3fab6c8d3c019918c))

## [1.2.0](https://github.com/TripleSpeeder/token-allowance-checker/compare/v1.0.0...v1.2.0) (2020-02-24)


### Features

* filter allowances ([2cf5b2a](https://github.com/TripleSpeeder/token-allowance-checker/commit/2cf5b2ac84c8bfd7a207919a4a39be15da8cff9c))
* show version number ([4537a97](https://github.com/TripleSpeeder/token-allowance-checker/commit/4537a97a725313ee19293414d133d86453cda718)), closes [#17](https://github.com/TripleSpeeder/token-allowance-checker/issues/17)


### Bug Fixes

* change string 'unknown ERC20' to 'unnamed ERC20' ([3719183](https://github.com/TripleSpeeder/token-allowance-checker/commit/3719183cb21dfe8eba86bc1571f8703a723a0fc4))
* forgot to change 'unknown' to 'unnamed' in another location ([04412b3](https://github.com/TripleSpeeder/token-allowance-checker/commit/04412b30498667524c9a613d14a2bfc74cc15cf6))

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
