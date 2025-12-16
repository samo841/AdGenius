import React from 'react';
import { Download, Copy, Image as ImageIcon, Type, ExternalLink } from 'lucide-react';
import { AdCopy } from '../types';

interface AdResultProps {
  isLoading: boolean;
  adCopy: AdCopy | null;
  adImage: string | null;
  statusMessage: string;
}

const AdResult: React.FC<AdResultProps> = ({ isLoading, adCopy, adImage, statusMessage }) => {
  
  // Custom Empty State: Inspiration Gallery
  if (!isLoading && !adCopy && !adImage) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50/50">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center mx-auto mb-6">
            <ImageIcon size={32} className="text-black" />
          </div>
          <h3 className="text-2xl font-extrabold text-black mb-3">Ready to Create?</h3>
          <p className="text-neutral-500 font-medium max-w-sm mx-auto">
            Upload a product and select a style to generate your first ad campaign.
          </p>
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading && !adImage) {
     return (
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-white">
           <div className="relative mb-8">
             <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
           </div>
           <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-wide">Generating Assets</h3>
           <p className="text-neutral-500 font-mono text-sm animate-pulse">
             [{statusMessage || "PROCESSING_REQUEST..."}]
           </p>
        </div>
     );
  }

  // Result State
  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto custom-scrollbar">
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 border border-gray-200 group">
        {adImage ? (
          <>
            <img src={adImage} alt="Generated Ad" className="w-full h-full object-cover" />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
              <a 
                href={adImage} 
                download="ad-genius-pro.png"
                className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors"
                title="Download Image"
              >
                <Download size={16} />
                <span>DOWNLOAD</span>
              </a>
            </div>
          </>
        ) : null}
      </div>

      {/* Copy Section */}
      {adCopy && (
        <div className="bg-white border-t-2 border-black pt-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2 text-black">
                <Type size={20} />
                <h3 className="font-bold uppercase tracking-wider">Generated Copy</h3>
            </div>
             <button 
              className="text-black hover:text-gray-600 font-bold text-sm flex items-center gap-1 uppercase"
              onClick={() => {
                const text = `${adCopy.headline}\n\n${adCopy.description}\n\n${adCopy.callToAction}\n\n${adCopy.hashtags.join(' ')}`;
                navigator.clipboard.writeText(text);
              }}
              title="Copy all text"
            >
              <Copy size={16} />
              Copy Text
            </button>
          </div>
          
          <div className="space-y-8">
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Headline</label>
                <p className="text-4xl font-extrabold text-black leading-tight tracking-tight">{adCopy.headline}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Description</label>
                    <p className="text-lg text-neutral-800 leading-relaxed font-medium">{adCopy.description}</p>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Call to Action</label>
                        <span className="inline-block px-4 py-2 bg-black text-white text-sm font-bold">
                            {adCopy.callToAction}
                        </span>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Hashtags</label>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm font-bold text-black">
                            {adCopy.hashtags.map((tag, i) => (
                            <span key={i} className="underline decoration-1 underline-offset-4">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default AdResult;