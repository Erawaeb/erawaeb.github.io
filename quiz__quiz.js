/* ERAWAEB — SCAM OR LEGIT? engine. Vanilla JS, no libraries, no backend.
   localStorage keys: eq_best (best streak), eq_rounds (rounds played),
   eq_daily_YYYYMMDD ('win' | 'loss'). */
(function () {
"use strict";

/* ---------------- DATA ---------------- */
var GUIDE = { scam: "SCAM_SHIELD", edge: "HOUSE_EDGE" };

var ROUNDS = [
  {
    id: "toll", cats: ["texts"], answer: "scam", guide: "scam",
    mock:
      '<div class="scr-head"><b>+1 (555) 019-2834</b>Text Message · now</div>' +
      '<div class="sms-body"><div class="bubble"><b>Toll Roads:</b> You have an unpaid toll of $12.75. Pay within 24 hours to avoid a $50 late fee.<br><span class="lnk">toll-pay-fast.com/pay</span></div></div>',
    trick: "Fake link harvests your card. Toll agencies don't text payment links.",
    rule: "Never pay from a text. Go to the agency's real site."
  },
  {
    id: "captcha", cats: ["texts"], answer: "scam", guide: "scam",
    mock:
      '<div class="scr-head"><b>free-movies-now.biz</b>wants your attention</div>' +
      '<div class="popup-card"><div class="site">VERIFY YOU ARE HUMAN</div>' +
      '<div class="captcha-box"><span class="box"></span><span>I\'m not a robot</span></div>' +
      '<div class="popup-steps">To continue:<br>1. Press <b>Win + R</b><br>2. Press <b>Ctrl + V</b><br>3. Press <b>Enter</b></div></div>',
    trick: "Those keys paste hidden malware onto your own computer.",
    rule: "Real CAPTCHAs never ask for key combos."
  },
  {
    id: "loan", cats: ["toogood"], answer: "scam", guide: "scam",
    mock:
      '<div class="scr-head"><b>+1 (555) 774-1209</b>Text Message · now</div>' +
      '<div class="sms-body"><div class="bubble">🎉 CONGRATS! Your <b>$10,000 loan</b> is APPROVED. No credit check needed.<br><span class="lnk">Claim now: bit.ly/loan-fast</span></div></div>',
    trick: "'No credit check' loans want a fee upfront — or your bank login.",
    rule: "Never pay money to borrow money."
  },
  {
    id: "riskfree", cats: ["gambling"], answer: "scam", guide: "edge",
    mock:
      '<div class="promo-card"><div class="promo-top"><div class="brandline">LUCKYLINE SPORTSBOOK</div>' +
      '<div class="offer">RISK-FREE <span>$1,000</span> BET</div>' +
      '<div class="promo-odds"><span class="odd">LAL −110</span><span class="odd">BOS −110</span><span class="odd">CLAIM →</span></div></div>' +
      '<div class="promo-fine">*Paid as site credit. 10x wagering requirement applies. Credit expires in 7 days. See full terms.</div></div>',
    trick: "'Risk-free' pays back site credit with 10x wagering attached.",
    rule: "Read the terms. Treat every bonus as a leash."
  },
  {
    id: "tipster", cats: ["gambling", "toogood"], answer: "scam", guide: "edge",
    mock:
      '<div class="scr-head tg-head"><b>💰 VIP Signals</b>Telegram · online</div>' +
      '<div class="sms-body tg-body"><div class="bubble"><span class="tg-name">VIP Signals</span>🔒 <b>LOCK OF THE DAY</b> 🔒<br>100% GUARANTEED WINNER.<br>Today\'s pick: <b>$99</b>. DM to pay ⬇️</div></div>',
    trick: "He's paid per signup. He profits whether you win or lose.",
    rule: "If they profit from your bets, it's not advice."
  },
  {
    id: "momcall", cats: ["dms"], answer: "scam", guide: "scam",
    mock:
      '<div class="call-screen"><div class="call-ava">👩</div>' +
      '<div class="call-name">Mom ❤️</div><div class="call-sub">incoming call…</div>' +
      '<div class="call-note">(the voice will sound exactly like her)</div>' +
      '<div class="call-btns"><span class="call-btn no">✕</span><span class="call-btn yes">📞</span></div></div>',
    trick: "AI clones a voice from seconds of audio.",
    rule: "Hang up. Call them back on their real number."
  },
  {
    id: "bankcheck", cats: ["texts"], answer: "legit", guide: "scam",
    mock:
      '<div class="scr-head"><b>CHASE</b>Text Message · now</div>' +
      '<div class="sms-body"><div class="bubble">Did you spend <b>$42.18</b> at Shell? Reply <b>YES</b> or <b>NO</b>.</div></div>',
    trick: "No link, no urgency — just a yes/no check from your bank.",
    rule: "Real alerts ask for nothing. Call the card's number if unsure."
  },
  {
    id: "qrmeter", cats: ["texts"], answer: "scam", guide: "scam",
    mock:
      '<div class="qr-scene"><div class="meter"><div class="face">00:42</div></div>' +
      '<div class="sticker"><canvas class="fakeqr" width="120" height="120" aria-label="Fake QR sticker"></canvas></div>' +
      '<div class="qr-cap">Someone slapped this over the real code.</div></div>',
    trick: "The sticker covers the real code with a scammer's payment page.",
    rule: "Don't scan street QR codes. Type the address yourself."
  },
  {
    id: "jobdm", cats: ["dms", "toogood"], answer: "scam", guide: "scam",
    mock:
      '<div class="scr-head igdm-head"><b>@easy.cash.club</b>Instagram · Active now</div>' +
      '<div class="sms-body"><div class="bubble">Hey bestie!! 💸 Earn <b>$500/day from home!</b> No experience needed. Just pay <b>$49</b> for the starter training kit and I\'ll show you how 👇</div></div>',
    trick: "Real jobs don't charge you $49 to start working.",
    rule: "Never pay to get hired."
  },
  {
    id: "insider", cats: ["gambling", "toogood"], answer: "scam", guide: "edge",
    mock:
      '<div class="promo-card"><div class="promo-top"><div class="brandline">PRIVATE GROUP</div>' +
      '<div class="offer">INSIDER <span>WINS</span></div>' +
      '<div class="promo-odds"><span class="odd">92% win rate</span><span class="odd">guaranteed</span></div></div>' +
      '<div class="promo-fine">Invite-only prediction group. Entry: $250. "Our insiders never lose."</div></div>',
    trick: "'Guaranteed wins' is the oldest lie in gambling.",
    rule: "Nobody beats the market every time. Walk away."
  },
  {
    id: "pizza", cats: ["dms"], answer: "legit", guide: "scam",
    mock:
      '<div class="cash-card"><div class="amt">$18.50</div>' +
      '<div class="from">Maya requested</div><div class="note">"pizza last night 🍕"</div>' +
      '<div class="cash-btns"><span>Decline</span><span>Pay</span></div></div>',
    trick: "You do owe Maya for pizza. This one's just life.",
    rule: "Match requests to real life before you tap pay."
  },
  {
    id: "package", cats: ["texts"], answer: "legit", guide: "scam",
    mock:
      '<div class="scr-head"><b>USPS</b>Text Message · 2:14 PM</div>' +
      '<div class="sms-body"><div class="bubble">Your package was delivered at 2:14 PM. Thank you for choosing USPS.</div></div>',
    trick: "No link, no action, no threat. Just information.",
    rule: "Legit notices don't demand anything."
  }
];

var CAT_NAMES = { texts: "Texts", dms: "DMs", gambling: "Gambling traps", toogood: "Too good to be true" };
var GUIDE_URL = { scam: "../../guides/scam-shield/", edge: "../../guides/the-house-edge/" };
var GUIDE_NAME = { scam: "The Scam Shield playbook", edge: "The House Edge guide" };

/* ---------------- utils ---------------- */
function $(s, r) { return (r || document).querySelector(s); }
function getLS(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
function setLS(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
function mulberry(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(a, rand) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(rand() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
function todayKey() {
  var d = new Date();
  return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
}
function dailyIndex() {
  var d = new Date();
  var n = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return n % ROUNDS.length;
}
function params() {
  var p = {};
  (location.search || "").replace(/^\?/, "").split("&").forEach(function (kv) {
    var k = kv.split("="); if (k[0]) p[decodeURIComponent(k[0])] = decodeURIComponent(k[1] || "");
  });
  return p;
}

/* decorative, unscannable QR — random modules, real finder squares */
function drawFakeQR() {
  document.querySelectorAll("canvas.fakeqr").forEach(function (c) {
    var ctx = c.getContext("2d"), N = 25, s = c.width / N, rand = mulberry(7);
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#111";
    function finder(x, y) {
      ctx.fillRect(x * s, y * s, 7 * s, 7 * s);
      ctx.fillStyle = "#fff"; ctx.fillRect((x + 1) * s, (y + 1) * s, 5 * s, 5 * s);
      ctx.fillStyle = "#111"; ctx.fillRect((x + 2) * s, (y + 2) * s, 3 * s, 3 * s);
    }
    for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) {
      var inF = (i < 8 && j < 8) || (i > N - 9 && j < 8) || (i < 8 && j > N - 9);
      if (!inF && rand() > 0.52) ctx.fillRect(i * s, j * s, s, s);
    }
    finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
  });
}

function popBurst(x, y, good) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var colors = good ? ["#34d17b", "#ffb224", "#f4f1e8"] : ["#ff4d5e", "#ffb224", "#f4f1e8"];
  for (var i = 0; i < 22; i++) {
    var p = document.createElement("div");
    p.className = "pop";
    var a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 130;
    p.style.left = x + "px"; p.style.top = y + "px";
    p.style.background = colors[i % colors.length];
    p.style.setProperty("--dx", Math.cos(a) * d + "px");
    p.style.setProperty("--dy", (Math.sin(a) * d - 60) + "px");
    p.style.setProperty("--rot", (Math.random() * 540 - 270) + "deg");
    document.body.appendChild(p);
    (function (el) { setTimeout(function () { el.remove(); }, 950); })(p);
  }
}

/* ---------------- HUB ---------------- */
function initHub() {
  var best = parseInt(getLS("eq_best", "0"), 10) || 0;
  var rounds = parseInt(getLS("eq_rounds", "0"), 10) || 0;
  var b = $("#stat-best"), r = $("#stat-rounds");
  if (b) b.textContent = best;
  if (r) r.textContent = rounds;

  var dc = $("#daily-card");
  if (dc) {
    var idx = dailyIndex(), round = ROUNDS[idx];
    var res = getLS("eq_daily_" + todayKey(), "");
    $("#daily-cat").textContent = "Today: " + round.cats.map(function (c) { return CAT_NAMES[c]; }).join(" · ");
    if (res === "win") { dc.classList.add("done"); $("#daily-sub").textContent = "Nailed it. New round tomorrow."; }
    else if (res === "loss") { dc.classList.add("done"); $("#daily-sub").textContent = "Got played. Run it back tomorrow."; }
    else { $("#daily-sub").textContent = "One round. One call. Streaks count."; }
  }
}

/* ---------------- PLAY ---------------- */
var S = null;

function rankFor(score, total) {
  var pct = score / total;
  if (pct >= 0.9) return ["RAZOR SHARP", "Scammers hate you."];
  if (pct >= 0.65) return ["GETTING THERE", "Sharp — keep the guard up."];
  if (pct >= 0.4) return ["SHAKY", "The traps are working on you."];
  return ["EASY TARGET", "Read the guides. Seriously."];
}

function initPlay() {
  var p = params();
  var list, daily = false, cat = p.cat || "";
  if (p.daily !== undefined || p.mode === "daily") {
    daily = true;
    list = [ROUNDS[dailyIndex()]];
  } else if (cat && CAT_NAMES[cat]) {
    list = ROUNDS.filter(function (r) { return r.cats.indexOf(cat) !== -1; });
    if (!list.length) list = ROUNDS.slice();
  } else {
    list = ROUNDS.slice();
  }
  list = shuffle(list, mulberry((Date.now() ^ (Math.random() * 1e9)) | 0));

  S = { list: list, i: 0, score: 0, streak: 0, bestRun: 0, daily: daily, cat: cat, answered: false };

  var title = $("#qz-mode");
  if (title) {
    title.textContent = daily ? "DAILY CHALLENGE" : (cat ? CAT_NAMES[cat].toUpperCase() : "FULL RUN");
  }
  renderRound();
}

function renderRound() {
  var r = S.list[S.i];
  S.answered = false;
  $("#qz-roundnum").innerHTML = "<b>" + (S.i + 1) + "</b>/" + S.list.length;
  $("#qz-bar").style.width = (S.i / S.list.length * 100) + "%";
  paintStreak();

  $("#qz-mock").innerHTML =
    '<div class="phone"><div class="notch"></div><div class="screen">' + r.mock + "</div></div>";
  drawFakeQR();

  var q = $("#qz-q");
  q.innerHTML = '<span class="scamw">SCAM</span> OR <span class="legitw">LEGIT</span>?';

  var c = $("#qz-choices");
  c.innerHTML =
    '<button class="qz-choice scam" id="pick-scam" type="button"><span class="em">🚩</span>SCAM</button>' +
    '<button class="qz-choice legit" id="pick-legit" type="button"><span class="em">✅</span>LEGIT</button>';
  $("#pick-scam").addEventListener("click", function () { answer("scam", this); });
  $("#pick-legit").addEventListener("click", function () { answer("legit", this); });
  $("#qz-reveal-slot").innerHTML = "";
}

function paintStreak() {
  var el = $("#qz-streak");
  el.querySelector(".n").textContent = S.streak;
  el.classList.toggle("lit", S.streak > 0);
  var f = el.querySelector(".flame");
  f.style.transform = "scale(" + (1 + Math.min(S.streak, 12) * 0.07) + ")";
}
function updateStreak(n) { S.streak = n; paintStreak(); }

function answer(pick, btn) {
  if (S.answered) return;
  S.answered = true;
  var r = S.list[S.i];
  var good = pick === r.answer;

  btn.classList.add("pressed", pick === "scam" ? "picked-scam" : "picked-legit");
  var other = $("#pick-" + (pick === "scam" ? "legit" : "scam"));
  if (other) other.classList.add("dim");
  $("#pick-scam").disabled = true; $("#pick-legit").disabled = true;

  setLS("eq_rounds", String((parseInt(getLS("eq_rounds", "0"), 10) || 0) + 1));

  var slot = $("#qz-reveal-slot");
  setTimeout(function () {
    if (good) {
      S.score++;
      updateStreak(S.streak + 1);
      S.bestRun = Math.max(S.bestRun, S.streak);
      btn.classList.add("pulse-green");
      var rect = btn.getBoundingClientRect();
      popBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, true);
    } else {
      updateStreak(0);
      $("#qz-stage-inner").classList.add("shake");
      setTimeout(function () { $("#qz-stage-inner").classList.remove("shake"); }, 550);
    }
    $("#qz-scorenum").textContent = S.score;
    $("#qz-bar").style.width = ((S.i + 1) / S.list.length * 100) + "%";

    var verdictCls = r.answer === "scam" ? "scamv" : "legitv";
    var verdictTxt = r.answer === "scam" ? "🚩 SCAM" : "✅ LEGIT";
    var call = good ? "YOU CALLED IT." : "YOU GOT PLAYED.";
    slot.innerHTML =
      '<div class="qz-reveal ' + (good ? "correct" : "wrong") + '" role="status">' +
      '<div class="verdict ' + verdictCls + '"><span>' + verdictTxt + '</span><span class="tagline">' + call + '</span></div>' +
      '<p class="trick">' + r.trick + '</p>' +
      '<p class="rule">' + r.rule + '</p>' +
      '<a class="guide-link" href="' + GUIDE_URL[r.guide] + '">Read the playbook →</a>' +
      '<button class="btn-next" id="qz-next" type="button">' + (S.i + 1 >= S.list.length ? "SEE MY RANK →" : "NEXT →") + '</button>' +
      "</div>";
    $("#qz-next").addEventListener("click", next);
    slot.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 420);
}

function next() {
  S.i++;
  if (S.i >= S.list.length) endScreen();
  else renderRound();
}

function endScreen() {
  var total = S.list.length;
  var best = parseInt(getLS("eq_best", "0"), 10) || 0;
  if (S.bestRun > best) { best = S.bestRun; setLS("eq_best", String(best)); }

  var rank, sub;
  if (S.daily) {
    var won = S.score === 1;
    rank = won ? "NAILED IT" : "GOT PLAYED";
    sub = won ? "One round. One call. Correct." : "One round. One call. Wrong.";
    setLS("eq_daily_" + todayKey(), won ? "win" : "loss");
  } else {
    var rr = rankFor(S.score, total);
    rank = rr[0]; sub = rr[1];
  }

  var stage = $("#qz-stage-inner");
  stage.innerHTML =
    '<div class="qz-end">' +
    '<p class="radar-label">' + (S.daily ? "DAILY CHALLENGE" : "SCAM RADAR") + '</p>' +
    '<p class="radar-rank">' + rank + '</p>' +
    '<p class="radar-sub">' + sub + '</p>' +
    '<div class="end-stats">' +
    '<div><span class="num g">' + S.score + '/' + total + '</span><span class="lbl">SCORE</span></div>' +
    '<div><span class="num a">' + S.bestRun + '</span><span class="lbl">BEST STREAK</span></div>' +
    '<div><span class="num">' + best + '</span><span class="lbl">ALL-TIME</span></div>' +
    "</div>" +
    '<div class="end-btns">' +
    '<a class="btn-play" href="./">PLAY AGAIN</a>' +
    (S.daily ? '<a class="btn-ghost" href="./">Full 12-round run →</a>' : '<a class="btn-ghost" href="./?daily">Daily challenge →</a>') +
    "</div>" +
    '<p class="radar-label" style="margin-bottom:1rem">GET THE NIGHTLY SIGNAL</p>' +
    '<form action="https://buttondown.com/api/emails/embed-subscribe/beaware" method="post" class="embeddable-buttondown-form digest-form" style="margin:0 auto">' +
    '<label class="sr-only" for="bd-email-end">Enter your email</label>' +
    '<input type="email" name="email" id="bd-email-end" placeholder="you@example.com" autocomplete="email" required />' +
    '<input type="submit" value="Get the digest" class="btn" />' +
    "</form>" +
    "</div>";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------------- boot ---------------- */
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("qz-stage-inner")) initPlay();
  else initHub();
});
})();
