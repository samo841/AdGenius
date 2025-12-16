import React, { useState, useEffect, useRef } from 'react';
import { Key, AlertCircle, ArrowRight, FileText, CheckCircle2, Sparkles, Layers, Zap, Ratio, MonitorPlay } from 'lucide-react';
import ProductUploader, { UploadedImage } from './components/ProductUploader';
import AdResult from './components/AdResult';
import { generateAdCopy, generateAdImage } from './services/geminiService';
import { AdCopy, AD_STYLES, AdStyle, AspectRatio, Resolution } from './types';

const App: React.FC = () => {
  // State
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<AdStyle>(AD_STYLES[0]);
  
  // New State for Settings
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [resolution, setResolution] = useState<Resolution>("1K");

  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [generatedCopy, setGeneratedCopy] = useState<AdCopy | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toolSectionRef = useRef<HTMLDivElement>(null);

  // Check API Key on Mount
  useEffect(() => {
    const checkApiKey = async () => {
      // @ts-ignore
      if (window.aistudio?.hasSelectedApiKey) {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeyReady(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio?.openSelectKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setApiKeyReady(true);
      setError(null);
    } else {
      setError("AI Studio environment not detected.");
    }
  };

  const handleImagesChange = (images: UploadedImage[]) => {
    setUploadedImages(images);
    setGeneratedCopy(null);
    setGeneratedImage(null);
    setError(null);
  };

  const scrollToTool = () => {
    toolSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerate = async () => {
    if (uploadedImages.length === 0 || !apiKeyReady) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedCopy(null);
    setGeneratedImage(null);
    
    // Scroll to tool view if not already there
    scrollToTool();

    try {
      const imageInputs = uploadedImages.map(img => ({
        data: img.preview.split(',')[1],
        mimeType: img.file.type
      }));

      setStatusMessage("Analyzing product...");
      const copy = await generateAdCopy(imageInputs, selectedStyle.prompt);
      setGeneratedCopy(copy);

      setStatusMessage("Generating visuals...");
      // Pass the new settings to the service
      const imageUrl = await generateAdImage(imageInputs, copy.visualPrompt, aspectRatio, resolution);
      setGeneratedImage(imageUrl);

    } catch (err: any) {
      console.error(err);
      let msg = "An unexpected error occurred.";
      if (err.message.includes("403") || err.message.includes("key")) {
        msg = "API Key Error. Please ensure you have selected a valid paid project key.";
        setApiKeyReady(false);
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setIsGenerating(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      
      {/* Navbar */}
      <nav className="w-full border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="bg-black text-white p-1.5 rounded-sm">
            <FileText size={20} />
          </div>
          <span>AdGenius</span>
        </div>
        <button 
          onClick={handleSelectKey}
          className="bg-black text-white px-5 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2"
        >
          <Sparkles size={16} />
          {apiKeyReady ? 'API Connected' : 'Get Started'}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="bg-black text-white text-xs font-bold px-3 py-1.5 uppercase tracking-wider inline-block mb-6">
            AI-Powered Marketing Tool
          </span>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 max-w-4xl">
            Create Better Ads, <br />
            <span className="bg-black text-white px-2 inline-block transform -rotate-1 mt-2">Faster.</span>
          </h1>
          <p className="text-xl text-neutral-500 max-w-2xl leading-relaxed mb-10">
            The all-in-one platform for e-commerce brands to create plagiarism-free, 
            perfectly styled product ads with AI assistance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={scrollToTool}
              className="bg-black text-white px-8 py-4 text-base font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group"
            >
              Start Creating Free 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={scrollToTool}
              className="bg-white text-black border-2 border-black px-8 py-4 text-base font-bold hover:bg-gray-50 transition-colors"
            >
              Try Ad Generator
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold mb-1">50K+</div>
              <div className="text-neutral-500 text-sm font-medium uppercase tracking-wide">Brands</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold mb-1">1M+</div>
              <div className="text-neutral-500 text-sm font-medium uppercase tracking-wide">Ads Generated</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold mb-1">99.2%</div>
              <div className="text-neutral-500 text-sm font-medium uppercase tracking-wide">Conversion</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold mb-1">{AD_STYLES.length}</div>
              <div className="text-neutral-500 text-sm font-medium uppercase tracking-wide">Art Styles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Section */}
      <div ref={toolSectionRef} className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        
        {/* API Warning */}
        {!apiKeyReady && (
          <div className="mb-12 p-6 border-2 border-black bg-yellow-50 flex items-start gap-4">
            <Key className="mt-1" />
            <div>
              <h3 className="font-bold text-lg">API Key Required</h3>
              <p className="text-neutral-600 mb-4">You need a paid Google Cloud Project API key to use the generative features.</p>
              <button onClick={handleSelectKey} className="text-sm font-bold underline">Connect Key</button>
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 ${!apiKeyReady ? 'opacity-50 pointer-events-none' : ''}`}>
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Step 1: Upload */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                 <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold rounded-sm">1</div>
                 <h2 className="text-2xl font-bold">Upload Product</h2>
              </div>
              <ProductUploader 
                onImagesChange={handleImagesChange}
                images={uploadedImages}
                disabled={isGenerating}
              />
            </section>

            {/* Step 2: Style */}
            <section>
               <div className="flex items-center gap-3 mb-6">
                 <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold rounded-sm">2</div>
                 <h2 className="text-2xl font-bold">Select Style</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar border-b border-gray-100 pb-4">
                {AD_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    disabled={isGenerating}
                    className={`
                      p-4 text-left border-2 transition-all duration-200 group
                      ${selectedStyle.id === style.id 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-200 hover:border-black text-gray-600 hover:text-black'}
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">{style.label}</span>
                      {selectedStyle.id === style.id && <CheckCircle2 size={16} />}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 3: Configuration (Aspect Ratio & Quality) */}
            <section>
               <div className="flex items-center gap-3 mb-6">
                 <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold rounded-sm">3</div>
                 <h2 className="text-2xl font-bold">Settings</h2>
              </div>
              
              <div className="space-y-6">
                {/* Aspect Ratio */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
                    <Ratio size={14} /> Aspect Ratio
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(["1:1", "3:4", "4:3", "16:9", "9:16"] as AspectRatio[]).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        disabled={isGenerating}
                        className={`
                          px-4 py-2 text-sm font-bold border-2 transition-colors
                          ${aspectRatio === ratio 
                            ? 'border-black bg-black text-white' 
                            : 'border-gray-200 text-gray-600 hover:border-black hover:text-black'}
                        `}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resolution */}
                <div>
                   <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
                    <MonitorPlay size={14} /> Resolution
                  </label>
                   <div className="flex gap-4">
                    {(["1K", "4K"] as Resolution[]).map((res) => (
                      <button
                        key={res}
                        onClick={() => setResolution(res)}
                        disabled={isGenerating}
                        className={`
                          flex-1 px-4 py-3 text-sm font-bold border-2 transition-all flex items-center justify-center gap-2
                          ${resolution === res
                            ? 'border-black bg-black text-white shadow-md' 
                            : 'border-gray-200 text-gray-600 hover:border-black hover:text-black'}
                        `}
                      >
                        {res}
                        {res === "4K" && <span className="px-1.5 py-0.5 bg-yellow-400 text-black text-[10px] rounded-sm">ULTRA</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Generate Action */}
            <button
              onClick={handleGenerate}
              disabled={uploadedImages.length === 0 || isGenerating}
              className={`
                w-full py-5 px-6 font-bold text-lg transition-all
                flex items-center justify-center gap-3 border-2
                ${uploadedImages.length === 0 || isGenerating
                  ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                  : 'bg-black text-white border-black hover:bg-white hover:text-black'}
              `}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  PROCESSING...
                </>
              ) : (
                <>
                  GENERATE AD
                  <Zap size={20} fill="currentColor" />
                </>
              )}
            </button>
            
            {error && (
              <div className="p-4 bg-red-50 text-red-700 border-l-4 border-red-500 flex items-start gap-3">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-7">
             <div className="flex items-center gap-3 mb-6">
                 <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold rounded-sm">4</div>
                 <h2 className="text-2xl font-bold">Results</h2>
              </div>
            <div className="border-2 border-black min-h-[600px] bg-white p-2">
              <AdResult 
                isLoading={isGenerating}
                adCopy={generatedCopy}
                adImage={generatedImage}
                statusMessage={statusMessage}
              />
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 font-bold mb-4 md:mb-0">
             <div className="bg-black text-white p-1 rounded-sm">
                <FileText size={16} />
              </div>
            AdGenius
          </div>
          <p className="text-gray-500 text-sm font-medium">© {new Date().getFullYear()} AdGenius Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;