
/**
 * WebPage Schema Generator 
 * Creates basic WebPage schema for better indexing
 */
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname || '/';
    if (path === '/' || path === '/index.html') {
        return;
    }
    // Get page metadata
    const pageTitle = document.title;
    const pageDescription = document.querySelector('meta[name="description"]')?.content || '';
    const canonicalOrigin = 'https://www.mountainedgehomes.com';
    const normalizedPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
    const pageUrl = canonicalOrigin + (normalizedPath === '/' ? '' : normalizedPath) + (window.location.search || '');
    const lastModified = document.querySelector('meta[name="last-modified"]')?.content || new Date().toISOString().split('T')[0];
    
    // Create WebPage schema
    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": pageTitle,
        "description": pageDescription,
        "url": pageUrl,
        "publisher": { "@id": "https://www.mountainedgehomes.com/#organization" },
        "lastReviewed": lastModified,
        "reviewedBy": { "@id": "https://www.mountainedgehomes.com/#organization" },
        "mainContentOfPage": {
            "@type": "WebPageElement",
            "cssSelector": ".hero-content, main, .properties-section, .about-section"
        },
        "breadcrumb": {
            "@id": "breadcrumb"
        }
    };
    
    // Add schema to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(webPageSchema);
    document.head.appendChild(script);
});
