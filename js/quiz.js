// GroundWatch quiz (learn.html)

const QUESTIONS = [
  {
    q: "What is land subsidence?",
    options: [
      "The rising of sea level due to melting ice",
      "The gradual sinking of the ground surface",
      "A sudden earthquake along a fault line",
      "Erosion of soil by strong winds",
    ],
    answer: 1,
    explain: "Land subsidence is the sinking or settling of the ground surface, often slowly over many years.",
  },
  {
    q: "What is the main human cause of land subsidence around northern Manila Bay?",
    options: ["Mining for gold", "Volcanic activity", "Excessive groundwater extraction", "Planting too many trees"],
    answer: 2,
    explain: "Pumping more groundwater than can be naturally recharged causes clay layers underground to compact.",
  },
  {
    q: "Which underground layer compresses the most when groundwater is pumped out?",
    options: ["Clay", "Gravel", "Bedrock", "Coral"],
    answer: 0,
    explain: "Clay holds water in tiny pores. When that water drains out, the clay packs tightly and does not rebound.",
  },
  {
    q: "Why does Hagonoy experience flooding even on days without rain?",
    options: [
      "Because of broken water pipes",
      "Because sinking land is now below high-tide level",
      "Because of too much traffic",
      "Because rivers are getting deeper",
    ],
    answer: 1,
    explain: "As the ground sinks, high tides from Manila Bay reach streets and homes, even without rain.",
  },
  {
    q: "Which is faster in Hagonoy's coastal areas?",
    options: ["Global sea-level rise", "Local land subsidence", "They are exactly the same", "Neither is happening"],
    answer: 1,
    explain: "Subsidence of several centimeters per year has been reported, while global sea-level rise is only a few millimeters per year.",
  },
  {
    q: "What happens when seawater moves into a coastal aquifer?",
    options: ["Saltwater intrusion", "Aquifer recharge", "Desalination", "Evaporation"],
    answer: 0,
    explain: "Saltwater intrusion makes well water salty and unsafe for drinking or farming.",
  },
  {
    q: "Can land that has already subsided usually return to its original level?",
    options: [
      "Yes, as soon as it rains",
      "Yes, after one year",
      "Mostly no. The compaction is largely permanent",
      "Only during summer",
    ],
    answer: 2,
    explain: "Compacted clay does not bounce back, which is why preventing further subsidence is so important.",
  },
  {
    q: "Which agency issues water permits and regulates groundwater use in the Philippines?",
    options: ["PAGASA", "National Water Resources Board (NWRB)", "DepEd", "LTO"],
    answer: 1,
    explain: "The NWRB regulates water use, including well permits, under the Water Code of the Philippines.",
  },
  {
    q: "Which household action helps reduce land subsidence?",
    options: [
      "Digging a deeper well",
      "Leaving the pump running all day",
      "Harvesting rainwater for cleaning and gardening",
      "Throwing garbage in canals",
    ],
    answer: 2,
    explain: "Using rainwater instead of groundwater reduces how much water is pumped from aquifers.",
  },
  {
    q: "How do mangroves help coastal communities like Hagonoy?",
    options: [
      "They increase groundwater pumping",
      "They reduce wave energy and protect against storm surge",
      "They make floods last longer",
      "They cause land subsidence",
    ],
    answer: 1,
    explain: "Mangroves act as natural barriers that weaken waves and trap sediment along the coast.",
  },
];

const PASSING_PERCENT = 70;

// Fisher–Yates shuffle, returns a new array
function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffle the questions and each question's options, keeping track of the right answer
function buildRound() {
  return shuffle(QUESTIONS).map((item) => {
    const order = shuffle(item.options.map((_, i) => i));
    return {
      q: item.q,
      explain: item.explain,
      options: order.map((i) => item.options[i]),
      answer: order.indexOf(item.answer),
    };
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function printCertificate(name, score, total) {
  let cert = document.querySelector(".certificate");
  if (!cert) {
    cert = document.createElement("div");
    cert.className = "certificate";
    document.body.append(cert);
  }
  const date = new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
  cert.innerHTML = `
    <p style="letter-spacing:0.15em;text-transform:uppercase;color:#c8792c;font-weight:700">Hagonoy GroundWatch</p>
    <h1>Certificate of Completion</h1>
    <p>This certifies that</p>
    <div class="cert-name">${escapeHtml(name)}</div>
    <p>has completed the <strong>GroundWatch Land Subsidence Quiz</strong> with a score of
      <strong>${score} out of ${total}</strong>, and has learned about the causes, effects, and solutions
      to land subsidence in Hagonoy, Bulacan.</p>
    <p style="margin-top:30px">${date}</p>`;

  document.body.classList.add("print-cert");
  window.addEventListener("afterprint", () => document.body.classList.remove("print-cert"), { once: true });
  window.print();
}

document.addEventListener("DOMContentLoaded", () => {
  const body = document.getElementById("quiz-body");
  const bar = document.getElementById("quiz-bar");
  const count = document.getElementById("quiz-count");
  let round = buildRound();
  let index = 0;
  let score = 0;

  function renderQuestion() {
    const item = round[index];
    bar.style.width = (index / round.length) * 100 + "%";
    count.textContent = `Question ${index + 1} of ${round.length}  |  Score: ${score}`;
    body.innerHTML = `
      <div class="quiz-question">${item.q}</div>
      <div class="quiz-options">
        ${item.options.map((opt, i) => `<button type="button" data-i="${i}">${String.fromCharCode(65 + i)}. ${opt}</button>`).join("")}
      </div>
      <div class="quiz-feedback" aria-live="polite"></div>
      <div class="quiz-footer"><span></span><button type="button" class="btn" id="next-btn" hidden>
        ${index === round.length - 1 ? "See results" : "Next question"}
      </button></div>`;

    const buttons = body.querySelectorAll(".quiz-options button");
    const feedback = body.querySelector(".quiz-feedback");
    const next = body.querySelector("#next-btn");

    buttons.forEach((btn) =>
      btn.addEventListener("click", () => {
        const choice = Number(btn.dataset.i);
        const correct = choice === item.answer;
        if (correct) score++;
        buttons.forEach((b) => (b.disabled = true));
        buttons[item.answer].classList.add("correct");
        if (!correct) btn.classList.add("wrong");
        feedback.innerHTML = `<strong>${correct ? "Correct!" : "Not quite."}</strong> ${item.explain}`;
        count.textContent = `Question ${index + 1} of ${round.length}  |  Score: ${score}`;
        next.hidden = false;
        next.focus();
      })
    );

    next.addEventListener("click", () => {
      index++;
      if (index < round.length) renderQuestion();
      else renderResults();
    });
  }

  function renderResults() {
    bar.style.width = "100%";
    count.textContent = "Quiz complete";
    const total = round.length;
    const pct = Math.round((score / total) * 100);
    const passed = pct >= PASSING_PERCENT;
    let message;
    if (pct >= 90) message = "Excellent! You're a true GroundWatch advocate. Share what you know with your community.";
    else if (passed) message = "Good job! Review the Causes & Effects and Solutions pages to strengthen your knowledge.";
    else message = "Keep learning! Explore the About and Causes & Effects pages, then try again. The questions come in a new order each time.";

    const certificate = passed
      ? `<form class="cert-form" id="cert-form">
           <div class="field">
             <label for="cert-name">Your name for the certificate</label>
             <input type="text" id="cert-name" required maxlength="60" placeholder="Juan Dela Cruz">
           </div>
           <button type="submit" class="btn">Print certificate</button>
         </form>`
      : `<p class="note">Score ${PASSING_PERCENT}% or higher to unlock a printable certificate.</p>`;

    body.innerHTML = `
      <div class="quiz-question">You scored ${score} out of ${total} (${pct}%)</div>
      <p>${message}</p>
      ${certificate}
      <div class="btn-row"><button type="button" class="btn${passed ? " outline" : ""}" id="retry-btn">Try again</button>
      <a class="btn outline" href="solutions.html">See solutions</a></div>`;

    body.querySelector("#retry-btn").addEventListener("click", () => {
      round = buildRound();
      index = 0;
      score = 0;
      renderQuestion();
    });

    const form = body.querySelector("#cert-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = form.querySelector("#cert-name").value.trim();
        if (name) printCertificate(name, score, total);
      });
    }
  }

  renderQuestion();
});
