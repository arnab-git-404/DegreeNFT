// import { Link } from "react-router-dom";
// import { GraduationCap, School, UserCheck, Shield } from "lucide-react";
// import { useState } from "react";
// import { Button } from "../components/Button";
// import {
//   Connection,
//   PublicKey,
//   LAMPORTS_PER_SOL,
//   clusterApiUrl,
// } from "@solana/web3.js";



// export function Home() {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleAirdrop = async () => {
//     try {
//       setIsLoading(true);

//       // Check if Phantom wallet is installed
//       const { solana } = window;
//       if (!solana || !solana.isPhantom) {
//         alert("Please install Phantom wallet to receive the airdrop");
//         setIsLoading(false);
//         return;
//       }

//       // Connect to wallet if not already connected
//       if (!solana.isConnected) {
//         await solana.connect();
//       }

//       // Get user's public key
//       const publicKey = solana.publicKey;

//       // Create connection to Solana devnet
//       const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

//       // Request airdrop of 1 SOL
//       const signature = await connection.requestAirdrop(
//         publicKey,
//         LAMPORTS_PER_SOL
//       );

//       // Confirm transaction
//       await connection.confirmTransaction(signature);

//       alert("Success! 1 SOL has been airdropped to your wallet.");
//     } catch (error) {
//       console.error("Airdrop failed:", error);
//       alert("Airdrop failed: " + error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-10  ">
//       <section className="py-10 text-center">
//         <GraduationCap className="mx-auto h-20 w-20 text-indigo-500" />
//         <h1 className="mt-8 text-4xl font-bold sm:text-6xl">
//           Secure Academic Credentials
//           <span className="block text-indigo-500">
//             on the Solana Blockchain
//           </span>
//         </h1>
//         <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
//           A decentralized platform for universities to issue and verify academic
//           credentials using non-transferable NFTs on the Solana blockchain.
//         </p>
//         <div className="mt-10 flex justify-center gap-4">
//           <Link to="/university">
//             <Button className=" text-lg hover:cursor-pointer ">
//               For Universities
//             </Button>
//           </Link>
//           <Link to="/student">
//             <Button className="text-lg hover:cursor-pointer ">
//               For Students
//             </Button>
//           </Link>
//         </div>
//       </section>

//       <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-7xl">
//         <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
//           <School className="h-12 w-12 text-indigo-500" />
//           <h3 className="mt-4 text-xl font-semibold">For Universities</h3>
//           <p className="mt-2 text-gray-400">
//             Issue tamper-proof digital credentials as non-transferable NFTs on
//             the Solana blockchain.
//           </p>
//         </div>

//         <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
//           <UserCheck className="h-12 w-12 text-indigo-500" />
//           <h3 className="mt-4 text-xl font-semibold">For Students</h3>

//           <p className="mt-2 text-gray-400">
//             Receive and manage your academic credentials in your Solana wallet.
//           </p>
//         </div>


//         <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
//           <UserCheck className="h-12 w-12 text-indigo-500" />
//           <h3 className="mt-4 text-xl font-semibold">1 SOL Airdrop</h3>
//           <p className="mt-2 text-gray-400">
//             Receive 1 SOL airdrop when you mint your first NFT
//           </p>
//           <Button className="mt-4" onClick={handleAirdrop} disabled={isLoading}>
//             {isLoading ? "Processing..." : "Get Airdrop"}
//           </Button>
//         </div>



//         <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
//           <Shield className="h-12 w-12 text-indigo-500" />
//           <h3 className="mt-4 text-xl font-semibold">Verification</h3>
//           <p className="mt-2 text-gray-400">
//             Instantly verify the authenticity of academic credentials on the
//             blockchain.
//           </p>
//         </div>
//       </section>
//     </div>
//   );
// }



import { useState, useEffect  } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, School, UserCheck, Shield, Wallet, ExternalLink } from "lucide-react";
import { Button } from "../components/Button";

// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import { toast } from 'react-hot-toast';

import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";

export function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [publicKey, setPublicKey] = useState(null);

  useEffect(() => {
    // Check if wallet is connected when component mounts
    const checkWalletConnection = async () => {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        try {
          // Check if already connected
          if (solana.isConnected) {
            setWalletConnected(true);
            setPublicKey(solana.publicKey);
            await updateWalletBalance(solana.publicKey);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    
    checkWalletConnection();
  }, []);

  const updateWalletBalance = async (pubKey) => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const balance = await connection.getBalance(pubKey);
      setWalletBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };


  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const { solana } = window;
  
      if (!solana || !solana.isPhantom) {

        toast.error("Please install Phantom wallet first" , { duration: 2000 });

        await new Promise(resolve => setTimeout(resolve, 2000));

        toast.loading("Redirecting to Phantom wallet...", { duration: 3000 });

        // Wait for 5 seconds before redirecting to Phantom wallet
        await new Promise(resolve => setTimeout(resolve, 3000));

        window.open("https://phantom.app/", "_blank");
        return;
      }
  
      const response = await solana.connect();
      setWalletConnected(true);
      setPublicKey(response.publicKey);
      await updateWalletBalance(response.publicKey);
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAirdrop = async () => {
    let toastId;
    try {
      setIsLoading(true);
  
      const { solana } = window;
      if (!solana || !solana.isPhantom) {
        toast.error("Please install Phantom wallet to receive the airdrop" , { duration: 2000 });

        await new Promise(resolve => setTimeout(resolve, 2000));

        
        toast.loading("Redirecting to Phantom wallet...", { duration: 3000 });

        // Wait for 5 seconds before redirecting to Phantom wallet
        await new Promise(resolve => setTimeout(resolve, 3000));

        window.open("https://phantom.app/", "_blank");
        return;
      }
  
      if (!solana.isConnected) {
        await connectWallet();
      }
  
      const userPublicKey = solana.publicKey;
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
      toastId = toast.loading("Requesting airdrop...");
  
      const signature = await connection.requestAirdrop(
        userPublicKey,
        LAMPORTS_PER_SOL
      );
  
      toast.loading("Confirming transaction...", { id: toastId });
  
      await connection.confirmTransaction(signature, "confirmed");
      await updateWalletBalance(userPublicKey);
  
      toast.success("Success! 1 SOL has been airdropped to your wallet", {
        id: toastId,
      });
  
    } catch (error) {
      console.error("Airdrop failed:", error);
      const message = error.message.includes("429") || error.message.includes("limit")
        ? "Airdrop limit reached. Please try again later or use a new wallet."
        : "Airdrop failed: " + error.message;
    
      if (toastId) {
        toast.error(message, { id: toastId });
      } else {
        toast.error(message);
      }
    }
     finally {
      setIsLoading(false);
    }
  };
  


  return (
    <div className="space-y-10 min-h-screen">

      {/* Wallet status bar */}
      <div className="fixed top-0 right-0 left-0 bg-gray-900/80 backdrop-blur-sm p-2 z-10 flex justify-end items-center">

        {walletConnected ? (
          <div className="flex items-center space-x-3 bg-gray-800 rounded-full py-1 px-3">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-xs text-gray-300">
              {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
            </span>
            {walletBalance !== null && (
              <span className="text-xs bg-indigo-900/50 py-1 px-2 rounded-full">
                {walletBalance.toFixed(2)} SOL
              </span>
            )}
          </div>
        ) : (
          <Button 
            onClick={connectWallet} 
            disabled={isLoading}
            className="py-1 px-3 text-xs flex items-center gap-1"
          >
            <Wallet className="h-3 w-3" />
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </div>
      
      <section className="py-16 text-center relative overflow-hidden">
        { /* Background gradient effects */}
         <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 pointer-events-none"></div>
        <div className="absolute -top-40 -right-40 h-80 w-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-1">
          <div className="relative inline-block">
            <GraduationCap className="mx-auto h-20 w-20 text-indigo-500" />
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          
          <h1 className="mt-8 text-4xl font-bold sm:text-6xl">
            Secure Academic Credentials
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
              on the Solana Blockchain
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            A decentralized platform for universities to issue and verify academic
            credentials using non-transferable NFTs on the Solana blockchain.
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/university">
              <Button className="text-lg hover:cursor-pointer transition transform hover:scale-105 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-600/20">
                For Universities
              </Button>
            </Link>
            <Link to="/student">
              <Button className="text-lg hover:cursor-pointer transition transform hover:scale-105 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-600/20">
                For Students
              </Button>
            </Link>
          </div>
        </div>
      </section>


      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-7xl px-4">
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-gray-800/80 hover:shadow-lg hover:shadow-indigo-500/10 group">
          <div className="bg-gray-700/50 rounded-lg p-3 inline-block group-hover:bg-indigo-500/20 transition-all">
            <School className="h-12 w-12 text-indigo-500" />
          </div>
          <h3 className="mt-4 text-xl font-semibold">For Universities</h3>
          <p className="mt-2 text-gray-400">
            Issue tamper-proof digital credentials as non-transferable NFTs on
            the Solana blockchain.
          </p>
          <div className="h-0 overflow-hidden group-hover:h-auto group-hover:mt-4 transition-all duration-300">
            <Link to="/university" className="text-indigo-400 hover:text-indigo-300 text-sm inline-flex items-center">
              Learn more <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>


        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-gray-800/80 hover:shadow-lg hover:shadow-indigo-500/10 group">
          <div className="bg-gray-700/50 rounded-lg p-3 inline-block group-hover:bg-indigo-500/20 transition-all">
            <UserCheck className="h-12 w-12 text-indigo-500" />
          </div>
          <h3 className="mt-4 text-xl font-semibold">For Students</h3>
          <p className="mt-2 text-gray-400">
            Receive and manage your academic credentials in your Solana wallet.
          </p>
          <div className="h-0 overflow-hidden group-hover:h-auto group-hover:mt-4 transition-all duration-300">
            <Link to="/student" className="text-indigo-400 hover:text-indigo-300 text-sm inline-flex items-center">
              Learn more <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-gray-800/80 hover:shadow-lg hover:shadow-indigo-500/10">
          <div className="bg-gray-700/50 rounded-lg p-3 inline-block">
            <Wallet className="h-12 w-12 text-indigo-500" />
          </div>
          <h3 className="mt-4 text-xl font-semibold">1 SOL Airdrop</h3>
          <p className="mt-2 text-gray-400">
            Need SOL to get started? Receive 1 SOL airdrop from the Solana devnet.
          </p>
          <div className="mt-4 relative">
            <Button 
              className=" hover:cursor-pointer w-full flex items-center justify-center gap-2 group transition transform hover:scale-[1.02]" 
              onClick={handleAirdrop} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>Get Airdrop</>
              )}
            </Button>
            {!walletConnected && (
              <div className="absolute -bottom-8 left-0 right-0 text-xs text-center text-indigo-400">
                Connect wallet first
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-gray-800/80 hover:shadow-lg hover:shadow-indigo-500/10 group">
          <div className="bg-gray-700/50 rounded-lg p-3 inline-block group-hover:bg-indigo-500/20 transition-all">
            <Shield className="h-12 w-12 text-indigo-500" />
          </div>
          <h3 className="mt-4 text-xl font-semibold">Verification</h3>
          <p className="mt-2 text-gray-400">
            Instantly verify the authenticity of academic credentials on the
            blockchain.
          </p>
          <div className="h-0 overflow-hidden group-hover:h-auto group-hover:mt-4 transition-all duration-300">
            <Link to="/verify" className="text-indigo-400 hover:text-indigo-300 text-sm inline-flex items-center">
              Verify credentials <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>
      
      <footer className="py-6 text-center text-gray-500 text-sm mt-20">
        <p>© {new Date().getFullYear()} DegreeNFT - Powered by Solana</p>
      </footer>
    </div>
  );
}