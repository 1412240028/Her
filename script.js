// Opening Animation
const envelope = document.getElementById('envelope');
const opening = document.getElementById('opening');
const mainContent = document.getElementById('main-content');
const reminderModal = document.getElementById('reminderModal');
const continueBtn = document.getElementById('continueBtn');
const bgMusic = document.getElementById('bgMusic');
const musicSection = document.getElementById('musicSection');
const songAudios = document.querySelectorAll('.song-audio');

// Toast Player Elements
const musicToast = document.getElementById('musicToast');
const toastToggle = document.getElementById('toastToggle');
const toastContent = document.getElementById('toastContent');
const playPauseBtn = document.getElementById('playPauseBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');

// Set background music volume
bgMusic.volume = 0.4;

// Toast Player State
let isToastExpanded = true;
let bgMusicWasPausedManually = false;

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
        musicToast.classList.add('show');
        
        // Start background music with user interaction (GUARANTEED TO WORK)
        bgMusic.play().then(() => {
            updatePlayPauseButton();
        }).catch(err => {
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

// ===== TOAST PLAYER CONTROLS =====

// Toggle Toast Expand/Collapse
toastToggle.addEventListener('click', function() {
    isToastExpanded = !isToastExpanded;
    if (isToastExpanded) {
        toastContent.classList.remove('collapsed');
        toastToggle.querySelector('.toggle-icon').textContent = '▼';
    } else {
        toastContent.classList.add('collapsed');
        toastToggle.querySelector('.toggle-icon').textContent = '▲';
    }
});

// Play/Pause Button
playPauseBtn.addEventListener('click', function() {
    if (bgMusic.paused) {
        bgMusic.play();
        bgMusicWasPausedManually = false;
    } else {
        bgMusic.pause();
        bgMusicWasPausedManually = true;
    }
    updatePlayPauseButton();
});

function updatePlayPauseButton() {
    const icon = playPauseBtn.querySelector('.play-icon');
    if (bgMusic.paused) {
        icon.textContent = '▶';
        playPauseBtn.classList.remove('playing');
    } else {
        icon.textContent = '⏸';
        playPauseBtn.classList.add('playing');
    }
}

// Volume Control
volumeSlider.addEventListener('input', function() {
    const volume = this.value / 100;
    bgMusic.volume = volume;
    volumeValue.textContent = this.value + '%';
});

// Progress Bar Click
progressBar.addEventListener('click', function(e) {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    bgMusic.currentTime = percent * bgMusic.duration;
});

// Update Progress Bar
bgMusic.addEventListener('timeupdate', function() {
    if (bgMusic.duration) {
        const percent = (bgMusic.currentTime / bgMusic.duration) * 100;
        progressFill.style.width = percent + '%';
        
        currentTimeDisplay.textContent = formatTime(bgMusic.currentTime);
        durationDisplay.textContent = formatTime(bgMusic.duration);
    }
});

// Format Time Helper
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

// Song Audio Controls - Pause BG music when song plays
songAudios.forEach(songAudio => {
    songAudio.addEventListener('play', function() {
        // Pause background music when any song starts playing
        if (!bgMusic.paused) {
            bgMusic.pause();
            updatePlayPauseButton();
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
        
        // Resume background music only if not manually paused
        if (allSongsPaused && !bgMusicWasPausedManually) {
            bgMusic.play();
            updatePlayPauseButton();
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
        
        if (allSongsPaused && !bgMusicWasPausedManually) {
            bgMusic.play();
            updatePlayPauseButton();
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