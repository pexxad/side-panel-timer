let mode = "countdown";
let timer = null;
let remaining = 0;
let paused = false;

const countdownBtn = document.getElementById("countdown-btn");
const countupBtn = document.getElementById("countup-btn");
const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resumeBtn = document.getElementById("resume-btn");
const resetBtn = document.getElementById("reset-btn");
const timerSetup = document.getElementById("timer-setup");

function pad(n) {
  return n.toString().padStart(2, "0");
}

function secToHMS(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [pad(h), pad(m), pad(s)].join(":");
}

function updateDisplay(sec) {
  timerDisplay.textContent = secToHMS(sec);
}

function setDisplayNormal() {
  timerDisplay.classList.remove("finished");
  countdownBtn.classList.remove("finished");
  resetBtn.classList.remove("finished");
}

function setDisplayFinished() {
  timerDisplay.classList.add("finished");
  countdownBtn.classList.add("finished");
  resetBtn.classList.add("finished");
}

function resetUI() {
  setDisplayNormal();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resumeBtn.disabled = true;
  resetBtn.disabled = true;
  if (mode === "countdown") timerSetup.style.display = "";
  else timerSetup.style.display = "none";
}

function getInputSeconds() {
  return (
    parseInt(hoursInput.value, 10) * 3600 +
    parseInt(minutesInput.value, 10) * 60 +
    parseInt(secondsInput.value, 10)
  );
}

function startCountdown() {
  remaining = getInputSeconds();
  if (remaining <= 0) return;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
  resetBtn.disabled = false;
  timerSetup.style.display = "none";
  setDisplayNormal();
  updateDisplay(remaining);
  timer = setInterval(() => {
    if (!paused) {
      remaining--;
      updateDisplay(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        setDisplayFinished();
        pauseBtn.disabled = true;
        resumeBtn.disabled = true;
        resetBtn.disabled = false;
        timerDisplay.textContent = "00:00:00";
      }
    }
  }, 1000);
}

function startCountup() {
  remaining = 0;
  updateDisplay(remaining);
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
  resetBtn.disabled = false;
  setDisplayNormal();
  timer = setInterval(() => {
    if (!paused) {
      remaining++;
      updateDisplay(remaining);
    }
  }, 1000);
}

countdownBtn.onclick = () => {
  mode = "countdown";
  countdownBtn.classList.add("active");
  countupBtn.classList.remove("active");
  timerSetup.style.display = "";
  resetUI();
};
countupBtn.onclick = () => {
  mode = "countup";
  countupBtn.classList.add("active");
  countdownBtn.classList.remove("active");
  timerSetup.style.display = "none";
  resetUI();
};

startBtn.onclick = () => {
  // 既存タイマーが動作中ならリセット
  if (timer) {
    clearInterval(timer);
    timer = null;
    paused = false;
    setDisplayNormal();
  }
  if (mode === "countdown") {
    updateDisplay(getInputSeconds());
    startCountdown();
  } else {
    updateDisplay(0);
    startCountup();
  }
};
pauseBtn.onclick = () => {
  paused = true;
  pauseBtn.disabled = true;
  resumeBtn.disabled = false;
};
resumeBtn.onclick = () => {
  paused = false;
  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
};
resetBtn.onclick = () => {
  if (timer) clearInterval(timer);
  timer = null;
  paused = false;
  if (mode === "countdown") {
    updateDisplay(getInputSeconds());
  } else {
    updateDisplay(0);
  }
  resetUI();
};

// 初期化
updateDisplay(0);
resetUI();
