
/**
 * Dynamic JSON-LD Schema Generator
 * Generates appropriate schema.org structured data based on page context
 */
document.addEventListener('DOMContentLoaded', function() {
    // Determine the current page type
    function getCurrentPageType() {
        const path = window.location.pathname;
        
        if (path === '/' || path.includes('index.html')) {
            return 'homepage';
        } else if (path.includes('neighborhood-')) {
            return 'neighborhood';
        } else if (path.includes('property-details')) {
            return 'property';
        } else if (path.includes('blog')) {
            return 'blog';
        } else if (path.includes('our-team')) {
            return 'team';
        } else if (path.includes('testimonials')) {
            return 'testimonials';
        } else if (path.includes('home-value')) {
            return 'tool';
        } else {
            return 'general';
        }
    }
    
    // Get page-specific data
    function getPageData() {
        const data = {
            title: document.title || 'Mountain Edge Homes',
            description: document.querySelector('meta[name="description"]')?.content || 'Luxury Real Estate in Mountain\'s Edge Las Vegas',
            url: window.location.href,
            image: document.querySelector('meta[property="og:image"]')?.content || 'https://mountainedgehomes.com/assets/images/hero-mountains-edge-1600w.jpg'
        };
        
        // Get additional data based on page type
        const pageType = getCurrentPageType();
        
        if (pageType === 'neighborhood') {
            // Extract neighborhood name from URL or H1
            const neighborhoodName = document.querySelector('h1')?.textContent || 
                                    window.location.pathname.split('neighborhood-')[1].split('.')[0]
                                    .replace(/-/g, ' ')
                                    .replace(/\b\w/g, l => l.toUpperCase());
            
            data.neighborhoodName = neighborhoodName;
            data.neighborhoodDescription = document.querySelector('.neighborhood-description')?.textContent || 
                                          'A beautiful neighborhood in Mountain\'s Edge Las Vegas.';
        } else if (pageType === 'property') {
            // Extract property data
            const priceElement = document.querySelector('.property-price');
            data.price = priceElement ? priceElement.textContent.trim() : '$750,000';
            
            const addressElement = document.querySelector('.property-address');
            data.address = addressElement ? addressElement.textContent.trim() : 'Mountain\'s Edge, Las Vegas, NV 89178';
            
            const bedsElement = document.querySelector('.property-beds');
            data.beds = bedsElement ? bedsElement.textContent.trim().split(' ')[0] : '4';
            
            const bathsElement = document.querySelector('.property-baths');
            data.baths = bathsElement ? bathsElement.textContent.trim().split(' ')[0] : '3';
            
            const sqftElement = document.querySelector('.property-sqft');
            data.sqft = sqftElement ? sqftElement.textContent.trim().split(' ')[0] : '2,500';
        }
        
        return data;
    }
    
    // Generate JSON-LD based on page type
    function generateJsonLd() {
        const pageType = getCurrentPageType();
        const pageData = getPageData();
        let schema = {};
        
        switch(pageType) {
            case 'neighborhood':
                schema = {
                    "@context": "https://schema.org",
                    "@type": "Place",
                    "name": pageData.neighborhoodName,
                    "description": pageData.neighborhoodDescription,
                    "url": pageData.url,
                    "image": pageData.image,
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": 36.0051,
                        "longitude": -115.2552
                    },
                    "containedInPlace": {
                        "@type": "City",
                        "name": "Las Vegas",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Las Vegas",
                            "addressRegion": "NV",
                            "postalCode": "89178",
                            "addressCountry": "US"
                        }
                    }
                };
                break;
                
            case 'property':
                schema = {
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": pageData.title,
                    "description": pageData.description,
                    "url": pageData.url,
                    "image": pageData.image,
                    "brand": {
                        "@type": "Brand",
                        "name": "Mountain Edge Homes"
                    },
                    "offers": {
                        "@type": "Offer",
                        "price": pageData.price.replace(/[^0-9]/g, ''),
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "url": pageData.url,
                        "seller": {
                            "@type": "RealEstateAgent",
                            "name": "Mountain Edge Homes",
                            "url": "https://mountainedgehomes.com"
                        }
                    },
                    "additionalProperty": [
                        {
                            "@type": "PropertyValue",
                            "name": "Bedrooms",
                            "value": pageData.beds
                        },
                        {
                            "@type": "PropertyValue",
                            "name": "Bathrooms",
                            "value": pageData.baths
                        },
                        {
                            "@type": "PropertyValue",
                            "name": "Square Feet",
                            "value": pageData.sqft
                        },
                        {
                            "@type": "PropertyValue",
                            "name": "Address",
                            "value": pageData.address
                        }
                    ]
                };
                break;
                
            case 'blog':
                // Get blog article content
                const blogArticles = document.querySelectorAll('article') || [];
                if (blogArticles.length > 0) {
                    // If multiple articles on page (like blog index)
                    schema = {
                        "@context": "https://schema.org",
                        "@type": "Blog",
                        "name": pageData.title,
                        "description": pageData.description,
                        "url": pageData.url,
                        "image": pageData.image,
                        "publisher": {
                            "@type": "Organization",
                            "name": "Mountain Edge Homes",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://mountainedgehomes.com/assets/images/favicon.png"
                            }
                        },
                        "blogPost": Array.from(blogArticles).slice(0, 5).map(article => {
                            const articleTitle = article.querySelector('h2, h3')?.textContent || 'Mountain\'s Edge Real Estate News';
                            const articleDate = article.querySelector('.article-date')?.textContent || '2024-04-01';
                            const articleSummary = article.querySelector('p, .article-excerpt')?.textContent || 'Real estate news and updates from Mountain\'s Edge Las Vegas.';
                            const articleUrl = article.querySelector('a')?.href || pageData.url;
                            
                            return {
                                "@type": "BlogPosting",
                                "headline": articleTitle,
                                "datePublished": articleDate,
                                "description": articleSummary,
                                "url": articleUrl
                            };
                        })
                    };
                } else {
                    // Single article page
                    const articleDate = document.querySelector('.article-date, .published-date')?.textContent || '2024-04-01';
                    const articleAuthor = document.querySelector('.article-author, .author')?.textContent || 'Mountain Edge Homes Team';
                    
                    schema = {
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": pageData.title,
                        "description": pageData.description,
                        "image": pageData.image,
                        "datePublished": articleDate,
                        "dateModified": articleDate,
                        "author": {
                            "@type": "Person",
                            "name": articleAuthor
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Mountain Edge Homes",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://mountainedgehomes.com/assets/images/favicon.png"
                            }
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": pageData.url
                        }
                    };
                }
                break;
                
            // Add more cases as needed
                
            default:
                // Default schema for unidentified page types
                schema = {
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": pageData.title,
                    "description": pageData.description,
                    "url": pageData.url,
                    "image": pageData.image,
                    "publisher": {
                        "@type": "Organization",
                        "name": "Mountain Edge Homes",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://mountainedgehomes.com/assets/images/favicon.png"
                        }
                    }
                };
                break;
        }
        
        // Add the schema to the page if it doesn't already exist
        if (!document.querySelector(`script[data-schema="${pageType}"]`)) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.text = JSON.stringify(schema);
            script.dataset.schema = pageType;
            document.head.appendChild(script);
            console.log(`Added ${pageType} schema to page`);
        }
    }
    
    // Generate the appropriate JSON-LD
    generateJsonLd();
});
