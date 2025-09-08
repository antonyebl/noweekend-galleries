function initCarousel(folder, containerId) {
    const container = document.getElementById(containerId);
    const imgFiles = container.dataset.images.split(','); // list of images

    imgFiles.forEach(img => {
        const el = document.createElement('img');
        el.src = `${folder}/${img}`;
        container.appendChild(el);
    });

    // Optional: arrow scrolling
    const leftArrow = container.previousElementSibling;
    const rightArrow = container.nextElementSibling;

    if(leftArrow && rightArrow){
        leftArrow.addEventListener('click', () => container.scrollBy({ left: -300, behavior: 'smooth' }));
        rightArrow.addEventListener('click', () => container.scrollBy({ left: 300, behavior: 'smooth' }));
    }
}
