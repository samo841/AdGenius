import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AdCopy, AspectRatio, Resolution } from "../types";

// Helper to clean JSON string if markdown code blocks are present
const cleanJsonString = (str: string): string => {
  return str.replace(/```json/g, '').replace(/```/g, '').trim();
};

export interface ImageInput {
  data: string;
  mimeType: string;
}

export const generateAdCopy = async (
  images: ImageInput[],
  stylePrompt: string
): Promise<AdCopy> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `You are a world-class marketing copywriter and art director. 
  Your goal is to analyze product images and a requested style, then generate catchy ad copy and a visual description for an image generator.
  
  Output MUST be valid JSON.`;

  const prompt = `Analyze these product images (variations/angles of the same product). The desired style is: "${stylePrompt}".
  
  1. Write a punchy Headline (max 8 words).
  2. Write a persuasive Description (max 25 words).
  3. Write a short Call to Action (CTA).
  4. Provide 3 relevant hashtags.
  5. Write a detailed "visualPrompt" that describes a scene to place this product in. 
     This visualPrompt will be used by an AI image generator to create a new background/scene for the product.
     
     CRITICAL INSTRUCTION: The scene MUST be relevant to the product's function and identity. 
     If the style is "Auto-Match", derive the scene entirely from the product (e.g., hiking boots -> mountain path). 
     If a specific style is chosen (e.g., "Neon"), apply that style TO a relevant setting (e.g., hiking boots -> mountain path with neon lighting accents).
     Do not describe the product itself in detail, just refer to it as "the product".`;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      headline: { type: Type.STRING },
      description: { type: Type.STRING },
      callToAction: { type: Type.STRING },
      hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
      visualPrompt: { type: Type.STRING },
    },
    required: ["headline", "description", "callToAction", "hashtags", "visualPrompt"],
  };

  const imageParts = images.map(img => ({
    inlineData: { data: img.data, mimeType: img.mimeType }
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using Flash for fast text/reasoning
      contents: {
        parts: [
          ...imageParts,
          { text: prompt }
        ]
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text response from Gemini");
    
    return JSON.parse(cleanJsonString(text)) as AdCopy;
  } catch (error) {
    console.error("Error generating ad copy:", error);
    throw error;
  }
};

export const generateAdImage = async (
  images: ImageInput[],
  visualPrompt: string,
  aspectRatio: AspectRatio,
  resolution: Resolution
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Nano Banana Pro / Gemini 3 Pro Image Preview
  // Capable of high-fidelity image generation/editing
  const modelId = 'gemini-3-pro-image-preview';

  const fullPrompt = `Create a high-quality, photorealistic product advertisement image. 
  Use the provided image(s) as the reference for the main product. 
  Place the product in the following scene: ${visualPrompt}.
  Ensure the product looks natural in the environment with correct lighting and shadows.
  Maintain the product's original appearance as much as possible.
  Professional photography, ${resolution} resolution.`;

  const imageParts = images.map(img => ({
    inlineData: { data: img.data, mimeType: img.mimeType }
  }));

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { text: fullPrompt },
          ...imageParts
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: resolution,
        }
      }
    });

    // Extract image from response
    // The response structure for image generation contains inlineData in the parts
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated in response");

  } catch (error) {
    console.error("Error generating ad image:", error);
    throw error;
  }
};