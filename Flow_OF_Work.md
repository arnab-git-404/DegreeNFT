# Degree NFT Issuance Flow

1. **Connect Wallet**
    - User connects their Phantom, Solflare, or other Solana wallet

2. **Prepare Metadata**
    - Create the degree certificate metadata (university, student details, etc.)

3. **Upload Metadata**
    - Upload the metadata to decentralized storage (NFT.storage in our implementation)

4. **Create Token**
    - Create a new SPL token with supply of 1 on Solana blockchain

5. **Create Metadata Account**
    - Link the on-chain token to your uploaded metadata using Metaplex's Token Metadata program

6. **Mint NFT**
    - Issue the token to the recipient wallet

7. **Transaction Complete**
    - NFT is now visible on Solana Explorer and in recipient's wallet