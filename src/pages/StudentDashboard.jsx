// import React, { useState, useEffect, useMemo } from "react";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { Connection, clusterApiUrl } from "@solana/web3.js";
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
//   Award,
//   Calendar,
//   School,
//   Clock,
//   Edit2,
//   Save,
//   X,
// } from "lucide-react";
// import { shortenAddress } from "../lib/utils";
// import { getExplorerUrl } from "../lib/solana";
// import { Button } from "../components/Button";
// import axios from "axios";
// import toast from "react-hot-toast";

// const API_BASE_URL = import.meta.env.VITE_APP_SERVER_URL;

// export function StudentDashboard() {
//   const wallet = useWallet();
//   const connection = new Connection(clusterApiUrl("devnet"));

//   const { connected, publicKey } = wallet;
//   const walletAddress = publicKey?.toBase58();

//   const [isLoading, setIsLoading] = useState(false);
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [nftInfo, setNftInfo] = useState(null);
//   const [authorizationError, setAuthorizationError] = useState("");

//   const [isMinting, setIsMinting] = useState(false);
//   const [mintError, setMintError] = useState("");
//   const [mintSuccess, setMintSuccess] = useState(false);
//   const [mintedNft, setMintedNft] = useState(null);

//   const [mintedNfts, setMintedNfts] = useState([]);
//   const [loadingNfts, setLoadingNfts] = useState(false);

//   // New states for verification window
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editedNftInfo, setEditedNftInfo] = useState(null);
//   const [confirmationDeadline, setConfirmationDeadline] = useState(null);
//   const [timeRemaining, setTimeRemaining] = useState(null);
//   const [isConfirmed, setIsConfirmed] = useState(false);
//   const [isSavingChanges, setIsSavingChanges] = useState(false);

//   // Initialize UMI when wallet is connected
//   const umi = useMemo(() => {
//     const umi = createUmi(connection);

//     if (wallet.publicKey) {
//       return umi.use(walletAdapterIdentity(wallet));
//     }

//     return umi;
//   }, [connection, wallet]);

//   // Calculate time remaining for confirmation deadline
//   useEffect(() => {
//     if (!confirmationDeadline) return;

//     const updateTimeRemaining = () => {
//       const now = new Date();
//       const deadline = new Date(confirmationDeadline);
//       const diffMs = deadline - now;

//       if (diffMs <= 0) {
//         setTimeRemaining({
//           days: 0,
//           hours: 0,
//           minutes: 0,
//           seconds: 0,
//           expired: true,
//         });
//         return;
//       }

//       const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//       const hours = Math.floor(
//         (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//       );
//       const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

//       setTimeRemaining({ days, hours, minutes, seconds, expired: false });
//     };

//     updateTimeRemaining();
//     const interval = setInterval(updateTimeRemaining, 1000);

//     return () => clearInterval(interval);
//   }, [confirmationDeadline]);

//   // Fetch authorization status when wallet connects or changes
//   useEffect(() => {
//     const checkAuthorization = async () => {
//       if (!connected || !walletAddress) {
//         resetStates();
//         return;
//       }

//       setIsLoading(true);
//       resetErrorStates();

//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/check-authorization/${walletAddress}`
//         );

//         if (response.data.authorized && response.data.nftInfo) {
//           setIsAuthorized(true);
//           setNftInfo(response.data.nftInfo);

//           // Set confirmation status and deadline
//           if (response.data.confirmationStatus) {
//             setIsConfirmed(response.data.confirmationStatus === "CONFIRMED");
//             setConfirmationDeadline(response.data.confirmationDeadline);
//           } else {
//             setIsConfirmed(false);
//             setConfirmationDeadline(null);
//           }

//           toast.success("Found credentials ready to review!");
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
//           error.response?.data?.message ||
//             "Failed to check authorization. Please try again."
//         );
//         toast.error("Failed to check credentials");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const resetStates = () => {
//       setIsAuthorized(false);
//       setNftInfo(null);
//       setAuthorizationError("");
//       setIsLoading(false);
//       setMintSuccess(false);
//       setMintedNft(null);
//       setMintError("");
//       setIsEditMode(false);
//       setEditedNftInfo(null);
//       setConfirmationDeadline(null);
//       setTimeRemaining(null);
//       setIsConfirmed(false);
//     };

//     const resetErrorStates = () => {
//       setAuthorizationError("");
//       setMintSuccess(false);
//       setMintedNft(null);
//       setMintError("");
//     };

//     checkAuthorization();
//     if (connected && walletAddress) {
//       fetchMintedNFTs();
//     }
//   }, [connected, walletAddress]);

//   // Handle confirming the credential data
//   const handleConfirm = async () => {
//     if (!walletAddress || !nftInfo) return;

//     setIsSavingChanges(true);

//     try {

//         toast.success("This Function is in Early Stage Of Development ...");

//     //   if (response.data.success) {
//     //     setIsConfirmed(true);
//     //     toast.success("Credential confirmed successfully!");
//     //   } else {
//     //     toast.error("Failed to confirm credential");
//     //   }

//     } catch (error) {
//       console.error("Error confirming credential:", error);
//       toast.error("Failed to confirm credential");
//     } finally {
//       setIsSavingChanges(false);
//     }
//   };

//   // Handle editing mode toggle
//   const handleEditToggle = () => {
//     if (isEditMode) {
//       setIsEditMode(false);
//     } else {
//       setEditedNftInfo({ ...nftInfo });
//       setIsEditMode(true);
//     }
//   };

//   // Handle saving edited info
//   const handleSaveChanges = async () => {
//     if (!walletAddress || !editedNftInfo) return;

//     setIsSavingChanges(true);

//     try {
//       toast.success("This Function is in Early Stage Of Development ...");
//     } catch (error) {
//       console.error("Error saving changes:", error);
//       toast.error("Failed to save changes");
//     } finally {
//       setIsSavingChanges(false);
//     }
//   };

//   // Handle input changes in edit mode
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditedNftInfo((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle Minting using UMI directly in the frontend
//   const handleMintNft = async () => {
//     if (!umi || !publicKey || !nftInfo || !nftInfo.uri || !nftInfo.name) {
//       setMintError(
//         "Cannot mint: Missing wallet connection, UMI instance, or NFT metadata"
//       );
//       toast.error("Missing required information for minting");
//       return;
//     }

//     setIsMinting(true);
//     setMintError("");
//     setMintSuccess(false);
//     setMintedNft(null);

//     // Show toast for starting mint process
//     const mintToastId = toast.loading("Minting your credential NFT...");

//     try {
//       const mint = generateSigner(umi);

//       await umi.use(mplTokenMetadata());
//       const { signature } = await createNft(umi, {
//         mint: mint,
//         name: nftInfo.name,
//         symbol: nftInfo.symbol,
//         uri: nftInfo.uri,
//         sellerFeeBasisPoints: percentAmount(0),
//         creators: [
//           {
//             address: publicKey,
//             verified: true,
//             share: 100,
//           },
//         ],
//       }).sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });

//       const mintedNftData = {
//         address: mint.publicKey.toString(),
//         signature: signature.toString(),
//         name: nftInfo.name,
//         symbol: nftInfo.symbol || "CRED",
//         uri: nftInfo.uri,
//         dateIssued: new Date().toISOString(),
//       };

//       setMintSuccess(true);
//       setMintedNft(mintedNftData);
//       setIsAuthorized(false);

//       // Update toast to success
//       toast.success("NFT minted successfully!", { id: mintToastId });

//       // Notify backend about successful mint
//       try {
//         await axios.post(`${API_BASE_URL}/confirm-mint`, {
//           walletAddress: walletAddress,
//           nft_Mint_Address: mint.publicKey.toString(),
//         });
//         console.log("Backend notified of successful mint.");
//       } catch (backendError) {
//         console.error("Failed to notify backend:", backendError);
//         toast.warning("Minting succeeded, but failed to update server status");
//       }

//       // Refresh minted NFTs list
//       fetchMintedNFTs();
//     } catch (err) {
//       console.error("Failed to mint NFT:", err);
//       let errorMessage = "An error occurred during minting.";
//       if (err instanceof Error) {
//         errorMessage = err.message;
//       }
//       setMintError(`Minting failed: ${errorMessage}`);
//       toast.error("Failed to mint NFT", { id: mintToastId });
//     } finally {
//       setIsMinting(false);
//     }
//   };

//   const fetchMintedNFTs = async () => {
//     if (!walletAddress) return;

//     setLoadingNfts(true);
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/minted-nfts/${walletAddress}`
//       );

//       if (response.data.nfts) {
//         setMintedNfts(response.data.nfts || []);
//       } else {
//         console.error("Failed to fetch minted NFTs:", response.data.error);
//         toast.error("Failed to load your minted credentials");
//       }
//     } catch (error) {
//       console.error("Error fetching minted NFTs:", error);
//       setMintedNfts([]);
//     } finally {
//       setLoadingNfts(false);
//     }
//   };

//   const getNftExplorerLink = (address, signature, type = "address") => {
//     const cluster = "devnet";

//     try {
//       if (type === "address" && address) {
//         return `https://explorer.solana.com/address/${address}?cluster=${cluster}`;
//       } else if (type === "transaction" && signature) {
//         return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
//       }
//       return null;
//     } catch (error) {
//       console.error("Error creating explorer link:", error);
//       return null;
//     }
//   };

//   // Format remaining time into a readable string
//   const formatTimeRemaining = () => {
//     if (!timeRemaining) return "Calculating...";

//     if (timeRemaining.expired) {
//       return "Deadline expired";
//     }

//     const { days, hours, minutes, seconds } = timeRemaining;
//     return `${days}d ${hours}h ${minutes}m ${seconds}s`;
//   };

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
//             Connected as:{" "}
//             <span className="font-mono">
//               {shortenAddress(walletAddress || "")}
//             </span>
//           </p>
//         </div>
//         <Button
//           onClick={fetchMintedNFTs}
//           variant="outline"
//           className="cursor-pointer"
//         >
//           Refresh NFTs
//         </Button>
//       </div>

//       {/* Display Mint Success Message */}
//       {mintSuccess && mintedNft && (
//         <div className="rounded-md border border-green-600 bg-green-900/30 p-4 animate-fadeIn">
//           <div className="flex items-center space-x-3">
//             <CheckCircle className="h-5 w-5 text-green-400" />
//             <div>
//               <p className="font-medium text-green-300">
//                 NFT Minted Successfully!
//               </p>
//               <div className="mt-2 flex space-x-4">
//                 <a
//                   href={getNftExplorerLink(
//                     mintedNft.address,
//                     mintedNft.signature,
//                     "address"
//                   )}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center text-sm text-green-400 hover:text-green-300 underline cursor-pointer"
//                 >
//                   View NFT <ExternalLink className="ml-1 h-4 w-4" />
//                 </a>
//                 <a
//                   href={getNftExplorerLink(
//                     mintedNft.address,
//                     mintedNft.signature,
//                     "transaction"
//                   )}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center text-sm text-green-400 hover:text-green-300 underline cursor-pointer"
//                 >
//                   View Transaction <ExternalLink className="ml-1 h-4 w-4" />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Display Available NFT to Verify/Mint */}
//       {isAuthorized && nftInfo && !mintSuccess && (
//         <div className="rounded-lg border border-indigo-600 bg-indigo-900/30 p-6 shadow-lg hover:shadow-indigo-900/20 transition-all">
//           <div className="flex justify-between items-start">
//             <h3 className="text-xl font-semibold text-indigo-300 flex items-center">
//               <Award className="inline-block mr-2 h-5 w-5" />
//               {isConfirmed
//                 ? "Credential Ready to Mint"
//                 : "Review Your Credential"}
//             </h3>

//             {confirmationDeadline && !isConfirmed && (
//               <div className="flex items-center text-amber-400 text-sm">
//                 <Clock className="h-4 w-4 mr-1" />
//                 <div>
//                   <p>Time remaining: {formatTimeRemaining()}</p>
//                   <p className="text-xs text-gray-400">
//                     Auto-confirms after deadline
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Edit Mode */}
//           {isEditMode ? (
//             <div className="mt-4 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={editedNftInfo.name || ""}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">
//                   Symbol
//                 </label>
//                 <input
//                   type="text"
//                   name="symbol"
//                   value={editedNftInfo.symbol || ""}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">
//                   Metadata URI
//                 </label>
//                 <input
//                   type="text"
//                   name="uri"
//                   value={editedNftInfo.uri || ""}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>

//               <div className="flex space-x-3 pt-2">
//                 <Button
//                   onClick={handleSaveChanges}
//                   disabled={isSavingChanges}
//                   className="cursor-pointer flex items-center"
//                 >
//                   {isSavingChanges ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="mr-2 h-4 w-4" />
//                       Save Changes
//                     </>
//                   )}
//                 </Button>

//                 <Button
//                   onClick={handleEditToggle}
//                   variant="outline"
//                   className="cursor-pointer"
//                   disabled={isSavingChanges}
//                 >
//                   <X className="mr-2 h-4 w-4" />
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* View Mode */}
//               <div className="mt-4 space-y-2 text-gray-300">
//                 <p>
//                   <span className="font-medium text-gray-100">Name:</span>{" "}
//                   {nftInfo.name}
//                 </p>
//                 <p>
//                   <span className="font-medium text-gray-100">Symbol:</span>{" "}
//                   {nftInfo.symbol || "CRED"}
//                 </p>
//                 <p>
//                   <span className="font-medium text-gray-100">
//                     Metadata URI:
//                   </span>{" "}
//                   <a
//                     href={nftInfo.uri}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="underline hover:text-indigo-400 break-all cursor-pointer"
//                   >
//                     {nftInfo.uri}
//                   </a>
//                 </p>
//               </div>

//               <div className="mt-6 flex flex-wrap gap-3">
//                 {!isConfirmed && !timeRemaining?.expired && (
//                   <>
//                     <Button
//                       onClick={handleConfirm}
//                       className="cursor-pointer hover:bg-green-600 bg-green-700 transition-colors flex items-center"
//                       disabled={isSavingChanges}
//                     >
//                       {isSavingChanges ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Confirming...
//                         </>
//                       ) : (
//                         <>
//                           <CheckCircle className="mr-2 h-4 w-4" />
//                           Confirm Details
//                         </>
//                       )}
//                     </Button>

//                     <Button
//                       onClick={handleEditToggle}
//                       variant="outline"
//                       className="cursor-pointer hover:bg-gray-700 transition-colors flex items-center"
//                       disabled={isSavingChanges}
//                     >
//                       <Edit2 className="mr-2 h-4 w-4" />
//                       Edit Details
//                     </Button>
//                   </>
//                 )}

//                 {(isConfirmed || timeRemaining?.expired) && (
//                   <Button
//                     onClick={handleMintNft}
//                     disabled={isMinting || !umi.identity}
//                     className="w-full sm:w-auto cursor-pointer hover:bg-indigo-600 transition-colors"
//                   >
//                     {isMinting ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Minting...
//                       </>
//                     ) : (
//                       "Mint My Credential NFT"
//                     )}
//                   </Button>
//                 )}
//               </div>

//               {isConfirmed && (
//                 <p className="mt-3 text-sm text-green-400 flex items-center">
//                   <CheckCircle className="mr-1 h-4 w-4" />
//                   You've confirmed these details are correct
//                 </p>
//               )}

//               {timeRemaining?.expired && !isConfirmed && (
//                 <p className="mt-3 text-sm text-amber-400 flex items-center">
//                   <Clock className="mr-1 h-4 w-4" />
//                   Review period expired. Details are auto-confirmed.
//                 </p>
//               )}

//               {mintError && (
//                 <p className="mt-3 text-sm text-red-400 flex items-center">
//                   <AlertCircle className="mr-1 h-4 w-4" /> {mintError}
//                 </p>
//               )}

//               {!umi.identity && (
//                 <p className="mt-3 text-sm text-yellow-400 flex items-center">
//                   <AlertCircle className="mr-1 h-4 w-4" /> Wallet not fully
//                   ready for signing. Please ensure it's connected and
//                   initialized.
//                 </p>
//               )}
//             </>
//           )}
//         </div>
//       )}

//       {/* Display if not authorized or no allocation found */}
//       {!isAuthorized && !isLoading && !mintSuccess && (
//         <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
//           <h3 className="text-xl font-semibold flex items-center">
//             <Calendar className="mr-2 h-5 w-5 text-gray-400" />
//             Pending Credentials
//           </h3>
//           <div className="mt-4">
//             <p className="text-gray-400">
//               {authorizationError ||
//                 "No pending credentials found for your wallet, or they have already been minted."}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Section for already minted NFTs */}
//       <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
//         <h3 className="text-xl font-semibold flex items-center">
//           <School className="mr-2 h-5 w-5 text-gray-100" />
//           My Minted Credentials
//         </h3>

//         {loadingNfts ? (
//           <div className="flex justify-center my-8">
//             <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
//           </div>
//         ) : mintedNfts.length > 0 ? (
//           <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//             {mintedNfts.map((nft, index) => (
//               <div
//                 key={index}
//                 className="rounded-lg border border-gray-700 bg-gray-800/60 p-5 hover:border-indigo-600 hover:shadow-md transition-all cursor-pointer"
//               >
//                 {nft.image && (
//                   <div className="h-40 w-full overflow-hidden rounded-md mb-4 bg-gray-700/50">
//                     <img
//                       src={nft.image}
//                       alt={nft.name}
//                       className="h-full w-full object-cover"
//                       onError={(e) => {
//                         e.target.src = "/api/placeholder/320/180";
//                         e.target.alt = "Failed to load image";
//                       }}
//                     />
//                   </div>
//                 )}
//                 <h4 className="text-lg font-medium text-indigo-300">
//                   {nft.name}
//                 </h4>
//                 <p className="text-sm text-gray-400 mt-1">{nft.symbol}</p>

//                 {nft.allocatedAt && (
//                   <p className="text-xs text-gray-500 mt-2 flex items-center">
//                     <Calendar className="h-3 w-3 mr-1" />
//                     Issued: {new Date(nft.allocatedAt).toLocaleDateString()}
//                   </p>
//                 )}

//                 {nft.mintedAt && (
//                   <p className="text-xs text-gray-500 mt-2 flex items-center">
//                     <Calendar className="h-3 w-3 mr-1" />
//                     Minted: {new Date(nft.mintedAt).toLocaleDateString()}
//                   </p>
//                 )}

//                 <div className="mt-4 flex space-x-2">
//                   <a
//                     href={getNftExplorerLink(
//                       nft.nftAddress,
//                       nft.signature,
//                       "address"
//                     )}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-xs text-indigo-400 hover:text-indigo-300 underline flex items-center"
//                   >
//                     View <ExternalLink className="ml-0.5 h-3 w-3" />
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center text-center py-8 text-gray-400">
//             <Award className="h-12 w-12 text-gray-600 mb-3" />
//             <p>You haven't minted any credential NFTs yet.</p>
//             {isAuthorized && nftInfo && (
//               <p className="mt-2 text-indigo-400">
//                 You have a credential ready to {isConfirmed ? "mint" : "review"}{" "}
//                 above!
//               </p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  School,
  Clock,
  Flag,
  MessageSquare,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { shortenAddress } from "../lib/utils";
import { getExplorerUrl } from "../lib/solana";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_APP_SERVER_URL;

const UNIVERSITY_FEES = 0.01;

export function StudentDashboard() {
  const navigate = useNavigate();

  const wallet = useWallet();
  const connection = new Connection(clusterApiUrl("devnet"));

  const { connected, publicKey } = wallet;
  const walletAddress = publicKey?.toBase58();
  const toastShownRef = useRef(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [balanceRefreshing, setBalanceRefreshing] = useState(false);

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

  // New states for verification window
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedNftInfo, setEditedNftInfo] = useState(null);
  const [confirmationDeadline, setConfirmationDeadline] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  // New states for reporting issues
  const [isReportingIssue, setIsReportingIssue] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");
  const [isSendingIssue, setIsSendingIssue] = useState(false);
  const [alreadyReported, setAlreadyReported] = useState(false);

  // Initialize UMI when wallet is connected
  const umi = useMemo(() => {
    const umi = createUmi(connection);

    if (wallet.publicKey) {
      return umi.use(walletAdapterIdentity(wallet));
    }

    return umi;
  }, [connection, wallet]);

  // Calculate time remaining for confirmation deadline
  useEffect(() => {
    if (!confirmationDeadline) return;

    const updateTimeRemaining = () => {
      const now = new Date();
      const deadline = new Date(confirmationDeadline);
      const diffMs = deadline - now;

      if (diffMs <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        });
        return;
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds, expired: false });
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [confirmationDeadline]);

  // Fetch authorization status when wallet connects or changes
  useEffect(() => {
    const checkAuthorization = async () => {
      if (!connected || !walletAddress) {
        resetStates();
        return;
      }

      setIsLoading(true);
      resetErrorStates();

      try {
        const response = await axios.get(
          `${API_BASE_URL}/check-authorization/${walletAddress}`
        );

        if (response.data.authorized && response.data.nftInfo) {
          setIsAuthorized(true);
          setNftInfo(response.data.nftInfo);

          if (response.data.existingReport) {
            setAlreadyReported(true);
          }

          // Set confirmation status and deadline
          if (response.data.nftInfo.confirmationStatus) {
            setIsConfirmed(
              response.data.nftInfo.confirmationStatus === "CONFIRMED"
            );
            setConfirmationDeadline(response.data.confirmationDeadline);
          } else {
            setIsConfirmed(false);
            setConfirmationDeadline(null);
          }

          if (!toastShownRef.current) {
            toast.success("Found credentials ready to review!");
            toastShownRef.current = true;
          }
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
          error.response?.data?.message ||
            "Failed to check authorization. Please try again."
        );
        toast.error("Failed to check credentials");
      } finally {
        setIsLoading(false);
      }
    };

    const resetStates = () => {
      setIsAuthorized(false);
      setNftInfo(null);
      setAuthorizationError("");
      setIsLoading(false);
      setMintSuccess(false);
      setMintedNft(null);
      setMintError("");
      setIsEditMode(false);
      setEditedNftInfo(null);
      setConfirmationDeadline(null);
      setTimeRemaining(null);
      setIsConfirmed(false);
    };

    const resetErrorStates = () => {
      setAuthorizationError("");
      setMintSuccess(false);
      setMintedNft(null);
      setMintError("");
    };

    checkAuthorization();

    if (connected && walletAddress) {
      fetchMintedNFTs();
      checkWalletBalance(); // Initial balance check

      const balanceInterval = setInterval(() => checkWalletBalance(), 5000); // Refresh every 5 seconds
      return () => clearInterval(balanceInterval); // Cleanup interval
    }
  }, [connected, walletAddress]);

  const handleConfirm = async () => {
    if (!walletAddress || !nftInfo) return;

    if (alreadyReported) {
      toast.error("You have already reported an issue for this credential.");
      return;
    }

    setIsSavingChanges(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/confirm-nft-credential`,
        {
          walletAddress,
        }
      );

      if (response.data.success) {
        setIsConfirmed(true);
        toast.success("Credential confirmed successfully!");
      } else {
        toast.error("Failed to confirm credential");
      }
    } catch (error) {
      console.error("Error confirming credential:", error);
      toast.error("Failed to confirm credential");
    } finally {
      setIsSavingChanges(false);
    }
  };

  // Handle editing mode toggle
  const handleEditToggle = () => {
    if (isEditMode) {
      setIsEditMode(false);
    } else {
      setEditedNftInfo({ ...nftInfo });
      setIsEditMode(true);
    }
  };

  // Handle saving edited info
  const handleSaveChanges = async () => {
    if (!walletAddress || !editedNftInfo) return;

    setIsSavingChanges(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/update-credential`, {
        walletAddress,
        nftInfo: editedNftInfo,
      });

      if (response.data.success) {
        setNftInfo(editedNftInfo);
        setIsEditMode(false);
        toast.success("Changes saved successfully!");
      } else {
        toast.error("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSavingChanges(false);
    }
  };

  // Handle input changes in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedNftInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Minting using UMI directly in the frontend
  const handleMintNft = async () => {
    const minimumBalance = 0.01;

    // Check if UMI, publicKey, and nftInfo are available
    if (!umi || !publicKey || !nftInfo || !nftInfo.uri || !nftInfo.name) {
      setMintError(
        "Cannot mint: Missing wallet connection, UMI instance, or NFT metadata"
      );
      toast.error("Missing required information for minting");
      return;
    }

    // Check wallet balance & Forward to faucet if insufficient
    if (walletBalance < minimumBalance) {
      toast(
        (t) => (
          <div className="flex items-center justify-between w-full  p-1">
            <div className="flex-1" >
              <p className="font-bold text-red-600">Insufficient Balance</p>
              <p className="text-m text-black">
                You need minimum ~{minimumBalance} Devnet SOL for minting. Your
                balance: {walletBalance} SOL
              </p>
            </div>

            <Button
              onClick={() => {
                navigate("/faucet");
                toast.dismiss(t.id);
              }}
              className="ml-4 !py-1.5 !px-3 hover:bg-blue-600 bg-blue-500 text-white hover:cursor-pointer"
            >
              Go to Faucet
            </Button>
          </div>
        ),
        {
          duration: 5000, // Keep toast visible longer
          id: "insufficient-balance-toast", // Prevent duplicate toasts
        }
      );
      return;
    }

    setIsMinting(true);
    setMintError("");
    setMintSuccess(false);
    setMintedNft(null);

    // Show toast for starting mint process
    const mintToastId = toast.loading("Minting your credential NFT...");

    try {
      await umi.use(mplTokenMetadata());

      const mint = generateSigner(umi);

      const { signature } = await createNft(umi, {
        mint: mint,
        name: nftInfo.name,
        symbol: nftInfo.symbol,
        uri: nftInfo.uri,
        sellerFeeBasisPoints: 500, // 5% royalty
        creators: [
          {
            address: publicKey,
            verified: true,
            share: 100,
          },
        ],
      }).sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });

      const mintedNftData = {
        address: mint.publicKey.toString(),
        signature: signature.toString(),
        name: nftInfo.name,
        symbol: nftInfo.symbol || "CRED",
        uri: nftInfo.uri,
        dateIssued: new Date().toISOString(),
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
      const response = await axios.get(
        `${API_BASE_URL}/minted-nfts/${walletAddress}`
      );

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

  // Format remaining time into a readable string
  const formatTimeRemaining = () => {
    if (!timeRemaining) return "Calculating...";

    if (timeRemaining.expired) {
      return "Deadline expired";
    }

    const { days, hours, minutes, seconds } = timeRemaining;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // Handle reporting an issue
  const handleReportIssue = () => {
    if (alreadyReported) {
      toast.error(
        "You've already reported an issue about this credential. Please contact your university for further assistance."
      );
    } else {
      setIsReportingIssue(true);
    }
  };

  // Handle canceling issue report
  const handleCancelReport = () => {
    setIsReportingIssue(false);
    setIssueDescription("");
  };

  // Handle submitting the issue
  const handleSubmitIssue = async () => {
    if (!walletAddress || !nftInfo || !issueDescription.trim()) {
      toast.error("Please provide a description of the issue");
      return;
    }

    setIsSendingIssue(true);

    try {
      // Fetch NFT data from Pinata
      const nftUriDataFromPinata = await fetch(nftInfo.uri);
      const nftUriData = await nftUriDataFromPinata.json();
      // console.log("NFT Data:", nftUriData);

      const response = await axios.post(`${API_BASE_URL}/report-issue`, {
        //  universityWallet: we need to extract this from the NFT uri or metadata. So Do it Later || Done (9.17PM , 19.06.2025)
        universityWallet:
          nftUriData.properties.creators[0].universityWalletAddress || "",
        studentWallet: walletAddress,
        nftIpfsHash: nftInfo.uri,
        reportType: "NFT Credential Issue",
        reportDetails: issueDescription.trim(),
      });

      console.log(
        "University Wallet:",
        nftUriData.properties.creators[0].universityWalletAddress
      );

      // Handle if the user has already reported an issue
      if (response.status === 409) {
        setAlreadyReported(true);
        toast.error(
          "You have already reported an issue. Please contact your university for further assistance."
        );
      } else if (response.data.success) {
        setIsReportingIssue(false);
        setIssueDescription("");
        setAlreadyReported(true);
        toast.success("Issue reported Successfully! Contact Your university.");
      } else {
        toast.error(response.data.message || "Failed to report issue");
      }
    } catch (error) {
      console.error("Error reporting issue:", error);
      toast.error("Failed to report issue. Please try again.");
    } finally {
      setIsSendingIssue(false);
    }
  };

  //Check user current wallet balance
  const checkWalletBalance = async () => {
    if (!walletAddress) {
      toast.error("Wallet not connected");
      return false;
    }
    setBalanceRefreshing(true);

    try {
      const balanceInLamports = await connection.getBalance(publicKey);
      const solBalance = balanceInLamports / 1_000_000_000; // Convert lamports to SOL
      setWalletBalance(solBalance.toFixed(3));
      return true; // Sufficient balance
    } catch (error) {
      console.error("Error checking wallet balance:", error);
      toast.error("Failed to check wallet balance");
      setWalletBalance(null);
      return false;
    } finally {
      setBalanceRefreshing(false);
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
          <h2 className="text-2xl font-bold">Student Dashboard</h2>
          <p className="mt-1 text-gray-250">
            Connected as :{" "}
            <span className="font-mono">
              {shortenAddress(walletAddress || "")}
            </span>
          </p>

          <p className="mt-1 text-gray-250">
            Wallet Balance :{" "}
            <span className="font-mono">
              {balanceRefreshing ? (
                <>
                  <Loader2 className="inline-block h-4 w-4 animate-spin" />
                  ...
                </>
              ) : (
                `${walletBalance} SOL`
              )}
            </span>
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
            <div>
              <p className="font-semibold text-2xl text-green-300 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span>NFT Minted Successfully!</span>
              </p>

              <div className="mt-2 flex space-x-4">
                <a
                  href={getNftExplorerLink(
                    mintedNft.address,
                    mintedNft.signature,
                    "address"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-green-400 hover:text-green-300 underline cursor-pointer"
                >
                  View NFT <ExternalLink className="ml-1 h-4 w-4" />
                </a>

                <p
                  className=" hover:cursor-pointer inline-flex items-center text-sm text-green-400 hover:text-green-300 underline cursor-pointer"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display Available NFT to Verify/Mint */}

      {isAuthorized && nftInfo && !mintSuccess && (
        <div className="rounded-lg border border-indigo-600 bg-indigo-900/30 p-6 shadow-lg hover:shadow-indigo-900/20 transition-all">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-indigo-300 flex items-center">
              <Award className="inline-block mr-2 h-5 w-5" />
              {isConfirmed
                ? "Credential Ready to Mint"
                : "Review Your Credential"}
            </h3>

            {confirmationDeadline && !isConfirmed && (
              <div className="flex items-center text-amber-400 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <div>
                  <p>Time remaining: {formatTimeRemaining()}</p>
                  <p className="text-xs text-gray-400">
                    Auto-confirms after deadline
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Edit Mode */}

          {isReportingIssue ? (
            // <div className="mt-4 space-y-4">
            //   <div>
            //     <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            //     <input
            //       type="text"
            //       name="name"
            //       value={editedNftInfo.name || ""}
            //       onChange={handleInputChange}
            //       className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            //     />
            //   </div>

            //   <div>
            //     <label className="block text-sm font-medium text-gray-300 mb-1">Symbol</label>
            //     <input
            //       type="text"
            //       name="symbol"
            //       value={editedNftInfo.symbol || ""}
            //       onChange={handleInputChange}
            //       className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            //     />
            //   </div>

            //   <div>
            //     <label className="block text-sm font-medium text-gray-300 mb-1">Metadata URI</label>
            //     <input
            //       type="text"
            //       name="uri"
            //       value={editedNftInfo.uri || ""}
            //       onChange={handleInputChange}
            //       className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            //     />
            //   </div>

            //   <div className="flex space-x-3 pt-2">
            //     <Button
            //       onClick={handleSaveChanges}
            //       disabled={isSavingChanges}
            //       className="cursor-pointer flex items-center"
            //     >
            //       {isSavingChanges ? (
            //         <>
            //           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            //           Saving...
            //         </>
            //       ) : (
            //         <>
            //           <Save className="mr-2 h-4 w-4" />
            //           Save Changes
            //         </>
            //       )}
            //     </Button>

            //     <Button
            //       onClick={handleEditToggle}
            //       variant="outline"
            //       className="cursor-pointer"
            //       disabled={isSavingChanges}
            //     >
            //       <X className="mr-2 h-4 w-4" />
            //       Cancel
            //     </Button>
            //   </div>
            // </div>

            <div className="mt-4 space-y-4">
              <p className="text-gray-300">
                Report an issue with your credential information that requires
                university attention:
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Issue Description
                </label>
                <textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  placeholder="Describe the issue with your credential details..."
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <Button
                  onClick={handleSubmitIssue}
                  disabled={isSendingIssue || !issueDescription.trim()}
                  className="cursor-pointer flex items-center"
                  title="Submit issue to university"
                >
                  {isSendingIssue ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Submit Issue
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleCancelReport}
                  variant="outline"
                  className="cursor-pointer"
                  disabled={isSendingIssue}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* View Mode */}
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
                  <span className="font-medium text-gray-100">
                    Metadata URI:
                  </span>{" "}
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

              <div className="mt-6 flex flex-wrap gap-3">
                {!isConfirmed && !timeRemaining?.expired && (
                  <>
                    <Button
                      disabled={isSavingChanges}
                      onClick={handleConfirm}
                      className="cursor-pointer hover:bg-green-600 bg-green-700 transition-colors flex items-center"
                      {...(alreadyReported
                        ? {
                            title:
                              "You have already reported an issue for this credential. Please contact your university for further assistance.",
                          }
                        : {
                            title:
                              "Confirm that, the above details are correct",
                          })}
                    >
                      {isSavingChanges ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirm Details
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleReportIssue}
                      variant="outline"
                      className="cursor-pointer hover:bg-amber-700 transition-colors flex items-center  "
                      disabled={isSendingIssue}
                    >
                      <Flag className="mr-2 h-4 w-4" />
                      Report Issue to University
                    </Button>
                  </>
                )}

                {(isConfirmed || timeRemaining?.expired) && (
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
                      "Mint Credential NFT"
                    )}
                  </Button>
                )}
              </div>

              {isConfirmed && (
                <p className="mt-3 text-sm text-green-400 flex items-center">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  You've confirmed these details are correct
                </p>
              )}

              {timeRemaining?.expired && !isConfirmed && (
                <p className="mt-3 text-sm text-amber-400 flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  Review period expired. Details are auto-confirmed.
                </p>
              )}

              {mintError && (
                <p className="mt-3 text-sm text-red-400 flex items-center">
                  <AlertCircle className="mr-1 h-4 w-4" /> {mintError}
                </p>
              )}

              {!umi.identity && (
                <p className="mt-3 text-sm text-yellow-400 flex items-center">
                  <AlertCircle className="mr-1 h-4 w-4" /> Wallet not fully
                  ready for signing. Please ensure it's connected and
                  initialized.
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Display if not authorized or no allocation found */}
      {!isAuthorized && !isLoading && !mintSuccess && (
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-gray-400" />
            Pending Credentials : {nftInfo ? nftInfo.length : "None"}
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
          Total Minted Credentials : {mintedNfts.length}
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
                <h4 className="text-lg font-medium text-indigo-300">
                  {nft.name}
                </h4>
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
                    Minted: {new Date(nft.mintedAt).toLocaleDateString()}
                  </p>
                )}

                <div className="mt-4 flex space-x-2">
                  <a
                    href={getNftExplorerLink(
                      nft.nftAddress,
                      nft.signature,
                      "address"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline flex items-center"
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
                You have a credential ready to {isConfirmed ? "mint" : "review"}{" "}
                above!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
