import { NewsCategory, NewsTag, Language } from '@/types/news';

/**
 * Get category name based on language preference and available fields
 */
export function getCategoryName(category: NewsCategory, language: Language = 'en'): string {
  // Try language-specific field first (for future multilingual support)
  if (language === 'cn' && category.name_cn) {
    return category.name_cn;
  }
  if (language === 'my' && category.name_my) {
    return category.name_my;
  }
  if (language === 'en' && category.name_en) {
    return category.name_en;
  }
  
  // Fall back to the base name field (current database schema)
  return category.name || '';
}

/**
 * Get tag name based on language preference and available fields
 */
export function getTagName(tag: NewsTag, language: Language = 'en'): string {
  // Try language-specific field first (for future multilingual support)
  if (language === 'cn' && tag.name_cn) {
    return tag.name_cn;
  }
  if (language === 'my' && tag.name_my) {
    return tag.name_my;
  }
  if (language === 'en' && tag.name_en) {
    return tag.name_en;
  }
  
  // Fall back to the base name field (current database schema)
  return tag.name || '';
}

/**
 * Format category name for display in UI (with optional language indicator)
 */
export function formatCategoryDisplay(category: NewsCategory, language: Language = 'en'): string {
  const name = getCategoryName(category, language);
  
  // For debugging: show when we're using a fallback
  if (process.env.NODE_ENV === 'development') {
    const hasLanguageSpecific = language !== 'en' && category[`name_${language}` as keyof NewsCategory];
    const hasMultilingualSupport = category.name_en || category.name_cn || category.name_my;
    
    if (hasLanguageSpecific && !hasMultilingualSupport) {
      return `${name} (missing lang field)`;
    }
  }
  
  return name;
}

/**
 * Format tag name for display in UI (with optional language indicator)
 */
export function formatTagDisplay(tag: NewsTag, language: Language = 'en'): string {
  const name = getTagName(tag, language);
  
  // For debugging: show when we're using a fallback
  if (process.env.NODE_ENV === 'development') {
    const hasLanguageSpecific = language !== 'en' && tag[`name_${language}` as keyof NewsTag];
    const hasMultilingualSupport = tag.name_en || tag.name_cn || tag.name_my;
    
    if (hasLanguageSpecific && !hasMultilingualSupport) {
      return `${name} (missing lang field)`;
    }
  }
  
  return name;
}
