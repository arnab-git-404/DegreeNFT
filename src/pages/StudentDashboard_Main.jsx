
// import React, { useState, useEffect, useMemo } from "react";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
// import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
// import {
//   createNft,
//   mplTokenMetadata,
// } from "@metaplex-foundation/mpl-token-metadata";
// import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
// import {
//   UserCheck,
//   ExternalLink,
//   Loader2,
//   AlertCircle,
//   CheckCircle,
// } from "lucide-react";
// import { shortenAddress } from "../lib/utils";
// import { getExplorerUrl } from "../lib/solana";
// import { Button } from "../components/Button";
// import axios from "axios"; 

// const API_BASE_URL = "http://localhost:5001/api"; //  backend URL

// export function StudentDashboard() {
 
//   const wallet = useWallet(); // Get the full wallet object
//   const connection = new Connection(clusterApiUrl("devnet")); // Use devnet for testing

//   const { connected, publicKey } = wallet;
//   const walletAddress = publicKey?.toBase58();


//   const [isLoading, setIsLoading] = useState(false); 
//   const [isAuthorized, setIsAuthorized] = useState(false); 
//   const [nftInfo, setNftInfo] = useState(null); // Metadata for the NFT to be minted
//   const [authorizationError, setAuthorizationError] = useState(""); // Error during authorization check

//   const [isMinting, setIsMinting] = useState(false); // Minting in progress
//   const [mintError, setMintError] = useState(""); // Error during minting
//   const [mintSuccess, setMintSuccess] = useState(false); // Minting successful
//   const [mintSignature, setMintSignature] = useState(""); // Signature of the mint transaction
//   const [ mintedNft, setMintedNft ] = useState(null); // Store minted NFT data

// // Initialize UMI when wallet is connected - FIXED
// const umi = useMemo(() => {
//   const umi = createUmi(connection);

//   if (wallet.publicKey) {
//     return umi.use(walletAdapterIdentity(wallet));
//   }

//   return umi;
// }, [connection, wallet]);


//   // Fetch authorization status when wallet connects or changes
//   useEffect(() => {

//     const checkAuthorization = async () => {
//       if (!connected || !walletAddress) {
//         setIsAuthorized(false);
//         setNftInfo(null);
//         setAuthorizationError("");
//         setIsLoading(false);
//         setMintSuccess(false); // Reset mint status
//         setMintSignature("");
//         setMintError("");
//         return;
//       }

//       setIsLoading(true);
//       setAuthorizationError("");
//       setMintSuccess(false); // Reset mint status on wallet change/check
//       setMintSignature("");
//       setMintError("");

//       try {

//         // Make API call to your backend to check allocation
//         const response = await axios.get(
//           `${API_BASE_URL}/check-authorization/${walletAddress}`
//         );

//         if (response.data.authorized && response.data.nftInfo) {
//           setIsAuthorized(true);
//           setNftInfo(response.data.nftInfo); // Store NFT details (name, symbol, uri)
    
//         } else {
//           setIsAuthorized(false);
//           setNftInfo(null);
//           setAuthorizationError(
//             response.data.message || "No NFT allocation found for this wallet."
//           );
//         }
//       } catch (error) {
//         console.error("Error checking authorization:", error);
//         setIsAuthorized(false);
//         setNftInfo(null);
//         setAuthorizationError(
//           error.response?.data?.message || "Failed to check authorization. Please try again."
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuthorization();
//   }, [connected, walletAddress]); // Re-run effect if connection status or public key changes


//   // Handle Minting using UMI directly in the frontend
//   const handleMintNft = async () => {

//     if (!umi || !publicKey || !nftInfo || !nftInfo.uri || !nftInfo.name || nftInfo.symbol ) {
//         setMintError("Cannot mint: Missing wallet connection, UMI instance, or NFT metadata (name, symbol, uri).");
//         return;
//     }

//     setIsMinting(true);
//     setMintError("");
//     setMintSuccess(false);
//     setMintSignature("");

//     try {

//       const mint = generateSigner(umi);
//       // 1. Generate a keypair for the new NFT mint account
//       console.log("Mint address:", mint.publicKey);
//       console.log("Using URI:", nftInfo.uri);
//       console.log("Using Name:", nftInfo.name);
//       console.log("Using Symbol:", nftInfo.symbol);
//       console.log("Creator:", publicKey.toBase58());
      
//       await umi.use(mplTokenMetadata());
//       // 2. Create the NFT using UMI
//       const { signature } = await createNft(umi, {
//         mint: mint, 
//         authority: umi.identity, // The current wallet is the authority
//         name: nftInfo.name,
//         symbol: nftInfo.symbol,
//         uri: nftInfo.uri,
//         sellerFeeBasisPoints: percentAmount(0), // 0% seller fee
//         creators: [
//            { address: publicKey,
//              verified: true, 
//              share: 100 
//           }
//         ],
//         // isMutable: true, // Set if you want the metadata to be updatable
//       }).sendAndConfirm(umi, { confirm: { commitment: "confirmed" } }); // Send and wait for confirmation

//       const mintedNftData = {
//         address: mint.publicKey,
//         signature,
//       };

//       // 3. Update state on successful mint
//       setMintSuccess(true);
//       setMintedNft(mintedNftData);
//       setIsAuthorized(false); // No longer authorized to mint this specific allocation
//       // Optionally clear nftInfo or update UI to show minted status differently
//       // setNftInfo(null);


//       // 4. (Optional) Notify backend that minting was successful
//       try {
//         await axios.post(`${API_BASE_URL}/confirm-mint`, {
//           walletAddress: walletAddress,
//           nft_Mint_Address: mint.publicKey.toString(),
//         });
//         console.log("Backend notified of successful mint.");
//       } catch (backendError) {
//         console.error("Failed to notify backend:", backendError);
//         // Decide how to handle this - maybe show a warning to the user?
//         // setMintError("Minting succeeded, but failed to update status with server.");
//       }

//     } catch (err) {
//       console.error("Failed to mint NFT:", err);
//       // Provide more specific error messages if possible
//       let errorMessage = "An error occurred during minting.";
//       if (err instanceof Error) {
//           errorMessage = err.message;
//       }
//       // Check for common errors like insufficient funds, network issues, etc.
//       setMintError(`Minting failed: ${errorMessage}`);
//     } finally {
//       setIsMinting(false);
//     }
//   };


//   const getNftExplorerLink = (type = "address") => {
//     if (!mintedNft) return null;

//     const cluster = "devnet";

//     try {
//       // Make sure we're working with string values
//       const addressString = mintedNft.address.toString();
//       const signatureString = mintedNft.signature.toString();

//       // Manually construct explorer URLs to avoid any formatting issues
//       if (type === "address") {
//         return `https://explorer.solana.com/address/${addressString}?cluster=${cluster}`;
//       } else if (type === "transaction") {
//         return `https://explorer.solana.com/tx/${signatureString}?cluster=${cluster}`;
//       }
//       return null;
//     } catch (error) {
//       console.error("Error creating explorer link:", error);
//       return null;
//     }
//   };

//   const getAllMintedNFTs = async () => {

//     try {
//       const response = await axios.get(`${API_BASE_URL}/minted-nfts/${walletAddress}`);
      
//       if (response.data.success) {
//         // Handle the response data as needed
//         console.log("Minted NFTs:", response.data.nfts);
//       } else {
//         console.error("Failed to fetch minted NFTs:", response.data.error);
//       }
//     }catch (error) {
//       console.error("Error fetching minted NFTs:", error);
//     }
//   }

//   // Render loading state for authorization check
//   if (isLoading) {
//     return (
//       <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
//         <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
//         <p className="mt-4 text-gray-400">Checking your credentials...</p>
//       </div>
//     );
//   }

//   // Render disconnected state
//   if (!connected) {
//     return (
//       <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
//         <UserCheck className="h-16 w-16 text-indigo-500" />
//         <h2 className="mt-4 text-2xl font-bold">Student Dashboard</h2>
//         <p className="mt-2 text-gray-400">
//           Connect your wallet to view your credentials
//         </p>
//         {/* Optionally add Wallet Multi Button here if not in layout */}
//       </div>
//     );
//   }

//   // Render connected state
//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">My Credentials</h2>
//           <p className="mt-1 text-gray-400">
//             Connected as: {shortenAddress(walletAddress || "")}
//           </p>
//         </div>
//       </div>

//       {/* Display Mint Success Message */}
//       {mintSuccess && (
//         <div className="rounded-md border border-green-600 bg-green-900/30 p-4">
//           <div className="flex items-center space-x-3">
//             <CheckCircle className="h-5 w-5 text-green-400" />
//             <div>
//               <p className="font-medium text-green-300">
//                 NFT Minted Successfully!
//               </p>
//               <a
//                 href={getNftExplorerLink()} // Use the locally defined helper
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="mt-1 inline-flex items-center text-sm text-green-400 hover:text-green-300 underline"
//               >
//                 View Transaction on Explorer <ExternalLink className="ml-1 h-4 w-4" />
//               </a>
//               {/* You might want to add a link to the minted NFT address as well */}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Display Available NFT to Mint */}
//       {/* Show only if authorized, we have NFT info, and it hasn't just been successfully minted */}
//       {isAuthorized && nftInfo && !mintSuccess && (
//         <div className="rounded-lg border border-indigo-600 bg-indigo-900/30 p-6 shadow-lg">
//           <h3 className="text-xl font-semibold text-indigo-300">
//             Credential Ready to Mint









import React, { useState, useEffect, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import {
  UserCheck,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
  Award,
  Calendar,
  School
} from "lucide-react";
import { shortenAddress } from "../lib/utils";

import { getExplorerUrl } from "../lib/solana";

import { Button } from "../components/Button";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_APP_SERVER_URL;

export function StudentDashboard() {
  const wallet = useWallet();
  const connection = new Connection(clusterApiUrl("devnet"));

  const { connected, publicKey } = wallet;
  
  const walletAddress = publicKey?.toBase58();

  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [nftInfo, setNftInfo] = useState(null);
  const [authorizationError, setAuthorizationError] = useState("");

  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState("");
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintedNft, setMintedNft] = useState(null);
  
  const [mintedNfts, setMintedNfts] = useState([]);
  const [loadingNfts, setLoadingNfts] = useState(false);

  // Initialize UMI when wallet is connected
  const umi = useMemo(() => {
    const umi = createUmi(connection);

    if (wallet.publicKey) {
      return umi.use(walletAdapterIdentity(wallet));
    }

    return umi;
  }, [connection, wallet]);

  // Fetch authorization status when wallet connects or changes
  useEffect(() => {
    const checkAuthorization = async () => {
      if (!connected || !walletAddress) {
        setIsAuthorized(false);
        setNftInfo(null);
        setAuthorizationError("");
        setIsLoading(false);
        setMintSuccess(false);
        setMintedNft(null);
        setMintError("");
        return;
      }

      setIsLoading(true);
      setAuthorizationError("");
      setMintSuccess(false);
      setMintedNft(null);
      setMintError("");

      try {
        const response = await axios.get(
          `${API_BASE_URL}/check-authorization/${walletAddress}`
        );

        if (response.data.authorized && response.data.nftInfo) {
          setIsAuthorized(true);
          setNftInfo(response.data.nftInfo);
          toast.success("Found credentials ready to mint!");
        } else {
          setIsAuthorized(false);
          setNftInfo(null);
          setAuthorizationError(
            response.data.message || "No NFT allocation found for this wallet."
          );
        }
      } catch (error) {
        console.error("Error checking authorization:", error);
        setIsAuthorized(false);
        setNftInfo(null);
        setAuthorizationError(
          error.response?.data?.message || "Failed to check authorization. Please try again."
        );
        toast.error("Failed to check credentials");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
    if (connected && walletAddress) {
      fetchMintedNFTs();
    }
  }, [connected, walletAddress]);

  // Handle Minting using UMI directly in the frontend
  const handleMintNft = async () => {
    if (!umi || !publicKey || !nftInfo || !nftInfo.uri || !nftInfo.name) {
      setMintError("Cannot mint: Missing wallet connection, UMI instance, or NFT metadata");
      toast.error("Missing required information for minting");
      return;
    }

    setIsMinting(true);
    setMintError("");
    setMintSuccess(false);
    setMintedNft(null);

    // Show toast for starting mint process
    const mintToastId = toast.loading("Minting your credential NFT...");

    try {
      const mint = generateSigner(umi);
      
      await umi.use(mplTokenMetadata());
      const { signature } = await createNft(umi, {
        mint: mint, 
        name: nftInfo.name,
        symbol: nftInfo.symbol,
        uri: nftInfo.uri,
        sellerFeeBasisPoints: percentAmount(0),
        creators: [
          { 
            address: publicKey,
            verified: true, 
            share: 100 
          }
        ],
      }).sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });

      const mintedNftData = {
        address: mint.publicKey.toString(),
        signature: signature.toString(),
        name: nftInfo.name,
        symbol: nftInfo.symbol || "CRED",
        uri: nftInfo.uri,
        dateIssued: new Date().toISOString()
      };

      setMintSuccess(true);
      setMintedNft(mintedNftData);
      setIsAuthorized(false);
      
      // Update toast to success
      toast.success("NFT minted successfully!", { id: mintToastId });

      // Notify backend about successful mint
      try {
        await axios.post(`${API_BASE_URL}/confirm-mint`, {
          walletAddress: walletAddress,
          nft_Mint_Address: mint.publicKey.toString(),
        });
        console.log("Backend notified of successful mint.");
      } catch (backendError) {
        console.error("Failed to notify backend:", backendError);
        toast.warning("Minting succeeded, but failed to update server status");
      }

      // Refresh minted NFTs list
      fetchMintedNFTs();

    } catch (err) {
      console.error("Failed to mint NFT:", err);
      let errorMessage = "An error occurred during minting.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setMintError(`Minting failed: ${errorMessage}`);
      toast.error("Failed to mint NFT", { id: mintToastId });
    } finally {
      setIsMinting(false);
    }
  };

  const fetchMintedNFTs = async () => {
    if (!walletAddress) return;
    
    setLoadingNfts(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/minted-nfts/${walletAddress}`);
      
      if (response.data.nfts) {
        setMintedNfts(response.data.nfts || []);
      } else {
        console.error("Failed to fetch minted NFTs:", response.data.error);
        toast.error("Failed to load your minted credentials");
      }

    } catch (error) {
      console.error("Error fetching minted NFTs:", error);
      setMintedNfts([]);
    } finally {
      setLoadingNfts(false);
    }
  };

  const getNftExplorerLink = (address, signature, type = "address") => {
    const cluster = "devnet";
    
    try {
      if (type === "address" && address) {
        return `https://explorer.solana.com/address/${address}?cluster=${cluster}`;
      } else if (type === "transaction" && signature) {
        return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
      }
      return null;
    } catch (error) {
      console.error("Error creating explorer link:", error);
      return null;
    }
  };

  // Render loading state for authorization check
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
        <p className="mt-4 text-gray-400">Checking your credentials...</p>
      </div>
    );
  }

  // Render disconnected state
  if (!connected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <UserCheck className="h-16 w-16 text-indigo-500" />
        <h2 className="mt-4 text-2xl font-bold">Student Dashboard</h2>
        <p className="mt-2 text-gray-400">
          Connect your wallet to view your credentials
        </p>
      </div>
    );
  }

  // Render connected state
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Credentials</h2>
          <p className="mt-1 text-gray-400">
            Connected as: <span className="font-mono">{shortenAddress(walletAddress || "")}</span>
          </p>
        </div>
        <Button 
          onClick={fetchMintedNFTs} 
          variant="outline"
          className="cursor-pointer"
        >
          Refresh NFTs
        </Button>
      </div>

      {/* Display Mint Success Message */}
      {mintSuccess && mintedNft && (
        <div className="rounded-md border border-green-600 bg-green-900/30 p-4 animate-fadeIn">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div>
              <p className="font-medium text-green-300">
                NFT Minted Successfully!
              </p>
              <div className="mt-2 flex space-x-4">
                <a
                  href={getNftExplorerLink(mintedNft.address, mintedNft.signature, "address")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-green-400 hover:text-green-300 underline cursor-pointer"
                >
                  View NFT <ExternalLink className="ml-1 h-4 w-4" />
                </a>
                <a
                  href={getNftExplorerLink(mintedNft.address, mintedNft.signature, "transaction")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-green-400 hover:text-green-300 underline cursor-pointer"
                >
                  View Transaction <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display Available NFT to Mint */}
      {isAuthorized && nftInfo && !mintSuccess && (
        <div className="rounded-lg border border-indigo-600 bg-indigo-900/30 p-6 shadow-lg hover:shadow-indigo-900/20 transition-all">
          <h3 className="text-xl font-semibold text-indigo-300">
            <Award className="inline-block mr-2 h-5 w-5" />
            Credential Ready to Mint
          </h3>
          <div className="mt-4 space-y-2 text-gray-300">
            <p>
              <span className="font-medium text-gray-100">Name:</span>{" "}
              {nftInfo.name}
            </p>
            <p>
              <span className="font-medium text-gray-100">Symbol:</span>{" "}
              {nftInfo.symbol || "CRED"}
            </p>
            <p>
              <span className="font-medium text-gray-100">Metadata URI:</span>{" "}
              <a 
                href={nftInfo.uri} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:text-indigo-400 break-all cursor-pointer"
              >
                {nftInfo.uri}
              </a>
            </p>
          </div>
          <div className="mt-6">
            <Button
              onClick={handleMintNft}
              disabled={isMinting || !umi.identity}
              className="w-full sm:w-auto cursor-pointer hover:bg-indigo-600 transition-colors"
            >
              {isMinting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Minting...
                </>
              ) : (
                "Mint My Credential NFT"
              )}
            </Button>
            {mintError && (
              <p className="mt-3 text-sm text-red-400 flex items-center">
                <AlertCircle className="mr-1 h-4 w-4" /> {mintError}
              </p>
            )}
            {!umi.identity && (
              <p className="mt-3 text-sm text-yellow-400 flex items-center">
                <AlertCircle className="mr-1 h-4 w-4" /> Wallet not fully ready for signing. Please ensure it's connected and initialized.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Display if not authorized or no allocation found */}
      {!isAuthorized && !isLoading && !mintSuccess && (
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-gray-400" />
            Pending Credentials 
          </h3>
          <div className="mt-4">
            <p className="text-gray-400">
              {authorizationError ||
                "No pending credentials found for your wallet, or they have already been minted."}
            </p>
          </div>
        </div>
      )}

      {/* Section for already minted NFTs */}
      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
        <h3 className="text-xl font-semibold flex items-center">
          <School className="mr-2 h-5 w-5 text-gray-100" />
          My Minted Credentials
        </h3>
        
        {loadingNfts ? (
          <div className="flex justify-center my-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : mintedNfts.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {mintedNfts.map((nft, index) => (
              <div 
                key={index} 
                className="rounded-lg border border-gray-700 bg-gray-800/60 p-5 hover:border-indigo-600 hover:shadow-md transition-all cursor-pointer"
              >
                {nft.image && (
                  <div className="h-40 w-full overflow-hidden rounded-md mb-4 bg-gray-700/50">
                    <img 
                      src={nft.image} 
                      alt={nft.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/320/180";
                        e.target.alt = "Failed to load image";
                      }} 
                    />
                  </div>
                )}
                <h4 className="text-lg font-medium text-indigo-300">{nft.name}</h4>
                <p className="text-sm text-gray-400 mt-1">{nft.symbol}</p>
                
                {nft.allocatedAt && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Issued: {new Date(nft.allocatedAt).toLocaleDateString()}
                  </p>
                )}

                {nft.mintedAt && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Minted : {new Date(nft.mintedAt).toLocaleDateString()}
                  </p>
                )}
                
                <div className="mt-4 flex space-x-2">
                  <a
                    href={getNftExplorerLink(nft.nftAddress, nft.signature, "address")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline flex items-center"
                    onClick={() =>{
                      console.log("clicked" )
                    }}
                  >
                    View <ExternalLink className="ml-0.5 h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-8 text-gray-400">
            <Award className="h-12 w-12 text-gray-600 mb-3" />
            <p>You haven't minted any credential NFTs yet.</p>
            {isAuthorized && nftInfo && (
              <p className="mt-2 text-indigo-400">
                You have a credential ready to mint above!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}