
document.addEventListener('DOMContentLoaded', function() {
    // Create Video Schema for property tours and neighborhood insights
    const videoSchema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "Mountain's Edge Las Vegas Community Tour",
        "description": "Take a virtual tour of the beautiful Mountain's Edge master-planned community in southwest Las Vegas. Explore the neighborhoods, parks, and amenities that make this area one of the most desirable in the Las Vegas Valley.",
        "thumbnailUrl": "https://mountainedgehomes.com/assets/images/hero-mountains-edge-1600w.jpg",
        "uploadDate": "2024-04-01T08:00:00+08:00",
        "duration": "PT3M42S",
        "contentUrl": "https://mountainedgehomes.com/assets/videos/mountains-edge-community-tour.mp4",
        "embedUrl": "https://www.youtube.com/embed/mountains-edge-tour",
        "publisher": {
            "@type": "Organization",
            "name": "Mountain Edge Homes",
            "logo": {
                "@type": "ImageObject",
                "url": "https://mountainedgehomes.com/assets/images/favicon.png",
                "width": "112",
                "height": "112"
            }
        },
        "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/WatchAction",
            "userInteractionCount": 2347
        }
    };
    
    // Add video schema to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(videoSchema);
    document.head.appendChild(script);
});
