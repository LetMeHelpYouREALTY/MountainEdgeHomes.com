
/**
 * Enhanced Real Estate Schema Implementation
 * Provides rich structured data specifically for real estate listings
 */
document.addEventListener('DOMContentLoaded', function() {
    // Only create property schema on property detail pages
    if (!window.location.pathname.includes('property-details')) return;
    
    // Extract property information from the page
    function getPropertyData() {
        const data = {
            name: document.querySelector('h1')?.textContent.trim() || 'Luxury Home in Mountain\'s Edge',
            description: document.querySelector('.property-description')?.textContent.trim() || 
                        'Beautiful home in Mountain\'s Edge featuring modern amenities and mountain views.',
            price: document.querySelector('.property-price')?.textContent.trim() || '$750,000',
            priceCurrency: 'USD',
            url: window.location.href,
            image: document.querySelector('.property-image img')?.src || 
                 'https://mountainedgehomes.com/assets/images/property-placeholder.jpg',
            address: document.querySelector('.property-address')?.textContent.trim() || 
                   'Mountain\'s Edge, Las Vegas, NV 89178',
            numberOfBedrooms: document.querySelector('.property-beds')?.textContent.trim().split(' ')[0] || '4',
            numberOfBathrooms: document.querySelector('.property-baths')?.textContent.trim().split(' ')[0] || '3',
            floorSize: {
                value: document.querySelector('.property-sqft')?.textContent.trim().split(' ')[0].replace(/,/g, '') || '2500',
                unitCode: 'SQFT'
            }
        };
        
        // Parse address components
        const addressParts = data.address.split(',');
        if (addressParts.length >= 3) {
            data.addressFormatted = {
                streetAddress: addressParts[0].trim(),
                addressLocality: addressParts[1].trim(),
                addressRegion: addressParts[2].trim().split(' ')[0],
                postalCode: addressParts[2].trim().split(' ')[1] || '89178',
                addressCountry: 'US'
            };
        }
        
        // Try to extract additional property features
        const features = document.querySelectorAll('.property-features li');
        if (features.length > 0) {
            data.amenities = Array.from(features).map(feature => feature.textContent.trim());
        }
        
        return data;
    }
    
    // Create the RealEstateListing schema
    function createRealEstateSchema() {
        const propertyData = getPropertyData();
        
        const schema = {
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            "name": propertyData.name,
            "description": propertyData.description,
            "url": propertyData.url,
            "datePosted": new Date().toISOString().split('T')[0],
            "image": Array.isArray(propertyData.image) ? propertyData.image : [propertyData.image],
            "offers": {
                "@type": "Offer",
                "price": propertyData.price.replace(/[$,]/g, ''),
                "priceCurrency": propertyData.priceCurrency,
                "availability": "https://schema.org/InStock"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": 36.0051,
                "longitude": -115.2552
            },
            "containedInPlace": {
                "@type": "Neighborhood",
                "name": "Mountain's Edge",
                "containedInPlace": {
                    "@type": "City",
                    "name": "Las Vegas",
                    "containedInPlace": {
                        "@type": "State",
                        "name": "Nevada"
                    }
                }
            },
            "address": {
                "@type": "PostalAddress",
                "streetAddress": propertyData.addressFormatted?.streetAddress || "Mountain's Edge",
                "addressLocality": propertyData.addressFormatted?.addressLocality || "Las Vegas",
                "addressRegion": propertyData.addressFormatted?.addressRegion || "NV",
                "postalCode": propertyData.addressFormatted?.postalCode || "89178",
                "addressCountry": propertyData.addressFormatted?.addressCountry || "US"
            },
            "numberOfRooms": parseInt(propertyData.numberOfBedrooms) + parseInt(propertyData.numberOfBathrooms),
            "numberOfBedrooms": propertyData.numberOfBedrooms,
            "numberOfBathrooms": propertyData.numberOfBathrooms,
            "floorSize": {
                "@type": "QuantitativeValue",
                "value": propertyData.floorSize.value,
                "unitCode": propertyData.floorSize.unitCode
            },
            "amenityFeature": propertyData.amenities ? propertyData.amenities.map(amenity => ({
                "@type": "LocationFeatureSpecification",
                "name": amenity
            })) : [],
            "broker": {
                "@type": "RealEstateAgent",
                "name": "Mountain Edge Homes",
                "image": "https://mountainedgehomes.com/assets/images/favicon.png",
                "url": "https://mountainedgehomes.com",
                "telephone": "(702) 919-5002",
                "email": "DrJanSells@MountainEdgeHomes.com",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "8015 Blue Diamond Rd",
                    "addressLocality": "Las Vegas",
                    "addressRegion": "NV",
                    "postalCode": "89178",
                    "addressCountry": "US"
                }
            },
            "publication": {
                "@type": "PublicationEvent",
                "startDate": new Date().toISOString().split('T')[0]
            }
        };
        
        // Add the schema to the page
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
        
        console.log('[SEO] Added RealEstateListing schema');
    }
    
    // Execute schema creation
    createRealEstateSchema();
});
