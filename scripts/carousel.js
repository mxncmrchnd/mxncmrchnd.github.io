let index = 0;

function getVisibleItems() {
    return window.innerWidth <= 768 ? 1 : 2;
}

function moveSlide(direction) {
    const track = document.getElementById("carouselTrack");
    const items = track.children;
    const visibleItems = getVisibleItems();
    const maxIndex = items.length - visibleItems;

    index += direction;

    if (index < 0) index = maxIndex;
    if (index > maxIndex) index = 0;

    const itemWidth = items[0].offsetWidth + 16; // 16px gap
    track.style.transform = `translateX(-${index * itemWidth}px)`;
}

window.addEventListener("resize", () => {
    index = 0;
    document.getElementById("carouselTrack").style.transform = `translateX(0)`;
});
