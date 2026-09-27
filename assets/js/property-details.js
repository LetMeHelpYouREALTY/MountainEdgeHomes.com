
document.addEventListener('DOMContentLoaded', function() {
    // Get the property ID from the URL
    const params = getUrlParams();
    const propertyId = parseInt(params.id, 10);
    
    if (!propertyId || isNaN(propertyId)) {
        showErrorMessage('Property not found. Please try again.');
        return;
    }
    
    // Find the property in our data
    const property = properties.find(p => p.id === propertyId);
    
    if (!property) {
        showErrorMessage('Property not found. Please try again.');
        return;
    }
    
    // Render the property details
    renderPropertyDetails(property);
    
    // Render similar properties
    renderSimilarProperties(property);
});

function showErrorMessage(message) {
    const propertyContent = document.getElementById('property-content');
    propertyContent.innerHTML = `
        <div class="error-message">
            <h2>Error</h2>
            <p>${message}</p>
            <a href="index.html" class="btn">Return to Home</a>
        </div>
    `;
}

function renderPropertyDetails(property) {
    const propertyContent = document.getElementById('property-content');
    
    // Create property details HTML
    const detailsHTML = `
        <div class="property-header">
            <div class="property-title-area">
                <h1>${property.title}</h1>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${property.location}</span>
                </div>
            </div>
            <div class="property-price">${property.price}</div>
        </div>
        
        <div class="property-gallery">
            <div class="gallery-image main-image">
                <img src="${property.image}" alt="${property.title}">
            </div>
            <div class="gallery-image">
                <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Property Interior">
            </div>
            <div class="gallery-image">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Property Kitchen">
                <div class="view-all-photos">
                    <i class="fas fa-images"></i> View All Photos
                </div>
            </div>
        </div>
        
        <div class="property-details-container">
            <div class="property-main-details">
                <div class="detail-section">
                    <h2>Property Details</h2>
                    <div class="property-specs">
                        <div class="spec-item">
                            <div class="spec-icon">
                                <i class="fas fa-bed"></i>
                            </div>
                            <div class="spec-name">Bedrooms</div>
                            <div class="spec-value">${property.bedrooms}</div>
                        </div>
                        <div class="spec-item">
                            <div class="spec-icon">
                                <i class="fas fa-bath"></i>
                            </div>
                            <div class="spec-name">Bathrooms</div>
                            <div class="spec-value">${property.bathrooms}</div>
                        </div>
                        <div class="spec-item">
                            <div class="spec-icon">
                                <i class="fas fa-ruler-combined"></i>
                            </div>
                            <div class="spec-name">Square Feet</div>
                            <div class="spec-value">${property.area}</div>
                        </div>
                        <div class="spec-item">
                            <div class="spec-icon">
                                <i class="fas fa-calendar-alt"></i>
                            </div>
                            <div class="spec-name">Year Built</div>
                            <div class="spec-value">2021</div>
                        </div>
                    </div>
                    
                    <div class="property-description">
                        <p>${property.description}</p>
                        <p>This exceptional mountain property offers unparalleled luxury and comfort in one of the most sought-after locations. Featuring high-end finishes throughout, including hardwood floors, granite countertops, and custom cabinetry. The open floor plan creates a seamless flow between living spaces, perfect for entertaining.</p>
                        <p>The gourmet kitchen includes top-of-the-line appliances, a spacious island, and ample storage. Large windows throughout the home showcase the breathtaking mountain views and fill the space with natural light. The primary suite features a luxurious bathroom with a soaking tub and separate shower.</p>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h2>Features & Amenities</h2>
                    <div class="property-features">
                        <div class="feature"><i class="fas fa-check"></i> Panoramic Mountain Views</div>
                        <div class="feature"><i class="fas fa-check"></i> Gourmet Kitchen</div>
                        <div class="feature"><i class="fas fa-check"></i> Hardwood Floors</div>
                        <div class="feature"><i class="fas fa-check"></i> Granite Countertops</div>
                        <div class="feature"><i class="fas fa-check"></i> Gas Fireplace</div>
                        <div class="feature"><i class="fas fa-check"></i> Heated Floors</div>
                        <div class="feature"><i class="fas fa-check"></i> Smart Home System</div>
                        <div class="feature"><i class="fas fa-check"></i> Home Theater</div>
                        <div class="feature"><i class="fas fa-check"></i> Wine Cellar</div>
                        <div class="feature"><i class="fas fa-check"></i> Outdoor Hot Tub</div>
                        <div class="feature"><i class="fas fa-check"></i> Covered Patio</div>
                        <div class="feature"><i class="fas fa-check"></i> 2-Car Garage</div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h2>Location</h2>
                    <div class="map-container">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26376.02482596!2d-115.2552!3d36.0051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c8c67a0333ff33%3A0x2c7ffe4df688c898!2sMountain's%20Edge%2C%20Las%20Vegas%2C%20NV!5e0!3m2!1sen!2sus!4v1620581000000!5m2!1sen!2sus" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy" title="Mountain's Edge, Las Vegas map"></iframe>
                    </div>
                    
                    <div class="location-details">
                        <p>Mountain's Edge is in southwest Las Vegas (89178), with parks, schools, and retail nearby. Typical drive times vary by traffic:</p>
                        <ul>
                            <li>Easy access to Blue Diamond Road and I-215</li>
                            <li>Parks and trails within the community</li>
                            <li>Shopping and dining along Blue Diamond corridor</li>
                            <li>Las Vegas Strip and airport within a reasonable drive</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="property-sidebar">
                <div class="contact-card">
                    <h3>Contact Agent</h3>
                    <div class="agent-info">
                        <div class="agent-image">
                            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="Real Estate Agent">
                        </div>
                        <div class="agent-details">
                            <h4>Dr. Jan Duffy</h4>
                            <p>Mountain Edge Homes · Berkshire Hathaway HomeServices Nevada Properties</p>
                        </div>
                    </div>
                    
                    <div class="agent-contacts">
                        <div class="agent-contact-item">
                            <i class="fas fa-phone"></i>
                            <span><a href="tel:+17029195002">(702) 919-5002</a></span>
                        </div>
                        <div class="agent-contact-item">
                            <i class="fas fa-envelope"></i>
                            <span><a href="mailto:DrJanSells@MountainEdgeHomes.com">DrJanSells@MountainEdgeHomes.com</a></span>
                        </div>
                    </div>
                    
                    <form class="contact-form" data-lead="true" data-lead-type="Property Inquiry" data-form-name="Property inquiry">
                        <div class="form-group">
                            <label for="name">Your Name</label>
                            <input type="text" id="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Your Email</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Your Phone</label>
                            <input type="tel" id="phone">
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" rows="4" required>I'm interested in learning more about this property.</textarea>
                        </div>
                        <button type="submit" class="btn">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    propertyContent.innerHTML = detailsHTML;
    
    if (window.MountainEdgeLeadForm && typeof window.MountainEdgeLeadForm.bindLeadForms === 'function') {
        window.MountainEdgeLeadForm.bindLeadForms();
    }
}

function renderSimilarProperties(currentProperty) {
    const similarPropertiesContainer = document.getElementById('similar-properties');
    
    // Find properties in the same location, excluding the current one
    let similarProperties = properties.filter(p => 
        p.id !== currentProperty.id && 
        p.location === currentProperty.location
    );
    
    // If we don't have enough similar properties by location, add some others
    if (similarProperties.length < 2) {
        const otherProperties = properties.filter(p => 
            p.id !== currentProperty.id && 
            !similarProperties.includes(p)
        );
        
        // Get random properties to fill up to 3 total
        while (similarProperties.length < 2 && otherProperties.length > 0) {
            const randomIndex = Math.floor(Math.random() * otherProperties.length);
            similarProperties.push(otherProperties.splice(randomIndex, 1)[0]);
        }
    }
    
    // Limit to 3 similar properties
    similarProperties = similarProperties.slice(0, 3);
    
    // Generate HTML for similar properties
    const propertiesHTML = similarProperties.map(property => generatePropertyCard(property)).join('');
    
    similarPropertiesContainer.innerHTML = propertiesHTML;
}
