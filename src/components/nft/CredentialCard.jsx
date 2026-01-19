import React, { useState, useEffect } from 'react';
import { Calendar, ExternalLink, Loader2, Award, GraduationCap } from 'lucide-react';
import { set } from '@metaplex-foundation/umi/serializers';

export function CredentialCard({ nft, metadataDetails, getNftExplorerLink }) {
  const [metadata, setMetadata] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!nft.uri) return;
      
      setLoadingMetadata(true);
      try {
        const response = await fetch(nft.uri);
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      } finally {
        setLoadingMetadata(false);
      }
    };

    fetchMetadata();
  }, [nft.uri]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/60 p-5 hover:border-indigo-600 hover:shadow-lg transition-all cursor-pointer group">
      {/* NFT Image */}
      {(nft.image || metadata?.image) && (
        <div className="h-48 w-full overflow-hidden rounded-md mb-4 bg-gray-700/50 relative">
          <img
            src={nft.image || metadata?.image}
            alt={nft.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {!nft.image && !metadata?.image && (
            <div className="flex items-center justify-center h-full">
              <GraduationCap className="h-16 w-16 text-gray-600" />
            </div>
          )}
        </div>
      )}

      {/* NFT Info */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-indigo-300 group-hover:text-indigo-200 transition-colors">
          {nft.name}
        </h4>
        <p className="text-sm text-gray-400">{nft.symbol}</p>

        {/* Description */}
        {metadata?.description && (
          <p className="text-xs text-gray-500 line-clamp-2 pt-2">
            {metadata.description}
          </p>
        )}

        {/* Key Attributes */}
        {loadingMetadata ? (
          <div className="flex items-center py-2">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-500 mr-2" />
            <span className="text-xs text-gray-400">Loading details...</span>
          </div>
        ) : metadata?.attributes && (
          <div className="pt-3 space-y-1.5 border-t border-gray-700/50">
            {metadata.attributes.slice(0, 3).map((attr, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-gray-500">{attr.trait_type}:</span>
                <span className="text-gray-300 font-medium">{attr.value}</span>
              </div>
            ))}
            {metadata.attributes.length > 3 && (
              <p className="text-xs text-indigo-400 pt-1">
                +{metadata.attributes.length - 3} more details
              </p>
            )}
          </div>
        )}

        {/* Dates */}
        <div className="pt-3 space-y-1.5 border-t border-gray-700/50">
          {nft.allocatedAt && (
            <p className="text-xs text-gray-500 flex items-center">
              <Calendar className="h-3 w-3 mr-1.5" />
              Issued: {new Date(nft.allocatedAt).toLocaleDateString()}
            </p>
          )}

          {nft.mintedAt && (
            <p className="text-xs text-gray-500 flex items-center">
              <Award className="h-3 w-3 mr-1.5" />
              Minted: {new Date(nft.mintedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 flex gap-2">
          <a
            href={getNftExplorerLink(nft.nftAddress, nft.signature, "address")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-600/50 rounded-md text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-1.5"
          >
            View on Explorer
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}