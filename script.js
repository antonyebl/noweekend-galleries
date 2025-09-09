document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('image-gallery');
    const galleryScroll = document.querySelector('.gallery-scroll');
    const galleryCounter = document.getElementById('gallery-counter');
    const loadingElement = document.getElementById('loading');
    
    // Create edge navigation zones
    const leftNav = document.createElement('div');
    leftNav.className = 'gallery-edge-nav left';
    document.body.appendChild(leftNav);
    
    const rightNav = document.createElement('div');
    rightNav.className = 'gallery-edge-nav right';
    document.body.appendChild(rightNav);
    
    // Function to load images from JSON
    function loadImagesFromJson() {
        // For local testing without a server
        const localImages = [
            {"url": "01.jpg", "alt": "Sunrise over mountains"},
            {"url": "02.jpg", "alt": "Early morning mist"},
            {"url": "03.jpg", "alt": "Sun rays through clouds"},
            {"url": "04.jpg", "alt": "Golden hour landscape"},
            {"url": "05.jpg", "alt": "Sunrise reflection on water"},
            {"url": "06.jpg", "alt": "Colorful morning sky"},
            {"url": "07.jpg", "alt": "Sun breaking horizon"},
            {"url": "08.jpg", "alt": "Dawn panoramic view"}
        ];
        processImages(localImages);
    }
    
    function processImages(images) {
        if (images.length === 0) {
            loadingElement.textContent = "No images found";
            return;
        }
        
        // Hide loading indicator
        loadingElement.style.display = 'none';
        
        // Create gallery items for each image
        images.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.style.animationDelay = `${index * 0.1}s`;
            
            const imgContainer = document.createElement('div');
            imgContainer.className = 'gallery-img-container';
            
            const img = document.createElement('img');
            img.src = image.url;
            img.alt = image.alt || `Image ${index + 1}`;
            img.className = 'gallery-img';
            
            imgContainer.appendChild(img);
            item.appendChild(imgContainer);
            gallery.appendChild(item);
        });
        
        // Initialize gallery navigation after images are loaded
        initGalleryNavigation(images.length);
    }
    
    function initGalleryNavigation(totalImages) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        if (galleryItems.length === 0) return;
        
        // Update counter and button states
        function updateUI() {
            const maxScrollPosition = gallery.scrollWidth - galleryScroll.clientWidth;
            let currentIndex = 0;
            let minDistance = Infinity;
            
            // Find which image is most centered
            galleryItems.forEach((item, index) => {
                const itemRect = item.getBoundingClientRect();
                const galleryRect = galleryScroll.getBoundingClientRect();
                const itemCenter = itemRect.left + itemRect.width/2;
                const galleryCenter = galleryRect.left + galleryRect.width/2;
                const distance = Math.abs(itemCenter - galleryCenter);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    currentIndex = index;
                }
            });
            
            galleryCounter.textContent = `${currentIndex + 1}/${totalImages}`;
        }
        
        // Edge navigation
        const leftEdge = document.querySelector('.gallery-edge-nav.left');
        const rightEdge = document.querySelector('.gallery-edge-nav.right');
        
        leftEdge.addEventListener('click', function() {
            galleryScroll.scrollBy({
                left: -galleryScroll.clientWidth * 0.8,
                behavior: 'smooth'
            });
        });
        
        rightEdge.addEventListener('click', function() {
            galleryScroll.scrollBy({
                left: galleryScroll.clientWidth * 0.8,
                behavior: 'smooth'
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') {
                galleryScroll.scrollBy({
                    left: galleryScroll.clientWidth * 0.8,
                    behavior: 'smooth'
                });
            } else if (e.key === 'ArrowLeft') {
                galleryScroll.scrollBy({
                    left: -galleryScroll.clientWidth * 0.8,
                    behavior: 'smooth'
                });
            }
        });
        
        // Update UI on scroll
        galleryScroll.addEventListener('scroll', updateUI);
        
        // Update on resize
        window.addEventListener('resize', updateUI);
        
        // Initialize
        updateUI();
        
        // Improved drag scrolling for mouse
        let isDragging = false;
        let startX;
        let scrollLeft;
        
        const startDrag = (e) => {
            // Only respond to left mouse button
            if (e.button !== 0) return;
            
            isDragging = true;
            startX = e.pageX - galleryScroll.offsetLeft;
            scrollLeft = galleryScroll.scrollLeft;
            galleryScroll.classList.add('grabbing');
            galleryScroll.style.scrollBehavior = 'auto';
            
            // Prevent text selection while dragging
            e.preventDefault();
        };
        
        const endDrag = () => {
            isDragging = false;
            galleryScroll.classList.remove('grabbing');
            galleryScroll.style.scrollBehavior = 'smooth';
        };
        
        const duringDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - galleryScroll.offsetLeft;
            const walk = (x - startX) * 2;
            galleryScroll.scrollLeft = scrollLeft - walk;
        };
        
        // Mouse events
        galleryScroll.addEventListener('mousedown', startDrag);
        galleryScroll.addEventListener('mouseleave', endDrag);
        galleryScroll.addEventListener('mouseup', endDrag);
        galleryScroll.addEventListener('mousemove', duringDrag);
        
        // Touch events for mobile
        galleryScroll.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - galleryScroll.offsetLeft;
            scrollLeft = galleryScroll.scrollLeft;
            galleryScroll.style.scrollBehavior = 'auto';
        }, { passive: true });
        
        galleryScroll.addEventListener('touchend', () => {
            isDragging = false;
            galleryScroll.style.scrollBehavior = 'smooth';
        });
        
        galleryScroll.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - galleryScroll.offsetLeft;
            const walk = (x - startX) * 2;
            galleryScroll.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    }
    
    // Start loading images
    loadImagesFromJson();
});
