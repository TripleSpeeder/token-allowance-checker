# Token Allowance Checker ("TAC")

## Introduction

__Token Allowance Checker__ is running at __https://tac.dappstar.io__.

There is also an outdated screencast (no audio): https://drive.google.com/file/d/1hS05o5LhC5lc9JU9nEdihURikU3AimVi/view

### The _unlimited approval_ problem
Many DApps have the habit of requiring you to approve effectively unlimited amount of tokens. This helps
improving the user experience, as you only have to sign off an approval once and it will be enough for
all future transactions.

However this also means that the DApp (or the person/entity controlling it) can at any time transfer
all of your tokens, without requiring any further approval.

In addition, there is no concept of expiring approvals. Once approved, the approval will remain forever.
If you do not trust a DApp or its operators anymore, there is usually no easy way to remove the approval.

## Empowering the user
Token Allowance Checker scans the complete Ethereum transaction history for ERC20-Approvals made by the
provided address. It collects all ERC20 token contracts and any `spender` addresses that have been 
approved by the user in the past.

This information is displayed to the user, together with the up-to-date allowance amount.

For all entries, the user can edit or delete the allowance.

### History
Originally this project started as a (winning) entry to the Gitcoin ["Sustain web3"](https://gitcoin.co/hackathon/sustain-web3/)
hackathon for bounty https://gitcoin.co/issue/dfuse-io/hackathons/2/3953. Since then it has evolved
further, moving from a plain javascript react app to react-redux and typescript. 

## Technologies used
 - [dfuse](https://www.dfuse.io/) to search for allowances approved in the past.
 - [Onboard.js](https://www.blocknative.com/onboard) for setting up web3 provider and accessing user wallet/accounts
 - [Redux-Toolkit](https://redux-toolkit.js.org/) for efficient Redux development
 - [typechain](https://github.com/ethereum-ts/TypeChain) to generate typings for ERC20 contract ABI

## Release workflow
 - PRs should go against development branch
 - To create a new release:
   - checkout development branch
   - issue `npm run release` - This will update the Changelog.md with all changes and create a new version tag
   - Create a PR against master
   - When the PR gets merged, travisCI will automatically deploy the latest release to gh-pages.
  