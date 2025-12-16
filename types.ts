export interface AdCopy {
  headline: string;
  description: string;
  callToAction: string;
  hashtags: string[];
  visualPrompt: string; // Internal use for image generation
}

export interface GeneratedAd {
  copy: AdCopy | null;
  imageUrl: string | null;
}

export interface AdStyle {
  id: string;
  label: string;
  prompt: string;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "16:9" | "9:16";
export type Resolution = "1K" | "2K" | "4K";

export const AD_STYLES: AdStyle[] = [
  { id: 'auto', label: '✨ Auto-Match Product', prompt: 'Analyze the product type thoroughly. Create a background setting that is the most natural, logical, and enhancing environment for this specific item. (e.g., if coffee -> cozy cafe table; if sneakers -> urban street or track). The theme must match the product function.' },
  { id: 'model', label: 'Fashion Model / On-Body', prompt: 'A professional fashion model wearing or holding the product. The model should have a look that fits the product aesthetic. Professional studio fashion photography, high detailed skin texture, realistic draping and fit.' },
  { id: 'minimalist', label: 'Minimalist Studio', prompt: 'clean, minimal, studio lighting, soft shadows, solid pastel background' },
  { id: 'luxury', label: 'Luxury & Elegant', prompt: 'elegant, sophisticated, dark moody lighting, gold accents, premium texture background' },
  { id: 'nature', label: 'Nature & Organic', prompt: 'natural sunlight, outdoor setting, greenery, wood textures, fresh atmosphere' },
  { id: 'cyberpunk', label: 'Neon / Cyberpunk', prompt: 'neon lights, futuristic, cyberpunk city background, vibrant colors, dramatic contrast' },
  { id: 'lifestyle', label: 'Lifestyle / Home', prompt: 'cozy home environment, warm lighting, lived-in feel, blurred background, interior design context' },
  { id: 'vintage', label: 'Vintage / Retro', prompt: 'vintage aesthetic, 80s retro style, warm film grain, nostalgic lighting, old school vibe' },
  { id: 'industrial', label: 'Industrial / Raw', prompt: 'raw concrete walls, metal textures, dramatic shadows, industrial warehouse setting, cold lighting' },
  { id: 'pastel', label: 'Pastel Dream', prompt: 'soft pastel colors, dreamy atmosphere, ethereal lighting, soft focus, cotton candy clouds background' },
  { id: 'urban', label: 'Urban / Street', prompt: 'urban city street, graffiti wall background, asphalt texture, city lights bokeh, edgy modern vibe' },
  { id: 'summer', label: 'Summer / Beach', prompt: 'sunny beach background, bright blue ocean, golden sand, tropical leaves, bright natural daylight' },
  { id: 'christmas', label: 'Festive / Holiday', prompt: 'festive holiday atmosphere, warm fairy lights, bokeh, rich red and gold tones, celebration mood' },
];