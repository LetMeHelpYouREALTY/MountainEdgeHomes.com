
/**
 * Speed Optimization for SEO
 * Implements performance enhancements that improve Core Web Vitals
 */
document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images
    function setupLazyLoading() {
        // Check if browser supports IntersectionObserver
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.setAttribute('src', src);
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                            
                            // Remove placeholder after loading
                            const placeholder = img.closest('.lazy-load-container')?.querySelector('.lazy-load-placeholder');
                            if (placeholder) {
                                placeholder.style.opacity = '0';
                                setTimeout(() => {
                                    placeholder.remove();
                                }, 300);
                            }
                        }
                    }
                });
            }, {
                rootMargin: '100px 0px',
                threshold: 0.01
            });
            
            // Convert regular images to lazy loaded ones
            document.querySelectorAll('img:not(.no-lazy):not([data-src])').forEach(img => {
                if (img.classList.contains('loaded') || img.closest('.lazy-load-container')) {
                    return;
                }
                
                // Save original source
                const src = img.getAttribute('src');
                if (!src) return;
                
                // Create container for image
                const container = document.createElement('div');
                container.className = 'lazy-load-container';
                
                // Create placeholder
                const placeholder = document.createElement('div');
                placeholder.className = 'lazy-load-placeholder';
                
                // Set up lazyload attributes
                img.setAttribute('data-src', src);
                img.removeAttribute('src');
                
                // Replace image with container
                img.parentNode.insertBefore(container, img);
                container.appendChild(img);
                container.appendChild(placeholder);
                
                // Observe for lazy loading
                imageObserver.observe(img);
            });
        }
    }
    
    // Defer non-critical CSS
    function deferNonCriticalCSS() {
        const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
        
        // Skip the first stylesheet (assuming it's critical)
        if (stylesheets.length <= 1) return;
        
        stylesheets.slice(1).forEach(stylesheet => {
            // Don't defer already loaded or critical stylesheets
            if (stylesheet.hasAttribute('data-critical') || 
                stylesheet.hasAttribute('data-loaded')) {
                return;
            }
            
            const href = stylesheet.getAttribute('href');
            
            // Create a preload link instead
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'style';
            preloadLink.href = href;
            preloadLink.onload = function() {
                this.onload = null;
                this.rel = 'stylesheet';
                this.setAttribute('data-loaded', 'true');
            };
            
            // Replace original stylesheet with preload
            stylesheet.parentNode.replaceChild(preloadLink, stylesheet);
        });
    }
    
    // Optimize font loading
    function optimizeFontLoading() {
        const fontLinks = document.querySelectorAll('link[rel="stylesheet"][href*="font"], link[href*="googleapis.com/css"]');
        
        fontLinks.forEach(link => {
            // Add display=swap for better performance
            const href = link.getAttribute('href');
            if (href.includes('googleapis.com/css') && !href.includes('display=swap')) {
                const newHref = href.includes('?') ? 
                    href + '&display=swap' : 
                    href + '?display=swap';
                link.setAttribute('href', newHref);
            }
            
            // Add preload for fonts
            link.setAttribute('media', 'print');
            link.setAttribute('onload', "this.media='all'");
        });
    }
    
    // Preload important resources
    function preloadCriticalResources() {
        // List of critical images to preload
        const criticalImages = [
            document.querySelector('.hero-image img')?.src,
            document.querySelector('.property-image img')?.src,
            document.querySelector('header img')?.src
        ].filter(src => src); // Filter out undefined sources
        
        // Preload each critical image
        criticalImages.forEach(src => {
            if (!document.querySelector(`link[rel="preload"][href="${src}"]`)) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'image';
                preloadLink.href = src;
                document.head.appendChild(preloadLink);
            }
        });
    }
    
    // Execute optimizations
    setupLazyLoading();
    deferNonCriticalCSS();
    optimizeFontLoading();
    preloadCriticalResources();
});
