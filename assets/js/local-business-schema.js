
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('script[type="application/ld+json"][data-me-org-schema="1"]')) {
        return;
    }
    var c = window.MountainEdgeSiteContact || {};
    var origin = c.siteOrigin || 'https://www.mountainedgehomes.com';
    var mapsUrl =
        c.mapsSearchUrl ||
        'https://www.google.com/maps/search/?api=1&query=8015+Blue+Diamond+Rd+Las+Vegas+NV+89178';

    /** Single RealEstateAgent graph for the homepage — no fabricated reviews/ratings. */
    var organizationGraph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'RealEstateAgent',
                '@id': origin + '/#organization',
                name: c.businessName || 'Mountain Edge Homes',
                alternateName: "Mountain's Edge Real Estate Specialists",
                url: origin + '/',
                logo: origin + '/assets/images/favicon.png',
                image: origin + '/assets/images/hero-mountains-edge-1600w.jpg',
                description:
                    "Discover luxury Mountain's Edge homes in Las Vegas 89178 with Mountain Edge Homes, the premier real estate agency specializing in Mountain's Edge neighborhoods and properties.",
                slogan: "Your Trusted Guide to Mountain's Edge Living",
                telephone: c.telephoneDisplay || '(702) 919-5002',
                email: c.email || 'DrJanSells@MountainEdgeHomes.com',
                currenciesAccepted: 'USD',
                paymentAccepted: 'Cash, Credit Card, Wire Transfer',
                priceRange: '$$$',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: c.streetAddress || '8015 Blue Diamond Rd',
                    addressLocality: c.addressLocality || 'Las Vegas',
                    addressRegion: c.addressRegion || 'NV',
                    postalCode: c.postalCode || '89178',
                    addressCountry: c.addressCountry || 'US',
                },
                geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 36.0051,
                    longitude: -115.2552,
                },
                hasMap: mapsUrl,
                openingHoursSpecification: [
                    {
                        '@type': 'OpeningHoursSpecification',
                        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                        opens: '09:00',
                        closes: '18:00',
                    },
                    {
                        '@type': 'OpeningHoursSpecification',
                        dayOfWeek: 'Saturday',
                        opens: '10:00',
                        closes: '16:00',
                    },
                ],
                sameAs: [
                    'https://www.facebook.com/MountainEdgeHomes',
                    'https://www.instagram.com/MountainEdgeHomes',
                    'https://twitter.com/MountainEdgeHomes',
                    'https://www.linkedin.com/company/springvalleylasvegas/',
                    'https://www.youtube.com/@DrDuffy',
                    'https://pinterest.com/MountainEdgeHomes',
                ],
                areaServed: {
                    '@type': 'City',
                    name: 'Las Vegas',
                    containsPlace: {
                        '@type': 'Neighborhood',
                        name: "Mountain's Edge",
                    },
                },
                hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: "Mountain's Edge Properties",
                    itemListElement: [
                        {
                            '@type': 'Offer',
                            itemOffered: {
                                '@type': 'Service',
                                name: 'Home Buying Services',
                                description:
                                    'Expert guidance through the entire Las Vegas luxury home buying process.',
                            },
                        },
                        {
                            '@type': 'Offer',
                            itemOffered: {
                                '@type': 'Service',
                                name: 'Home Selling Services',
                                description:
                                    "Strategic marketing and pricing expertise for Mountain's Edge properties.",
                            },
                        },
                        {
                            '@type': 'Offer',
                            itemOffered: {
                                '@type': 'Service',
                                name: 'Investment Property Consulting',
                                description:
                                    "Data-driven investment advice for Mountain's Edge and surrounding Las Vegas communities.",
                            },
                        },
                    ],
                },
                potentialAction: [
                    {
                        '@type': 'SearchAction',
                        target: {
                            '@type': 'EntryPoint',
                            urlTemplate:
                                origin + '/homes-for-sale.html?q={search_term_string}#property-search',
                        },
                        'query-input': 'required name=search_term_string',
                    },
                    {
                        '@type': 'ReserveAction',
                        target: {
                            '@type': 'EntryPoint',
                            urlTemplate: origin + '/schedule.html',
                            inLanguage: 'en-US',
                            actionPlatform: [
                                'http://schema.org/DesktopWebPlatform',
                                'http://schema.org/IOSPlatform',
                                'http://schema.org/AndroidPlatform',
                            ],
                        },
                        result: {
                            '@type': 'Reservation',
                            name: 'Schedule a Showing',
                        },
                    },
                ],
                speakable: {
                    '@type': 'SpeakableSpecification',
                    cssSelector: ['h1', '.hero-content p', '#about p'],
                },
            },
        ],
    };

    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-me-org-schema', '1');
    script.text = JSON.stringify(organizationGraph);
    document.head.appendChild(script);
});
