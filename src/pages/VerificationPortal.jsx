import { useState } from 'react';
import { Shield, Search, CheckCircle, XCircle, ExternalLink , Copy } from 'lucide-react';
// import { isValidPublicKey } from '@/lib/solana';
// import { getExplorerUrl } from '@/lib/solana';
// import { isValidPublicKey } from '@/lib/solana';

import { shortenAddress } from '../lib/utils';
import { isValidPublicKey } from '../lib/solana';
import { getExplorerUrl } from '../lib/solana';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { toast } from 'react-hot-toast';

export function VerificationPortal() {

  const API_BASE_URL = import.meta.env.VITE_APP_SERVER_URL;


  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [verificationResult, setVerificationResult] = useState('invalid');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isValidPublicKey(address)) return;

    setIsLoading(true);
    try {
      

      // TODO: Implement verification logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      setVerificationResult('valid');
      toast.success("Verified! Go to View on Solana Explorer For Detalis", {
      duration: 5000,
      });

      
      
    } catch (error) {
      console.error('Error verifying credential:', error);
      setVerificationResult('invalid');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <Shield className="mx-auto h-16 w-16 text-indigo-500" />
        <h2 className="mt-4 text-2xl font-bold">Credential Verification</h2>
        <p className="mt-2 text-gray-400">
          Verify the authenticity of academic credentials on the Solana blockchain
        </p>
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
        <form onSubmit={handleVerify} className="space-y-4">
          <Input
            placeholder="Enter NFT Address or Student Wallet Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={address && !isValidPublicKey(address) ? 'Invalid Solana address' : undefined}
          />
          <Button
            type="submit"
            disabled={!isValidPublicKey(address) || isLoading}
            className="hover:cursor-pointer w-full"
          >
            {isLoading ? (
              <>Verifying...</>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Verify Credential
              </>
            )}
          </Button>
        </form>

        {verificationResult && (
          <div className="mt-6 rounded-lg bg-gray-700/50 p-4">
            {verificationResult === 'valid' ? (
              <div className="flex items-center space-x-2 text-green-500">
                <CheckCircle className="h-5 w-5" />
                <span>Valid credential</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-500">
                <XCircle className="h-5 w-5" />
                <span>Invalid credential</span>
              </div>
            )}


            <div className="mt-4">
              <a
                href={getExplorerUrl(address)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                View on Solana Explorer
                <ExternalLink className="ml-1 inline h-4 w-4" />
              </a>
            </div>

            <div className="mt-4">
               <a
                 onClick={() => {
                  navigator.clipboard.writeText("FYYAm8NKgaShjzFkdi5rVY5TC47jeSKpo7PxEgHBPFDz");
                  toast.success("Address copied to clipboard! ", {
                    duration: 3000,
                    // icon: "📋"
                    });
                }}

                title="Copy This address & Paste it in the input field"
                rel="noopener noreferrer"
                className=" hover:cursor-pointer text-sm text-indigo-400 hover:text-indigo-300"
              >
                Example DegreeNFT Address: {"FYYAm8NKgaShjzFkdi5rVY5TC47jeSKpo7PxEgHBPFDz"}
               <Copy className="ml-2 inline h-4 w-4"/>
                
    
              </a>

            </div>
              

          </div>
        )}
      </div>
    </div>
  );
}
