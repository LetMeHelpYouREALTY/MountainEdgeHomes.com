
document.addEventListener('DOMContentLoaded', function() {
    // Create FAQ Schema for Voice Search Optimization
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What areas of Las Vegas does Mountain Edge Homes serve?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Mountain Edge Homes specializes in the Mountain's Edge community in southwest Las Vegas, particularly the 89178 zip code. We also serve Enterprise, Spring Valley, and surrounding neighborhoods in Clark County, Nevada."
                }
            },
            {
                "@type": "Question",
                "name": "What is the average home price in Mountain's Edge Las Vegas?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The average home price in Mountain's Edge is approximately $750,000, though prices can range from $500,000 to over $1.5 million depending on the specific neighborhood, home size, and features."
                }
            },
            {
                "@type": "Question",
                "name": "Which neighborhoods are part of Mountain's Edge in Las Vegas?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Mountain's Edge includes eight distinctive neighborhoods: Aspire, Cascade at Mountain Pass, Collina, Mesa/Valla, Montelano, Quintessa, San Gabriel, and Sierra Madre. Each offers unique home styles and community amenities."
                }
            },
            {
                "@type": "Question",
                "name": "How do I schedule a home showing in Mountain's Edge?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can schedule a home showing by using our online booking system at mountainedgehomes.com/index.html#booking, calling us at (702) 919-5002, or emailing DrJanSells@MountainEdgeHomes.com. We offer various appointment types including in-person showings, virtual tours, and open house visits."
                }
            },
            {
                "@type": "Question",
                "name": "What real estate services does Mountain Edge Homes provide?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Mountain Edge Homes provides comprehensive real estate services including home buying guidance, property selling, investment property consulting, and property management specifically for the Mountain's Edge community and surrounding Las Vegas neighborhoods."
                }
            },
            {
                "@type": "Question",
                "name": "How can I find out what my Mountain's Edge home is worth?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can get an instant home value estimate by using our free valuation tool at mountainedgehomes.com/home-value.html. For a more comprehensive analysis, you can schedule a personalized home valuation consultation with one of our Mountain's Edge specialists."
                }
            },
            {
                "@type": "Question",
                "name": "What are the best schools near Mountain's Edge Las Vegas?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Mountain's Edge is served by several highly-rated schools including Wright Elementary School, Faiss Middle School, and Sierra Vista High School. There are also several private and charter school options nearby including Pinecrest Academy and American Preparatory Academy."
                }
            }
        ]
    };
    
    // Add FAQ schema to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);
});
/**
 * FAQ Schema Generator
 * Creates structured data for frequently asked questions
 */
document.addEventListener('DOMContentLoaded', function() {
    // Define comprehensive FAQs for the main site
    const mountainsEdgeFaqs = [
        {
            question: "What is the average home price in Mountain's Edge Las Vegas?",
            answer: "The average home price in Mountain's Edge is approximately $750,000, with properties ranging from $500,000 to over $1.5 million depending on size, location, and amenities. The community offers a variety of housing options across its eight distinctive neighborhoods, each with its own price range and features."
        },
        {
            question: "Which schools serve the Mountain's Edge community?",
            answer: "Mountain's Edge is served by several highly-rated schools in the Clark County School District including Wright Elementary School, Carolyn S. Reedom Elementary, Judith D. Steele Elementary, Lawrence & Heidi Canarelli Middle School, Faiss Middle School, Sierra Vista High School, and Desert Oasis High School. There are also several private and charter school options nearby including Pinecrest Academy and American Preparatory Academy."
        },
        {
            question: "What amenities are available in Mountain's Edge Las Vegas?",
            answer: "Mountain's Edge features numerous amenities including Exploration Peak Park (a 2,800-acre park with hiking trails, playground, and picnic areas), Nathaniel Jones Park (featuring basketball courts, splash pad, and dog park), Mountain's Edge Regional Park (with sports fields, walking paths, and recreation areas), community centers with fitness facilities, miles of walking and biking trails, multiple neighborhood parks, and nearby shopping centers, restaurants, and entertainment options."
        },
        {
            question: "How far is Mountain's Edge from the Las Vegas Strip and airport?",
            answer: "Mountain's Edge is conveniently located approximately 15 miles southwest of the Las Vegas Strip, which is about a 20-25 minute drive depending on traffic. Harry Reid International Airport (formerly McCarran) is roughly 17 miles away, typically a 25-30 minute drive. The community's location offers a peaceful suburban environment while maintaining easy access to Las Vegas's world-famous attractions and transportation hubs."
        },
        {
            question: "What are the HOA fees in Mountain's Edge?",
            answer: "HOA fees in Mountain's Edge typically range from $50-150 per month depending on the specific neighborhood. These fees cover maintenance of common areas, community amenities, and neighborhood security features. Some premium neighborhoods with additional amenities may have slightly higher fees. The Mountain's Edge Master Association fee is approximately $35-50 per month, with additional sub-association fees varying by neighborhood."
        },
        {
            question: "Is Mountain's Edge a good investment area in Las Vegas?",
            answer: "Mountain's Edge has consistently shown strong property value appreciation, making it an excellent investment area in Las Vegas. The master-planned community's amenities, location, and continued development contribute to its investment potential. Since its development in the early 2000s, homes in Mountain's Edge have maintained their value well, even during market fluctuations, and have shown consistent growth over time."
        },
        {
            question: "What shopping and dining options are near Mountain's Edge?",
            answer: "Mountain's Edge residents enjoy convenient access to numerous shopping and dining options including Mountain's Edge Marketplace, Blue Diamond Marketplace, Rhodes Ranch Town Center, grocery stores like Smith's and Albertsons, various restaurants including Settebello Pizzeria and Hokkaido Teppanyaki Hibachi, and major retailers such as Target and Home Depot within a short drive. Additionally, the community is just a 15-20 minute drive from Downtown Summerlin, offering premium shopping, dining, and entertainment options."
        },
        {
            question: "What is the weather like in Mountain's Edge Las Vegas?",
            answer: "Mountain's Edge experiences the desert climate typical of Las Vegas with some modifications due to its slightly higher elevation. Summers (June-September) are hot with temperatures frequently exceeding 100°F with low humidity. Winters (December-February) are mild with daytime temperatures averaging 55-65°F and nights occasionally dropping to the 30s. Spring and Fall are pleasant with temperatures ranging from 65-85°F. The area receives very low precipitation (approximately 4 inches annually) and enjoys over 300 sunny days per year."
        },
        {
            question: "Is Mountain's Edge a safe neighborhood?",
            answer: "Mountain's Edge is considered one of the safer neighborhoods in the Las Vegas area. The community features several gated sections, active neighborhood watch programs, and regular patrols. Crime rates are lower than Las Vegas averages, and the well-planned community design contributes to its safety profile. Additionally, the Las Vegas Metropolitan Police Department has a substation relatively close to the community, ensuring quick response times when needed."
        },
        {
            question: "What healthcare facilities are near Mountain's Edge?",
            answer: "Mountain's Edge residents have access to several healthcare options including Southern Hills Hospital (full-service hospital approximately 10 minutes away), Spring Valley Hospital (comprehensive medical center about 15 minutes from the community), multiple urgent care centers within 5-10 minutes including CareNow and UMC Quick Care, several medical plazas with specialists, dentists, and primary care physicians in the immediate area, and pharmacies such as CVS, Walgreens, and Smith's Pharmacy all within the community or very close by."
        }
    ];
    
    // Only create FAQ schema on relevant pages
    const path = window.location.pathname;
    if (path === '/' || path.includes('index.html') || path.includes('neighborhood-')) {
        createFaqSchema(mountainsEdgeFaqs);
    }
    
    // Create and add FAQ schema to the page
    function createFaqSchema(faqItems) {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                }
            }))
        };
        
        // Add schema to the page
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(faqSchema);
        document.head.appendChild(script);
        
        console.log('[SEO] Added FAQ schema with', faqItems.length, 'questions');
    }
});
