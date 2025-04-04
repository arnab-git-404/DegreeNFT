import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { useSolana } from "../context/SolanaContext";
import { Input } from "../components/Input";
import { shortenAddress } from "../lib/utils";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import { useWallet } from '@solana/wallet-adapter-react';




export function BatchUploadPortal() {
  const { connected, publicKey } = useWallet();


  
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { mintDegreeNFT } = useSolana();



  const handleFileUpload = (e) => {

    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // Parse CSV/Excel file
      parseFile(uploadedFile).then((data) => {
        setParsedData(data);
      });
    }
  };

  const handleBatchMint = async () => {
    setIsProcessing(true);
    const results = [];

    // Process each student in sequence to avoid transaction failures
    for (const student of parsedData) {
      try {
        const result = await mintDegreeNFT(
          {
            universityName: student.universityName,
            studentName: student.studentName,
            degreeType: student.degreeType,
            // Other fields...
          },
          student.studentAddress
        );

        results.push({
          success: true,
          student: student.studentName,
          transaction: result.response.signature,
        });
      } catch (error) {
        results.push({
          success: false,
          student: student.studentName,
          error: error.message,
        });
      }
    }

    setIsProcessing(false);
    // Show batch processing results
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              University Batch Upload Portal
            </h2>
            <p className="mt-1 text-gray-400">
              Connected as: {shortenAddress(publicKey?.toBase58() || "")}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
          {/* <h3 className="text-xl font-semibold">Issue New Degree Credential</h3> */}
        
        <h4 className="text-lg font-medium">Batch Degree Issuance</h4>
        <p className="text-sm text-gray-400 mb-4">
          Upload a CSV file with multiple student records
        </p>
        <Input
          type="file"
          accept=".csv , .xlsx"
          onChange={handleFileUpload}
          className="mb-4 hover:cursor-pointer w-60 "
        />

        {parsedData.length > 0 && (
          <>
            <p className="mb-2">{parsedData.length} students found in file</p>
            <Button onClick={handleBatchMint} disabled={isProcessing}>
              {isProcessing
                ? `Processing (${results.length}/${parsedData.length})`
                : `Mint ${parsedData.length} Degree NFTs`}
            </Button>
          </>
        )}

        </div>
        
      </div>



    </>
  );
}
