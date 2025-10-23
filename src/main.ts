import type { Question } from "./types.d.ts";
import "./style.css";

let current = 0;
let score = 0;
let questions: Question[] = [];

const app = document.getElementById("app")!;

async function loadQuestions() {
  const res = await fetch("/questions.json");
  questions = await res.json();
  renderQuestion();
}

function renderQuestion() {
  const q = questions[current];
  app.innerHTML = `
    <div class="quiz">
      <h2>Question ${current + 1} of ${questions.length}</h2>
      <p>${q.question}</p>
      <div class="options">
        ${q.options
          .map(
            (opt, i) =>
              `<button onclick="window.answer(${i})">${opt}</button>`
          )
          .join("")}
      </div>
      <p class="progress">Score: ${score}/${questions.length}</p>
    </div>
  `;
}

(window as any).answer = (index: number) => {
  if (index === questions[current].answer) score++;
  current++;
  if (current < questions.length) renderQuestion();
  else showResult();
};

function showResult() {
  const percent = Math.round((score / questions.length) * 100);
  let remark = "";

  if (percent >= 90) remark = "🌟 Excellent! You're a Linux master.";
  else if (percent >= 75) remark = "💪 Great job! Keep it up.";
  else if (percent >= 50) remark = "👍 Not bad — some review needed.";
  else remark = "📘 Keep practicing — you’ll get there!";

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
  renderQuestion();
};

loadQuestions();
