const timersList = document.getElementById('timers-list');
const alertSound = document.getElementById('alert-sound');

document.getElementById('add-stopwatch').onclick = () => {
  timersList.appendChild(createStopwatch());
};
document.getElementById('add-countdown').onclick = () => {
  timersList.appendChild(createCountdown());
};

function pad(n, len=2) {
  return n.toString().padStart(len, '0');
}

// -- STOPWATCH
function createStopwatch() {
  let ms = 0, interval = null, running = false, pausedAt = 0;
  const el = document.createElement('div');
  el.className = 'timer-container';

  el.innerHTML = `
    <div class="timer-display">
      <span class="time-big">00:00:00</span>
      <span class="time-millis">000</span>
    </div>
    <div class="timer-buttons">
      <button class="timer-btn btn-start">Start</button>
      <button class="timer-btn btn-clear">Clear</button>
    </div>
  `;
  const timeEl = el.querySelector('.time-big');
  const msEl = el.querySelector('.time-millis');
  const btnsDiv = el.querySelector('.timer-buttons');

  function updateDisplay() {
    const total = ms;
    let h = Math.floor(total / 3600000);
    let m = Math.floor((total % 3600000) / 60000);
    let s = Math.floor((total % 60000) / 1000);
    let msDisp = total % 1000;
    timeEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    msEl.textContent = pad(msDisp, 3);
  }
  function run() {
    const t0 = Date.now() - ms;
    interval = setInterval(() => {
      ms = Date.now() - t0;
      updateDisplay();
    }, 1);
  }
  function stopInt() {
    clearInterval(interval);
    interval = null;
  }
  function reset() {
    ms = 0;
    updateDisplay();
    stopInt();
    running = false;
    setState('initial');
  }

  function setState(state) {
    btnsDiv.innerHTML = '';
    if (state === 'initial') {
      btnsDiv.appendChild(makeBtn('Start', 'btn-start', onStart));
      btnsDiv.appendChild(makeBtn('Clear', 'btn-clear', reset));
    } else if (state === 'running') {
      btnsDiv.appendChild(makeBtn('Pause', 'btn-pause', onPause));
      btnsDiv.appendChild(makeBtn('Clear', 'btn-clear', reset));
    } else if (state === 'paused') {
      btnsDiv.appendChild(makeBtn('Continue', 'btn-continue', onContinue));
      btnsDiv.appendChild(makeBtn('Clear', 'btn-clear', reset));
    }
  }
  function onStart() {
    running = true;
    run();
    setState('running');
  }
  function onPause() {
    running = false;
    stopInt();
    setState('paused');
  }
  function onContinue() {
    running = true;
    run();
    setState('running');
  }

  updateDisplay();
  setState('initial');
  return el;
}

// -- COUNTDOWN
function createCountdown() {
  // For a 00:00:00 initial state, we let user input up to 6 digits
  let initial = [0,0,0,0,0,0], inputPtr=0, remainingMs=0;
  let interval = null, running = false;
  const el = document.createElement('div');
  el.className = 'timer-container';

  el.innerHTML = `
    <div class="timer-display">
      <span class="time-big">00:00:00</span>
      <span class="time-millis">000</span>
    </div>
    <div class="countdown-keypad"></div>
  `;
  const timeEl = el.querySelector('.time-big');
  const msEl = el.querySelector('.time-millis');
  const keypad = el.querySelector('.countdown-keypad');

  function updateDisplay(msToShow = null) {
    let ms = msToShow !== null ? msToShow : remainingMs;
    ms = Math.max(0, ms);
    let tot = Math.floor(ms / 1000);
    let h = Math.floor(tot / 3600), m = Math.floor((tot % 3600) / 60), s = tot % 60;
    timeEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    msEl.textContent = pad(ms % 1000, 3);
  }
  function digitsToMs() {
    let h = initial[0]*10 + initial[1],
        m = initial[2]*10 + initial[3],
        s = initial[4]*10 + initial[5];
    return (h*3600 + m*60 + s)*1000;
  }
  // Keypad logic: fill hhmmss, left to right
  function fillDigit(d) {
    if(inputPtr<6) {
      initial[inputPtr] = d;
      inputPtr++;
      updateTimeFromInput();
      if(inputPtr>=6) return;
    }
  }
  function clearDigit() {
    if(inputPtr>0) {
      inputPtr--;
      initial[inputPtr]=0;
      updateTimeFromInput();
    }
  }
  function updateTimeFromInput() {
    let h = initial[0]*10 + initial[1],
        m = initial[2]*10 + initial[3],
        s = initial[4]*10 + initial[5];
    timeEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    msEl.textContent = '000';
  }
  function run() {
    const t0 = Date.now();
    const end = Date.now() + remainingMs;
    interval = setInterval(() => {
      let now = end - Date.now();
      if (now<=0) {
        updateDisplay(0);
        stopInt();
        running = false;
        showNotification('¡Tiempo terminado!');
        alertSound.currentTime = 0;
        alertSound.play();
        setState('finished');
      } else {
        updateDisplay(now);
        remainingMs = now;
      }
    }, 1);
  }
  function stopInt() {
    clearInterval(interval);
    interval = null;
  }
  function reset() {
    stopInt();
    running = false;
    initial = [0,0,0,0,0,0];
    inputPtr=0;
    remainingMs = 0;
    updateTimeFromInput();
    setState('input');
  }
  function setState(state) {
    keypad.innerHTML = '';
    if (state==='input') {
      // Show keypad 5-9/set 0-4/clear (as reference image)
      for(let i=5;i<=9;i++) keypad.appendChild(makeBtn(`${i}`,'keypad-btn', ()=>fillDigit(i)));
      keypad.appendChild(makeBtn('Set','keypad-btn btn-set', onSet));
      for(let i=0;i<=4;i++) keypad.appendChild(makeBtn(`${i}`,'keypad-btn', ()=>fillDigit(i)));
      keypad.appendChild(makeBtn('Clear','keypad-btn btn-clear', clearDigit));
    } else {
      // Show Start & Clear buttons
      const btnsDiv = document.createElement('div');
      btnsDiv.className = 'timer-buttons';
      btnsDiv.appendChild(makeBtn('Start','timer-btn btn-start', onStart));
      btnsDiv.appendChild(makeBtn('Clear','timer-btn btn-clear', reset));
      keypad.appendChild(btnsDiv);
    }
  }
  function onSet() {
    remainingMs = digitsToMs();
    if (remainingMs <= 0) return;
    updateDisplay(remainingMs);
    setState('timing');
  }
  function onStart() {
    running = true;
    run();
    setState('running');
  }
  function onPause() {
    running = false;
    stopInt();
    setPauseContinue('paused');
  }
  function onContinue() {
    running = true;
    run();
    setPauseContinue('running');
  }
  function setPauseContinue(state) {
    const btnsDiv = keypad.querySelector('.timer-buttons');
    btnsDiv.innerHTML = '';
    if(state==='running') {
      btnsDiv.appendChild(makeBtn('Pause','timer-btn btn-pause', onPause));
      btnsDiv.appendChild(makeBtn('Clear','timer-btn btn-clear', reset));
    } else if(state==='paused') {
      btnsDiv.appendChild(makeBtn('Continue','timer-btn btn-continue', onContinue));
      btnsDiv.appendChild(makeBtn('Clear','timer-btn btn-clear', reset));
    }
  }
  function showNotification(msg) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(()=>notif.remove(),3200);
  }
  updateTimeFromInput();
  setState('input');
  return el;
}

// -- Helpers
function makeBtn(txt, cls, onClick) {
  const btn = document.createElement('button');
  btn.className = cls;
  btn.textContent = txt;
  btn.onclick = onClick;
  return btn;
}
