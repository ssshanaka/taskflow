import { useEffect } from 'react';

/**
 * Custom hook for managing SEO metadata dynamically.
 * @param {Object} options
 * @param {string} options.title - The document title (automatically appended with ' | TaskFlow')
 * @param {string} options.description - The meta description
 * @param {string} [options.canonicalUrl] - Canonical URL for the page
 * @param {Object} [options.schema] - Optional JSON-LD schema object
 */
export const useSEO = ({ title, description, canonicalUrl, schema }) => {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = title ? `${title} | TaskFlow` : 'TaskFlow';
    document.title = fullTitle;

    // 2. Update Meta Description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        metaDescription.content = description;
        document.head.appendChild(metaDescription);
      }
    }

    // 3. Update Canonical URL
    if (canonicalUrl) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (linkCanonical) {
        linkCanonical.setAttribute('href', canonicalUrl);
      } else {
        linkCanonical = document.createElement('link');
        linkCanonical.rel = 'canonical';
        linkCanonical.href = canonicalUrl;
        document.head.appendChild(linkCanonical);
      }
    }

    // 4. Inject JSON-LD Schema
    let scriptTag = null;
    if (schema) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      // Identify this specific script tag to easily remove it later
      scriptTag.id = 'seo-schema';
      scriptTag.text = JSON.stringify(schema);
      
      // Remove any existing schema tag to prevent duplicates
      const existingScript = document.getElementById('seo-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      
      document.head.appendChild(scriptTag);
    }

    // Cleanup function
    return () => {
      // Revert title to default if unmounting (optional, usually handled by next page's useSEO)
      // Remove schema script when component unmounts
      if (scriptTag && document.head.contains(scriptTag)) {
        document.head.removeChild(scriptTag);
      }
    };
  }, [title, description, canonicalUrl, schema]);
};
