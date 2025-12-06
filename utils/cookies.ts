// Cookie management utilities
export type FontSize = 'small' | 'medium' | 'large';

export interface UserSettings {
  fontSize: FontSize;
}

const defaultSettings: UserSettings = {
  fontSize: 'medium'
};

const COOKIE_NAME = 'solar-atap-settings';

export function getSettings(): UserSettings {
  if (typeof window === 'undefined') return defaultSettings;
  
  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${COOKIE_NAME}=`));
    
    if (!cookie) return defaultSettings;
    
    const decoded = decodeURIComponent(cookie.split('=')[1]);
    const settings = JSON.parse(decoded) as UserSettings;
    
    return { ...defaultSettings, ...settings };
  } catch (error) {
    console.error('Error reading settings cookie:', error);
    return defaultSettings;
  }
}

export function setSettings(settings: Partial<UserSettings>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const currentSettings = getSettings();
    const newSettings = { ...currentSettings, ...settings };
    
    const cookieValue = JSON.stringify(newSettings);
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1); // 1 year from now
    
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(cookieValue)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
  } catch (error) {
    console.error('Error writing settings cookie:', error);
  }
}

export function getFontSizeClass(fontSize: FontSize): string {
  switch (fontSize) {
    case 'small':
      return 'text-sm';
    case 'large':
      return 'text-lg';
    default:
      return 'text-base';
  }
}
