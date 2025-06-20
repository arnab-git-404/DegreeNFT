// 3rd Edition - 8.24AM - 14.03.25

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  School,
  Plus,
  CheckCircle,
  Info,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { shortenAddress } from "../lib/utils";
import { isValidPublicKey } from "../lib/solana";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useSolana } from "../context/SolanaContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fromJSON } from "postcss";

export function UniversityDashboard() {
  // Add Pinata API configuration
  const PINATA_API_KEY = import.meta.env.VITE_APP_PINATA_API_KEY;
  const PINATA_SECRET_KEY = import.meta.env.VITE_APP_PINATA_API_SECRET;
  const API_BASE_URL = import.meta.env.VITE_APP_SERVER_URL;
  const EXTERNAL_API_URL = "https://degree-nft.vercel.app/";

  const { publicKey } = useWallet();
  const navigate = useNavigate();

  const {
    connected,
    isValidPublicKey,
    setCurrentIpfsHash,
    currentIpfsHash,
    createNftFromIpfs,
    mintedNft,
    getNftExplorerLink,
    isLoading,
  } = useSolana();

  // Form state
  const [formData, setFormData] = useState({
    universityName: "",
    studentName: "",
    studentAddress: "",
    degreeType: "",
    issueDate: new Date().toISOString().split("T")[0],
    graduationYear: "",
    cgpa: "",
    programDuration: "",
    major: "",
    honors: "",
  });

  const [recentCredentials, setRecentCredentials] = useState([]);

  // Format form data into NFT metadata
  const createNftMetadata = (formData) => {
    return {
      name: `${formData.universityName} - ${formData.degreeType}`,
      symbol: "DegreeNFT",
      description: `${formData.degreeType} issued by ${formData.universityName} to ${formData.studentName}`,
      seller_fee_basis_points: 500,
      image:
        "https://cdn.tourradar.com/s3/tour/720x480/251218_65585c177b316.jpg", // Replace with your certificate image URL
      external_url: `${EXTERNAL_API_URL}`,
      attributes: [
        {
          trait_type: "Student Name",
          value: formData.studentName,
        },
        {
          trait_type: "University",
          value: formData.universityName,
        },
        {
          trait_type: "Degree",
          value: formData.degreeType,
        },
        {
          trait_type: "Major",
          value: formData.major,
        },
        {
          trait_type: "CGPA",
          value: formData.cgpa,
        },
        {
          trait_type: "Graduation Year",
          value: formData.graduationYear,
        },
        {
          trait_type: "Program Duration",
          value: formData.programDuration,
        },
        {
          trait_type: "Issue Date",
          value: formData.issueDate,
        },
        {
          trait_type: "Honors",
          value: formData.honors || "None",
        },
      ],

      properties: {
        creators: [
          {
            universityWalletAddress: `${publicKey.toString()}`,
          },
        ],

        files: [
          {
            type: "image/png",
            uri: "https://cdn.tourradar.com/s3/tour/720x480/251218_65585c177b316.jpg", // Replace with your certificate image URL
          },
        ],
        category: "image",
      },
    };
  };

  const uploadToPinata = async (metadata) => {
    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
          },
        }
      );
      setCurrentIpfsHash(response.data.IpfsHash);
      return response.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      throw new Error("Failed to upload metadata to IPFS");
    }
  };

  const validateForm = () => {
    // University information validation
    if (!formData.universityName?.trim()) return "University name is required";

    // Student information validation
    if (!formData.studentName?.trim()) return "Student name is required";

    if (
      !formData.studentAddress?.trim() &&
      !isValidPublicKey(formData.studentAddress)
    )
      return "Student wallet address is required";

    if (formData.studentAddress === publicKey?.toString())
      return "Student wallet address cannot be the same as the university wallet address";

    // Degree information validation
    if (!formData.degreeType?.trim()) return "Degree type is required";

    if (!formData.major?.trim()) return "Major field of study is required";

    if (!formData.issueDate) return "Issue date is required";

    if (!formData.graduationYear) return "Graduation year is required";

    // Check graduation year is within reasonable range
    const year = parseInt(formData.graduationYear);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear + 10)
      return "Please enter a valid graduation year";

    if (!formData.programDuration?.trim())
      return "Program duration is required";

    if (!formData.cgpa?.trim()) return "CGPA is required";

    // Validate CGPA format if needed
    const cgpa = parseFloat(formData.cgpa);
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10)
      // Adjust max value based on your grading system
      return "Please enter a valid CGPA value";

    // All validations passed
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const explorerLink = mintedNft ? getNftExplorerLink("address") : null;

  const getCredentialExplorerUrl = (type, value) => {
    if (!value) return "#";
    const cluster = "devnet";
    return `https://explorer.solana.com/${type}/${value.toString()}?cluster=${cluster}`;
  };

  const mintIssuedDegree = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      toast.loading("Creating degree NFT...");

      // Create metadata
      const metadata = createNftMetadata(formData);

      const metadataString = JSON.stringify(metadata);

      // Upload to IPFS
      const ipfsHash = await uploadToPinata(metadataString);
      console.log("IPFS Hash:", ipfsHash);

      // Set the hash in context
      // setCurrentIpfsHash(ipfsHash);

      // Create NFT
      const nftResult = await createNftFromIpfs(
        metadata.name,
        metadata.description
        // metadata.attributes
        // formData
      );

      if (!nftResult) {
        throw new Error("Failed to create NFT");
      }

      // Add to recent credentials
      setRecentCredentials((prev) => [
        {
          id: Date.now().toString(),
          studentName: formData.studentName,
          degreeType: formData.degreeType,
          timestamp: new Date().toISOString(),
          address: nftResult.address,
          signature: nftResult.signature,
        },
        ...prev.slice(0, 9),
      ]);

      toast.dismiss();
      toast.success("Degree NFT created successfully!");

      // Reset form
      setFormData({
        universityName: formData.universityName,
        studentName: "",
        studentAddress: "",
        degreeType: "",
        issueDate: new Date().toISOString().split("T")[0],
        graduationYear: "",
        cgpa: "",
        programDuration: "",
        major: "",
        honors: "",
      });

      toast.success("Degree credential issued successfully!");
    } catch (error) {
      console.error("Error issuing degree:", error);
      toast.error(`Failed to issue credential: ${error.message}`);
    }
  };

  const handleIssueDegree = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      toast.loading("Creating degree NFT...");

      // Create metadata
      const metadata = createNftMetadata(formData);

      const metadataString = JSON.stringify(metadata);

      // Upload to IPFS
      const ipfsHash = await uploadToPinata(metadataString);
      console.log("IPFS Hash:", ipfsHash);

      await createNftAllocation(ipfsHash);

      toast.dismiss();
      // toast.success("Degree NFT created successfully!");

      // Reset form
      setFormData({
        universityName: formData.universityName,
        studentName: "",
        studentAddress: "",
        degreeType: "",
        issueDate: new Date().toISOString().split("T")[0],
        graduationYear: "",
        cgpa: "",
        programDuration: "",
        major: "",
        honors: "",
      });

      toast.success("Degree credential issued successfully!");
    } catch (error) {
      console.error("Error issuing degree:", error);
      toast.error(`Failed to issue credential: ${error.message}`);
    }
  };

  const createNftAllocation = async (ipfsHash) => {
    const metadataUri = `https://ipfs.io/ipfs/${ipfsHash}`;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/create-nft-ipfsHash-allocation`,
        {
          studentWallet: formData.studentAddress,
          universityWallet: publicKey.toString(),
          name: formData.degreeType,
          symbol: "DegreeNFT",
          uri: metadataUri,
          ipfsHash: ipfsHash,
          sellerFeeBasisPoints: 500,
        }
      );
      console.log("Data Uploaded TO Backend");
      return response.data;
    } catch (error) {
      console.error("Error creating NFT allocation:", error);
    }
  };

  if (!connected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <School className="h-16 w-16 text-indigo-500" />

        <h2 className="mt-4 text-2xl font-bold">University Dashboard</h2>

        <p className="mt-2 text-gray-400">
          Connect your wallet to issue academic credentials
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">University Dashboard</h2>

          <p className="mt-1 text-gray-400">
            Connected as: {shortenAddress(publicKey?.toBase58() || "")}
          </p>
        </div>

        <div>
          {/* <h2 className="text-2xl font-bold">Go For Batch Upload</h2> */}

          <Button
            variant="outline"
            onClick={() => {
              navigate("/batch-upload");
              toast("Please use .csv files ", {
                icon: "ℹ️",
                duration: 2000,
              });
            }}
            className="flex items-center gap-2 hover:cursor-pointer "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Batch Upload
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
        <h3 className="text-xl font-semibold">Issue New Degree Credential</h3>
        <p className="mt-1 text-sm text-gray-400">
          Fill in all the required information to mint a degree certificate NFT
        </p>

        <form onSubmit={handleIssueDegree} className="mt-6 space-y-6">
          {/* University Information */}
          <div className="space-y-4">
            <div className="flex items-center">
              <h4 className="font-medium text-indigo-400">
                University Information
              </h4>
              <div
                className="tooltip ml-2 cursor-help"
                title="Information about the institution issuing this degree"
              >
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <Input
              label="University or Institution Name"
              name="universityName"
              placeholder="e.g. Harvard University"
              value={formData.universityName}
              onChange={handleInputChange}
              description="Official name of the university or educational institution"
              required
            />
          </div>

          {/* Student Information */}
          <div className="space-y-4">
            <div className="flex items-center">
              <h4 className="font-medium text-indigo-400">
                Student Information
              </h4>
              <div
                className="tooltip ml-2 cursor-help"
                title="Details about the recipient of this degree"
              >
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <Input
              label="Student Full Name"
              name="studentName"
              placeholder="e.g. John A. Smith"
              value={formData.studentName}
              onChange={handleInputChange}
              description="Complete legal name as it appears on official documents"
              required
            />

            <Input
              label="Student Wallet Address (Solana)"
              name="studentAddress"
              placeholder="e.g. EzAvxJV9odS9WTfgnMCmRjKmvn82ziEWDMKJTnrEP4gH"
              value={formData.studentAddress}
              onChange={handleInputChange}
              description="The Solana wallet address where the degree NFT will be sent"
              error={
                formData.studentAddress &&
                !isValidPublicKey(formData.studentAddress)
                  ? "Invalid Solana address"
                  : formData.studentAddress === publicKey?.toString()
                  ? "Student wallet address cannot be the same as the university wallet address"
                  : undefined
              }
              required
            />
          </div>

          {/* Degree Information */}
          <div className="space-y-4">
            <div className="flex items-center">
              <h4 className="font-medium text-indigo-400">
                Degree Information
              </h4>
              <div
                className="tooltip ml-2 cursor-help"
                title="Academic details about the degree being awarded"
              >
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Degree Type/Title"
                name="degreeType"
                placeholder="e.g. Bachelor of Science"
                value={formData.degreeType}
                onChange={handleInputChange}
                description="The specific academic degree being awarded"
                required
              />

              <Input
                label="Major/Field of Study"
                name="major"
                placeholder="e.g. Computer Science"
                value={formData.major}
                onChange={handleInputChange}
                description="The student's specialized field or concentration"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input
                label="Issue Date"
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={handleInputChange}
                description="When this degree certificate is being issued"
                required
              />

              <Input
                label="Graduation Year"
                name="graduationYear"
                placeholder="e.g. 2023"
                type="number"
                min="1900"
                max="2099"
                value={formData.graduationYear}
                onChange={handleInputChange}
                description="The year when graduation was completed"
                required
              />

              <Input
                label="Program Duration"
                name="programDuration"
                placeholder="e.g. 4 years"
                value={formData.programDuration}
                onChange={handleInputChange}
                description="Length of time required to complete the degree"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="CGPA/Final Grade"
                name="cgpa"
                placeholder="e.g. 3.8"
                value={formData.cgpa}
                onChange={handleInputChange}
                description="Cumulative Grade Point Average or final grade received"
                required
              />

              <Input
                label="Honors/Distinctions"
                name="honors"
                placeholder="e.g. Magna Cum Laude"
                value={formData.honors}
                onChange={handleInputChange}
                description="Any special honors or achievements (optional)"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={
                !formData.universityName ||
                !formData.studentName ||
                !isValidPublicKey(formData.studentAddress) ||
                !formData.degreeType ||
                !formData.issueDate ||
                !formData.graduationYear ||
                !formData.cgpa ||
                !formData.programDuration ||
                !formData.major ||
                isLoading
              }
              className=" hover:cursor-pointer w-full"
            >
              {isLoading ? (
                <>Issuing Credential...</>
              ) : (
                <>
                  {/* <Plus className="mr-2 h-4 w-4" /> */}
                  Issue Degree Certificate NFT
                </>
              )}
            </Button>

            <div className="mt-2 rounded-md bg-gray-700/40 p-3">
              <p className="flex items-start text-sm text-gray-300">
                <Info className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5 text-indigo-400" />
                <span>
                  This will create an on-chain NFT credential on the Solana
                  blockchain that will be sent directly to the student's wallet.
                  The credential will be permanently recorded and verifiable by
                  anyone with the NFT address.
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
        <h3 className="text-xl font-semibold">Recent Credentials</h3>
        <div className="mt-4 space-y-4">
          {recentCredentials.length > 0 ? (
            <div className="space-y-4">
              {recentCredentials.map((credential) => (
                <div
                  key={credential.id}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{credential.studentName}</h4>
                      <p className="text-sm text-gray-600">
                        {credential.degreeType}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(credential.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <a
                      href={getCredentialExplorerUrl(
                        "address",
                        credential.address
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Info className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No credentials issued yet.</p>
              <p className="text-sm text-gray-400 mt-1">
                Issued credentials will appear here
              </p>
            </div>
          )}

          {mintedNft && (
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Latest NFT Created
              </h4>
              <p className="text-sm mt-2 text-green-700">
                NFT Address:
                {explorerLink ? (
                  <a
                    href={explorerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 underline"
                  >
                    {mintedNft.address.toString().substring(0, 8)}...
                  </a>
                ) : (
                  <span className="ml-1">
                    {mintedNft.address.toString().substring(0, 8)}...
                  </span>
                )}
              </p>
              {mintedNft.metadataUri && (
                <a
                  href={mintedNft.metadataUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 mt-1 flex items-center"
                >
                  <span>View Metadata</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
            </div>
          )}
        </div>
      </div> */}




    </div>
  );
}


//               />
//             </div>
//           </div>

//           <div className="pt-4">
//             <Button
//               type="submit"
//               disabled={
//                 !formData.universityName ||
//                 !formData.studentName ||
//                 !isValidPublicKey(formData.studentAddress) ||
//                 !formData.degreeType ||
//                 !formData.issueDate ||
//                 !formData.graduationYear ||
//                 !formData.cgpa ||
//                 !formData.programDuration ||
//                 !formData.major ||
//                 isLoading
//               }
//               className="w-full"
//             >
//               {isLoading ? (
//                 <>Issuing Credential...</>
//               ) : (
//                 <>
//                   <Plus className="mr-2 h-4 w-4" />
//                   Issue Degree Certificate NFT
//                 </>
//               )}
//             </Button>

//             <p className="mt-2 text-xs text-gray-500">
//               <Info className="inline h-3 w-3 mr-1" />
//               This will create an on-chain NFT credential that will be sent directly to the student's wallet
//             </p>
//           </div>
//         </form>
//       </div>

//       <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
//         <h3 className="text-xl font-semibold">Recent Credentials</h3>
//         <div className="mt-4 space-y-4">
//           {recentCredentials.length > 0 ? (
//             recentCredentials.map((credential, index) => (
//               <div key={index} className="flex items-center justify-between rounded-lg bg-gray-700/50 p-4">
//                 <div>
//                   <p className="font-medium">{credential.degreeType}</p>
//                   <p className="text-sm text-gray-400">
//                     {shortenAddress(credential.studentAddress)}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {new Date(credential.timestamp).toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="flex items-center">
//                   {credential.transactionSignature && (
//                     <a
//                       href={`https://explorer.solana.com/tx/${credential.transactionSignature}?cluster=devnet`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="mr-3 text-xs text-indigo-400 hover:text-indigo-300"
//                     >
//                       View Transaction
//                     </a>
//                   )}
//                   <CheckCircle className="h-5 w-5 text-green-500" />
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-gray-500">No credentials issued yet</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// 1st Edition
// import { useState } from 'react';
// import { useWallet } from '@solana/wallet-adapter-react';
// import { School, Plus, CheckCircle } from 'lucide-react';
// import { shortenAddress } from '../lib/utils';
// // import { isValidPublicKey } from '@/lib/solana';
// import { isValidPublicKey } from '../lib/solana';
// import {Button} from '../components/Button';
// import {Input} from '../components/Input';

// export function UniversityDashboard() {
//   const { connected, publicKey } = useWallet();
//   const [studentAddress, setStudentAddress] = useState('');
//   const [degreeName, setDegreeName] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleIssueDegree = async (e) => {
//     e.preventDefault();
//     if (!connected || !isValidPublicKey(studentAddress)) return;

//     setIsLoading(true);
//     try {
//       // TODO: Implement NFT minting logic
//       await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
//       setStudentAddress('');
//       setDegreeName('');
//     } catch (error) {
//       console.error('Error issuing degree:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!connected) {
//     return (
//       <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
//         <School className="h-16 w-16 text-indigo-500" />
//         <h2 className="mt-4 text-2xl font-bold">University Dashboard</h2>
//         <p className="mt-2 text-gray-400">Connect your wallet to issue academic credentials</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">University Dashboard</h2>
//           <p className="mt-1 text-gray-400">
//             Connected as: {shortenAddress(publicKey?.toBase58() || '')}
//           </p>
//         </div>
//       </div>

//       <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
//         <h3 className="text-xl font-semibold">Issue New Credential</h3>
//         <form onSubmit={handleIssueDegree} className="mt-4 space-y-4">
//           <div>
//             <Input

//               placeholder="Student Wallet Address"
//               value={studentAddress}
//               onChange={(e) => setStudentAddress(e.target.value)}
//               error={studentAddress && !isValidPublicKey(studentAddress) ? 'Invalid Solana address' : undefined}
//             />
//           </div>

//           <div>
//             <Input
//               placeholder="Degree Name"
//               value={degreeName}
//               onChange={(e) => setDegreeName(e.target.value)}
//             />
//           </div>

//           <Button
//             type="submit"
//             disabled={!degreeName || !isValidPublicKey(studentAddress) || isLoading}
//             className="w-full"
//           >
//             {isLoading ? (
//               <>Issuing Credential...</>
//             ) : (
//               <>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Issue Credential
//               </>
//             )}
//           </Button>
//         </form>
//       </div>

//       <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
//         <h3 className="text-xl font-semibold">Recent Credentials</h3>
//         <div className="mt-4 space-y-4">
//           <div className="flex items-center justify-between rounded-lg bg-gray-700/50 p-4">
//             <div>
//               <p className="font-medium">Bachelor of Computer Science</p>
//               <p className="text-sm text-gray-400">{shortenAddress('8xyt4aCBQNQs1jHWqRQRVNQCUE1nJD3XAcZCJJKHVp2E')}</p>
//             </div>
//             <CheckCircle className="h-5 w-5 text-green-500" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
