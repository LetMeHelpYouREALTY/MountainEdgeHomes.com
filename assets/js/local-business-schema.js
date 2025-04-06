
document.addEventListener('DOMContentLoaded', function() {
    // Create enhanced LocalBusiness schema for improved map listings
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "subType": "RealEstateAgent",
        "@id": "https://mountainedgehomes.com/#organization",
        "name": "Mountain Edge Homes",
        "alternateName": "Mountain's Edge Real Estate Specialists",
        "url": "https://mountainedgehomes.com/",
        "logo": "https://mountainedgehomes.com/assets/images/favicon.png",
        "image": "https://mountainedgehomes.com/assets/images/hero-mountains-edge-1600w.jpg",
        "description": "Premier real estate agency specializing in Mountain's Edge Las Vegas luxury homes and properties in the 89178 zip code area.",
        "slogan": "Your Trusted Guide to Mountain's Edge Living",
        "currenciesAccepted": "USD",
        "paymentAccepted": "Cash, Credit Card, Wire Transfer",
        "priceRange": "$$$",
        "telephone": "(702) 919-5002",
        "email": "DrJanSells@MountainEdgeHomes.com",
        "foundingDate": "2008",
        "foundingLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Las Vegas",
                "addressRegion": "NV",
                "postalCode": "89178",
                "addressCountry": "US"
            }
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "8015 Blue Diamond Rd",
            "addressLocality": "Las Vegas",
            "addressRegion": "NV",
            "postalCode": "89178",
            "addressCountry": "US"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 36.0051,
            "longitude": -115.2552
        },
        "hasMap": "https://www.google.com/maps?cid=MountainEdgeHomes",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": "10:00",
                "closes": "16:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Sunday",
                "opens": "09:00",
                "closes": "18:00",
                "description": "By Appointment Only"
            }
        ],
        "sameAs": [
            "https://www.facebook.com/MountainEdgeHomes",
            "https://www.instagram.com/MountainEdgeHomes",
            "https://twitter.com/MountainEdgeHomes",
            "https://www.linkedin.com/company/mountain-edge-homes",
            "https://www.youtube.com/MountainEdgeHomes",
            "https://pinterest.com/MountainEdgeHomes"
        ],
        "areaServed": [
            {
                "@type": "City",
                "name": "Las Vegas",
                "containsPlace": {
                    "@type": "Neighborhood",
                    "name": "Mountain's Edge",
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": 36.0051,
                        "longitude": -115.2552
                    }
                }
            },
            {
                "@type": "City",
                "name": "Enterprise",
                "containsPlace": {
                    "@type": "Neighborhood",
                    "name": "Mountain's Edge"
                }
            }
        ],
        "makesOffer": [
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Free Home Valuation",
                    "url": "https://mountainedgehomes.com/home-value.html"
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Virtual Home Tours",
                    "url": "https://mountainedgehomes.com/index.html#booking"
                }
            }
        ],
        "reviews": [
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "John & Sarah Davis"
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                },
                "datePublished": "2023-05-20",
                "reviewBody": "Working with Mountain Edge Homes was an absolute pleasure. Their knowledge of the Mountain's Edge market, professionalism, and attention to detail made the home buying process seamless. We couldn't be happier with our new mountain retreat!"
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "87",
            "bestRating": "5",
            "worstRating": "1"
        }
    };
    
    // Add local business schema to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(localBusinessSchema);
    document.head.appendChild(script);
});
