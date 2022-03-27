# GSN Demo

## Running

### Prerequisites for running on Rinkeby
- Get your own node URL and wallet private key
- Create rinkeby.json file
```
{
    "url": "https://rinkeby.infura.io/v3/...",
    "privateKey": "..."
}
```

### Local demo

- `npx hardhat compile`
- `npx hardhat node`
- `node scripts/test-gsn.js`

### Demo on Rinkeby with GSN's Paymaster

- `npx hardhat compile`
- `npx hardhat run scripts/test-gsn-rinkeby.js --network rinkeby`

### Demo on Rinkeby with our own's Paymaster

- `npx hardhat compile`
- `npx hardhat run scripts/test-gsn-rinkeby-custom-paymaster.js --network rinkeby`