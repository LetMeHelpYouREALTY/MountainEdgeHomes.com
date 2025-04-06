
/**
 * Social Sharing Optimization
 * Enhances social media sharing capabilities with dynamic meta tags and Twitter Card support
 */
document.addEventListener('DOMContentLoaded', function() {
    // Update meta tags based on page content
    function optimizeSocialSharing() {
        // Get page content
        const title = document.querySelector('h1')?.textContent.trim() || document.title;
        const pageDescription = document.querySelector('meta[name="description"]')?.content || '';
        
        // Get main image - try various selectors
        let mainImage = 
            document.querySelector('.hero-image img')?.src || 
            document.querySelector('.property-image img')?.src || 
            document.querySelector('.neighborhood-image img')?.src ||
            document.querySelector('main img')?.src ||
            'https://mountainedgehomes.com/assets/images/hero-mountains-edge-1600w.jpg';
        
        // Ensure full URL for image
        if (mainImage && !mainImage.startsWith('http')) {
            if (mainImage.startsWith('/')) {
                mainImage = window.location.origin + mainImage;
            } else {
                mainImage = window.location.origin + '/' + mainImage;
            }
        }
        
        // Update or create Open Graph tags
        updateMetaTag('og:title', title);
        updateMetaTag('og:description', pageDescription);
        updateMetaTag('og:image', mainImage);
        updateMetaTag('og:url', window.location.href);
        
        // Update or create Twitter Card tags
        updateMetaTag('twitter:card', 'summary_large_image', 'name');
        updateMetaTag('twitter:title', title, 'name');
        updateMetaTag('twitter:description', pageDescription, 'name');
        updateMetaTag('twitter:image', mainImage, 'name');
        
        // Add social media sharing buttons if not present
        addSocialSharingButtons();
    }
    
    // Helper function to update or create meta tags
    function updateMetaTag(property, content, attributeName = 'property') {
        let tag = document.querySelector(`meta[${attributeName}="${property}"]`);
        
        if (tag) {
            tag.setAttribute('content', content);
        } else {
            tag = document.createElement('meta');
            tag.setAttribute(attributeName, property);
            tag.setAttribute('content', content);
            document.head.appendChild(tag);
        }
    }
    
    // Add social sharing buttons
    function addSocialSharingButtons() {
        // Check if sharing buttons already exist
        if (document.querySelector('.social-sharing-buttons')) {
            return;
        }
        
        // Content to share
        const pageUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent(document.title);
        
        // Create social sharing container
        const sharingContainer = document.createElement('div');
        sharingContainer.className = 'social-sharing-buttons';
        sharingContainer.innerHTML = `
            <p>Share this page:</p>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}" target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
                <i class="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}" target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
                <i class="fab fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
                <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="mailto:?subject=${pageTitle}&body=Check out this page: ${pageUrl}" aria-label="Share via Email">
                <i class="fas fa-envelope"></i>
            </a>
        `;
        
        // Add styling to sharing buttons
        const style = document.createElement('style');
        style.textContent = `
            .social-sharing-buttons {
                display: flex;
                align-items: center;
                margin: 30px 0;
                gap: 10px;
            }
            
            .social-sharing-buttons p {
                margin: 0;
                margin-right: 5px;
                font-weight: 600;
            }
            
            .social-sharing-buttons a {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-color: #f5f5f5;
                color: #333;
                text-decoration: none;
                transition: all 0.3s ease;
            }
            
            .social-sharing-buttons a:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            
            .social-sharing-buttons a:nth-child(2):hover {
                background-color: #1877F2;
                color: white;
            }
            
            .social-sharing-buttons a:nth-child(3):hover {
                background-color: #1DA1F2;
                color: white;
            }
            
            .social-sharing-buttons a:nth-child(4):hover {
                background-color: #0A66C2;
                color: white;
            }
            
            .social-sharing-buttons a:nth-child(5):hover {
                background-color: #EA4335;
                color: white;
            }
        `;
        document.head.appendChild(style);
        
        // Find appropriate place to add sharing buttons
        const contentSection = document.querySelector('main');
        if (contentSection) {
            // Try to find a good position - after first section or before footer
            const firstSection = contentSection.querySelector('section');
            if (firstSection) {
                firstSection.after(sharingContainer);
            } else {
                const footer = document.querySelector('footer');
                if (footer) {
                    footer.before(sharingContainer);
                } else {
                    contentSection.appendChild(sharingContainer);
                }
            }
        }
    }
    
    // Execute functions
    optimizeSocialSharing();
});
