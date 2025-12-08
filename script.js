// Opening Animation
const envelope = document.getElementById('envelope');
const opening = document.getElementById('opening');
const mainContent = document.getElementById('main-content');
const reminderModal = document.getElementById('reminderModal');
const continueBtn = document.getElementById('continueBtn');
const bgMusic = document.getElementById('bgMusic');
const musicSection = document.getElementById('musicSection');
const songAudios = document.querySelectorAll('.song-audio');

// Set background music volume
bgMusic.volume = 0.4;

envelope.addEventListener('click', function() {
    envelope.classList.add('open');

    // Hide opening and show reminder modal (NO CONFETTI YET)
    setTimeout(() => {
        opening.classList.add('hidden');
        
        // Show reminder modal after opening is hidden
        setTimeout(() => {
            reminderModal.classList.add('show');
        }, 500);
    }, 2000);
});

// Continue button click handler
continueBtn.addEventListener('click', function() {
    // Hide modal
    reminderModal.classList.remove('show');
    
    // Create confetti after modal starts hiding
    setTimeout(() => {
        for(let i = 0; i < 100; i++) {
            setTimeout(() => {
                createConfetti();
            }, i * 30);
        }
    }, 200);
    
    // Show main content after modal fades out
    setTimeout(() => {
        mainContent.classList.add('show');
        
        // Start background music with user interaction (GUARANTEED TO WORK)
        bgMusic.play().catch(err => {
            console.log('Background music autoplay prevented:', err);
        });
    }, 700);
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

// Background Music Control with Scroll Detection
let bgMusicWasPausedByScroll = false;

window.addEventListener('scroll', function() {
    // Check if musicSection exists before accessing it
    if (!musicSection) return;
    
    const musicSectionRect = musicSection.getBoundingClientRect();
    const isInMusicSection = musicSectionRect.top < window.innerHeight && musicSectionRect.bottom > 0;
    
    if (isInMusicSection && !bgMusic.paused) {
        bgMusic.pause();
        bgMusicWasPausedByScroll = true;
    } else if (!isInMusicSection && bgMusicWasPausedByScroll) {
        // Check if no song is currently playing
        let anySongPlaying = false;
        songAudios.forEach(audio => {
            if (!audio.paused) {
                anySongPlaying = true;
            }
        });
        
        if (!anySongPlaying) {
            bgMusic.play().catch(err => console.log('BG music resume error:', err));
        }
        bgMusicWasPausedByScroll = false;
    }
});

// Song Audio Controls - Pause BG music when song plays
songAudios.forEach(songAudio => {
    songAudio.addEventListener('play', function() {
        // Pause background music when any song starts playing
        if (!bgMusic.paused) {
            bgMusic.pause();
        }
        
        // Pause all other songs
        songAudios.forEach(otherAudio => {
            if (otherAudio !== songAudio && !otherAudio.paused) {
                otherAudio.pause();
            }
        });
    });
    
    songAudio.addEventListener('pause', function() {
        // Check if all songs are paused
        let allSongsPaused = true;
        songAudios.forEach(audio => {
            if (!audio.paused) {
                allSongsPaused = false;
            }
        });
        
        // Resume background music only if all songs are paused and not in music section
        if (allSongsPaused && !bgMusicWasPausedByScroll) {
            if (!musicSection) return;
            const musicSectionRect = musicSection.getBoundingClientRect();
            const isInMusicSection = musicSectionRect.top < window.innerHeight && musicSectionRect.bottom > 0;
            
            if (!isInMusicSection) {
                bgMusic.play().catch(err => console.log('BG music resume error:', err));
            }
        }
    });
    
    songAudio.addEventListener('ended', function() {
        // When song ends, check if should resume background music
        let allSongsPaused = true;
        songAudios.forEach(audio => {
            if (!audio.paused) {
                allSongsPaused = false;
            }
        });
        
        if (allSongsPaused && !bgMusicWasPausedByScroll) {
            if (!musicSection) return;
            const musicSectionRect = musicSection.getBoundingClientRect();
            const isInMusicSection = musicSectionRect.top < window.innerHeight && musicSectionRect.bottom > 0;
            
            if (!isInMusicSection) {
                bgMusic.play().catch(err => console.log('BG music resume error:', err));
            }
        }
    });
});

// Lyrics Toggle Function
function toggleLyrics(lyricsId, button) {
    const lyricsBox = document.getElementById(lyricsId);
    if (!lyricsBox) return;
    
    const isShowing = lyricsBox.classList.contains('show');
    
    if (isShowing) {
        lyricsBox.classList.remove('show');
        button.classList.remove('active');
        button.innerHTML = '<span class="icon">▼</span> Lihat Lirik';
    } else {
        lyricsBox.classList.add('show');
        button.classList.add('active');
        button.innerHTML = '<span class="icon">▲</span> Sembunyikan Lirik';
    }
}

// Carousel
let currentSlide = 0;
const totalSlides = 33;
const carouselInner = document.getElementById('carouselInner');
const indicatorsContainer = document.getElementById('indicators');

// Create indicators only if container exists
if (indicatorsContainer) {
    for(let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if(i === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }
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
    if (!carouselInner) return;
    
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

if (notesTrigger && notesContent) {
    notesTrigger.addEventListener('click', function() {
        if (!notesOpened) {
            notesContent.classList.add('show');
            notesTrigger.style.cursor = 'default';
            notesTrigger.style.opacity = '0.8';
            notesOpened = true;
        }
    });
}