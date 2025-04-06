
document.addEventListener('DOMContentLoaded', function() {
    // Dynamically generate breadcrumb schema based on page location
    function generateBreadcrumbSchema() {
        const currentPath = window.location.pathname;
        const pageName = document.title;
        
        // Default home page item
        let breadcrumbItems = [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://mountainedgehomes.com/"
            }
        ];
        
        // Add additional breadcrumb items based on current page
        if (currentPath !== '/' && currentPath !== '/index.html') {
            const pathSegments = currentPath.split('/').filter(segment => segment && segment !== 'index.html');
            
            pathSegments.forEach((segment, index) => {
                // Clean up segment name for display
                const segmentName = segment
                    .replace('.html', '')
                    .replace(/-/g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                
                breadcrumbItems.push({
                    "@type": "ListItem",
                    "position": index + 2,
                    "name": segmentName,
                    "item": `https://mountainedgehomes.com/${segment}`
                });
            });
        }
        
        // Create the breadcrumb schema
        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbItems
        };
        
        // Add schema to page
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(breadcrumbSchema);
        document.head.appendChild(script);
        
        // Optionally render visual breadcrumbs if they don't exist
        if (!document.querySelector('.breadcrumbs')) {
            const breadcrumbContainer = document.createElement('div');
            breadcrumbContainer.className = 'breadcrumbs';
            
            breadcrumbItems.forEach((item, index) => {
                const breadcrumbLink = document.createElement('a');
                breadcrumbLink.href = item.item;
                breadcrumbLink.textContent = item.name;
                breadcrumbContainer.appendChild(breadcrumbLink);
                
                if (index < breadcrumbItems.length - 1) {
                    const separator = document.createElement('span');
                    separator.className = 'breadcrumb-separator';
                    separator.innerHTML = ' &raquo; ';
                    breadcrumbContainer.appendChild(separator);
                }
            });
            
            // Add breadcrumbs after header if there's content
            const contentSection = document.querySelector('header + section');
            if (contentSection && breadcrumbItems.length > 1) {
                contentSection.parentNode.insertBefore(breadcrumbContainer, contentSection);
            }
        }
    }
    
    // Generate breadcrumb schema
    generateBreadcrumbSchema();
});
