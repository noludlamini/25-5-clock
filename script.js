document.addEventListener("DOMContentLoaded", () => {
  let breakLength = 5;
  let sessionLength = 25;
  let timeLeft = sessionLength * 60;
  let timerInterval = null;
  let isRunning = false;
  let isSession = true;

  const breakEl = document.getElementById("break-length");
  const sessionEl = document.getElementById("session-length");
  const timeLeftEl = document.getElementById("time-left");
  const timerLabel = document.getElementById("timer-label");
  const beep = document.getElementById("beep");
  const progressCircle = document.querySelector(".progress");

  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  function updateProgress() {
    const total = (isSession ? sessionLength : breakLength) * 60;
    const offset = circumference - (timeLeft / total) * circumference;
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = offset;
  }

  function updateDisplay() {
    const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const secs = String(timeLeft % 60).padStart(2, "0");
    timeLeftEl.textContent = `${mins}:${secs}`;
    updateProgress();
    breakEl.textContent = breakLength;
    sessionEl.textContent = sessionLength;
  }

  function adjustLength(type, delta) {
    if (isRunning) return;
    if (type === "break") {
      breakLength = Math.min(60, Math.max(1, breakLength + delta));
      if (!isSession) timeLeft = breakLength * 60;
    } else {
      sessionLength = Math.min(60, Math.max(1, sessionLength + delta));
      if (isSession) timeLeft = sessionLength * 60;
    }
    updateDisplay();
  }

  function toggleTimer() {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
    } else {
      isRunning = true;
      timerInterval = setInterval(runTimer, 1000);
    }
  }

  function runTimer() {
    timeLeft--;
    updateDisplay();
    if (timeLeft < 0) {
      beep.play();
      isSession = !isSession;
      timerLabel.textContent = isSession ? "Session" : "Break";
      timeLeft = (isSession ? sessionLength : breakLength) * 60;
      updateDisplay();
    }
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isSession = true;
    breakLength = 5;
    sessionLength = 25;
    timeLeft = sessionLength * 60;
    timerLabel.textContent = "Session";
    beep.pause();
    beep.currentTime = 0;
    updateDisplay();
  }

  document.getElementById("break-decrement").addEventListener("click", () => adjustLength("break", -1));
  document.getElementById("break-increment").addEventListener("click", () => adjustLength("break", 1));
  document.getElementById("session-decrement").addEventListener("click", () => adjustLength("session", -1));
  document.getElementById("session-increment").addEventListener("click", () => adjustLength("session", 1));
  document.getElementById("start_stop").addEventListener("click", toggleTimer);
  document.getElementById("reset").addEventListener("click", resetTimer);

  updateDisplay();
});

