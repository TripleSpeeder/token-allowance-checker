# Token Allowance Checker ("TAC")

### TODO on redux/typescript refactor branch after initial implementation

 - Verify if contracts are ERC20-conform before adding them
 - Use names & symbols from WellKnownContracts.js if necessary
 - Add TokenBalanceSlice to track token balance of provided addresses
 - Add typechain generation to travis config for building


## Introduction
This is my entry to the Gitcoin ["Sustain web3"](https://gitcoin.co/hackathon/sustain-web3/) hackathon.

Bounty: https://gitcoin.co/issue/dfuse-io/hackathons/2/3953

__Token Allowance Checker__ is running at __https://tac.dappstar.io__.

There is also a short screencast (no audio): https://drive.google.com/file/d/1hS05o5LhC5lc9JU9nEdihURikU3AimVi/view

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

## Technologies used
 - [dfuse](https://www.dfuse.io/) to search for allowances approved in the past.
 - [Onboard.js](https://www.blocknative.com/onboard) for setting up web3 provider and accessing user wallet/accounts

## Release workflow
 - PRs should go against development branch
 - To create a new release:
   - checkout development branch
   - issue `npm run release` - This will update the Changelog.md with all changes and create a new version tag
   - Create a PR against master
   - When the PR gets merged, travisCI will automatically deploy the latest release to gh-pages.
  