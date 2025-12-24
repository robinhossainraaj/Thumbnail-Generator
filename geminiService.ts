
import { GoogleGenAI } from "@google/genai";
import { ThumbnailConfig } from "../types";

export const generateThumbnail = async (config: ThumbnailConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const intensityMap: Record<number, string> = {
    0: "barely visible, subtle glow",
    25: "very soft, dim illumination",
    50: "gentle, balanced light",
    75: "clear, pronounced backlight",
    100: "vibrant, radiant divine light"
  };

  const getIntensityText = (val: number) => {
    if (val < 20) return intensityMap[0];
    if (val < 40) return intensityMap[25];
    if (val < 60) return intensityMap[50];
    if (val < 85) return intensityMap[75];
    return intensityMap[100];
  };

  const prompt = `A professional high-resolution YouTube thumbnail, 16:9 aspect ratio. 
    Character: A ${config.age} ${config.ethnicity} ${config.gender}.
    Facial Expression: ${config.emotion}.
    Pose: ${config.pose}.
    Position: Placed at the ${config.position} of the frame.
    Background: ${config.backgroundColor} environment with ${config.lightingTheme} lighting.
    Lighting: Light coming from a ${config.lightAngle} behind the character.
    Light Intensity: ${getIntensityText(config.lightIntensity)}. 
    Visual Style: Cinematic, spiritual, high-quality photography, peaceful atmosphere.
    CRITICAL: The light must be soft and gentle, ensuring the character's face is clearly visible, properly illuminated, and NOT overexposed. 
    NO TEXT, NO TITLES, NO GRAPHICS. Pure character and atmosphere.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    const candidates = response.candidates?.[0]?.content?.parts;
    if (!candidates) throw new Error("No candidates returned from API");

    const imagePart = candidates.find(part => part.inlineData);
    if (!imagePart || !imagePart.inlineData) {
      throw new Error("No image data found in response");
    }

    return `data:image/png;base64,${imagePart.inlineData.data}`;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
