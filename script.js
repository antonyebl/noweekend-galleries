document.addEventListener('DOMContentLoaded', () => {
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const galleryContainer = document.querySelector('.gallery-container');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    // Fetch the list of image filenames from the JSON file
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

            // Create image elements from the fetched list
            const images = imageFilenames.map(filename => {
                const img = document.createElement('img');
                img.src = filename; // Path is relative to the current folder
                img.alt = filename;
                img.classList.add('gallery-image');
                galleryWrapper.appendChild(img);
                return img;
            });

            // Duplicate images for the infinite loop effect
            images.forEach(img => {
                const clone = img.cloneNode(true);
                galleryWrapper.appendChild(clone);
            });

            // The rest of the script remains the same as before, 
            // but now it operates on the dynamically loaded images.

            let isDragging = false;
            let startPos = 0;
            let currentTranslate = 0;
            let prevTranslate = 0;
            let animationFrameId;

            // --- Mouse Drag Functionality ---
            galleryContainer.addEventListener('mousedown', (e) => {
                isDragging = true;
                startPos = e.clientX;
                galleryWrapper.style.transition = 'none';
                e.preventDefault();
            });

            galleryContainer.addEventListener('mouseleave', () => {
                isDragging = false;
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
            });

            galleryContainer.addEventListener('mouseup', () => {
                isDragging = false;
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
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
                const firstImage = galleryWrapper.querySelector('.gallery-image');
                if (!firstImage) return;

                const imageWidth = firstImage.offsetWidth;
                const gap = 15;
                let moveDistance;

                if (e.key === 'ArrowRight') {
                    moveDistance = -(imageWidth + gap);
                    smoothScroll(moveDistance);
                } else if (e.key === 'ArrowLeft') {
                    moveDistance = (imageWidth + gap);
                    smoothScroll(moveDistance);
                }
            });

            // --- Arrow Button Navigation ---
            leftArrow.addEventListener('click', () => {
                const firstImage = galleryWrapper.querySelector('.gallery-image');
                if (!firstImage) return;
                const imageWidth = firstImage.offsetWidth;
                const gap = 15;
                smoothScroll(imageWidth + gap);
            });

            rightArrow.addEventListener('click', () => {
                const firstImage = galleryWrapper.querySelector('.gallery-image');
                if (!firstImage) return;
                const imageWidth = firstImage.offsetWidth;
                const gap = 15;
                smoothScroll(-(imageWidth + gap));
            });

            // --- Helper Functions ---
            function setGalleryPosition() {
                galleryWrapper.style.transform = `translateX(${currentTranslate}px)`;
            }

            function checkAndLoop() {
                const originalImages = Array.from(galleryWrapper.querySelectorAll('.gallery-image')).slice(0, imageFilenames.length);
                let originalImagesTotalWidth = 0;
                originalImages.forEach(img => {
                    originalImagesTotalWidth += img.offsetWidth + 15;
                });
                originalImagesTotalWidth -= 15;

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

            // Initial check
            window.addEventListener('resize', () => {
                prevTranslate = currentTranslate;
                checkAndLoop();
            });

        })
        .catch(error => {
            console.error('Error fetching images:', error);
            // Handle the error, e.g., display a message to the user
            galleryWrapper.innerHTML = `<p style="color:white; text-align:center;">Error loading gallery. Please ensure the images.json file exists and is valid.</p>`;
        });
});
