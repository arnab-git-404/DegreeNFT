# DegreeNFT

A blockchain-based solution for issuing, managing, and verifying academic credentials as Non-Fungible Tokens (NFTs).

## Overview

DegreeNFT leverages blockchain technology to create tamper-proof digital academic credentials. Educational institutions can issue degrees as NFTs, providing graduates with verifiable, portable proof of their qualifications that can be easily shared with employers or other institutions.

## Features

- **Secure Credential Issuance**: Convert academic degrees into blockchain-verified NFTs
- **Credential Verification**: Simple verification process for employers and institutions
- **Ownership Control**: Graduates maintain complete ownership of their credentials
- **Revocation Capability**: Institutions can revoke credentials if necessary
- **Metadata Storage**: Store comprehensive credential details within the NFT

## Tech Stack

- Solidity (Smart Contracts)
- Ethereum Blockchain
- IPFS (for certificate metadata storage)
- Web3.js
- React (Front-end)

## Installation

```
git clone https://github.com/yourusername/DegreeNFT.git
cd DegreeNFT
npm install
```

## Development

```
npm run dev
```

## Testing

```
npm test
```

## Deployment

1. Configure your network in `truffle-config.js`
2. Deploy smart contracts:
   ```
   truffle migrate --network <network-name>
   ```
3. Update front-end configuration with deployed contract addresses

## Usage

### For Educational Institutions

```javascript
// Example code for minting a new degree NFT
const degreeNFT = await DegreeNFT.deployed();
await degreeNFT.mintDegree(
  studentAddress,
  "Bachelor of Science in Computer Science",
  "ipfs://QmXyz..." // IPFS hash containing degree metadata
);
```

### For Students/Graduates

- Connect wallet to view owned degree NFTs
- Share verification links with potential employers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
