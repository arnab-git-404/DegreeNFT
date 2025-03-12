import React, { useState, useEffect } from 'react';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';

const DiplomaVerification = () => {
  const [connection, setConnection] = useState(null);
  const [metaplex, setMetaplex] = useState(null);
  const [nftAddress, setNftAddress] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Initialize connection and Metaplex
  useEffect(() => {
    const newConnection = new Connection(clusterApiUrl('testnet'), 'confirmed');
    setConnection(newConnection);
    
    const newMetaplex = Metaplex.make(newConnection);
    setMetaplex(newMetaplex);
  }, []);
  
  // Verify the diploma NFT
  const verifyDiploma = async (e) => {
    e.preventDefault();
    
    if (!isValidAddress(nftAddress)) {
      setError('Please enter a valid Solana address');
      setVerificationResult(null);
      return;
    }
    
    setIsLoading(true);
    setError('');
    setVerificationResult(null);
    
    try {
      const mintAddress = new PublicKey(nftAddress);
      
      // Fetch NFT data
      const nft = await metaplex.nfts().findByMint({ mintAddress });
      
      if (!nft.uri) {
        throw new Error("No metadata URI found for this NFT");
      }
      
      // Fetch metadata
      const response = await fetch(nft.uri);
      const metadata = await response.json();
      
      // Verify this is a diploma NFT by checking for required attributes
      const requiredAttributes = ["Student Name", "Student ID", "Program", "Major", "University"];
      const hasRequiredAttributes = requiredAttributes.every(attr => 
        metadata.attributes && metadata.attributes.some(a => a.trait_type === attr)
      );
      
      if (!hasRequiredAttributes) {
        throw new Error("This NFT does not appear to be a valid diploma");
      }
      
      setVerificationResult({
        isVerified: true,
        metadata,
        nft,
        ownerAddress: nft.ownerAddress?.toString() || "Unknown"
      });
    } catch (error) {
      console.error("Error verifying diploma NFT:", error);
      setError(error.message || "Failed to verify diploma NFT");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper to find attribute value in metadata
  const getAttributeValue = (attributeName) => {
    if (!verificationResult || !verificationResult.metadata || !verificationResult.metadata.attributes) {
      return "N/A";
    }
    
    const attribute = verificationResult.metadata.attributes.find(
      attr => attr.trait_type === attributeName
    );
    
    return attribute ? attribute.value : "N/A";
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
    <div className="diploma-verification-container">
      <h2>Diploma Verification Portal</h2>
      <p>Verify the authenticity of a diploma by entering its NFT address.</p>
      
      <form onSubmit={verifyDiploma} className="verification-form">
        <div className="form-group">
          <label>NFT Address:</label>
          <input
            type="text"
            value={nftAddress}
            onChange={(e) => setNftAddress(e.target.value)}
            placeholder="Enter the diploma NFT address"
            required
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify Diploma'}
        </button>
      </form>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {verificationResult && verificationResult.isVerified && (
        <div className="verification-result">
          <h3>✅ Verified Diploma</h3>
          
          <div className="diploma-details">
            <div className="detail-row">
              <strong>Student Name:</strong>
              <span>{getAttributeValue("Student Name")}</span>
            </div>
            
            <div className="detail-row">
              <strong>Student ID:</strong>
              <span>{getAttributeValue("Student ID")}</span>
            </div>
            
            <div className="detail-row">
              <strong>Program:</strong>
              <span>{getAttributeValue("Program")}</span>
            </div>
            
            <div className="detail-row">
              <strong>Major:</strong>
              <span>{getAttributeValue("Major")}</span>
            </div>
            
            <div className="detail-row">
              <strong>University:</strong>
              <span>{getAttributeValue("University")}</span>
            </div>
            
            <div className="detail-row">
              <strong>Graduation Date:</strong>
              <span>{getAttributeValue("Graduation Date")}</span>
            </div>
            
            <div className="detail-row">
              <strong>Honors:</strong>
              <span>{getAttributeValue("Honors")}</span>
            </div>
            
            <div className="detail-row">
              <strong>Issue Date:</strong>
              <span>{getAttributeValue("Issue Date")}</span>
            </div>
            
            <div className="detail-row">
              <strong>NFT Owner:</strong>
              <span>{verificationResult.ownerAddress}</span>
            </div>
          </div>
          
          <div className="verification-links">
            <a 
              href={`https://explorer.solana.com/address/${nftAddress}?cluster=testnet`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              View on Solana Explorer
            </a>
            
            {verificationResult.metadata.image && (
              <a 
                href={verificationResult.metadata.image} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View Diploma Image
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiplomaVerification;