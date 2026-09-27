document.addEventListener('DOMContentLoaded', function() {
    // Get the current neighborhood from the HTML filename
    const pagePath = window.location.pathname;
    const pageFilename = pagePath.substring(pagePath.lastIndexOf('/') + 1);

    // Extract neighborhood name from filename (e.g., neighborhood-aspire.html -> aspire)
    let neighborhoodName = pageFilename.replace('neighborhood-', '').replace('.html', '');

    // Format neighborhood name for display (replace hyphens with spaces and capitalize)
    let formattedName = neighborhoodName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    // Update page title and subtitle
    document.querySelectorAll('.neighborhood-title').forEach(el => {
        el.textContent = formattedName;
    });

    document.title = formattedName + ' | Mountain Edge Homes';

    // Update hero content if it exists
    const heroContent = document.querySelector('.hero-content h1');
    if (heroContent) {
        heroContent.textContent = `${formattedName} - Las Vegas Premium Mountain's Edge Living`;
    }

    // Update interest dropdown in contact form
    const interestSelect = document.getElementById('interest');
    if (interestSelect) {
        const options = interestSelect.querySelectorAll('option');
        options.forEach(option => {
            option.textContent = option.textContent.replace('[Neighborhood Name]', formattedName);
        });
    }

    // Update property listings
    const propertiesContainer = document.getElementById('neighborhood-properties');
    if (propertiesContainer) {
        // Filter properties for this neighborhood
        const neighborhoodProperties = properties.filter(property => {
            // Replace spaces with hyphens and make lowercase for comparison
            const propNeighborhood = property.neighborhood.toLowerCase().replace(/\s+/g, '-');
            return propNeighborhood === neighborhoodName;
        });

        if (neighborhoodProperties.length > 0) {
            propertiesContainer.innerHTML = neighborhoodProperties.map(property => 
                generatePropertyCard(property)
            ).join('');
        } else {
            propertiesContainer.innerHTML = `
                <div class="no-properties">
                    <p>There are currently no properties available in ${formattedName}.</p>
                    <p>Please check back soon or <a href="index.html#contact">contact us</a> for upcoming listings.</p>
                </div>
            `;
        }
    }

    // Update RealScout custom search parameter
    const realscoutElements = document.querySelectorAll('realscout-office-listings');
    realscoutElements.forEach(element => {
        if (element.hasAttribute('custom-search')) {
            const currentSearch = element.getAttribute('custom-search');
            if (currentSearch.includes('Mountain Edge')) {
                element.setAttribute('custom-search', `${formattedName} Mountain Edge`);
            }
        }
    });

    // Form submission handler
    const neighborhoodForm = document.getElementById('neighborhood-info-form');
    if (neighborhoodForm) {
        neighborhoodForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your interest in ' + formattedName + '! A representative will contact you shortly.');
            neighborhoodForm.reset();
        });
    }

    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.neighborhood-description, .neighborhood-image, .amenities-list, .gallery-item, .testimonial, .feature-list li');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight * 0.8) {
                element.classList.add('animated');
            }
        });
    };

    // Run once on load
    animateOnScroll();

    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Gallery image lightbox effect
    const galleryItems = document.querySelectorAll('.gallery-grid img');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Create lightbox elements
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';

            const lightboxContent = document.createElement('div');
            lightboxContent.className = 'lightbox-content';

            const lightboxImage = document.createElement('img');
            lightboxImage.src = this.src;

            const closeButton = document.createElement('span');
            closeButton.className = 'lightbox-close';
            closeButton.innerHTML = '&times;';

            // Append elements
            lightboxContent.appendChild(lightboxImage);
            lightboxContent.appendChild(closeButton);
            lightbox.appendChild(lightboxContent);
            document.body.appendChild(lightbox);

            // Prevent scrolling while lightbox is open
            document.body.style.overflow = 'hidden';

            // Close lightbox on click
            lightbox.addEventListener('click', function() {
                document.body.removeChild(lightbox);
                document.body.style.overflow = 'auto';
            });
        });
    });

});
// Neighborhood landing page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set unique background for each neighborhood
    const pageTitle = document.title;
    const heroSection = document.querySelector('.neighborhood-hero');
    
    if (heroSection) {
        if (pageTitle.includes('Aspire')) {
            heroSection.style.backgroundImage = "url('https://images.unsplash.com/photo-1585773690161-7b1cd0accfcf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')";
        } else if (pageTitle.includes('Cascade')) {
            heroSection.style.backgroundImage = "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')";
        } else if (pageTitle.includes('Collina')) {
            heroSection.style.backgroundImage = "url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')";
        } else if (pageTitle.includes('Mesa/Valla')) {
            heroSection.style.backgroundImage = "url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')";
        } else if (pageTitle.includes('Quintessa')) {
            heroSection.style.backgroundImage = "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')";
        } else if (pageTitle.includes('Sierra Madre')) {
            heroSection.style.backgroundImage = "url('https://images.unsplash.com/photo-1600607687939-ce8a6c349279?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')";
        }
    }

    // Lead forms use assets/js/lead-form.js → POST /api/lead

    // Smooth scroll for CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button, .secondary-cta');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Check if RealScout components are loaded
    const realscoutContainer = document.querySelector('.realscout-container');
    if (realscoutContainer) {
        // Add loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading properties...';
        realscoutContainer.appendChild(loadingIndicator);
        
        // Check if RealScout has loaded (in a real implementation, you'd use their API events)
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
            console.log('RealScout component refreshed');
        }, 2000);
    }
});
