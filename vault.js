let current = 0;
let insights = [];

fetch('./insights.json')
  .then(res => {
    if (!res.ok) throw new Error('Failed to load insights.json');
    return res.json();
  })
  .then(data => {
    insights = data;
    showInsight();
    startTimer();
  })
  .catch(err => {
    console.error('Could not load insights:', err);
    document.getElementById("insight-title").innerText = "Error loading secrets.";
    document.getElementById("insight-content").innerText = "Check insights.json in root folder.";
  });

function showInsight() {
  const insight = insights[current];
  if (!insight) {
    current = 0;
    showInsight();
    return;
  }

  document.getElementById("insight-title").innerText = insight.title;
  document.getElementById("insight-content").innerText = insight.content;

  document.getElementById("cta-button").onclick = () => {
    current = (current + 1) % insights.length;
    showInsight();
    resetTimer();
    refreshAd();
  };
}

let timer;
function startTimer() {
  let duration = 300;
  timer = setInterval(() => {
    if (duration <= 0) clearInterval(timer);
    let min = Math.floor(duration / 60);
    let sec = duration % 60;
    document.getElementById("timer").innerText =
      `This page expires in ${min}:${sec.toString().padStart(2, '0')}...`;
    duration--;
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  startTimer();
}

function refreshAd() {
  const ad = document.getElementById("ad-container");
  ad.innerHTML = "";
  const script = document.createElement("script");
  script.src = "adsense.js";
  script.async = true;
  ad.appendChild(script);
}
