document.addEventListener('DOMContentLoaded', () => {
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const galleryContainer = document.querySelector('.gallery-container');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    
    const allImages = [];

    fetch('images.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('images.json not found or could not be loaded.');
            }
            return response.json();
        })
        .then(imageData => {
            if (!Array.isArray(imageData)) {
                throw new Error('images.json content is not a valid array.');
            }

            // Create placeholders and start loading images
            imageData.forEach(item => {
                const imgWrapper = document.createElement('div');
                imgWrapper.classList.add('gallery-image-wrapper');
                imgWrapper.style.backgroundColor = item.avgColor;
                galleryWrapper.appendChild(imgWrapper);

                const img = document.createElement('img');
                img.src = item.filename;
                img.alt = item.filename;
                img.classList.add('gallery-image');
                imgWrapper.appendChild(img);
                allImages.push(img);

                img.onload = () => {
                    img.classList.add('loaded');
                };
            });

            // Set up gallery functionality immediately after placeholders are created
            setupGallery(imageData.map(i => i.filename));
        })
        .catch(error => {
            console.error('Error fetching images:', error);
            galleryWrapper.innerHTML = `<p style="color:white; text-align:center;">Error loading gallery. Please ensure the images.json file exists and is valid.</p>`;
        });

    function setupGallery(imageFilenames) {
        // ... (rest of the setupGallery function, including duplicating images and handling events) ...
        const imagesToDuplicate = document.querySelectorAll('.gallery-image-wrapper');
        imagesToDuplicate.forEach(imgWrapper => {
            const clone = imgWrapper.cloneNode(true);
            galleryWrapper.appendChild(clone);
        });

        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
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

            const moveDistance = (firstImage.offsetWidth + gap);
            if (e.key === 'ArrowRight') {
                smoothScroll(-moveDistance);
            } else if (e.key === 'ArrowLeft') {
                smoothScroll(moveDistance);
            }
        });

        // --- Arrow Button Navigation ---
        leftArrow.addEventListener('click', () => {
            const firstImage = allImages[0];
            if (!firstImage) return;
            const moveDistance = (firstImage.offsetWidth + gap);
            smoothScroll(moveDistance);
        });

        rightArrow.addEventListener('click', () => {
            const firstImage = allImages[0];
            if (!firstImage) return;
            const moveDistance = (firstImage.offsetWidth + gap);
            smoothScroll(-moveDistance);
        });

        // --- Helper Functions ---
        function setGalleryPosition() {
            galleryWrapper.style.transform = `translateX(${currentTranslate}px)`;
        }

        function checkAndLoop() {
            let originalImagesTotalWidth = 0;
            imagesToDuplicate.forEach(imgWrapper => {
                originalImagesTotalWidth += imgWrapper.offsetWidth + gap;
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

        window.addEventListener('resize', () => {
            prevTranslate = currentTranslate;
            checkAndLoop();
        });
    }
});
