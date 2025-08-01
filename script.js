const titleText = 'Where is my FRIEND';
const titleContainer = document.getElementById('title');
let endingsUnlocked = parseInt(localStorage.getItem('endingsUnlocked') || '0');
document.querySelector('.endings').textContent = `Endings unlocked: ${endingsUnlocked}/5`;

for (let i = 0; i < titleText.length; i++) {
  const char = titleText[i];
  const span = document.createElement('span');
  span.classList.add('letter');
  span.style.animationDelay = `${Math.random() * 2}s`;
  if ('FRIEND'.includes(char) && i >= titleText.indexOf('F')) {
    span.classList.add('friend');
  }
  span.textContent = char === ' ' ? '\u00A0' : char;
  titleContainer.appendChild(span);
}

const scenes = {
  start: {
    text: `I woke up alone. The house was cold. Too cold.\nI thought I heard him in the night—but now... silence.\nHe wouldn’t just leave. Not like this.\n\nWhat should I do first?`,
    vignette: 'default',
    choices: [
      { text: 'Search the room', next: 'room' },
      { text: 'Go outside', next: 'outside' }
    ]
  },
  room: {
    text: `The walls hold memories, quiet and heavy.\nBeneath the bed, dust dances in the pale light.\nThe air smells faintly of him.\n\nWhere do I look?`,
    vignette: 'warm',
    choices: [
      { text: 'Look under bed', next: 'underBed' },
      { text: 'Check the desk', next: 'desk' }
    ]
  },
  outside: {
    text: `The night air greets me with emptiness.\nThe world feels paused, like it's holding its breath.\n\nWhat do I do?`,
    vignette: 'cool',
    choices: [
      { text: 'Call out', next: 'callOut' },
      { text: 'Walk to street', next: 'street' }
    ]
  },
  underBed: {
    text: `It’s empty except for shadows.\nEven they seem to avoid me.`,
    vignette: 'dark',
    choices: []
  },
  desk: {
    text: `A folded note rests alone. The paper trembles in my hands.`,
    vignette: 'warm',
    choices: []
  },
  callOut: {
    text: `My voice scatters into the night. It does not return.`,
    vignette: 'cool',
    choices: []
  },
  street: {
    text: `The street is deserted. Lights flicker like fading thoughts.\nI take a step forward, and the silence swallows me whole.`,
    vignette: 'dark',
    isEnding: true,
    choices: []
  }
};

function startGame() {
  const menu = document.getElementById('menu');
  const scene = document.getElementById('scene');
  fadeOut(menu, () => {
    menu.style.display = 'none';
    playMusic('game');
    showScene('start');
    fadeIn(scene);
  });
}

function choose(route) {
  if (scenes[route]) {
    if (scenes[route].isEnding) {
      endingsUnlocked = Math.min(5, endingsUnlocked + 1);
      localStorage.setItem('endingsUnlocked', endingsUnlocked);
    }
    showScene(route);
  }
}

function showScene(key) {
  const data = scenes[key];
  document.getElementById('scene').setAttribute('data-vignette', data.vignette || 'default');
  typeText(document.getElementById('scene-text'), data.text);
  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';
  data.choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.textContent = c.text;
    btn.style.opacity = '0';
    btn.onclick = () => choose(c.next);
    choicesEl.appendChild(btn);
    setTimeout(() => { btn.style.opacity = '1'; }, 500 + i * 200);
  });
}

function typeText(el, text) {
  el.textContent = '';
  let i = 0;
  const chars = text.split('');
  function type() {
    if (i < chars.length) {
      el.textContent += chars[i];
      i++;
      setTimeout(type, 20 + Math.random() * 40);
    }
  }
  type();
}

function fadeOut(el, cb) {
  el.style.opacity = 0;
  setTimeout(cb, 1000);
}
function fadeIn(el) {
  el.style.opacity = 1;
}

const menuMusic = document.getElementById('menuMusic');
const gameMusic = document.getElementById('gameMusic');

function playMusic(type) {
  if (type === 'menu') {
    menuMusic.volume = 0.5;
    menuMusic.play().catch(()=>{});
  } else if (type === 'game') {
    let fadeOutInterval = setInterval(() => {
      if (menuMusic.volume > 0.01) {
        menuMusic.volume -= 0.01;
      } else {
        menuMusic.pause();
        clearInterval(fadeOutInterval);
      }
    }, 30);
    gameMusic.volume = 0;
    gameMusic.play().catch(()=>{});
    let fadeInInterval = setInterval(() => {
      if (gameMusic.volume < 0.5) {
        gameMusic.volume += 0.01;
      } else {
        clearInterval(fadeInInterval);
      }
    }, 30);
  }
}

// Background particles
function createParticles() {
  const particleContainer = document.createElement('div');
  particleContainer.className = 'particles';
  document.body.appendChild(particleContainer);
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = 10 + Math.random() * 10 + 's';
    p.style.opacity = Math.random();
    particleContainer.appendChild(p);
  }
}

playMusic('menu');
createParticles();
