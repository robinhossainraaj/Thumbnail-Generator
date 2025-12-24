
export interface ThumbnailConfig {
  emotion: string;
  lightingTheme: string;
  pose: string;
  gender: string;
  ethnicity: string;
  age: string;
  backgroundColor: string;
  lightingDirection: string;
  lightAngle: string;
  position: string;
  lightIntensity: number; // 0 to 100
}

export interface Option {
  id: string;
  label: string;
  description?: string;
}

export type Category = 
  | 'emotion'
  | 'lightingTheme'
  | 'pose'
  | 'gender'
  | 'ethnicity'
  | 'age'
  | 'backgroundColor'
  | 'lightingDirection'
  | 'lightAngle'
  | 'position';
