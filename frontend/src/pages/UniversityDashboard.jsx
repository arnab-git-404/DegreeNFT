import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { School, Plus, CheckCircle } from 'lucide-react';
import { shortenAddress } from '../lib/utils';
// import { isValidPublicKey } from '@/lib/solana';
import { isValidPublicKey } from '../lib/solana';
import {Button} from '../components/Button';
import {Input} from '../components/Input';




export function UniversityDashboard() {
  const { connected, publicKey } = useWallet();
  const [studentAddress, setStudentAddress] = useState('');
  const [degreeName, setDegreeName] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleIssueDegree = async (e) => {
    e.preventDefault();
    if (!connected || !isValidPublicKey(studentAddress)) return;

    setIsLoading(true);
    try {
      // TODO: Implement NFT minting logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      setStudentAddress('');
      setDegreeName('');
    } catch (error) {
      console.error('Error issuing degree:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <School className="h-16 w-16 text-indigo-500" />
        <h2 className="mt-4 text-2xl font-bold">University Dashboard</h2>
        <p className="mt-2 text-gray-400">Connect your wallet to issue academic credentials</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">University Dashboard</h2>
          <p className="mt-1 text-gray-400">
            Connected as: {shortenAddress(publicKey?.toBase58() || '')}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
        <h3 className="text-xl font-semibold">Issue New Credential</h3>
        <form onSubmit={handleIssueDegree} className="mt-4 space-y-4">
          <div>
            <Input
            
              placeholder="Student Wallet Address"
              value={studentAddress}
              onChange={(e) => setStudentAddress(e.target.value)}
              error={studentAddress && !isValidPublicKey(studentAddress) ? 'Invalid Solana address' : undefined}
            />
          </div>
          <div>
            <Input
              placeholder="Degree Name"
              value={degreeName}
              onChange={(e) => setDegreeName(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={!degreeName || !isValidPublicKey(studentAddress) || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>Issuing Credential...</>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Issue Credential
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
        <h3 className="text-xl font-semibold">Recent Credentials</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-gray-700/50 p-4">
            <div>
              <p className="font-medium">Bachelor of Computer Science</p>
              <p className="text-sm text-gray-400">{shortenAddress('8xyt4aCBQNQs1jHWqRQRVNQCUE1nJD3XAcZCJJKHVp2E')}</p>
            </div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}