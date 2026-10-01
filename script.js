/** 
 * CONFIGURATION - Edit text and images here
 */
const CONFIG = {
  names: {
    mine: "Vishnu",
    hers: "Tanu (Chutku pack)"
  },
  storyPages: [
    {
      img: "pics/ghibli/story_1.jpg",
      heading: "Two Cities, One Heart",
      text: "Gandhinagar to Panipat is a long way. But my heart is always right there with you."
    },
    {
      img: "pics/ghibli/story_2.jpg",
      heading: "I Miss You",
      text: "It's been so long since we met. Every day without seeing your smile feels incomplete."
    },
    {
      img: "pics/ghibli/story_3.jpg",
      heading: "The Bumps in the Road",
      text: "Distance made things hard. The fights, the misunderstandings... I know they hurt us both, and I hate that."
    },
    {
      img: "pics/ghibli/story_4.jpg",
      heading: "Trying My Best",
      text: "I am trying so hard to find a way to meet you. You mean everything to me, and I won't stop trying."
    },
    {
      img: "pics/ghibli/story_5.jpg",
      heading: "A Promise",
      text: "Things will get better, my Chutku pack. We will be together soon. I promise."
    }
  ],
  noteLines: [
    "I'm so sorry for letting the distance create shadows between us.",
    "Every day without you is a day my heart feels incomplete.",
    "I promise to hold on tighter, to fight for us, and to close this distance soon.",
    "You are my forever, Chutku pack. I love you endlessly."
  ],
  finalPhoto: "pics/ghibli/final_photo.jpg",
  yesMessage: "Let's decide on the time soon! (Maybe next weekend? 😊)"
};

/**
 * STATE MANAGEMENT
 */
let currentScreen = 'welcome';
let currentStoryPage = 0;
let noteRevealed = false;

// DOM Elements
const screens = {
  welcome: document.getElementById('screen-welcome'),
  storybook: document.getElementById('screen-storybook'),
  sorryNote: document.getElementById('screen-sorry-note'),
  photoReveal: document.getElementById('screen-photo-reveal'),
  question: document.getElementById('screen-question'),
  yes: document.getElementById('screen-yes')
};

/**
 * SCREEN NAVIGATION
 */
function goToScreen(screenId) {
  Object.values(screens).forEach(screen => {
    screen.classList.remove('active');
  });
  screens[screenId].classList.add('active');
  currentScreen = screenId;
}

// 1. Welcome to Storybook
document.getElementById('btn-open-story').addEventListener('click', () => {
  goToScreen('storybook');
  initStorybook();
});

/**
 * STORYBOOK LOGIC
 */
const storyImg = document.getElementById('story-img');
const storyHeading = document.getElementById('story-heading');
const storyText = document.getElementById('story-text');
const btnPrev = document.getElementById('btn-prev-page');
const btnNext = document.getElementById('btn-next-page');
const progressContainer = document.getElementById('story-progress');

function initStorybook() {
  // Create dots
  progressContainer.innerHTML = '';
  CONFIG.storyPages.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (idx === 0) dot.classList.add('active');
    progressContainer.appendChild(dot);
  });
  updateStoryPage();
}

function updateStoryPage() {
  const page = CONFIG.storyPages[currentStoryPage];
  
  // Fade out slightly
  storyImg.style.opacity = 0;
  
  setTimeout(() => {
    storyImg.src = page.img;
    storyHeading.textContent = page.heading;
    storyText.textContent = page.text;
    storyImg.style.opacity = 1;
  }, 200);

  // Update dots
  const dots = progressContainer.querySelectorAll('.dot');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentStoryPage);
  });

  // Buttons
  btnPrev.classList.toggle('hidden', currentStoryPage === 0);
  
  if (currentStoryPage === CONFIG.storyPages.length - 1) {
    btnNext.innerHTML = '❤️'; // Finish icon
  } else {
    btnNext.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
  }
}

btnPrev.addEventListener('click', () => {
  if (currentStoryPage > 0) {
    currentStoryPage--;
    updateStoryPage();
  }
});

btnNext.addEventListener('click', () => {
  if (currentStoryPage < CONFIG.storyPages.length - 1) {
    currentStoryPage++;
    updateStoryPage();
  } else {
    // Go to sorry note
    goToScreen('sorryNote');
    startNoteReveal();
  }
});

/**
 * SORRY NOTE LOGIC
 */
const noteLinesContainer = document.getElementById('note-lines');
const btnILoveYou = document.getElementById('btn-i-love-you');

function startNoteReveal() {
  if (noteRevealed) return;
  noteRevealed = true;
  
  noteLinesContainer.innerHTML = '';
  CONFIG.noteLines.forEach((line, idx) => {
    const p = document.createElement('p');
    p.classList.add('note-line');
    p.textContent = line;
    noteLinesContainer.appendChild(p);
    
    setTimeout(() => {
      p.classList.add('visible');
    }, 1000 + (idx * 1500)); // Reveal one by one
  });

  setTimeout(() => {
    btnILoveYou.classList.remove('hidden');
  }, 1000 + (CONFIG.noteLines.length * 1500));
}

/**
 * PHOTO REVEAL LOGIC
 */
const photoFrame = document.querySelector('.photo-frame');
const btnWhatsNext = document.getElementById('btn-whats-next');

btnILoveYou.addEventListener('click', () => {
  // Burst hearts (via canvas particle system config change)
  createBurst(window.innerWidth / 2, window.innerHeight / 2);
  
  setTimeout(() => {
    goToScreen('photoReveal');
    setTimeout(() => {
      photoFrame.classList.add('revealed');
      setTimeout(() => {
        btnWhatsNext.classList.remove('hidden');
      }, 1500);
    }, 300);
  }, 500);
});

btnWhatsNext.addEventListener('click', () => {
  goToScreen('question');
});

/**
 * QUESTION LOGIC (Dodge Button)
 */
const btnNo = document.getElementById('btn-no');
const btnYes = document.getElementById('btn-yes');

let noDodgeMultiplier = 1;

function moveNoButton(e) {
  if (e) e.preventDefault(); // Prevent double firing on touch

  const rect = btnNo.getBoundingClientRect();
  createPopEffect(rect);

  // Move button out to body to avoid transform containing blocks
  if (btnNo.parentElement !== document.body) {
    document.body.appendChild(btnNo);
  }

  // Hide button temporarily
  btnNo.style.transition = 'none';
  btnNo.style.opacity = '0';
  btnNo.style.pointerEvents = 'none';
  btnNo.style.zIndex = '9999';
  btnNo.style.position = 'absolute';
  
  // Set initial position so rect doesn't collapse
  btnNo.style.position = 'fixed';
  btnNo.style.left = `${rect.left}px`;
  btnNo.style.top = `${rect.top}px`;

  noDodgeMultiplier += 0.1;

  setTimeout(() => {
    const safePadding = 20;
    // Use offsetWidth/Height to get un-transformed dimensions
    const btnWidth = btnNo.offsetWidth || 100;
    const btnHeight = btnNo.offsetHeight || 50;
    const yesRect = btnYes.getBoundingClientRect();
    
    // Maximum allowable top/left coordinates
    const maxX = window.innerWidth - btnWidth - safePadding;
    const maxY = window.innerHeight - btnHeight - safePadding;
    
    // Ensure range is never negative
    const rangeX = Math.max(0, maxX - safePadding);
    const rangeY = Math.max(0, maxY - safePadding);
    
    let newX, newY;
    let overlap = true;
    let attempts = 0;
    
    while (overlap && attempts < 50) {
      newX = safePadding + (Math.random() * rangeX);
      newY = safePadding + (Math.random() * rangeY);
      
      const padding = 20;
      overlap = !(newX + btnWidth + padding < yesRect.left || 
                  newX > yesRect.right + padding || 
                  newY + btnHeight + padding < yesRect.top || 
                  newY > yesRect.bottom + padding);
      attempts++;
    }
    
    // Final hard-clamp to guarantee it never exceeds viewport
    newX = Math.max(safePadding, Math.min(newX, maxX));
    newY = Math.max(safePadding, Math.min(newY, maxY));

    btnNo.style.left = `${newX}px`;
    btnNo.style.top = `${newY}px`;
    btnNo.style.transform = `scale(${Math.max(0.7, 1 - (noDodgeMultiplier * 0.05))})`;
    
    // Fade back in
    btnNo.style.transition = 'opacity 0.3s ease';
    btnNo.style.opacity = '1';
    btnNo.style.pointerEvents = 'auto';
  }, 400);
}

// Ensure it's clickable now instead of hover
btnNo.addEventListener('click', moveNoButton);
btnNo.addEventListener('touchstart', moveNoButton, {passive: false});

function createPopEffect(rect) {
  const numBubbles = 12;
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < numBubbles; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    const size = 15 + Math.random() * 25;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.zIndex = '9999';
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 80;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    bubble.style.left = `${centerX - size/2}px`;
    bubble.style.top = `${centerY - size/2}px`;
    bubble.style.setProperty('--tx', `${tx}px`);
    bubble.style.setProperty('--ty', `${ty}px`);
    
    document.body.appendChild(bubble);
    
    bubble.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(0.5)`, opacity: 0 }
    ], {
      duration: 600 + Math.random() * 200,
      easing: 'ease-out'
    }).onfinish = () => bubble.remove();
  }
}

/**
 * YES RESULT
 */
btnYes.addEventListener('click', () => {
  goToScreen('yes');
  document.querySelector('.small-note').textContent = CONFIG.yesMessage;
  triggerConfetti();
});


/**
 * CANVAS PARTICLE SYSTEM (Lightweight)
 */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let width, height;

// Parallax target
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  // Handle device pixel ratio for sharpness & performance
  const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
}

window.addEventListener('resize', resize);
resize();

// Parallax tracking
window.addEventListener('mousemove', (e) => {
  targetMouseX = (e.clientX / width - 0.5) * 2; // -1 to 1
  targetMouseY = (e.clientY / height - 0.5) * 2;
});

// For mobile tilt (DeviceOrientation)
window.addEventListener('deviceorientation', (e) => {
  if (e.gamma && e.beta) {
    targetMouseX = Math.min(Math.max(e.gamma / 45, -1), 1);
    targetMouseY = Math.min(Math.max(e.beta / 45, -1), 1);
  }
});

class Particle {
  constructor(x, y, isBurst = false) {
    this.x = x !== undefined ? x : Math.random() * width;
    this.y = y !== undefined ? y : Math.random() * height + height;
    
    this.size = Math.random() * 4 + 2;
    this.speedY = -(Math.random() * 1 + 0.5);
    this.speedX = Math.random() * 1 - 0.5;
    
    this.life = 1;
    this.decay = Math.random() * 0.005 + 0.002;
    
    this.type = Math.random() > 0.5 ? 'heart' : 'circle';
    this.color = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 182, 193, 0.6)';
    
    // Parallax factor
    this.z = Math.random() * 2 + 0.5;
    
    if (isBurst) {
      this.speedY = (Math.random() - 0.5) * 15;
      this.speedX = (Math.random() - 0.5) * 15;
      this.decay = 0.02;
      this.size *= 2;
    }
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Parallax effect
    this.x -= (mouseX * this.z * 0.5);
    this.y -= (mouseY * this.z * 0.5);

    this.life -= this.decay;

    if (this.life <= 0 || this.y < -50 || this.x < -50 || this.x > width + 50) {
      this.reset();
    }
  }
  
  reset() {
    this.x = Math.random() * width;
    this.y = height + 50;
    this.life = 1;
    this.speedY = -(Math.random() * 1 + 0.5);
    this.speedX = Math.random() * 1 - 0.5;
  }

  draw() {
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    
    if (this.type === 'circle') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw simple heart
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(this.size / 10, this.size / 10);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(0, -3, -5, -3, -5, 0);
      ctx.bezierCurveTo(-5, 3, 0, 5, 0, 8);
      ctx.bezierCurveTo(0, 5, 5, 3, 5, 0);
      ctx.bezierCurveTo(5, -3, 0, -3, 0, 0);
      ctx.fill();
      ctx.restore();
    }
  }
}

// Check for reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const particleCount = prefersReducedMotion ? 0 : (width < 600 ? 30 : 60);

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function createBurst(x, y) {
  if (prefersReducedMotion) return;
  for (let i = 0; i < 40; i++) {
    particles.push(new Particle(x, y, true));
  }
}

let isConfetti = false;
function triggerConfetti() {
  if (prefersReducedMotion) return;
  isConfetti = true;
  particles = [];
  for (let i = 0; i < 150; i++) {
    let p = new Particle(Math.random() * width, Math.random() * height - height);
    p.speedY = Math.random() * 3 + 2; // Falling down
    p.type = 'heart';
    p.color = `hsl(${Math.random() * 60 + 330}, 100%, 70%)`; // Pinkish reds
    p.reset = function() {
      if(isConfetti) {
        this.y = -50;
        this.x = Math.random() * width;
        this.life = 1;
      }
    };
    particles.push(p);
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  
  // Smooth parallax interpolation
  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetMouseY - mouseY) * 0.05;

  particles.forEach((p, index) => {
    p.update();
    p.draw();
    if(p.life <= 0 && isConfetti) {
        p.reset();
    }
  });
  
  requestAnimationFrame(animate);
}

animate();
