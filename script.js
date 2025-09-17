const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const question = document.getElementById('question');
const message = document.getElementById('message');
let noClicks = 0;
let noBtnAngle = 0;
const confettiColors = ['#ff69b4', '#ffd700', '#00e6e6', '#ff6347', '#7cfc00', '#1e90ff'];


function startRainbowBackground() {
    let hue = 0;
    setInterval(() => {
        document.body.style.background = `linear-gradient(120deg, hsl(${hue},70%,20%), hsl(${(hue+60)%360},70%,20%))`;
        hue = (hue + 1) % 360;
    }, 30);
}
startRainbowBackground();

yesBtn.addEventListener('click', () => {
    yesBtn.remove();
    noBtn.remove();
    question.textContent = "";
    message.textContent = "Awww 😍 See you Friday!";
    heartEffect();
    confettiEffect();
    playSound('yes');
    pulseBackground();
    floatingCompliment();
});

noBtn.addEventListener('click', () => {
    noClicks++;
    playSound('no');
    flashBackground();

    const funMessages = [
        "Please...? 😥",
        "Please... 🥺",
        "Pretty please? 🥹"
    ];

    if (noClicks <= funMessages.length) {
        question.textContent = funMessages[noClicks - 1];
        moveButtonFancy(noBtn, noClicks);
    } else if (noClicks === 4) {
        document.body.style.animation = 'glitch 0.3s infinite';
        question.textContent = "System Error... Accepting is mandatory 😵";
        moveButtonFancy(noBtn, noClicks);
    } else {
        noBtn.remove();
        question.textContent = "Only one choice remains 😈";
    }
});

yesBtn.addEventListener('mouseenter', () => {
    for (let i = 0; i < 12; i++) {
        setTimeout(() => burstHeart(yesBtn), i * 40);
    }
});

function burstHeart(btn) {
    const rect = btn.getBoundingClientRect();
    const heart = document.createElement('div');
    heart.className = 'burst-heart';
    heart.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 60}px`;
    heart.style.top = `${rect.top + rect.height / 2 + (Math.random() - 0.5) * 30}px`;
    heart.style.setProperty('--angle', `${Math.random() * 360}deg`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 900);
}

noBtn.addEventListener('mouseenter', () => {
    noBtn.classList.add('shake');
    setTimeout(() => noBtn.classList.remove('shake'), 400);
});

function moveButtonFancy(button, clickCount) {
    const btnWidth = button.offsetWidth;
    const btnHeight = button.offsetHeight;
    const padding = 40;
    const x = Math.random() * (window.innerWidth - btnWidth - padding);
    const y = Math.random() * (window.innerHeight - btnHeight - padding);

    button.style.position = 'absolute';
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;

    noBtnAngle += 45;
    button.animate([
        { transform: `scale(1) rotate(${noBtnAngle - 45}deg)` },
        { transform: `scale(1.2) rotate(${noBtnAngle}deg)` },
        { transform: `scale(1) rotate(${noBtnAngle}deg)` }
    ], {
        duration: 400,
        easing: 'ease-in-out'
    });
}

function heartEffect() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.animationDuration = (2 + Math.random() * 2) + 's';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 5000);
    }, 100);
}

function confettiEffect() {
    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            confetti.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 2000);
        }, i * 10);
    }
}

function playSound(type) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);

    if (type === 'yes') {
        o.type = 'triangle';
        o.frequency.value = 880;
        g.gain.value = 0.15;
        o.start();
        o.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.25);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
        o.stop(ctx.currentTime + 0.25);
    } else {
        o.type = 'square';
        o.frequency.value = 220;
        g.gain.value = 0.12;
        o.start();
        o.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.18);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.18);
        o.stop(ctx.currentTime + 0.18);
    }
}

function pulseBackground() {
    document.body.classList.add('pulse-bg');
    setTimeout(() => document.body.classList.remove('pulse-bg'), 700);
}

function flashBackground() {
    document.body.classList.add('flash-bg');
    setTimeout(() => document.body.classList.remove('flash-bg'), 200);
}

// Floating background shapes
function floatingShapes() {
    for (let i = 0; i < 12; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        shape.style.left = `${Math.random() * 100}vw`;
        shape.style.animationDuration = `${8 + Math.random() * 8}s`;
        shape.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        shape.style.opacity = 0.18 + Math.random() * 0.18;
        shape.style.width = shape.style.height = `${24 + Math.random() * 32}px`;
        shape.style.borderRadius = Math.random() > 0.5 ? '50%' : '30% 70% 70% 30% / 30% 30% 70% 70%';
        document.body.appendChild(shape);
        setTimeout(() => shape.remove(), 18000);
    }
    setTimeout(floatingShapes, 5000);
}
floatingShapes();

// Twinkling star background
function twinkleStars() {
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.className = 'twinkle-star';
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDuration = `${2 + Math.random() * 3}s`;
        star.style.opacity = 0.2 + Math.random() * 0.5;
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 6000);
    }
    setTimeout(twinkleStars, 1200);
}
twinkleStars();

function floatingCompliment() {
    const compliments = [
        "You're amazing! 💖",
        "You light up my world! ✨",
        "Best decision ever! 😍",
        "You make my heart flutter! 🦋"
    ];
    const compliment = document.createElement('div');
    compliment.className = 'floating-compliment';
    compliment.textContent = compliments[Math.floor(Math.random() * compliments.length)];
    compliment.style.left = `${30 + Math.random() * 40}vw`;
    compliment.style.top = '60vh';
    document.body.appendChild(compliment);
    setTimeout(() => compliment.remove(), 4000);
}
