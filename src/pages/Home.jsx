import { Link } from 'react-router-dom';
import { GraduationCap, School, UserCheck, Shield } from 'lucide-react';
import {Button} from '../components/Button';


export function Home() {
  return (
    <div className="space-y-10  ">
      <section className="py-10 text-center">
        <GraduationCap className="mx-auto h-20 w-20 text-indigo-500" />
        <h1 className="mt-8 text-4xl font-bold sm:text-6xl">
          Secure Academic Credentials
          <span className="block text-indigo-500">on the Solana Blockchain</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
          A decentralized platform for universities to issue and verify academic credentials
          using non-transferable NFTs on the Solana blockchain.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/university">
            
            <Button className=' text-lg hover:cursor-pointer ' >For Universities</Button>
          </Link>
          <Link to="/student">
            
            <Button className='text-lg hover:cursor-pointer ' >For Students</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-7xl">
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
          <School className="h-12 w-12 text-indigo-500" />
          <h3 className="mt-4 text-xl font-semibold">For Universities</h3>
          <p className="mt-2 text-gray-400">
            Issue tamper-proof digital credentials as non-transferable NFTs on the Solana blockchain.
          </p>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
          
          <UserCheck className="h-12 w-12 text-indigo-500" />
          <h3 className="mt-4 text-xl font-semibold">For Students</h3>

          <p className="mt-2 text-gray-400">
            Receive and manage your academic credentials in your Solana wallet.
          </p>
        </div>
        
        
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
          <Shield className="h-12 w-12 text-indigo-500" />
          <h3 className="mt-4 text-xl font-semibold">Verification</h3>
          <p className="mt-2 text-gray-400">
            Instantly verify the authenticity of academic credentials on the blockchain.
          </p>
        </div>
      </section>
    </div>
  );
}