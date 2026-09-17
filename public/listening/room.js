(() => {
  const $ = selector => document.querySelector(selector);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let playing = false, entered = false, soundOn = false, audio = null, master = null, timer = null, beat = 0;
  const projects = {
    recart: { title: 'ReCart', category: 'SIDE A · PRODUCT DESIGN + DEVELOPMENT', copy: 'Four resale marketplaces, one search. Explore the decisions behind a simpler way to shop secondhand.', url: '/recart' },
    pinwheels: { title: 'Pinwheels', category: 'SIDE B · DISCOVERY CONCEPT', copy: 'An idea is a starting point. A discovery experience that lets people direct, refine, and save what comes next.', url: '/pinwheels' }
  };
  const status = text => { $('#room-status').textContent = text; };
  function sync() {
    document.body.classList.toggle('playing', playing);
    document.body.classList.toggle('entered', entered);
    document.querySelectorAll('[data-play]').forEach(button => {
      button.setAttribute('aria-pressed', String(playing));
      button.setAttribute('aria-label', playing ? 'Pause the turntable' : 'Start the turntable');
      if (button.classList.contains('transport')) button.textContent = playing ? 'Ⅱ' : '▶';
    });
    $('.turntable .hotspot-dot').textContent = playing ? 'Ⅱ' : '▶';
    $('.turntable .hotspot-label').textContent = playing ? 'Pause the record' : 'Play the record';
    $('#sound').textContent = soundOn ? 'Sound on' : 'Sound off';
    $('#sound').setAttribute('aria-pressed', String(soundOn));
    if (master && audio) master.gain.setTargetAtTime(playing && soundOn ? .18 : 0, audio.currentTime, .15);
  }
  function togglePlay() {
    const firstEntry = !entered;
    playing = !playing;
    if (!entered) { entered = true; $('#record-dock').hidden = false; }
    sync();
    if (firstEntry) $('.record').focus({ preventScroll: true });
    status(playing ? 'The room is open. Choose a record to explore a project.' : 'Turntable paused. You can still explore the records.');
  }
  document.querySelectorAll('[data-play]').forEach(button => button.addEventListener('click', togglePlay));
  document.querySelectorAll('[data-browse]').forEach(button => button.addEventListener('click', () => {
    entered = true; $('#liner').hidden = true; $('#record-dock').hidden = false; sync();
    $('.record').focus();
  }));
  $('#close-dock').addEventListener('click', () => { $('#record-dock').hidden = true; $('.browse').focus(); });
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    $('#liner-title').textContent = project.title; $('#liner-category').textContent = project.category;
    $('#liner-copy').textContent = project.copy; $('#liner-link').href = project.url;
    $('#liner').hidden = false;
    document.querySelectorAll('[data-project]').forEach(record => record.setAttribute('aria-pressed', String(record === button)));
    $('#playing-label').textContent = 'ON THE TURNTABLE'; $('#playing-title').textContent = project.title;
    if (innerWidth < 768) $('#record-dock').hidden = true;
    $('#liner-link').focus(); status(project.title + ' selected. Open the case study to explore.');
  }));
  $('#close-liner').addEventListener('click', () => { $('#liner').hidden = true; $('#record-dock').hidden = false; $('.record[aria-pressed="true"]')?.focus(); });
  $('#lamp').addEventListener('click', () => {
    const dim = document.body.classList.toggle('mood-dim'); $('#lamp').setAttribute('aria-pressed', String(dim)); $('#lamp').setAttribute('aria-label', dim ? 'Brighten the room' : 'Dim the room');
  });
  document.querySelectorAll('[data-about]').forEach(button => button.addEventListener('click', () => $('#about').showModal()));
  $('#close-about').addEventListener('click', () => $('#about').close());
  $('#about').addEventListener('click', event => { if (event.target === $('#about')) { const r = $('#about').getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) $('#about').close(); } });
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !$('#about').open) { $('#liner').hidden = true; $('#record-dock').hidden = true; $('.browse').focus(); }
  });
  // A small original ambient loop, created locally; sound only starts after consent.
  function note(frequency, when, length, volume) {
    const oscillator = audio.createOscillator(), gain = audio.createGain(); oscillator.type = 'sine'; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, when); gain.gain.linearRampToValueAtTime(volume, when + .08); gain.gain.exponentialRampToValueAtTime(.0001, when + length);
    oscillator.connect(gain); gain.connect(master); oscillator.start(when); oscillator.stop(when + length + .1); oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  async function enableAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) throw new Error('Audio unavailable');
    if (!audio) {
      audio = new AudioContext(); master = audio.createGain(); master.gain.value = 0; master.connect(audio.destination);
      timer = setInterval(() => {
        if (!playing || !soundOn || document.hidden || audio.state !== 'running') return;
        const chords = [[130.81,164.81,196,246.94],[110,130.81,164.81,196],[87.31,110,130.81,164.81],[98,123.47,146.83,196]];
        const chord = chords[Math.floor(beat / 8) % chords.length], now = audio.currentTime + .02;
        note(chord[beat % 4] * 2, now, 1.8, .22);
        if (beat % 8 === 0) chord.forEach(frequency => note(frequency, now, 3.7, .10));
        beat++;
      }, 520);
    }
    await audio.resume();
  }
  $('#sound').addEventListener('click', async () => {
    try { if (!soundOn) await enableAudio(); soundOn = !soundOn; if (soundOn && !playing) { playing = true; entered = true; } sync(); status(soundOn ? 'Original ambient loop enabled.' : 'Sound muted.'); }
    catch { soundOn = false; sync(); status('Audio is unavailable in this browser. The room remains interactive.'); }
  });
  document.addEventListener('visibilitychange', () => { if (audio && master) master.gain.setTargetAtTime(!document.hidden && playing && soundOn ? .18 : 0, audio.currentTime, .1); });
  window.addEventListener('pagehide', event => { if (!event.persisted) { clearInterval(timer); audio?.close(); } });
  const room = $('#room');
  if (!reduced) $('.corner').addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !entered) return;
    room.style.setProperty('--px', ((event.clientX / innerWidth - .5) * -10) + 'px');
    room.style.setProperty('--py', ((event.clientY / innerHeight - .5) * -7) + 'px');
  });
  const canvas = $('#equalizer'), context = canvas.getContext('2d'); canvas.width = 256; canvas.height = 144;
  let last = 0;
  function draw(time) {
    requestAnimationFrame(draw); if (time - last < 65 || document.hidden) return; last = time;
    context.clearRect(0, 0, 256, 144); if (!playing) return;
    context.fillStyle = '#b8fc8d'; context.shadowColor = '#81ff46'; context.shadowBlur = 5;
    for (let i = 0; i < 15; i++) { const h = reduced ? 30 + (i % 4) * 15 : 10 + Math.abs(Math.sin(time * .0017 + i * .8) * Math.cos(i * .43)) * 102; context.fillRect(8 + i * 16, 132 - h, 9, h); }
  }
  requestAnimationFrame(draw); sync();
})();
