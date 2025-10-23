// script.js
const timersDiv = document.getElementById('timers');
document.getElementById('addStopwatch').onclick = () => addTimer('stopwatch');
document.getElementById('addCountdown').onclick = () => addTimer('countdown');

function addTimer(type) {
    const timerBox = document.createElement('div');
    timerBox.className = 'timer-box';
    timerBox.innerHTML = (type === 'stopwatch') ? getStopwatchHTML() : getCountdownSetupHTML();
    timersDiv.appendChild(timerBox);
    (type === 'stopwatch') ? setupStopwatch(timerBox) : setupCountdownSetup(timerBox);
}

// ------------------- HTML generators ------------------- //
function getStopwatchHTML() {
    return `
        <div class="display-area">
            <div class="time-numbers-row">
                <span class="time-main">00:00:00</span>
                <span class="time-ms">000</span>
            </div>
        </div>
        <div class="timer-actions">
            <button class="timer-btn start">Start</button>
            <button class="timer-btn clear">Clear</button>
        </div>
        <div class="notif"></div>
    `;
}
function getCountdownSetupHTML() {
    let nums1 = '';
    for(let i=5; i<=9; i++) nums1 += `<button class="numpad-btn">${i}</button>`;
    let nums2 = '';
    for(let i=0; i<=4; i++) nums2 += `<button class="numpad-btn">${i}</button>`;
    return `
        <div class="display-area">
            <div class="time-numbers-row">
                <span class="time-main">00:00:00</span>
                <span class="time-ms">000</span>
            </div>
        </div>
        <div class="numpad-row">${nums1}<button class="set-btn set">Set</button></div>
        <div class="numpad-row">${nums2}<button class="numpad-clear-btn">Clear</button></div>
        <div class="notif"></div>
    `;
}
function getCountdownStartHTML(timeStr) {
    return `
        <div class="display-area">
            <div class="time-numbers-row">
                <span class="time-main">${timeStr}</span>
                <span class="time-ms">000</span>
            </div>
        </div>
        <div class="timer-actions">
            <button class="timer-btn start">Start</button>
            <button class="timer-btn clear">Clear</button>
        </div>
        <div class="notif"></div>
    `;
}

// ------------------- Cronómetro Logic ------------------- //
function setupStopwatch(box) {
    const main = box.querySelector('.time-main');
    const ms = box.querySelector('.time-ms');
    const startBtn = box.querySelector('.timer-btn.start');
    const clearBtn = box.querySelector('.timer-btn.clear');
    let interval = null, running = false, paused = false, time = 0;
    updateDisplay();

    startBtn.onclick = function() {
        if(!running && !paused) { // Start
            running = true;
            interval = setInterval(()=>{
                time += 10;
                updateDisplay();
            },10);
            toPause(startBtn);
        } else if(running) { // Pause
            running = false; paused = true;
            clearInterval(interval);
            toContinue(startBtn);
        } else if(paused) { // Continue
            running = true; paused = false;
            interval = setInterval(()=>{
                time += 10;
                updateDisplay();
            },10);
            toPause(startBtn);
        }
    }
    clearBtn.onclick = function() {
        running = paused = false;
        clearInterval(interval); time = 0;
        toStart(startBtn);
        updateDisplay();
    }
    function updateDisplay() {
        let h = Math.floor(time/3600000), m = Math.floor((time%3600000)/60000), s = Math.floor((time%60000)/1000), msVal = time%1000;
        main.textContent = pad2(h)+':'+pad2(m)+':'+pad2(s);
        ms.textContent = pad3(msVal);
    }
}
function toPause(btn) {
    btn.textContent = 'Pause'; btn.className = 'timer-btn pause';
}
function toContinue(btn) {
    btn.textContent = 'Continue'; btn.className = 'timer-btn continue';
}
function toStart(btn) {
    btn.textContent = 'Start'; btn.className = 'timer-btn start';
}

// ------------------- Countdown Logic ------------------- //
function setupCountdownSetup(box) {
    const main = box.querySelector('.time-main');
    const ms = box.querySelector('.time-ms');
    const numpad = box.querySelectorAll('.numpad-btn');
    const setBtn = box.querySelector('.set-btn');
    const clearBtn = box.querySelector('.numpad-clear-btn');
    let digits = [];

    update();

    numpad.forEach(btn=>{
        btn.onclick = ()=>{
            if(digits.length < 6) {
                digits.unshift(btn.textContent);
                update();
            }
        }
    });
    setBtn.onclick = ()=>{
        let h = parseInt(digits[5]||'0')*10 + parseInt(digits[4]||'0');
        let m = parseInt(digits[3]||'0')*10 + parseInt(digits[2]||'0');
        let s = parseInt(digits[1]||'0')*10 + parseInt(digits[0]||'0');
        let total = h*3600 + m*60 + s;
        if(total===0) return;
        let msVal = total*1000;
        box.innerHTML = getCountdownStartHTML(toTimeStr(h,m,s));
        setupCountdownActive(box, msVal);
    }
    clearBtn.onclick = ()=>{
        digits=[];
        update();
    }
    function update() {
        let arr = ['0','0','0','0','0','0'];
        for(let i=0; i<digits.length; ++i) arr[5-i] = digits[i];
        let h = arr[0]+arr[1], m = arr[2]+arr[3], s = arr[4]+arr[5];
        main.textContent = `${h}:${m}:${s}`;
        ms.textContent = '000';
    }
}
function setupCountdownActive(box, msVal) {
    const main = box.querySelector('.time-main');
    const ms = box.querySelector('.time-ms');
    const startBtn = box.querySelector('.timer-btn.start');
    const clearBtn = box.querySelector('.timer-btn.clear');
    const notif = box.querySelector('.notif');
    let running = false, paused = false, finished = false, left = msVal, interval=null;
    update();

    startBtn.onclick = ()=>{
        if(!running && !paused && !finished) { // Start
            running = true;
            interval = setInterval(()=>{
                left -= 10;
                if(left<=0) {
                    left=0;
                    update();
                    finished = true;
                    running = false;
                    clearInterval(interval);
                    notif.textContent = '¡Finalizó!';
                    notif.style.display = 'block';
                    beep();
                    notify('Cuenta regresiva finalizada');
                }
                else update();
            },10);
            toPause(startBtn);
        } else if(running) { // Pause
            running = false; paused = true; clearInterval(interval);
            toContinue(startBtn);
        } else if(paused) { // Continue
            running = true; paused = false;
            interval = setInterval(()=>{
                left -= 10;
                if(left<=0) {
                    left=0;
                    update();
                    finished = true;
                    running = false;
                    clearInterval(interval);
                    notif.textContent = '¡Finalizó!';
                    notif.style.display = 'block';
                    beep();
                    notify('Cuenta regresiva finalizada');
                }
                else update();
            },10);
            toPause(startBtn);
        }
    };
    clearBtn.onclick = ()=>{
        running = false; paused = false; finished = false;
        clearInterval(interval);
        box.innerHTML = getCountdownSetupHTML();
        setupCountdownSetup(box);
    };
    function update() {
        let h = Math.floor(left/3600000), m = Math.floor((left%3600000)/60000), s = Math.floor((left%60000)/1000), msVal = left%1000;
        main.textContent = pad2(h)+':'+pad2(m)+':'+pad2(s);
        ms.textContent = pad3(msVal);
    }
}
// -- Utilidades
function pad2(x) { return String(x).padStart(2,'0'); }
function pad3(x) { return String(x).padStart(3,'0').slice(0,3); }
function toTimeStr(h,m,s) {
    return pad2(h)+':'+pad2(m)+':'+pad2(s);
}
// Beep corto
function beep() {
    try {
        let ctx = new (window.AudioContext||window.webkitAudioContext)();
        let o = ctx.createOscillator(), g = ctx.createGain();
        o.type='sine'; o.frequency.value=970; g.gain.value=0.10;
        o.connect(g); g.connect(ctx.destination); o.start();
        setTimeout(()=>{
            g.gain.linearRampToValueAtTime(0, ctx.currentTime+0.22);
            setTimeout(()=>{ o.stop(); ctx.close(); },250);
        },95);
    } catch{}
}
// Web Notification
function notify(msg) {
    if('Notification'in window && Notification.permission==='granted')
        new Notification(msg);
    else if('Notification'in window && Notification.permission!=='denied')
        Notification.requestPermission().then(perm=>{
            if(perm==='granted') new Notification(msg);
        });
}
(function(){if('Notification'in window && Notification.permission==='default')
    Notification.requestPermission();
})();
