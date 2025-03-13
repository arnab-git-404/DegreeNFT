import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Metaplex } from '@metaplex-foundation/js';
import { 
  SOLANA_CONNECTION, 
  SOLANA_NETWORK, 
  isValidPublicKey, 
  getExplorerUrl,
  createDegreeMetadata,
  calculateMintingCost
} from '../lib/solana';

// Create context
const SolanaContext = createContext(null);

export function SolanaProvider({ children }) {
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