document.addEventListener('DOMContentLoaded', () => {
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const galleryContainer = document.querySelector('.gallery-container');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    // A counter to track image loading
    let imagesLoadedCount = 0;
    const allImages = [];

    // --- Core Logic: Fetch and Load Images ---
    fetch('images.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('images.json not found or could not be loaded.');
            }
            return response.json();
        })
        .then(imageFilenames => {
            if (!Array.isArray(imageFilenames)) {
                throw new Error('images.json content is not a valid array.');
            }

            // Create and append original images
            imageFilenames.forEach(filename => {
                const img = document.createElement('img');
                img.src = filename;
                img.alt = filename;
                img.classList.add('gallery-image');
                galleryWrapper.appendChild(img);
                allImages.push(img);

                // Add an event listener to check when the image is fully loaded
                img.onload = () => {
                    imagesLoadedCount++;
                    if (imagesLoadedCount === imageFilenames.length) {
                        // All original images are loaded, now we can set up the gallery
                        setupGallery(imageFilenames);
                    }
                };
            });
        })
        .catch(error => {
            console.error('Error fetching images:', error);
            galleryWrapper.innerHTML = `<p style="color:white; text-align:center;">Error loading gallery. Please ensure the images.json file exists and is valid.</p>`;
        });

    // --- Setup function that runs AFTER all images are loaded ---
    function setupGallery(imageFilenames) {
        // Now that original images are loaded, create duplicates for the loop
        allImages.forEach(img => {
            const clone = img.cloneNode(true);
            galleryWrapper.appendChild(clone);
        });

        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationFrameId;
        const gap = 15;

        // --- Mouse Drag Functionality ---
        galleryContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startPos = e.clientX;
            galleryWrapper.style.transition = 'none';
            e.preventDefault();
        });

        galleryContainer.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        galleryContainer.addEventListener('mouseup', () => {
            isDragging = false;
            prevTranslate = currentTranslate;
            checkAndLoop();
        });

        galleryContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const currentPosition = e.clientX;
            currentTranslate = prevTranslate + currentPosition - startPos;
            requestAnimationFrame(setGalleryPosition);
        });

        // --- Keyboard Navigation ---
        document.addEventListener('keydown', (e) => {
            const firstImage = allImages[0];
            if (!firstImage) return;

            let moveDistance;
            if (e.key === 'ArrowRight') {
                moveDistance = -(firstImage.offsetWidth + gap);
                smoothScroll(moveDistance);
            } else if (e.key === 'ArrowLeft') {
                moveDistance = (firstImage.offsetWidth + gap);
                smoothScroll(moveDistance);
            }
        });

        // --- Arrow Button Navigation ---
        leftArrow.addEventListener('click', () => {
            const firstImage = allImages[0];
            if (!firstImage) return;
            smoothScroll(firstImage.offsetWidth + gap);
        });

        rightArrow.addEventListener('click', () => {
            const firstImage = allImages[0];
            if (!firstImage) return;
            smoothScroll(-(firstImage.offsetWidth + gap));
        });

        // --- Helper Functions ---
        function setGalleryPosition() {
            galleryWrapper.style.transform = `translateX(${currentTranslate}px)`;
        }

        function checkAndLoop() {
            let originalImagesTotalWidth = 0;
            allImages.forEach(img => {
                originalImagesTotalWidth += img.offsetWidth + gap;
            });
            originalImagesTotalWidth -= gap;

            if (currentTranslate < -originalImagesTotalWidth) {
                currentTranslate += originalImagesTotalWidth;
                galleryWrapper.style.transition = 'none';
                setGalleryPosition();
                galleryWrapper.offsetWidth;
            } else if (currentTranslate > 0) {
                currentTranslate -= originalImagesTotalWidth;
                galleryWrapper.style.transition = 'none';
                setGalleryPosition();
                galleryWrapper.offsetWidth;
            }
            prevTranslate = currentTranslate;
        }

        function smoothScroll(distance) {
            galleryWrapper.style.transition = 'transform 0.5s ease-out';
            currentTranslate += distance;
            setGalleryPosition();
            setTimeout(() => {
                prevTranslate = currentTranslate;
                checkAndLoop();
            }, 500);
        }

        // Initial check and resize handler
        window.addEventListener('resize', () => {
            prevTranslate = currentTranslate;
            checkAndLoop();
        });
    }
});
