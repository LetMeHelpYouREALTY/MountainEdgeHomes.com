
/**
 * Enhanced FAQ Schema Generator
 * Creates comprehensive structured data for frequently asked questions
 * Optimized for voice search and featured snippets
 */
document.addEventListener('DOMContentLoaded', function() {
    // Define comprehensive FAQs for all real estate topics
    const comprehensiveFaqs = [
        // Home Buying FAQs
        {
            question: "What is the average home price in Mountain's Edge Las Vegas?",
            answer: "The average home price in Mountain's Edge is approximately $750,000, with properties ranging from $500,000 to over $1.5 million depending on size, location, and amenities. The community offers a variety of housing options across its eight distinctive neighborhoods, each with its own price range and features. Entry-level homes typically start around $500,000-$650,000, mid-range properties from $650,000-$900,000, and luxury estates from $900,000 to $1.5 million and above.",
            categories: ["buying", "investment"]
        },
        {
            question: "What types of homes are available in Mountain's Edge?",
            answer: "Mountain's Edge offers a diverse range of home types including single-story ranches, two-story family homes, luxury estates with casitas, and semi-custom homes with 3-7 bedrooms ranging from 1,800 to 5,000+ square feet. Most homes feature desert landscaping, energy-efficient designs, and were built between 2004 and present. Architectural styles range from Spanish Colonial to Mediterranean to Contemporary Desert Modern, with newer construction primarily in the western sections of the community.",
            categories: ["buying"]
        },
        {
            question: "What is the real estate market trend in Mountain's Edge Las Vegas?",
            answer: "Mountain's Edge real estate has shown consistent appreciation of 5-7% annually over the past five years, outperforming the greater Las Vegas market by approximately 2%. Limited inventory and strong demand have created a competitive market for buyers, with homes selling in an average of 24 days, approximately 15% faster than the broader Las Vegas market. The area has demonstrated remarkable resilience during economic fluctuations, maintaining stronger value retention than many other Las Vegas communities.",
            categories: ["buying", "investment"]
        },
        {
            question: "How do I schedule a home showing in Mountain's Edge?",
            answer: "You can schedule a home showing by using our online booking system at mountainedgehomes.com/index.html#booking, calling us at (702) 919-5002, or emailing DrJanSells@MountainEdgeHomes.com. We offer various appointment types including in-person showings, virtual tours, and open house visits. For the best experience, we recommend scheduling at least 24-48 hours in advance, especially for occupied homes or gated communities that require resident notification.",
            categories: ["buying", "service"]
        },
        
        // Neighborhood FAQs
        {
            question: "Which neighborhoods are part of Mountain's Edge in Las Vegas?",
            answer: "Mountain's Edge includes eight distinctive neighborhoods: Aspire, Cascade at Mountain Pass, Collina, Mesa/Valla, Montelano, Quintessa, San Gabriel, and Sierra Madre. Each offers unique home styles and community amenities. Aspire features exclusive gated homes, Cascade at Mountain Pass offers guard-gated luxury living with mountain views, Collina provides stunning homes in picturesque settings, Mesa/Valla focuses on family-friendly designs, Montelano offers spacious lots, Quintessa emphasizes architectural distinction, San Gabriel provides diverse home styles, and Sierra Madre features prestigious homes with resort-style amenities.",
            categories: ["neighborhood"]
        },
        {
            question: "What is it like living in Mountain's Edge Las Vegas?",
            answer: "Living in Mountain's Edge offers a suburban desert lifestyle with an emphasis on outdoor recreation, family-friendly amenities, and a strong sense of community, all within a 20-minute drive to the Las Vegas Strip. Residents enjoy hiking trails, parks, and open spaces designed for year-round outdoor activities. The community hosts regular neighborhood gatherings, holiday celebrations, and seasonal festivals that create strong social bonds. With excellent schools, numerous playgrounds, and youth programs, it's particularly appealing to families. The area strikes an ideal balance between suburban tranquility and easy access to Las Vegas entertainment and employment centers.",
            categories: ["neighborhood", "lifestyle"]
        },
        {
            question: "What are the HOA fees in Mountain's Edge?",
            answer: "HOA fees in Mountain's Edge typically range from $50-150 per month depending on the specific neighborhood. The Mountain's Edge Master Association fee is approximately $35-50 per month, with additional sub-association fees varying by neighborhood. Premium neighborhoods with additional amenities may have slightly higher fees. These fees cover maintenance of common areas, community amenities, and neighborhood security features. The HOAs are professionally managed and provide regular financial reports to homeowners. Some neighborhoods like Cascade at Mountain Pass include additional services such as guard-gated security in their fees.",
            categories: ["neighborhood", "buying"]
        },
        
        // Amenities FAQs
        {
            question: "What amenities are available in Mountain's Edge Las Vegas?",
            answer: "Mountain's Edge features numerous amenities including Exploration Peak Park (a 2,800-acre park with hiking trails, playground, and picnic areas), Nathaniel Jones Park (featuring basketball courts, splash pad, and dog park), Mountain's Edge Regional Park (with sports fields, walking paths, and recreation areas), community centers with fitness facilities, miles of walking and biking trails, multiple neighborhood parks, and nearby shopping centers, restaurants, and entertainment options. The community was designed with sustainability in mind, featuring desert-adaptive landscaping throughout its public spaces.",
            categories: ["amenities", "lifestyle"]
        },
        {
            question: "What shopping and dining options are near Mountain's Edge?",
            answer: "Mountain's Edge residents enjoy convenient access to numerous shopping and dining options including Mountain's Edge Marketplace, Blue Diamond Marketplace, Rhodes Ranch Town Center, grocery stores like Smith's and Albertsons, various restaurants including Settebello Pizzeria and Hokkaido Teppanyaki Hibachi, and major retailers such as Target and Home Depot within a short drive. Additionally, the community is just a 15-20 minute drive from Downtown Summerlin, offering premium shopping, dining, and entertainment options including Red Rock Casino and City National Arena.",
            categories: ["amenities", "lifestyle"]
        },
        {
            question: "How far is Mountain's Edge from the Las Vegas Strip and airport?",
            answer: "Mountain's Edge is conveniently located approximately 15 miles southwest of the Las Vegas Strip, which is about a 20-25 minute drive depending on traffic. Harry Reid International Airport (formerly McCarran) is roughly 17 miles away, typically a 25-30 minute drive. The community's location offers a peaceful suburban environment while maintaining easy access to Las Vegas's world-famous attractions and transportation hubs. The drive to both destinations is straightforward via the 215 Beltway, which has multiple access points near Mountain's Edge.",
            categories: ["amenities", "neighborhood"]
        },
        
        // Schools FAQs
        {
            question: "Which schools serve the Mountain's Edge community?",
            answer: "Mountain's Edge is served by several highly-rated schools in the Clark County School District including Wright Elementary School, Carolyn S. Reedom Elementary, Judith D. Steele Elementary, Lawrence & Heidi Canarelli Middle School, Faiss Middle School, Sierra Vista High School, and Desert Oasis High School. There are also several private and charter school options nearby including Pinecrest Academy and American Preparatory Academy. For the most current school assignment information, families should verify with the Clark County School District or contact our office for assistance.",
            categories: ["schools", "neighborhood"]
        },
        {
            question: "How are the schools rated in Mountain's Edge Las Vegas?",
            answer: "Schools serving Mountain's Edge are generally rated above average for Las Vegas, with elementary schools receiving 7-8/10 ratings, middle schools 6-7/10, and high schools 6-7/10 according to GreatSchools, placing them among the better-performing public schools in Clark County. Many Mountain's Edge schools offer specialized programs including GATE (Gifted and Talented Education), advanced placement courses, and extracurricular activities ranging from robotics to performing arts. The area's schools benefit from strong parental involvement and community support.",
            categories: ["schools"]
        },
        
        // Investment FAQs
        {
            question: "Is Mountain's Edge a good investment area in Las Vegas?",
            answer: "Mountain's Edge has consistently shown strong property value appreciation, making it an excellent investment area in Las Vegas. The master-planned community's amenities, location, and continued development contribute to its investment potential. Since its development in the early 2000s, homes in Mountain's Edge have maintained their value well, even during market fluctuations, and have shown consistent growth over time. Properties typically appreciate 5-7% annually, outperforming Las Vegas averages by approximately 2%, while rental properties generally achieve 4-6% returns after expenses.",
            categories: ["investment", "buying"]
        },
        {
            question: "What is the rental market like in Mountain's Edge?",
            answer: "The Mountain's Edge rental market is strong with high demand, average monthly rents of $2,500-$4,500 for single-family homes, typical cash flow returns of 4-6%, low vacancy rates (under 5%), and stable tenancy averaging 2+ years. The neighborhood attracts quality tenants including professionals, families with children, and military personnel. Properties in gated communities command 10-15% higher rents but have increased HOA fees. Rental restrictions vary by neighborhood - some limit the percentage of rental properties allowed, so investors should verify these details before purchasing.",
            categories: ["investment"]
        },
        
        // Lifestyle FAQs
        {
            question: "What is the weather like in Mountain's Edge Las Vegas?",
            answer: "Mountain's Edge experiences the desert climate typical of Las Vegas with some modifications due to its slightly higher elevation. Summers (June-September) are hot with temperatures frequently exceeding 100°F with low humidity. Winters (December-February) are mild with daytime temperatures averaging 55-65°F and nights occasionally dropping to the 30s. Spring and Fall are pleasant with temperatures ranging from 65-85°F. The area receives very low precipitation (approximately 4 inches annually) and enjoys over 300 sunny days per year. The community's elevation provides slightly cooler temperatures than the Las Vegas valley floor.",
            categories: ["lifestyle", "neighborhood"]
        },
        {
            question: "Is Mountain's Edge a safe neighborhood?",
            answer: "Mountain's Edge is considered one of the safer neighborhoods in the Las Vegas area. The community features several gated sections, active neighborhood watch programs, and regular patrols. Crime rates are lower than Las Vegas averages, and the well-planned community design contributes to its safety profile. Additionally, the Las Vegas Metropolitan Police Department has a substation relatively close to the community, ensuring quick response times when needed. The strong sense of community and high percentage of owner-occupied homes creates natural neighborhood vigilance.",
            categories: ["lifestyle", "neighborhood"]
        },
        {
            question: "What healthcare facilities are near Mountain's Edge?",
            answer: "Mountain's Edge residents have access to several healthcare options including Southern Hills Hospital (full-service hospital approximately 10 minutes away), Spring Valley Hospital (comprehensive medical center about 15 minutes from the community), multiple urgent care centers within 5-10 minutes including CareNow and UMC Quick Care, several medical plazas with specialists, dentists, and primary care physicians in the immediate area, and pharmacies such as CVS, Walgreens, and Smith's Pharmacy all within the community or very close by.",
            categories: ["lifestyle", "amenities"]
        }
    ];
    
    // Generate FAQ schema based on current page
    function generateEnhancedFaqSchema() {
        const path = window.location.pathname;
        let pageFaqs = [];
        
        // Filter FAQs based on page
        if (path === '/' || path.includes('index.html')) {
            // Homepage FAQs should focus on general information and buying
            pageFaqs = comprehensiveFaqs.filter(faq => 
                faq.categories.includes('buying') || 
                faq.categories.includes('neighborhood') ||
                faq.categories.includes('lifestyle')
            ).slice(0, 10); // Limit to 10 questions for homepage
        } else if (path.includes('faq.html')) {
            // FAQ page gets all FAQs
            pageFaqs = comprehensiveFaqs;
        } else if (path.includes('neighborhood-')) {
            // Neighborhood pages get neighborhood-specific FAQs
            pageFaqs = comprehensiveFaqs.filter(faq => 
                faq.categories.includes('neighborhood')
            );
        } else if (path.includes('home-value.html')) {
            // Home value page gets investment and buying FAQs
            pageFaqs = comprehensiveFaqs.filter(faq => 
                faq.categories.includes('investment') || 
                faq.categories.includes('buying')
            );
        } else {
            // Default: Include top 5 general FAQs
            pageFaqs = comprehensiveFaqs.slice(0, 5);
        }
        
        // Create schema
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": pageFaqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };
        
        // Check for existing schema to avoid duplicates
        const existingSchema = document.querySelector('script[id="faq-schema"]');
        if (existingSchema) {
            existingSchema.textContent = JSON.stringify(faqSchema);
        } else {
            // Add new schema to page
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = 'faq-schema';
            script.textContent = JSON.stringify(faqSchema);
            document.head.appendChild(script);
        }
        
        console.log('[SEO] Added enhanced FAQ schema with', pageFaqs.length, 'questions optimized for featured snippets');
    }
    
    // Initialize FAQ schema
    generateEnhancedFaqSchema();
    
    // Optional: Create actual FAQ elements on the page if on FAQ page
    const path = window.location.pathname;
    if (path.includes('faq.html')) {
        const faqContainer = document.querySelector('.faq-container');
        if (faqContainer) {
            // Clear existing FAQs
            faqContainer.innerHTML = '';
            
            // Add FAQ items to page
            comprehensiveFaqs.forEach(faq => {
                const categoryAttr = faq.categories.join(' ');
                
                const faqItem = document.createElement('div');
                faqItem.className = 'faq-item';
                faqItem.setAttribute('data-category', categoryAttr);
                
                faqItem.innerHTML = `
                    <div class="faq-question" data-voice-target="question">
                        ${faq.question}
                    </div>
                    <div class="faq-answer">
                        <div class="faq-answer-content" data-voice-target="answer">
                            <div class="featured-snippet-candidate">
                                <p class="quick-answer">${faq.answer.split('.')[0]}.</p>
                            </div>
                            <p>${faq.answer}</p>
                        </div>
                    </div>
                `;
                
                faqContainer.appendChild(faqItem);
            });
            
            console.log('[SEO] Generated', comprehensiveFaqs.length, 'FAQ elements on page');
        }
    }
});
