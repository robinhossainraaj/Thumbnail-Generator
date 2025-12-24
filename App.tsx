
import React, { useState, useCallback } from 'react';
import { 
  EMOTIONS, 
  LIGHTING_THEMES, 
  POSES, 
  GENDERS, 
  ETHNICITIES, 
  AGES, 
  BG_COLORS, 
  LIGHT_ANGLES, 
  POSITIONS 
} from './constants';
import { ThumbnailConfig, Category, Option } from './types';
import { generateThumbnail } from './services/geminiService';

const App: React.FC = () => {
  const [config, setConfig] = useState<ThumbnailConfig>({
    emotion: 'peaceful',
    lightingTheme: 'soft-glow',
    pose: 'hands-clasped-face',
    gender: 'female',
    ethnicity: 'caucasian',
    age: 'young-adult',
    backgroundColor: 'soft-blue',
    lightingDirection: 'backlight',
    lightAngle: 'overhead',
    position: 'right',
    lightIntensity: 50,
  });

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptionSelect = (category: Category, value: string) => {
    setConfig(prev => ({ ...prev, [category]: value }));
  };

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({ ...prev, lightIntensity: parseInt(e.target.value) }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const imageUrl = await generateThumbnail(config);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError("Failed to generate thumbnail. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `prayer-thumbnail-${Date.now()}.png`;
    link.click();
  };

  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3 px-1">{children}</h3>
  );

  const Selector: React.FC<{ 
    category: Category; 
    options: Option[]; 
    currentValue: string; 
  }> = ({ category, options, currentValue }) => (
    <div className="flex flex-wrap gap-2 mb-6">
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => handleOptionSelect(category, opt.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            currentValue === opt.id 
              ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
              : 'bg-zinc-900 text-gray-400 border-zinc-800 hover:border-zinc-600'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="max-w-6xl w-full mb-12 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-blue-400 mb-4 tracking-widest uppercase">
          Studio Edition
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Divine<span className="text-blue-500">Thumb</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Craft cinematic, high-impact prayer thumbnails for YouTube. Advanced lighting, precise emotions, total control.
        </p>
      </header>

      <main className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Configuration */}
        <div className="space-y-8 pb-32">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl">
            
            <section>
              <SectionTitle>1. Facial Emotion</SectionTitle>
              <Selector category="emotion" options={EMOTIONS} currentValue={config.emotion} />
            </section>

            <section>
              <SectionTitle>2. Prayer Pose</SectionTitle>
              <Selector category="pose" options={POSES} currentValue={config.pose} />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <SectionTitle>3. Gender</SectionTitle>
                <Selector category="gender" options={GENDERS} currentValue={config.gender} />
              </section>
              <section>
                <SectionTitle>4. Age</SectionTitle>
                <Selector category="age" options={AGES} currentValue={config.age} />
              </section>
            </div>

            <section>
              <SectionTitle>5. Ethnicity</SectionTitle>
              <Selector category="ethnicity" options={ETHNICITIES} currentValue={config.ethnicity} />
            </section>

            <section>
              <SectionTitle>6. Lighting & Theme</SectionTitle>
              <Selector category="lightingTheme" options={LIGHTING_THEMES} currentValue={config.lightingTheme} />
            </section>

            <section>
              <SectionTitle>7. Background Color</SectionTitle>
              <Selector category="backgroundColor" options={BG_COLORS} currentValue={config.backgroundColor} />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <SectionTitle>8. Light Angle</SectionTitle>
                <Selector category="lightAngle" options={LIGHT_ANGLES} currentValue={config.lightAngle} />
              </section>
              <section>
                <SectionTitle>9. Position</SectionTitle>
                <Selector category="position" options={POSITIONS} currentValue={config.position} />
              </section>
            </div>

            <section className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
              <div className="flex justify-between items-center mb-4">
                <SectionTitle>10. Light Intensity Control</SectionTitle>
                <span className="text-white font-mono text-sm">{config.lightIntensity}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={config.lightIntensity}
                onChange={handleIntensityChange}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <p className="text-xs text-gray-500 mt-3 italic">
                Controls the exposure and softness of the backlight. Lower values ensure maximum character visibility.
              </p>
            </section>
          </div>
        </div>

        {/* Right: Preview (Sticky) */}
        <div className="lg:sticky lg:top-8 h-fit space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative group">
            <div className="aspect-video bg-zinc-950 flex items-center justify-center relative">
              {generatedImage ? (
                <img src={generatedImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-8">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-400 animate-pulse font-medium">Generating Divine Masterpiece...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-zinc-500 font-medium">Your preview will appear here</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8 text-center">
                <div className="space-y-4">
                  <p className="text-red-400 font-medium">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="px-6 py-2 bg-zinc-800 text-white rounded-full text-sm font-bold border border-zinc-700"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`flex-1 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                isGenerating 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                : 'bg-white text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
              }`}
            >
              {isGenerating ? (
                <>Processing...</>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
                  </svg>
                  Generate Thumbnail
                </>
              )}
            </button>
            
            {generatedImage && (
              <button
                onClick={downloadImage}
                className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-white hover:bg-zinc-800 transition-all active:scale-90"
                title="Download PNG"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            )}
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 flex gap-4 items-start">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-blue-200/70 leading-relaxed">
              <strong>Studio Pro Tip:</strong> For the best results, use "Backlight" with 50% intensity. This creates a halo effect that pops against the dark YouTube UI while keeping the facial features sharp.
            </p>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl w-full mt-24 py-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-zinc-500 text-sm gap-6">
        <p>&copy; 2024 DivineThumb AI Studio. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">API Status</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
