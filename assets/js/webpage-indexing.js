
/**
 * WebPage Schema Generator 
 * Creates basic WebPage schema for better indexing
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get page metadata
    const pageTitle = document.title;
    const pageDescription = document.querySelector('meta[name="description"]')?.content || '';
    const pageUrl = window.location.href;
    const lastModified = document.querySelector('meta[name="last-modified"]')?.content || new Date().toISOString().split('T')[0];
    
    // Create WebPage schema
    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": pageTitle,
        "description": pageDescription,
        "url": pageUrl,
        "lastReviewed": lastModified,
        "reviewedBy": {
            "@type": "Organization",
            "name": "Mountain Edge Homes",
            "url": "https://mountainedgehomes.com/"
        },
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
