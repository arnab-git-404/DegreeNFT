import React, { useState, useEffect } from 'react';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
// import { useWallet } from '@solana/wallet-adapter-react';
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Metaplex, walletAdapterIdentity, bundlrStorage } from '@metaplex-foundation/js';

const DiplomaIssuance = () => {
  const { wallet, publicKey, connected } = useWallet();
  const [connection, setConnection] = useState(null);
  const [metaplex, setMetaplex] = useState(null);
  const [studentAddress, setStudentAddress] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [program, setProgram] = useState('');
  const [major, setMajor] = useState('');
  const [graduationDate, setGraduationDate] = useState('');
  const [issuanceStatus, setIssuanceStatus] = useState('');
  const [nftAddress, setNftAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // University information
  const universityInfo = {
    name: "Example University",
    accreditationId: "ACCR-123456",
    location: "San Francisco, CA"
  };
  
  // Initialize connection and Metaplex
  useEffect(() => {
    const newConnection = new Connection(clusterApiUrl('testnet'), 'confirmed');
    setConnection(newConnection);
    
    if (wallet && connected) {
      const newMetaplex = Metaplex.make(newConnection)
        .use(walletAdapterIdentity(wallet.adapter))
        .use(bundlrStorage({
          address: 'https://devnet.bundlr.network',
          providerUrl: 'https://api.testnet.solana.com',
          timeout: 60000,
        }));
      
      setMetaplex(newMetaplex);
    }
  }, [wallet, connected]);
  
  // Create metadata and mint NFT
  const issueDiploma = async (e) => {
    e.preventDefault();
    
    if (!connected || !metaplex) {
      setIssuanceStatus('Please connect your wallet first');
      return;
    }
    
    if (!isValidAddress(studentAddress)) {
      setIssuanceStatus('Please enter a valid Solana address');
      return;
    }
    
    setIsLoading(true);
    setIssuanceStatus('Creating diploma NFT...');
    
    try {
      // Student information
      const student = {
        name: studentName,
        id: studentId,
        program,
        major,
        graduationDate
      };
      
      // University information with issue date
      const university = {
        ...universityInfo,
        issueDate: new Date().toISOString().split('T')[0]
      };
      
      // Create metadata
      const metadata = {
        name: `${university.name} - ${student.program} - ${student.name}`,
        description: `Official diploma certifying that ${student.name} has completed the requirements for ${student.program} in ${student.major} at ${university.name}.`,
        image: "https://your-university-domain.edu/diploma-template.png", // Replace with actual image
        attributes: [
          { trait_type: "Student Name", value: student.name },
          { trait_type: "Student ID", value: student.id },
          { trait_type: "Program", value: student.program },
          { trait_type: "Major", value: student.major },
          { trait_type: "Graduation Date", value: student.graduationDate },
          { trait_type: "University", value: university.name },
          { trait_type: "Accreditation ID", value: university.accreditationId },
          { trait_type: "Issue Date", value: university.issueDate }
        ]
      };
      
      // Upload metadata
      setIssuanceStatus('Uploading metadata...');
      const { uri } = await metaplex.nfts().uploadMetadata(metadata);
      
      // Mint NFT
      setIssuanceStatus('Minting NFT diploma...');
      const recipientAddress = new PublicKey(studentAddress);
      
      const { nft } = await metaplex.nfts().create({
        uri,
        name: `${university.name} - ${student.program} - ${student.name}`,
        sellerFeeBasisPoints: 0,
        tokenOwner: recipientAddress
      });
      
      setNftAddress(nft.address.toString());
      setIssuanceStatus('Diploma NFT issued successfully!');
    } catch (error) {
      console.error('Error issuing diploma:', error);
      setIssuanceStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Validate Solana address
  const isValidAddress = (address) => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  };
  
  return (
    <div className="diploma-issuance-container">
      <h2>University Diploma Issuance</h2>
      
      <div className="wallet-section">
        <h3>University Wallet</h3>
        <WalletMultiButton />
        {connected && (
          <p>Connected as: {publicKey.toString()}</p>
        )}
      </div>
      
      <form onSubmit={issueDiploma} className="issuance-form">
        <h3>Issue New Diploma</h3>
        
        <div className="form-group">
          <label>Student Wallet Address:</label>
          <input
            type="text"
            value={studentAddress}
            onChange={(e) => setStudentAddress(e.target.value)}
            placeholder="Enter student's Solana wallet address"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Student Name:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter student's full name"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Student ID:</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter student ID"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Program:</label>
          <input
            type="text"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            placeholder="e.g., Bachelor of Science"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Major:</label>
          <input
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            placeholder="e.g., Computer Science"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Graduation Date:</label>
          <input
            type="date"
            value={graduationDate}
            onChange={(e) => setGraduationDate(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={isLoading || !connected}>
          {isLoading ? 'Processing...' : 'Issue Diploma NFT'}
        </button>
      </form>
      
      {issuanceStatus && (
        <div className="status-section ">
          <h3>Status</h3>
          <p>{issuanceStatus}</p>
          {nftAddress && (
            <div>
              <p>NFT Address: {nftAddress}</p>
              <a 
                href={`https://explorer.solana.com/address/${nftAddress}?cluster=testnet`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View on Solana Explorer
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiplomaIssuance;