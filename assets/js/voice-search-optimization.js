
/**
 * Voice Search Optimization
 * Enhances the website for voice search queries by implementing
 * speakable structured data and natural language patterns
 */
document.addEventListener('DOMContentLoaded', function() {
    // Create speakable content schema for voice search
    function createSpeakableSchema() {
        // Only add speakable to main pages
        const eligiblePages = ['/', '/index.html', '/blog.html', '/home-value.html'];
        if (!eligiblePages.includes(window.location.pathname) && 
            !window.location.pathname.includes('neighborhood-')) {
            return;
        }
        
        // Find the best content for speakable sections
        const mainHeading = document.querySelector('h1');
        const subHeadings = document.querySelectorAll('h2');
        const introParagraphs = document.querySelectorAll('p.intro, .intro p, section.hero p, .hero-content p');
        
        // CSS selectors for speakable content
        const selectors = [];
        
        if (mainHeading) {
            // Add ID to heading if it doesn't have one
            if (!mainHeading.id) {
                mainHeading.id = 'main-heading';
            }
            selectors.push('#' + mainHeading.id);
        }
        
        // Add first 2-3 subheadings
        let headingCount = 0;
        subHeadings.forEach(heading => {
            if (headingCount < 2) {
                if (!heading.id) {
                    heading.id = 'sub-heading-' + headingCount;
                }
                selectors.push('#' + heading.id);
                headingCount++;
            }
        });
        
        // Add intro paragraphs
        let paraCount = 0;
        introParagraphs.forEach(para => {
            if (paraCount < 2) {
                if (!para.id) {
                    para.id = 'intro-para-' + paraCount;
                }
                selectors.push('#' + para.id);
                paraCount++;
            }
        });
        
        // Create speakable schema if we have selectors
        if (selectors.length > 0) {
            const speakableSchema = {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "speakable": {
                    "@type": "SpeakableSpecification",
                    "cssSelector": selectors
                },
                "url": window.location.href
            };
            
            // Add the schema to the page
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(speakableSchema);
            document.head.appendChild(script);
            
            console.log('[SEO] Added speakable schema for voice search');
        }
    }
    
    // Add natural language content markers
    function addVoiceSearchMarkers() {
        // Find question-like headings for FAQ sections
        const questionHeadings = document.querySelectorAll('h2, h3, h4');
        
        questionHeadings.forEach(heading => {
            const text = heading.textContent.trim();
            
            // If the heading looks like a question
            if (text.endsWith('?') || 
                text.startsWith('How') || 
                text.startsWith('What') || 
                text.startsWith('Where') || 
                text.startsWith('When') || 
                text.startsWith('Why') || 
                text.startsWith('Who') || 
                text.startsWith('Can')) {
                
                // Mark this as a potential voice search target
                heading.setAttribute('data-voice-target', 'question');
                
                // Find the answer paragraph
                let answer = heading.nextElementSibling;
                while (answer && answer.tagName !== 'H2' && answer.tagName !== 'H3' && answer.tagName !== 'H4') {
                    if (answer.tagName === 'P') {
                        answer.setAttribute('data-voice-target', 'answer');
                        break;
                    }
                    answer = answer.nextElementSibling;
                }
            }
        });
        
        // Add location markers for local search
        const locationMarkers = [
            "Mountain's Edge",
            "Las Vegas",
            "Nevada",
            "89178",
            "NV"
        ];
        
        // Find paragraphs with location info
        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(para => {
            let containsLocation = false;
            
            locationMarkers.forEach(marker => {
                if (para.textContent.includes(marker)) {
                    containsLocation = true;
                }
            });
            
            if (containsLocation) {
                para.setAttribute('data-voice-target', 'location');
            }
        });
    }
    
    // Call functions
    createSpeakableSchema();
    addVoiceSearchMarkers();
});
