// 2nd Edition - 2.56pm - 12/03/25
import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { GraduationCap } from 'lucide-react';

export function WalletButton() {
  const { connected } = useWallet();
  
  return (
    <div className="wallet-button-wrapper">
      {/* Custom styling for the Wallet Adapter UI component */}
      <div className="relative">
        <WalletMultiButton 
          className={`
            !bg-gradient-to-r !from-indigo-600 !to-indigo-500 !transition-all
            !rounded-lg !border-0 !h-auto 
            md:!py-2 md:!px-4 
            !py-1.5 !px-2 !text-sm md:!text-base
            hover:!shadow-md hover:!from-indigo-700 hover:!to-indigo-600
            flex items-center
          `}
        >

            {!connected && (
            <span className="md:hidden mr-1">
              <GraduationCap className="h-4 w-4" />
            </span>

          ) }

          <span className='hidden md:inline' >
            {connected ? "Connected" : "Connect Wallet"}
          </span>

          <span className='md:hidden'>
            {connected ? "Connected" : "Connect"}
          </span>


        
        </WalletMultiButton>
      
      </div>
    </div>
  );
}


// 1st Edition - 2.56pm - 12/03/25
// import { useWallet } from '@solana/wallet-adapter-react';
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import { cn } from '../lib/utils';

// export function WalletButton({ className }) {
//   const { connected } = useWallet();

//   return (
//     <WalletMultiButton
//       className={cn(
//         '!bg-indigo-600 hover:!bg-indigo-700',
//         connected && '!bg-green-600 hover:!bg-green-700',
//         className
//       )}
//     />
//   );
// }
