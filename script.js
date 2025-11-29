// Opening Animation
const envelope = document.getElementById('envelope');
const opening = document.getElementById('opening');
const mainContent = document.getElementById('main-content');

envelope.addEventListener('click', function() {
    envelope.classList.add('open');
    
    // Create confetti
    for(let i = 0; i < 100; i++) {
        setTimeout(() => {
            createConfetti();
        }, i * 30);
    }

    // Hide opening and show content
    setTimeout(() => {
        opening.classList.add('hidden');
        setTimeout(() => {
            mainContent.classList.add('show');
        }, 500);
    }, 2000);
});

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.background = ['#FF6B9D', '#FFA07A', '#FFD700', '#C98EAF', '#FFE5E5'][Math.floor(Math.random() * 5)];
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(confetti);

    setTimeout(() => {
        confetti.remove();
    }, 5000);
}

// Carousel
let currentSlide = 0;
const totalSlides = 33;
const carouselInner = document.getElementById('carouselInner');
const indicatorsContainer = document.getElementById('indicators');

// Create indicators
for(let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement('div');
    indicator.className = 'indicator';
    if(i === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToSlide(i));
    indicatorsContainer.appendChild(indicator);
}

function moveCarousel(direction) {
    currentSlide += direction;
    if(currentSlide < 0) currentSlide = totalSlides - 1;
    if(currentSlide >= totalSlides) currentSlide = 0;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function updateCarousel() {
    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Auto-play carousel
setInterval(() => {
    moveCarousel(1);
}, 10000);

// Notes Toggle
const notesTrigger = document.getElementById('notesTrigger');
const notesContent = document.getElementById('notesContent');
let notesOpened = false;

notesTrigger.addEventListener('click', function() {
    if (!notesOpened) {
        notesContent.classList.add('show');
        notesTrigger.style.cursor = 'default';
        notesTrigger.style.opacity = '0.8';
        notesOpened = true;
    }
});
