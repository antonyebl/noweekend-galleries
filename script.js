document.addEventListener('DOMContentLoaded', function() {
    // Get the current gallery folder from the URL
    const pathSegments = window.location.pathname.split('/');
    const galleryFolder = pathSegments[pathSegments.length - 2];
    
    // Load images from the JSON file
    fetch('./images.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(images => {
            const gallery = document.getElementById('image-gallery');
            
            // Create gallery items for each image
            images.forEach((image, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.style.animationDelay = `${index * 0.1}s`;
                
                const img = document.createElement('img');
                img.src = image.url;
                img.alt = image.alt || `Image ${index + 1}`;
                img.className = 'gallery-img';
                
                // Lazy loading for better performance
                img.loading = 'lazy';
                
                item.appendChild(img);
                gallery.appendChild(item);
            });
            
            // Initialize gallery navigation after images are loaded
            initGalleryNavigation();
        })
        .catch(error => {
            console.error('Error loading images:', error);
            const gallery = document.getElementById('image-gallery');
            gallery.innerHTML = '<p class="error-message">Failed to load images. Please try again later.</p>';
        });
    
    function initGalleryNavigation() {
        const galleryScroll = document.querySelector('.gallery-scroll');
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        if (galleryItems.length === 0) return;
        
        // Calculate scroll amount (item width + gap)
        const firstItem = galleryItems[0];
        const itemStyle = window.getComputedStyle(firstItem);
        const itemWidth = firstItem.offsetWidth + parseInt(itemStyle.marginRight);
        
        // Next button event
        nextBtn.addEventListener('click', function() {
            galleryScroll.scrollBy({
                left: itemWidth,
                behavior: 'smooth'
            });
        });
        
        // Previous button event
        prevBtn.addEventListener('click', function() {
            galleryScroll.scrollBy({
                left: -itemWidth,
                behavior: 'smooth'
            });
        });
        
        // Keyboard navigation for accessibility
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') {
                nextBtn.click();
            } else if (e.key === 'ArrowLeft') {
                prevBtn.click();
            }
        });
        
        // Touch and mouse drag handling
        let isDown = false;
        let startX;
        let scrollLeft;
        
        galleryScroll.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - galleryScroll.offsetLeft;
            scrollLeft = galleryScroll.scrollLeft;
            galleryScroll.style.cursor = 'grabbing';
            galleryScroll.style.scrollBehavior = 'auto';
        });
        
        galleryScroll.addEventListener('mouseleave', () => {
            isDown = false;
            galleryScroll.style.cursor = 'grab';
            galleryScroll.style.scrollBehavior = 'smooth';
        });
        
        galleryScroll.addEventListener('mouseup', () => {
            isDown = false;
            galleryScroll.style.cursor = 'grab';
            galleryScroll.style.scrollBehavior = 'smooth';
        });
        
        galleryScroll.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - galleryScroll.offsetLeft;
            const walk = (x - startX) * 2;
            galleryScroll.scrollLeft = scrollLeft - walk;
        });
        
        // Touch events for mobile
        galleryScroll.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - galleryScroll.offsetLeft;
            scrollLeft = galleryScroll.scrollLeft;
            galleryScroll.style.scrollBehavior = 'auto';
        }, { passive: true });
        
        galleryScroll.addEventListener('touchend', () => {
            isDown = false;
            galleryScroll.style.scrollBehavior = 'smooth';
        });
        
        galleryScroll.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - galleryScroll.offsetLeft;
            const walk = (x - startX) * 2;
            galleryScroll.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    }
});
