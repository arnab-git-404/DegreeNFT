// 3rd Edition - 14.03.25

// import { createContext, useContext, useState, useEffect, useMemo } from 'react';

// import { useWallet } from '@solana/wallet-adapter-react';
// import { PublicKey } from '@solana/web3.js';
// // import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
// import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
// import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
// import { generateSigner, some, none } from '@metaplex-foundation/umi';

// import { 
//   SOLANA_CONNECTION, 
//   SOLANA_NETWORK, 
//   isValidPublicKey, 
//   getExplorerUrl,
//   createDegreeMetadata,
//   calculateMintingCost
// } from '../lib/solana';

// // Create context
// const SolanaContext = createContext(null);

// export function SolanaProvider({ children }) {

//   const wallet = useWallet();
//   const { publicKey, signTransaction, connected } = wallet;
  
//   const [balance, setBalance] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [mintCost, setMintCost] = useState(0);
//   const [lastTransaction, setLastTransaction] = useState(null);

//   // Initialize Umi with the connected wallet when available
//   const umi = useMemo(() => {
//     // Create a base Umi instance
//     const umi = createUmi(SOLANA_CONNECTION.rpcEndpoint);
    
//     // Add plugins
//     let umiWithPlugins = umi.use(mplTokenMetadata());
    
//     // Add wallet adapter identity if connected
//     if (wallet && connected) {
//       umiWithPlugins = umiWithPlugins.use(walletAdapterIdentity(wallet));
//     }
    
//     return umiWithPlugins;
//   }, [wallet, connected, SOLANA_CONNECTION.rpcEndpoint]);

//   // Load wallet balance when connected
//   useEffect(() => {
//     if (!publicKey) return;

//     const fetchBalance = async () => {
//       try {
//         const bal = await SOLANA_CONNECTION.getBalance(publicKey);
//         setBalance(bal / 1000000000); // Convert lamports to SOL
//       } catch (error) {
//         console.error('Error fetching balance:', error);
//       }
//     };

//     fetchBalance();
    
//     // Subscribe to balance changes
//     const id = SOLANA_CONNECTION.onAccountChange(
//       publicKey,
//       () => fetchBalance(),
//       'confirmed'
//     );

//     return () => {
//       SOLANA_CONNECTION.removeAccountChangeListener(id);
//     };
//   }, [publicKey]);

//   // Load estimated minting cost on component mount
//   useEffect(() => {
//     const loadMintCost = async () => {
//       try {
//         const cost = await calculateMintingCost();
//         setMintCost(cost);
//       } catch (error) {
//         console.error("Failed to calculate minting cost:", error);
//       }
//     };
    
//     loadMintCost();
//   }, []);

//   // Mint an NFT using the metadata
//   const mintDegreeNFT = async (degreeData, recipientAddress = null) => {
//     if (!publicKey || !connected) {
//       throw new Error("Wallet not connected");
//     }

//     setIsLoading(true);
//     try {
//       // Create the metadata
//       const metadata = createDegreeMetadata(
//         {
//           ...degreeData,
//           studentAddress: recipientAddress || ''
//         },
//         publicKey.toString()
//       );
      
//       // For development/testing, we'll use a simplified approach
//       // In production, you would use a real IPFS storage or Arweave
//       const uri = `https://example.com/metadata/${Date.now()}.json`;
      
//       // Import the createNft function here to avoid loading issues
//       const { createNft } = await import('@metaplex-foundation/mpl-token-metadata');
      
//       // Generate a new keypair for the mint
//       const mintKeypair = generateSigner(umi);
      
//       // The owner will be the recipient if provided, otherwise the connected wallet
//       const ownerPublicKey = recipientAddress 
//         ? new PublicKey(recipientAddress).toBase58()
//         : publicKey.toBase58();
        
//       // Create the NFT
//       const { signature } = await createNft(umi, {
//         mint: mintKeypair,
//         name: degreeData.degreeType || 'Academic Degree',
//         symbol: 'DEGREE',
//         uri: uri,
//         sellerFeeBasisPoints: 0, // No royalties
//         collection: none(),
//         uses: none(),
//         isMutable: true,
//         tokenStandard: 0, // NonFungible
//         creators: [
//           {
//             address: publicKey.toBase58(),
//             verified: true,
//             share: 100,
//           },
//         ],
//         tokenOwner: some(ownerPublicKey),
//       }).sendAndConfirm(umi);
      
//       // Save the transaction info
//       setLastTransaction({
//         signature,
//         mintAddress: mintKeypair.publicKey,
//         recipient: recipientAddress || publicKey.toString()
//       });
      
//       return {
//         address: new PublicKey(mintKeypair.publicKey),
//         uri,
//         name: degreeData.degreeType || 'Academic Degree',
//         response: { signature }
//       };
//     } catch (error) {
//       console.error("Error minting NFT:", error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Transfer an NFT to another wallet
//   const transferDegreeNFT = async (mintAddress, recipientAddress) => {
//     if (!publicKey) {
//       throw new Error("Wallet not connected");
//     }
    
//     if (!isValidPublicKey(recipientAddress)) {
//       throw new Error("Invalid recipient address");
//     }

//     setIsLoading(true);
//     try {
//       // Transfer the token using the SPL Token Program
//       // This is a simplified implementation - in a real application
//       // you would use the token program to transfer the token
      
//       // Simulate a transfer for testing
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // For a real implementation, you would:
//       // 1. Get the token account for this mint owned by the current user
//       // 2. Get or create a token account for the recipient
//       // 3. Use the SPL Token transfer instruction to move the token
      
//       const signature = "simulated_transfer_" + Date.now();
      
//       setLastTransaction({
//         signature,
//         mintAddress,
//         recipient: recipientAddress
//       });
      
//       return { signature };
//     } catch (error) {
//       console.error("Error transferring NFT:", error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Verify a degree NFT's authenticity
//   const verifyDegreeNFT = async (mintAddress, universityAddress) => {
//     try {
//       if (!isValidPublicKey(mintAddress) || !isValidPublicKey(universityAddress)) {
//         throw new Error("Invalid mint or university address");
//       }
      
//       // This would need to be implemented to fetch NFT metadata
//       // and verify the creator address matches the university address
      
//       // For testing purposes, we'll simulate a verification
//       const verified = Math.random() > 0.3; // 70% chance to verify successfully
      
//       return {
//         verified,
//         nft: {
//           name: "Sample Degree Certificate",
//           creators: [{ address: new PublicKey(universityAddress), share: 100 }]
//         },
//         message: verified 
//           ? "Degree certificate verified successfully" 
//           : "This degree was not issued by the specified university"
//       };
//     } catch (error) {
//       console.error("Error verifying NFT:", error);
//       throw error;
//     }
//   };

//   const value = {
//     connected,
//     publicKey: publicKey?.toString(),
//     balance,
//     SOLANA_NETWORK,
//     SOLANA_CONNECTION,
//     mintCost,
//     isLoading,
//     lastTransaction,
//     umi,
//     mintDegreeNFT,
//     transferDegreeNFT,
//     verifyDegreeNFT,
//     getExplorerUrl,
//     isValidPublicKey
//   };

//   return (
//     <SolanaContext.Provider value={value}>
//       {children}
//     </SolanaContext.Provider>
//   );
// }

// // Custom hook to use the Solana context
// export function useSolana() {
//   const context = useContext(SolanaContext);
//   if (!context) {
//     throw new Error('useSolana must be used within a SolanaProvider');
//   }
//   return context;
// }

// 2nd Edition 7.31pm-13.03.25

// import { createContext, useContext, useState, useEffect, useMemo } from 'react';
// import { useWallet } from '@solana/wallet-adapter-react';
// import { PublicKey } from '@solana/web3.js';

// // Import Umi and plugins
// import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

// import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

// // import { nftStorage } from '@metaplex-foundation/umi-uploader-nft-storage';
// import { nftStorageUploader } from '@metaplex-foundation/umi-uploader-nft-storage';

// import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

// import { 
//   SOLANA_CONNECTION, 
//   SOLANA_NETWORK, 
//   isValidPublicKey, 
//   getExplorerUrl,
//   createDegreeMetadata,
//   calculateMintingCost
// } from '../lib/solana';

// // Create context
// const SolanaContext = createContext(null);

// export function SolanaProvider({ children }) {
  
//   const wallet = useWallet();

//   const { publicKey, signTransaction, connected } = wallet;
  
//   const [balance, setBalance] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [mintCost, setMintCost] = useState(0);
//   const [lastTransaction, setLastTransaction] = useState(null);

//   // Initialize Umi with the connected wallet when available
//   const umi = useMemo(() => {

//     // Create a base Umi instance
//     const umi = createUmi(SOLANA_CONNECTION);
    
//     // Add plugins
//     const umiWithPlugins = umi.use(mplTokenMetadata());
    
//     // Using NFT.storage for metadata uploads
//     // Note: You'll need to set an API key for production
//     // const umiWithStorage = umiWithPlugins.use(nftStorage());
//     // const umiWithStorage = umiWithPlugins.use(nftStorageUploader());
    
//     const umiWithStorage = umiWithPlugins.use(
//       nftStorageUploader({
//         token: process.env.REACT_APP_NFT_STORAGE_KEY || 'a1063ff5.051802e8e1144945aed009195a2da3ba'
//       })
//     );



//     // Add wallet adapter identity if connected
//     if (publicKey && signTransaction) {
//       return umiWithStorage.use(walletAdapterIdentity(wallet));
//     }
    
//     return umiWithStorage;
//   }, [publicKey, signTransaction, wallet]);

//   // Load wallet balance when connected
//   useEffect(() => {
//     if (!publicKey) return;

//     const fetchBalance = async () => {
//       try {
//         const bal = await SOLANA_CONNECTION.getBalance(publicKey);
//         setBalance(bal / 1000000000); // Convert lamports to SOL
//       } catch (error) {
//         console.error('Error fetching balance:', error);
//       }
//     };

//     fetchBalance();
    
//     // Subscribe to balance changes
//     const id = SOLANA_CONNECTION.onAccountChange(
//       publicKey,
//       () => fetchBalance(),
//       'confirmed'
//     );

//     return () => {
//       SOLANA_CONNECTION.removeAccountChangeListener(id);
//     };
//   }, [publicKey]);

//   // Load estimated minting cost on component mount
//   useEffect(() => {
//     const loadMintCost = async () => {
//       try {
//         const cost = await calculateMintingCost();
//         setMintCost(cost);
//       } catch (error) {
//         console.error("Failed to calculate minting cost:", error);
//       }
//     };
    
//     loadMintCost();
//   }, []);

//   // Mint an NFT using the metadata
//   const mintDegreeNFT = async (degreeData, recipientAddress = null) => {
//     if (!publicKey || !umi) {
//       throw new Error("Wallet not connected");
//     }

//     setIsLoading(true);
//     try {
//       // Create the metadata
//       const metadata = createDegreeMetadata(
//         {
//           ...degreeData,
//           studentAddress: recipientAddress || ''
//         },
//         publicKey.toString()
//       );
      
//       // Upload metadata
//       const uri = await umi.uploader.uploadJson(metadata);
      
//       // Create the NFT
//       // This is a simplified version - you'll need to implement the actual minting
//       // using mpl-token-metadata's createNft function
//       const { mintAddress, signature } = await createNftWithUmi(
//         umi,
//         {
//           name: metadata.name,
//           uri: uri,
//           sellerFeeBasisPoints: 0, // No royalties
//           symbol: 'DEGREE'
//         },
//         recipientAddress
//       );
      
//       // Save the transaction info
//       setLastTransaction({
//         signature,
//         mintAddress: mintAddress.toString(),
//         recipient: recipientAddress || publicKey.toString()
//       });
      
//       return {
//         address: mintAddress,
//         uri,
//         name: metadata.name,
//         response: { signature }
//       };
//     } catch (error) {
//       console.error("Error minting NFT:", error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Helper function to create an NFT with Umi
//   const createNftWithUmi = async (umi, metadata, recipientAddress = null) => {
//     // Import required functions from mpl-token-metadata
//     const { createNft, findMetadataPda } = await import('@metaplex-foundation/mpl-token-metadata');
    
//     // This implementation is simplified
//     // In a production app, you need to handle:
//     // 1. Creating a mint account
//     // 2. Initializing the mint
//     // 3. Creating a token account
//     // 4. Minting tokens
//     // 5. Creating metadata
    
//     // For now, we'll just return a placeholder
//     // You'll need to implement the actual minting logic
    
//     return {
//       mintAddress: new PublicKey("placeholder"),
//       signature: "placeholder"
//     };
//   };

//   // Transfer an NFT to another wallet
//   const transferDegreeNFT = async (mintAddress, recipientAddress) => {
//     if (!publicKey) {
//       throw new Error("Wallet not connected");
//     }
    
//     if (!isValidPublicKey(recipientAddress)) {
//       throw new Error("Invalid recipient address");
//     }

//     setIsLoading(true);
//     try {
//       // This would need to be implemented using the token program
//       // to transfer the NFT to the recipient
      
//       // Placeholder implementation
//       setLastTransaction({
//         signature: "placeholder",
//         mintAddress,
//         recipient: recipientAddress
//       });
      
//       return { signature: "placeholder" };
//     } catch (error) {
//       console.error("Error transferring NFT:", error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Verify a degree NFT's authenticity
//   const verifyDegreeNFT = async (mintAddress, universityAddress) => {
//     try {
//       // This would need to be implemented to fetch NFT metadata
//       // and verify the creator address matches the university address
      
//       // Placeholder implementation
//       return {
//         verified: true,
//         nft: {
//           name: "Placeholder Degree",
//           creators: [{ address: new PublicKey(universityAddress), share: 100 }]
//         },
//         message: "Degree certificate verified successfully"
//       };
//     } catch (error) {
//       console.error("Error verifying NFT:", error);
//       throw error;
//     }
//   };

//   const value = {
//     connected,
//     publicKey: publicKey?.toString(),
//     balance,
//     SOLANA_NETWORK,
//     SOLANA_CONNECTION,
//     mintCost,
//     isLoading,
//     lastTransaction,
//     umi,
//     mintDegreeNFT,
//     transferDegreeNFT,
//     verifyDegreeNFT,
//     getExplorerUrl,
//     isValidPublicKey
//   };

//   return (
//     <SolanaContext.Provider value={value}>
//       {children}
//     </SolanaContext.Provider>
//   );
// }

// // Custom hook to use the Solana context
// export function useSolana() {
//   const context = useContext(SolanaContext);
//   if (!context) {
//     throw new Error('useSolana must be used within a SolanaProvider');
//   }
//   return context;
// }












// 1st Edition 7.31pm-13.03.25
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

import { 
  SOLANA_CONNECTION, 
  SOLANA_NETWORK, 
  isValidPublicKey, 
  getExplorerUrl,
  createDegreeMetadata,
  calculateMintingCost
} from '../lib/solana';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

// Create context
const SolanaContext = createContext(null);

export function SolanaProvider({ children }) {

  console.log(mplTokenMetadata());


  const wallet = useWallet();

  const { publicKey, signTransaction, connected } = wallet;
  
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [mintCost, setMintCost] = useState(0);
  const [lastTransaction, setLastTransaction] = useState(null);

// Initialize Metaplex with the connected wallet when available
  const metaplex = useMemo(() => {
    if (!publicKey || !signTransaction) return null;
    
    return Metaplex.make(SOLANA_CONNECTION).use({
      wallet: {
        publicKey,
        signTransaction
      },
      cluster: SOLANA_NETWORK
    });
  }, [publicKey, signTransaction]);

  // Load wallet balance when connected
  useEffect(() => {
    if (!publicKey) return;

    const fetchBalance = async () => {
      try {
        const bal = await SOLANA_CONNECTION.getBalance(publicKey);
        setBalance(bal / 1000000000); // Convert lamports to SOL
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
    
    // Subscribe to balance changes
    const id = SOLANA_CONNECTION.onAccountChange(
      publicKey,
      () => fetchBalance(),
      'confirmed'
    );

    return () => {
      SOLANA_CONNECTION.removeAccountChangeListener(id);
    };
  }, [publicKey]);

  // Load estimated minting cost on component mount
  useEffect(() => {
    const loadMintCost = async () => {
      try {
        const cost = await calculateMintingCost();
        setMintCost(cost);
      } catch (error) {
        console.error("Failed to calculate minting cost:", error);
      }
    };
    
    loadMintCost();
  }, []);

  // Mint an NFT using the metadata
  const mintDegreeNFT = async (degreeData, recipientAddress = null) => {
    if (!publicKey || !metaplex) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    try {
      // Create the metadata
      const metadata = createDegreeMetadata(
        {
          ...degreeData,
          studentAddress: recipientAddress || ''
        },
        publicKey.toString()
      );
      
      // Upload metadata to Arweave or IPFS
      const { uri } = await metaplex.nfts().uploadMetadata(metadata);
      
      // Mint the NFT
      const { nft } = await metaplex.nfts().create({
        uri,
        name: metadata.name,
        sellerFeeBasisPoints: 0, // No royalties
        creators: [{ address: publicKey, share: 100 }]
      });
      
      // Save the transaction info
      setLastTransaction({
        signature: nft.response.signature,
        mintAddress: nft.address.toString(),
        recipient: recipientAddress || publicKey.toString()
      });
      
      return nft;
    } catch (error) {
      console.error("Error minting NFT:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Transfer an NFT to another wallet
  const transferDegreeNFT = async (mintAddress, recipientAddress) => {
    if (!publicKey || !metaplex) {
      throw new Error("Wallet not connected");
    }
    
    if (!isValidPublicKey(recipientAddress)) {
      throw new Error("Invalid recipient address");
    }

    setIsLoading(true);
    try {
      const mintPublicKey = new PublicKey(mintAddress);
      const recipientPublicKey = new PublicKey(recipientAddress);
      
      const { response } = await metaplex.nfts().transfer({
        nftOrSft: { address: mintPublicKey },
        authority: wallet,
        toOwner: recipientPublicKey
      });
      
      setLastTransaction({
        signature: response.signature,
        mintAddress,
        recipient: recipientAddress
      });
      
      return response;
    } catch (error) {
      console.error("Error transferring NFT:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify a degree NFT's authenticity
  const verifyDegreeNFT = async (mintAddress, universityAddress) => {
    try {
      const mintPublicKey = new PublicKey(mintAddress);
      const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });
      
      // Verify the NFT creator is the claimed university
      const creator = nft.creators.find(c => c.address.toString() === universityAddress);
      
      if (!creator) {
        return {
          verified: false,
          message: "This degree was not issued by the specified university"
        };
      }
      
      return {
        verified: true,
        nft,
        message: "Degree certificate verified successfully"
      };
    } catch (error) {
      console.error("Error verifying NFT:", error);
      throw error;
    }
  };

  const value = {
    connected,
    publicKey: publicKey?.toString(),
    balance,
    SOLANA_NETWORK,
    SOLANA_CONNECTION,
    mintCost,
    isLoading,
    lastTransaction,
    metaplex,
    mintDegreeNFT,
    transferDegreeNFT,
    verifyDegreeNFT,
    getExplorerUrl,
    isValidPublicKey
  };

  return (
    <SolanaContext.Provider value={value}>
      {children}
    </SolanaContext.Provider>
  );
}

// Custom hook to use the Solana context
export function useSolana() {
  const context = useContext(SolanaContext);
  if (!context) {
    throw new Error('useSolana must be used within a SolanaProvider');
  }
  return context;
}