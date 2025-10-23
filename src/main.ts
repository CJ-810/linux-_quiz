import "./styles.css";
import type { Question } from "./types.d.ts";

let current = 0;
let score = 0;
let questions: Question[] = [];
const app = document.getElementById("app")!;

async function loadQuestions() {
  const res = await fetch("/questions.json");
  questions = await res.json();

  // 🔀 Shuffle questions before starting
  shuffleArray(questions);

  renderQuestion();
}

// 🔀 Fisher–Yates shuffle algorithm
function shuffleArray(array: Question[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderQuestion() {
  const q = questions[current];
  app.innerHTML = `
    <div class="quiz">
      <h2>Question ${current + 1} of ${questions.length}</h2>
      <p class="question">${q.question}</p>
      <div class="options">
        ${q.options
          .map(
            (opt, i) =>
              `<button class="option-btn" data-index="${i}">${opt}</button>`
          )
          .join("")}
      </div>
      <div class="next-container"></div>
      <p class="progress">Score: ${score}/${questions.length}</p>
    </div>
  `;

  document.querySelectorAll<HTMLButtonElement>(".option-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      handleAnswer(parseInt(btn.dataset.index!))
    );
  });
}

function handleAnswer(selectedIndex: number) {
  const q = questions[current];
  const buttons = document.querySelectorAll<HTMLButtonElement>(".option-btn");

  buttons.forEach((b) => (b.disabled = true));

  buttons.forEach((btn, i) => {
    if (i === q.answer) btn.classList.add("correct");
    else if (i === selectedIndex && i !== q.answer) btn.classList.add("wrong");
  });

  const nextContainer = document.querySelector(".next-container")!;

  if (selectedIndex === q.answer) {
    score++;
    setTimeout(() => {
      current++;
      if (current < questions.length) renderQuestion();
      else showResult();
    }, 1000);
  } else {
    nextContainer.innerHTML = `
      <p class="feedback">❌ Wrong! The correct answer is: <strong>${
        q.options[q.answer]
      }</strong></p>
      <button class="next-btn">Next</button>
    `;
    document
      .querySelector<HTMLButtonElement>(".next-btn")!
      .addEventListener("click", () => {
        current++;
        if (current < questions.length) renderQuestion();
        else showResult();
      });
  }
}

function showResult() {
  const percent = Math.round((score / questions.length) * 100);
  let remark = "";

  if (percent >= 100) remark = "🌟 Excellent! You're a Linux master.";
  else if (percent >= 80) remark = "💪 Great job! you passed.";
  else if (percent >= 50) remark = "👍 Not bad — some review needed.";
  else remark = "💀 your cooked";

  app.innerHTML = `
    <div class="quiz result">
      <h2>Quiz Complete!</h2>
      <p>Your score: <strong>${score}</strong> / ${questions.length}</p>
      <p>Percentage: <strong>${percent}%</strong></p>
      <p class="remark">${remark}</p>
      <button onclick="window.restart()">Restart Quiz</button>
    </div>
  `;
}

(window as any).restart = () => {
  current = 0;
  score = 0;

  // 🔁 Re-shuffle when restarting
  shuffleArray(questions);

  renderQuestion();
};

loadQuestions();
