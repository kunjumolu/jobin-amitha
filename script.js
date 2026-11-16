/* ==========================================================================
   Jobin Paul Varghese & Amitha Kurian — Digital Wedding Card Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDoors();
  initScrollReveal();
  initDressCodeModal();
  initCalendarDownload();
  initRsvpForm();
  initPetalsCanvas();
  initAmbientMusic();
  initTimelinePearl();
});

/* --------------------------------------------------------------------------
   1. Opening Sage Green Doors
   -------------------------------------------------------------------------- */
let musicController = null;

function initDoors() {
  const doorOverlay = document.getElementById('door-overlay');
  if (!doorOverlay) return;

  const openDoors = () => {
    if (doorOverlay.classList.contains('is-opening')) return;
    doorOverlay.classList.add('is-opening');
    document.body.classList.remove('doors-locked');

    if (musicController && !musicController.isPlaying()) {
      musicController.start();
    }

    setTimeout(() => {
      doorOverlay.classList.add('is-opened');
      window.dispatchEvent(new Event('scroll'));
    }, 950);
  };

  doorOverlay.addEventListener('click', openDoors);
  doorOverlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDoors();
    }
  });
}

/* --------------------------------------------------------------------------
   2. Scroll Reveal
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const sections = document.querySelectorAll('.reveal');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  sections.forEach((sec) => observer.observe(sec));
}

/* --------------------------------------------------------------------------
   3. Dress Code Modal (Pale Yellow & Sage Green Theme)
   -------------------------------------------------------------------------- */
const DRESS_CODE_DATA = {
  men: {
    title: 'Men’s Attire',
    description:
      'Classic tailored suits, linen blazers, or crisp kurtas in soothing sage green, olive, cream, and soft butter-yellow accents.',
    swatches: [
      { label: 'Sage Mist', hex: '#8fa682' },
      { label: 'Olive Moss', hex: '#5e7753' },
      { label: 'Ivory Linen', hex: '#f8f3dc' },
      { label: 'Butter Cream', hex: '#f1df9a' }
    ],
    tips: [
      'Sage or olive linen suits paired with an ivory shirt',
      'Warm cream mundu / kurta with a pale yellow or sage pocket square',
      'Tan, cognac, or classic espresso leather footwear'
    ]
  },
  women: {
    title: 'Women’s Attire',
    description:
      'Graceful silk sarees, organza drapes, lehengas, or evening gowns in pale butter-yellow, pastel lemon, and botanical sage green.',
    swatches: [
      { label: 'Pale Yellow', hex: '#f3e4a8' },
      { label: 'Soft Lemon', hex: '#f8efc4' },
      { label: 'Sage Leaf', hex: '#94aa87' },
      { label: 'Gold Thread', hex: '#c8ad67' }
    ],
    tips: [
      'Tissue kasavu, pastel yellow silk, or sage organza sarees',
      'Pearl, antique gold, or delicate floral jewellery accents',
      'Breathable flowing silhouettes ideal for Kerala’s festive evenings'
    ]
  },
  kids: {
    title: 'Kids’ Attire',
    description:
      'Playful, comfortable festive outfits blending butter-yellow florals, soft ivory linen, and gentle sage green tones.',
    swatches: [
      { label: 'Buttercup', hex: '#f5e6ab' },
      { label: 'Cream Silk', hex: '#faf5df' },
      { label: 'Sprout Green', hex: '#a5b89a' },
      { label: 'Warm Gold', hex: '#d6c080' }
    ],
    tips: [
      'Pastel yellow frocks, pattu pavadai, or floral linen dresses',
      'Sage green waistcoats or crisp ivory shirt & trouser sets',
      'Soft comfortable shoes ready for dancing and celebration'
    ]
  }
};

function initDressCodeModal() {
  const modal = document.getElementById('dresscode-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const titleEl = document.getElementById('modal-title');
  const descEl = document.getElementById('modal-description');
  const swatchesEl = document.getElementById('modal-swatches');
  const tipsEl = document.getElementById('modal-tips');

  if (!modal) return;

  const openModal = (group) => {
    const data = DRESS_CODE_DATA[group];
    if (!data) return;

    titleEl.textContent = data.title;
    descEl.textContent = data.description;

    swatchesEl.innerHTML = data.swatches
      .map(
        (s) => `
      <div class="swatch-item">
        <span class="swatch-dot" style="background:${s.hex}"></span>
        <span class="swatch-label">${s.label}</span>
      </div>`
      )
      .join('');

    tipsEl.innerHTML = data.tips.map((t) => `<li>${t}</li>`).join('');
    modal.classList.remove('hidden');
  };

  const closeModal = () => modal.classList.add('hidden');

  document.querySelectorAll('.dresscode-card').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.group));
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });
}

/* --------------------------------------------------------------------------
   4. Calendar (.ics) Download for Wedding & Reception
   -------------------------------------------------------------------------- */
function initCalendarDownload() {
  const btn = document.getElementById('download-ics-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//JobinAndAmitha//WeddingInvitation//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:jobin-amitha-wedding-20261228@weddingcard',
      'DTSTAMP:20261112T090000Z',
      'DTSTART;VALUE=DATE:20261228',
      'DTEND;VALUE=DATE:20261229',
      'SUMMARY:Wedding of Jobin Paul Varghese & Amitha Kurian',
      'LOCATION:St. George Jacobite Syrian Church, Mananthavady',
      'DESCRIPTION:"Let all that you do be done in love." — 1 Corinthians 16:14. Ceremony from 9:30 AM.',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'UID:jobin-amitha-reception-20261228@weddingcard',
      'DTSTAMP:20261112T090000Z',
      'DTSTART:20261228T063000Z',
      'DTEND:20261228T103000Z',
      'SUMMARY:Wedding Reception — Jobin Paul Varghese & Amitha Kurian',
      'LOCATION:Parakkal Auditorium, Mythrinagar, Mananthavady',
      'DESCRIPTION:Reception from 12:00 PM onwards.',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Jobin-and-Amitha-Wedding-Dates.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
}

/* --------------------------------------------------------------------------
   5. Interactive RSVP Options
   -------------------------------------------------------------------------- */
function initRsvpForm() {
  const container = document.querySelector('.rsvp-options-wrap');
  if (!container) return;

  const radios = container.querySelectorAll('input[name="attendance"]');
  const noteText = document.getElementById('rsvp-note-text');
  const STORAGE_KEY = 'jobin_amitha_rsvp_choice';

  const updateMessage = (value) => {
    if (!noteText) return;
    if (value === 'coming') {
      noteText.textContent = 'We look forward to celebrating with you! ✨';
    } else {
      noteText.textContent = 'You will be dearly missed & in our prayers! 🤍';
    }
  };

  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      updateMessage(radio.value);
      try {
        localStorage.setItem(STORAGE_KEY, radio.value);
      } catch {}
    });
  });

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const matchRadio = container.querySelector(`input[name="attendance"][value="${saved}"]`);
      if (matchRadio) {
        matchRadio.checked = true;
        updateMessage(saved);
      }
    }
  } catch {}
}

/* --------------------------------------------------------------------------
   6. Ambient Floating Pale-Yellow & Sage Petals
   -------------------------------------------------------------------------- */
function initPetalsCanvas() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const colors = [
    'rgba(243, 228, 168, 0.52)',
    'rgba(255, 250, 224, 0.55)',
    'rgba(165, 184, 154, 0.35)'
  ];

  const petals = Array.from({ length: 16 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 3 + Math.random() * 4.5,
    speedY: 0.25 + Math.random() * 0.45,
    speedX: -0.25 + Math.random() * 0.5,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.015,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  const tick = () => {
    ctx.clearRect(0, 0, width, height);
    petals.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.y * 0.012) * 0.25;
      p.angle += p.spin;

      if (p.y > height + 16) {
        p.y = -16;
        p.x = Math.random() * width;
      }
      if (p.x > width + 16) p.x = -16;
      if (p.x < -16) p.x = width + 16;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.58, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

/* --------------------------------------------------------------------------
   7. Gentle Web-Audio Harp Melody (No External Audio File Required)
   -------------------------------------------------------------------------- */
function initAmbientMusic() {
  const toggleBtn = document.getElementById('sound-toggle');
  const iconOff = document.getElementById('icon-sound-off');
  const iconOn = document.getElementById('icon-sound-on');
  if (!toggleBtn) return;

  let audioCtx = null;
  let playing = false;
  let timerId = null;
  let stepIndex = 0;

  // Soft F-major / D-minor warm harp arpeggio notes (Hz)
  const melody = [
    349.23, 440.0, 523.25, 659.25,
    587.33, 523.25, 440.0, 392.0,
    349.23, 440.0, 523.25, 698.46,
    659.25, 587.33, 523.25, 440.0
  ];

  const playNote = (freq) => {
    if (!audioCtx || !playing) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.032, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 2.2);
  };

  const updateIcon = () => {
    toggleBtn.setAttribute('aria-pressed', String(playing));
    iconOff.classList.toggle('hidden', playing);
    iconOn.classList.toggle('hidden', !playing);
  };

  const start = () => {
    if (playing) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    playing = true;
    updateIcon();

    playNote(melody[stepIndex % melody.length]);
    stepIndex++;

    timerId = setInterval(() => {
      playNote(melody[stepIndex % melody.length]);
      stepIndex++;
    }, 950);
  };

  const stop = () => {
    playing = false;
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    updateIcon();
  };

  toggleBtn.addEventListener('click', () => {
    if (playing) {
      stop();
    } else {
      start();
    }
  });

  musicController = {
    start,
    stop,
    isPlaying: () => playing
  };
}

/* --------------------------------------------------------------------------
   8. Interactive Timeline Pearl Slider (Scroll Animated)
   -------------------------------------------------------------------------- */
function initTimelinePearl() {
  const wrapper = document.querySelector('.timeline-wrapper');
  const pearl = document.getElementById('timelineMovingPearl');
  if (!wrapper || !pearl) return;

  let startY = 14;
  let endY = 350;
  let ticking = false;

  function measureStops() {
    const wrapH = wrapper.offsetHeight || wrapper.clientHeight || 360;
    startY = 14;
    // Travel all the way down to the very bottom of the dotted line
    endY = Math.max(startY + 200, wrapH - 14);
  }

  function update() {
    ticking = false;
    measureStops();

    const rect = wrapper.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;

    // Slide starts as top of timeline enters the screen (~75% vh)
    // Finishes all the way at the bottom of the line as user scrolls through the section
    const startScroll = vh * 0.75;
    const endScroll = vh * 0.40 - (rect.height * 0.75);

    const scrollSpan = startScroll - endScroll;
    let progress = 0;
    if (scrollSpan > 0) {
      progress = (startScroll - rect.top) / scrollSpan;
      progress = Math.max(0, Math.min(1, progress));
    }

    const currentY = startY + progress * (endY - startY);
    pearl.style.top = `${currentY.toFixed(1)}px`;
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('touchmove', requestTick, { passive: true });
  window.addEventListener('wheel', requestTick, { passive: true });
  window.addEventListener('resize', () => {
    measureStops();
    requestTick();
  });

  // Re-measure after initial layout and resource loads
  measureStops();
  update();
  window.addEventListener('load', () => {
    measureStops();
    update();
  });
  setTimeout(() => {
    measureStops();
    update();
  }, 300);
  setTimeout(() => {
    measureStops();
    update();
  }, 1000);
}


