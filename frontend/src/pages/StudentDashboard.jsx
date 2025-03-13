import { useWallet } from '@solana/wallet-adapter-react';
import { UserCheck, ExternalLink } from 'lucide-react';
// import { shortenAddress } from '@/lib/utils';
import { shortenAddress } from '../lib/utils';

// import { getExplorerUrl } from '@/lib/solana';
import { getExplorerUrl } from '../lib/solana';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function StudentDashboard() {
  const { connected, publicKey } = useWallet();
  
  if (!connected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <UserCheck className="h-16 w-16 text-indigo-500" />
        <h2 className="mt-4 text-2xl font-bold">Student Dashboard</h2>
        <p className="mt-2 text-gray-400">Connect your wallet to view your credentials</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Credentials</h2>
          <p className="mt-1 text-gray-400">
            Connected as: {shortenAddress(publicKey?.toBase58() || '')}
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold">Bachelor of Computer Science</h3>
              <p className="mt-1 text-sm text-gray-400">Issued by: {shortenAddress('8xyt4aCBQNQs1jHWqRQRVNQCUE1nJD3XAcZCJJKHVp2E')}</p>
              <p className="mt-2 text-sm text-gray-400">Issue Date: March 15, 2024</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(getExplorerUrl(publicKey?.toBase58() || ''), '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Explorer
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
        <h3 className="text-xl font-semibold">Pending Credentials</h3>
        <div className="mt-4">
          <p className="text-gray-400">No pending credentials found.</p>
        </div>
      </div>
    </div>
  );
}