// Enhanced script with config system and better organization
class RomanticApp {
    constructor() {
        this.config = null;
        this.noClicks = 0;
        this.elements = {};
        this.intervals = [];
        this.audioContext = null;

        this.init();
    }

    async init() {
        try {
            await this.loadConfig();
            this.cacheElements();
            this.applyConfig();
            this.setupEventListeners();
            this.startBackgroundEffects();
            this.hideLoading();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError();
            this.loadDefaults();
        }
    }

    async loadConfig() {
        try {
            const response = await fetch('config.json');
            if (!response.ok) throw new Error('Config not found');
            this.config = await response.json();
        } catch (error) {
            console.warn('Using default config:', error);
            this.config = this.getDefaultConfig();
        }
    }

    getDefaultConfig() {
        return {
            question: {
                text: "Will you be my girlfriend?",
                fontSize: "2.2rem",
                color: "#ffffff"
            },
            buttons: {
                yes: { text: "Yes ❤️", color: "#ff69b4", hoverColor: "#ff1493" },
                no: { text: "No", color: "#ff6b6b", hoverColor: "#ff4757" }
            },
            messages: {
                success: "Awww 😍 See you Friday!",
                rejection: ["Please...? 💕", "Pretty please? 🥺", "I promise I'll treat you right! 🌹"],
                finalMessage: "Only one choice remains 😈",
                systemError: "System Error... Accepting is mandatory 💘"
            },
            effects: {
                hearts: { enabled: true, colors: ["#ff69b4", "#ff1493", "#dc143c"], count: 100 },
                confetti: { enabled: true, colors: ["#ff69b4", "#ffd700", "#ff6347"], count: 80 },
                sound: { enabled: true, volume: 0.15 }
            },
            compliments: ["You're amazing! 💖", "You light up my world! ✨", "Best decision ever! 😍"],
            theme: {
                primaryColor: "#ff69b4",
                secondaryColor: "#ff1493",
                backgroundColor: "#0a0a0a",
                textColor: "#ffffff",
                fontFamily: "'Poppins', 'Arial', sans-serif"
            }
        };
    }

    cacheElements() {
        this.elements = {
            question: document.getElementById('question'),
            yesBtn: document.getElementById('yesBtn'),
            noBtn: document.getElementById('noBtn'),
            message: document.getElementById('message'),
            loading: document.getElementById('loading'),
            error: document.getElementById('error'),
            heartsBackground: document.getElementById('heartsBackground'),
            starsContainer: document.getElementById('starsContainer')
        };
    }

    applyConfig() {
        // Apply theme
        const root = document.documentElement;
        const theme = this.config.theme;

        root.style.setProperty('--primary-color', theme.primaryColor);
        root.style.setProperty('--secondary-color', theme.secondaryColor);
        root.style.setProperty('--background-color', theme.backgroundColor);
        root.style.setProperty('--text-color', theme.textColor);
        root.style.setProperty('--font-family', theme.fontFamily);

        // Apply content
        this.elements.question.textContent = this.config.question.text;
        this.elements.question.style.fontSize = this.config.question.fontSize;
        this.elements.question.style.color = this.config.question.color;

        // Apply button styles and text
        const yesBtn = this.elements.yesBtn.querySelector('.btn-text');
        const noBtn = this.elements.noBtn.querySelector('.btn-text');

        if (yesBtn) yesBtn.textContent = this.config.buttons.yes.text;
        if (noBtn) noBtn.textContent = this.config.buttons.no.text;
    }

    setupEventListeners() {
        // Yes button events
        this.elements.yesBtn.addEventListener('click', () => this.handleYesClick());
        this.elements.yesBtn.addEventListener('mouseenter', () => this.createBurstHearts());

        // No button events
        this.elements.noBtn.addEventListener('click', () => this.handleNoClick());
        this.elements.noBtn.addEventListener('mouseenter', () => this.shakeButton());

        // Touch support for mobile
        this.elements.yesBtn.addEventListener('touchstart', () => this.createBurstHearts());
        this.elements.noBtn.addEventListener('touchstart', () => this.shakeButton());
    }

    handleYesClick() {
        // Remove buttons
        this.elements.yesBtn.remove();
        this.elements.noBtn.remove();

        // Clear question
        this.elements.question.textContent = "";

        // Show success message
        this.elements.message.textContent = this.config.messages.success;
        this.elements.message.style.animation = 'fadeInUp 0.6s ease-out';

        // Trigger effects
        this.startHeartRain();
        this.startConfetti();
        this.playSound('success');
        this.pulseBackground();
        this.showFloatingCompliment();
    }

    handleNoClick() {
        this.noClicks++;
        this.playSound('rejection');
        this.flashBackground();

        const rejectionMessages = this.config.messages.rejection;

        if (this.noClicks <= rejectionMessages.length) {
            this.elements.question.textContent = rejectionMessages[this.noClicks - 1];
            this.moveButton(this.elements.noBtn);
        } else if (this.noClicks === rejectionMessages.length + 1) {
            document.body.classList.add('glitch');
            this.elements.question.textContent = this.config.messages.systemError;
            this.moveButton(this.elements.noBtn);
            setTimeout(() => document.body.classList.remove('glitch'), 1000);
        } else {
            this.elements.noBtn.remove();
            this.elements.question.textContent = this.config.messages.finalMessage;
        }
    }

    moveButton(button) {
        const padding = 50;
        const maxX = window.innerWidth - button.offsetWidth - padding;
        const maxY = window.innerHeight - button.offsetHeight - padding;

        const x = Math.random() * maxX + padding;
        const y = Math.random() * maxY + padding;

        button.style.position = 'fixed';
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
        button.style.zIndex = '1000';

        // Add rotation animation
        const rotation = (this.noClicks * 45) % 360;
        button.style.transform = `rotate(${rotation}deg)`;
        button.style.transition = 'all 0.4s ease-in-out';
    }

    shakeButton() {
        this.elements.noBtn.classList.add('shake');
        setTimeout(() => {
            this.elements.noBtn.classList.remove('shake');
        }, 500);
    }

    createBurstHearts() {
        if (!this.config.effects.hearts.enabled) return;

        const rect = this.elements.yesBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'burst-heart';
                heart.textContent = '💕';

                const angle = (i * 45) * Math.PI / 180;
                const distance = 60;
                const dx = Math.cos(angle) * distance;
                const dy = Math.sin(angle) * distance;

                heart.style.left = `${centerX}px`;
                heart.style.top = `${centerY}px`;
                heart.style.setProperty('--dx', `${dx}px`);
                heart.style.setProperty('--dy', `${dy}px`);

                document.body.appendChild(heart);

                setTimeout(() => heart.remove(), 1000);
            }, i * 50);
        }
    }

    startBackgroundEffects() {
        this.startFloatingHearts();
        this.startTwinklingStars();
    }

    startFloatingHearts() {
        if (!this.config.effects.hearts.enabled) return;

        const heartSymbols = ['💕', '💖', '💗', '💓', '💘', '💝'];

        const createHeart = () => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.fontSize = `${1 + Math.random()}rem`;
            heart.style.animationDuration = `${3 + Math.random() * 2}s`;
            heart.style.opacity = `${0.3 + Math.random() * 0.4}`;

            this.elements.heartsBackground.appendChild(heart);

            setTimeout(() => heart.remove(), 5000);
        };

        // Create hearts periodically
        const heartInterval = setInterval(createHeart, 800);
        this.intervals.push(heartInterval);
    }

    startTwinklingStars() {
        const createStar = () => {
            const star = document.createElement('div');
            star.className = 'twinkling-star';
            star.style.left = `${Math.random() * 100}vw`;
            star.style.top = `${Math.random() * 100}vh`;
            star.style.animationDuration = `${2 + Math.random() * 3}s`;
            star.style.animationDelay = `${Math.random() * 2}s`;

            this.elements.starsContainer.appendChild(star);

            setTimeout(() => star.remove(), 8000);
        };

        // Create initial stars
        for (let i = 0; i < 50; i++) {
            setTimeout(createStar, i * 100);
        }

        // Create stars periodically
        const starInterval = setInterval(createStar, 2000);
        this.intervals.push(starInterval);
    }

    startHeartRain() {
        if (!this.config.effects.hearts.enabled) return;

        const heartSymbols = ['💕', '💖', '💗', '💓', '💘', '💝', '❤️', '💙', '💜', '🧡'];
        const colors = this.config.effects.hearts.colors;

        const createRainHeart = () => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.fontSize = `${1.2 + Math.random() * 0.8}rem`;
            heart.style.color = colors[Math.floor(Math.random() * colors.length)];
            heart.style.animationDuration = `${2 + Math.random() * 2}s`;

            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 4500);
        };

        // Intensive heart rain for success
        for (let i = 0; i < this.config.effects.hearts.count; i++) {
            setTimeout(createRainHeart, i * 50);
        }

        const rainInterval = setInterval(createRainHeart, 150);
        setTimeout(() => clearInterval(rainInterval), 5000);
    }

    startConfetti() {
        if (!this.config.effects.confetti.enabled) return;

        const colors = this.config.effects.confetti.colors;

        const createConfetti = () => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4000);
        };

        // Create confetti burst
        for (let i = 0; i < this.config.effects.confetti.count; i++) {
            setTimeout(createConfetti, i * 30);
        }
    }

    showFloatingCompliment() {
        const compliments = this.config.compliments;
        const compliment = compliments[Math.floor(Math.random() * compliments.length)];

        const complimentEl = document.createElement('div');
        complimentEl.className = 'floating-compliment';
        complimentEl.textContent = compliment;
        complimentEl.style.left = `${20 + Math.random() * 60}vw`;
        complimentEl.style.top = '60vh';

        document.body.appendChild(complimentEl);

        setTimeout(() => complimentEl.remove(), 4000);
    }

    playSound(type) {
        if (!this.config.effects.sound.enabled) return;

        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            const ctx = this.audioContext;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            gainNode.gain.value = this.config.effects.sound.volume;

            if (type === 'success') {
                // Happy ascending tone
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, ctx.currentTime);
                oscillator.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.3);
                gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
                oscillator.stop(ctx.currentTime + 0.3);
            } else if (type === 'rejection') {
                // Disappointed descending tone
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(330, ctx.currentTime);
                oscillator.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.2);
                gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
                oscillator.stop(ctx.currentTime + 0.2);
            }

            oscillator.start();
        } catch (error) {
            console.warn('Audio playback failed:', error);
        }
    }

    pulseBackground() {
        document.body.classList.add('pulse-bg');
        setTimeout(() => {
            document.body.classList.remove('pulse-bg');
        }, 1000);
    }

    flashBackground() {
        document.body.classList.add('flash-bg');
        setTimeout(() => {
            document.body.classList.remove('flash-bg');
        }, 300);
    }

    hideLoading() {
        const loading = this.elements.loading;
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        }
    }

    showError() {
        const error = this.elements.error;
        if (error) {
            error.style.display = 'block';
            setTimeout(() => {
                error.style.display = 'none';
            }, 3000);
        }
    }

    loadDefaults() {
        this.cacheElements();
        this.applyConfig();
        this.setupEventListeners();
        this.startBackgroundEffects();
        this.hideLoading();
    }

    // Cleanup method for performance
    cleanup() {
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];

        if (this.audioContext) {
            this.audioContext.close();
        }

        // Remove all floating elements
        const floatingElements = document.querySelectorAll(
            '.floating-heart, .burst-heart, .confetti-piece, .twinkling-star, .floating-compliment'
        );
        floatingElements.forEach(el => el.remove());
    }
}

// Enhanced mobile support and accessibility
class MobileEnhancer {
    constructor() {
        this.setupMobileOptimizations();
        this.setupAccessibility();
    }

    setupMobileOptimizations() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Optimize for mobile performance
        if (window.innerWidth < 768) {
            // Reduce particles for better performance
            document.documentElement.style.setProperty('--mobile-optimization', 'true');
        }

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                // Recalculate positions after orientation change
                window.scrollTo(0, 0);
            }, 100);
        });
    }

    setupAccessibility() {
        // Add focus indicators for keyboard navigation
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });

        // Add aria labels
        const yesBtn = document.getElementById('yesBtn');
        const noBtn = document.getElementById('noBtn');

        if (yesBtn) yesBtn.setAttribute('aria-label', 'Accept the romantic proposal');
        if (noBtn) noBtn.setAttribute('aria-label', 'Decline the romantic proposal');

        // Respect reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-speed', '0.1s');
        }
    }
}

// Performance monitor
class PerformanceMonitor {
    constructor() {
        this.startTime = performance.now();
        this.frameCount = 0;
        this.lastFrame = this.startTime;

        if (window.innerWidth < 768) {
            this.monitorPerformance();
        }
    }

    monitorPerformance() {
        const monitor = () => {
            this.frameCount++;
            const currentTime = performance.now();

            if (currentTime - this.lastFrame > 100) { // Check every 100ms
                const fps = 1000 / (currentTime - this.lastFrame);

                if (fps < 30) {
                    // Reduce effects for better performance
                    this.optimizeForLowEnd();
                }

                this.lastFrame = currentTime;
            }

            requestAnimationFrame(monitor);
        };

        requestAnimationFrame(monitor);
    }

    optimizeForLowEnd() {
        // Remove some background elements for better performance
        const hearts = document.querySelectorAll('.floating-heart');
        const stars = document.querySelectorAll('.twinkling-star');

        hearts.forEach((heart, index) => {
            if (index % 2 === 0) heart.remove();
        });

        stars.forEach((star, index) => {
            if (index % 3 === 0) star.remove();
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new RomanticApp();
    const mobileEnhancer = new MobileEnhancer();
    const performanceMonitor = new PerformanceMonitor();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        app.cleanup();
    });

    // Handle visibility change (mobile app switching)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            app.cleanup();
        } else {
            app.startBackgroundEffects();
        }
    });
});

// Error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});