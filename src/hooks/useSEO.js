import { useEffect, useRef } from 'react';

/**
 * Custom hook for managing SEO metadata dynamically.
 * Handles title, description, canonical URL, OG/Twitter meta tags,
 * and JSON-LD structured data injection.
 *
 * @param {Object} options
 * @param {string} options.title - Page title (appended with ' | TaskFlow')
 * @param {string} [options.description] - Meta description
 * @param {string} [options.canonicalUrl] - Canonical URL for the page
 * @param {string} [options.ogImage] - Open Graph image URL
 * @param {Object} [options.schema] - JSON-LD schema object
 */
export const useSEO = ({ title, description, canonicalUrl, ogImage, schema }) => {
  // Use a ref to deep-compare schema and avoid infinite re-renders
  // from inline object literals in the dependency array.
  const schemaRef = useRef(null);
  const schemaStringified = schema ? JSON.stringify(schema) : null;

  useEffect(() => {
    // 1. Update Title
    const fullTitle = title ? `${title} | TaskFlow` : 'TaskFlow';
    document.title = fullTitle;

    // 2. Update Meta Description
    if (description) {
      updateMeta('name', 'description', description);
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

    // 4. Update Open Graph meta tags
    updateMeta('property', 'og:title', fullTitle);
    if (description) updateMeta('property', 'og:description', description);
    if (canonicalUrl) updateMeta('property', 'og:url', canonicalUrl);
    if (ogImage) updateMeta('property', 'og:image', ogImage);

    // 5. Update Twitter Card meta tags
    updateMeta('name', 'twitter:title', fullTitle);
    if (description) updateMeta('name', 'twitter:description', description);
    if (canonicalUrl) updateMeta('name', 'twitter:url', canonicalUrl);
    if (ogImage) updateMeta('name', 'twitter:image', ogImage);

    // 6. Inject JSON-LD Schema (uses stringified value for stable comparison)
    let scriptTag = null;
    if (schemaStringified && schemaStringified !== schemaRef.current) {
      schemaRef.current = schemaStringified;

      // Remove any existing schema tag to prevent duplicates
      const existingScript = document.getElementById('seo-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }

      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.id = 'seo-schema';
      scriptTag.text = schemaStringified;
      document.head.appendChild(scriptTag);
    }

    // Cleanup: remove schema script when component unmounts
    return () => {
      const existing = document.getElementById('seo-schema');
      if (existing && document.head.contains(existing)) {
        document.head.removeChild(existing);
      }
      schemaRef.current = null;
    };
  }, [title, description, canonicalUrl, ogImage, schemaStringified]);
};

/**
 * Helper to create or update a meta tag.
 * @param {'name'|'property'} attr - The attribute type (name vs property)
 * @param {string} key - The attribute value (e.g. 'description', 'og:title')
 * @param {string} content - The content value
 */
function updateMeta(attr, key, content) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (tag) {
    tag.setAttribute('content', content);
  } else {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    tag.setAttribute('content', content);
    document.head.appendChild(tag);
  }
}
