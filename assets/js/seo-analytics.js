
/**
 * SEO Analytics and Monitoring Script
 * Tracks important SEO metrics and provides console reporting
 */
document.addEventListener('DOMContentLoaded', function() {
    // Performance monitoring for Core Web Vitals
    function monitorCoreWebVitals() {
        if (window.performance && 'getEntriesByType' in performance) {
            // Monitor LCP (Largest Contentful Paint)
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lcpEntry = entries[entries.length - 1];
                console.log('[SEO Monitor] LCP:', Math.round(lcpEntry.startTime + lcpEntry.duration), 'ms');
            }).observe({type: 'largest-contentful-paint', buffered: true});
            
            // Monitor FID (First Input Delay)
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    console.log('[SEO Monitor] FID:', Math.round(entry.processingStart - entry.startTime), 'ms');
                });
            }).observe({type: 'first-input', buffered: true});
            
            // Monitor CLS (Cumulative Layout Shift)
            let clsValue = 0;
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                console.log('[SEO Monitor] CLS:', clsValue.toFixed(3));
            }).observe({type: 'layout-shift', buffered: true});
        }
    }
    
    // Check for proper heading hierarchy
    function validateHeadingHierarchy() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        let h1Count = 0;
        let issues = [];
        
        headings.forEach(heading => {
            const currentLevel = parseInt(heading.tagName.substring(1));
            
            if (heading.tagName === 'H1') {
                h1Count++;
                if (h1Count > 1) {
                    issues.push('Multiple H1 tags found: "' + heading.textContent.substring(0, 30) + '..."');
                }
            }
            
            if (currentLevel - lastLevel > 1 && lastLevel !== 0) {
                issues.push('Heading level skip: ' + heading.tagName + ' follows H' + lastLevel);
            }
            
            if (heading.textContent.trim() === '') {
                issues.push('Empty heading found: ' + heading.tagName);
            }
            
            lastLevel = currentLevel;
        });
        
        if (h1Count === 0) {
            issues.push('No H1 tag found on page');
        }
        
        if (issues.length > 0) {
            console.warn('[SEO Monitor] Heading hierarchy issues:');
            issues.forEach(issue => console.warn('- ' + issue));
        } else {
            console.log('[SEO Monitor] Heading hierarchy: OK');
        }
    }
    
    // Check image alt text
    function validateImageAccessibility() {
        const images = document.querySelectorAll('img');
        let missingAlt = 0;
        let emptyAlt = 0;
        
        images.forEach(img => {
            if (!img.hasAttribute('alt')) {
                missingAlt++;
                console.warn('[SEO Monitor] Image missing alt attribute:', img.src);
            } else if (img.alt.trim() === '') {
                emptyAlt++;
                console.warn('[SEO Monitor] Image has empty alt text:', img.src);
            }
        });
        
        if (missingAlt === 0 && emptyAlt === 0) {
            console.log('[SEO Monitor] Image accessibility: OK');
        } else {
            console.warn(`[SEO Monitor] Image issues: ${missingAlt} missing alt, ${emptyAlt} empty alt`);
        }
    }
    
    // Check for proper schema implementation
    function validateSchemaImplementation() {
        const schemas = document.querySelectorAll('script[type="application/ld+json"]');
        
        if (schemas.length === 0) {
            console.warn('[SEO Monitor] No structured data found on page');
        } else {
            console.log(`[SEO Monitor] Found ${schemas.length} structured data elements`);
        }
    }
    
    // Check meta tags
    function validateMetaTags() {
        const title = document.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const ogImage = document.querySelector('meta[property="og:image"]');
        
        if (title && title.length > 70) {
            console.warn('[SEO Monitor] Title too long:', title.length, 'chars');
        }
        
        if (!metaDesc) {
            console.warn('[SEO Monitor] Missing meta description');
        } else if (metaDesc.content.length > 160) {
            console.warn('[SEO Monitor] Meta description too long:', metaDesc.content.length, 'chars');
        }
        
        if (!canonicalLink) {
            console.warn('[SEO Monitor] Missing canonical URL');
        }
        
        if (!ogTitle || !ogDesc || !ogImage) {
            console.warn('[SEO Monitor] Missing Open Graph tags');
        }
    }
    
    // Run all SEO checks
    function runSEOChecks() {
        console.group('SEO Health Check');
        monitorCoreWebVitals();
        validateHeadingHierarchy();
        validateImageAccessibility();
        validateSchemaImplementation();
        validateMetaTags();
        console.groupEnd();
    }
    
    // Only run in development environment (not in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('replit')) {
        runSEOChecks();
    }
});
