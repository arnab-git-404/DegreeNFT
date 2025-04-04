// 1st ONE 

// import { useSolana } from '../context/SolanaContext';
// function MyComponent() {
//   const { connected, umi, mintDegreeNFT } = useSolana();
  
//   const createDegree = async () => {
//     if (!connected) return;
    
//     try {
//       const result = await mintDegreeNFT({
//         universityName: 'Example University',
//         studentName: 'John Doe',
//         degreeType: 'Bachelor of Science',
//         // ... other degree data
//       });
      
//       console.log('Created NFT with mint address:', result.address.toString());
//     } catch (error) {
//       console.error('Failed to create degree NFT:', error);
//     }
//   };
  
//   return (
//     <div>
//       <button onClick={createDegree}>Create Degree NFT</button>
//     </div>
//   );
// }



// 2ND ONE 
// const createNftWithUmi = async (umi, metadata, recipientAddress = null) => {
//     const { createNft, mplTokenMetadata } = await import('@metaplex-foundation/mpl-token-metadata');
//     const { createSignerFromKeypair, generateSigner, publicKey } = await import('@metaplex-foundation/umi');
//     const { createMint } = await import('@solana/spl-token');
    
//     // Generate a new keypair for the mint
//     const mintKeypair = generateSigner(umi);
    
//     // The owner will be the recipient if provided, otherwise the connected wallet
//     const ownerPublicKey = recipientAddress 
//       ? new PublicKey(recipientAddress) 
//       : umi.identity.publicKey;
      
//     try {
//       // Create the NFT
//       const { signature } = await createNft(umi, {
//         mint: mintKeypair,
//         name: metadata.name,
//         symbol: metadata.symbol || 'DEGREE',
//         uri: metadata.uri,
//         sellerFeeBasisPoints: 0,
//         creators: [
//           {
//             address: umi.identity.publicKey,
//             share: 100,
//             verified: true,
//           },
//         ],
//         // If recipient is provided and different from the connected wallet,
//         // we need to set it as the token owner
//         tokenOwner: ownerPublicKey,
//       }).sendAndConfirm(umi);
      
//       return {
//         mintAddress: mintKeypair.publicKey,
//         signature,
//       };
//     } catch (error) {
//       console.error('Error creating NFT:', error);
//       throw error;
//     }
//   };

// 3rd One 
// This would be implemented on a backend server
// async function queueBatchMinting(batchData, universityPublicKey) {
//     // Add to processing queue (e.g., Redis, AWS SQS, etc.)
//     const batchId = await addToProcessingQueue({
//       students: batchData,
//       universityPublicKey,
//       status: 'pending',
//       timestamp: Date.now()
//     });
    
//     // Return batch ID for tracking
//     return batchId;
//   }
  
//   // In your React component
//   const submitBatchForProcessing = async () => {
//     const batchId = await queueBatchMinting(parsedData, publicKey);
    
//     // Store batch ID to track progress
//     setBatchProcessingId(batchId);
    
//     // Set up polling to check status
//     const intervalId = setInterval(async () => {
//       const status = await checkBatchStatus(batchId);
//       setBatchStatus(status);
      
//       if (status.completed) {
//         clearInterval(intervalId);
//       }
//     }, 5000);
//   };

// 4th One
// // University collection
// {
//     publicKey: "EzAvxJV9odS9WTfgnMCmRjKmvn82ziEWDMKJTnrEP4gH",
//     name: "Harvard University",
//     verificationStatus: "verified",
//     totalIssuedCredentials: 1502,
//     createdAt: "2023-01-15T00:00:00Z"
//   }
  
//   // Credentials collection
//   {
//     mintAddress: "7KqpRwzkkeweW5jQoETyLzhvs9rc8Lx6YHKMaJJ8og7",
//     universityPublicKey: "EzAvxJV9odS9WTfgnMCmRjKmvn82ziEWDMKJTnrEP4gH",
//     studentPublicKey: "8xyt4aCBQNQs1jHWqRQRVNQCUE1nJD3XAcZCJJKHVp2E",
//     studentName: "John Smith",
//     degreeType: "Bachelor of Computer Science",
//     issueDate: "2025-03-14T00:00:00Z",
//     transactionSignature: "3NAMDm19TeoRoSKzjqUyQQUinMBUUvDTYz4xU5gV4Jcc9SAY3xnJYQug1fwH4W",
//     metadataUri: "https://arweave.net/xyz123",
//     status: "minted", // minted, transferred, revoked
//     major: "Computer Science",
//     cgpa: "3.8",
//     // Other credential data
//   }
  
//   // Analytics collection
//   {
//     universityPublicKey: "EzAvxJV9odS9WTfgnMCmRjKmvn82ziEWDMKJTnrEP4gH",
//     year: 2025,
//     monthlyIssuedCredentials: {
//       "01": 120,
//       "02": 45,
//       "03": 98
//       // ...
//     },
//     degreeTypeBreakdown: {
//       "Bachelor of Science": 185,
//       "Master of Science": 78
//       // ...
//     }
//   }


// 5th One
// Load DB in UniversityDashboard 
// import { useEffect } from 'react';
// import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../lib/firebase'; // Example with Firebase

// function UniversityDashboard() {
//   const { connected, publicKey } = useWallet();
//   const [issuedCredentials, setIssuedCredentials] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // Load data from database when component mounts
//   useEffect(() => {
//     if (!connected || !publicKey) return;
    
//     const loadCredentials = async () => {
//       try {
//         const credentialsRef = collection(db, 'credentials');
//         const q = query(credentialsRef, where('universityPublicKey', '==', publicKey.toString()));
//         const querySnapshot = await getDocs(q);
        
//         const credentials = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
        
//         setIssuedCredentials(credentials);
//       } catch (error) {
//         console.error('Error loading credentials:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     loadCredentials();
//   }, [connected, publicKey]);
  
//   // Store credential in database after minting
//   const handleIssueDegree = async (e) => {
//     e.preventDefault();
    
//     try {
//       // Mint the NFT as before
//       const result = await mintDegreeNFT(degreeData, formData.studentAddress);
      
//       // Save to database
//       await addDoc(collection(db, 'credentials'), {
//         mintAddress: result.address.toString(),
//         universityPublicKey: publicKey.toString(),
//         studentPublicKey: formData.studentAddress,
//         studentName: formData.studentName,
//         degreeType: formData.degreeType,
//         issueDate: new Date(formData.issueDate).toISOString(),
//         transactionSignature: result.response.signature,
//         metadataUri: result.uri,
//         status: "minted",
//         major: formData.major,
//         cgpa: formData.cgpa,
//         graduationYear: formData.graduationYear,
//         timestamp: new Date().toISOString()
//       });
      
//       // Update UI
//       toast.success('Degree credential issued successfully!');
//     } catch (error) {
//       console.error('Error issuing degree:', error);
//       toast.error(`Failed to issue credential: ${error.message}`);
//     }
//   };
  
//   // Component UI...
// }

// ============================================================================================================================================================

// Handling Batch Signatures for NFT Minting
// You've identified a critical UX challenge: Yes, with the current implementation, the university would need to approve 100 separate wallet signature requests for 100 students.

// This would create a terrible user experience - imagine clicking "Approve" in Phantom wallet 100 times!

// Solutions to Reduce Signature Requests

// 1. Transaction Batching
// const handleBatchMint = async () => {
//     setIsProcessing(true);
//     const batchSize = 5; // Solana has transaction size limits
//     const results = [];
    
//     // Process in small batches
//     for (let i = 0; i < parsedData.length; i += batchSize) {
//       const batch = parsedData.slice(i, i + batchSize);
      
//       try {
//         // Create a single transaction with multiple instructions
//         const { signatures, mintAddresses } = await batchMintDegreeNFTs(batch);
        
//         // Record results from this batch
//         batch.forEach((student, index) => {
//           results.push({
//             success: true,
//             student: student.studentName,
//             mintAddress: mintAddresses[index],
//             transaction: signatures[0] // All mints in batch share same transaction
//           });
//         });
        
//       } catch (error) {
//         // If the batch fails, process individually as fallback
//         for (const student of batch) {
//           // Individual processing...
//         }
//       }
//     }
    
//     setIsProcessing(false);
//     setResults(results);
//   };
// This reduces 100 signatures to approximately 20 signatures (with 5 NFTs per transaction).

// 2. Delegate Authority Solution
// const handleBatchMint = async () => {
//     // First, create a delegate authority that can mint on behalf of university
//     const delegateKeypair = Keypair.generate();
    
//     // Ask university to sign ONCE to approve delegation
//     const delegationResult = await delegateMintingAuthority(
//       delegateKeypair.publicKey, 
//       parsedData.length // Allow exactly the number of mints needed
//     );
    
//     if (!delegationResult.success) {
//       toast.error("Failed to approve batch minting");
//       return;
//     }
    
//     // Now process all students without further signatures
//     setIsProcessing(true);
//     const results = [];
    
//     for (const student of parsedData) {
//       try {
//         const result = await mintDegreeNFTWithDelegate({
//           studentData: student,
//           delegateKeypair
//         });
        
//         results.push({
//           success: true,
//           student: student.studentName,
//           transaction: result.signature
//         });
//       } catch (error) {
//         results.push({
//           success: false,
//           student: student.studentName,
//           error: error.message
//         });
//       }
//     }
    
//     setIsProcessing(false);
//     setResults(results);
//   };
// This approach requires just 1 signature regardless of batch size!


// 3. Custom Program Solution
// The most elegant but complex solution is to deploy a custom Solana program (smart contract) designed specifically for batch minting degree NFTs:
// const handleBatchMint = async () => {
//     // Convert all student data to compact on-chain format
//     const compactData = parsedData.map(convertStudentDataToCompactFormat);
    
//     // Single transaction to mint all certificates
//     const { signature } = await batchMintProgram.rpc.batchMintDegrees(
//       compactData,
//       {
//         accounts: {
//           university: publicKey,
//           // other required accounts
//         },
//         // Single signature from university wallet
//       }
//     );
    
//     // Process results
//     setIsProcessing(false);
//     toast.success(`Successfully minted ${parsedData.length} certificates in one transaction!`);
//   };



