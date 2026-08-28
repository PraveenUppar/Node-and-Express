// Assignment 7: Quiz API
// ========================
//
// Build an Express API that serves quiz questions and tracks scores.
//
// Endpoints:
//   GET    /quiz/categories         → List available quiz categories
//   GET    /quiz/questions           → Get random questions (with optional filters)
//   POST   /quiz/start               → Start a new quiz session
//   POST   /quiz/:sessionId/answer   → Submit an answer for the current question
//   GET    /quiz/:sessionId/score    → Get the score for a quiz session
//   GET    /quiz/leaderboard         → Get top scores
//
// Question Object Structure:
// {
//   id: 1,
//   question: "What does 'npm' stand for?",
//   options: ["Node Package Manager", "New Project Manager", "Node Project Maker", "None of these"],
//   correctAnswer: 0,        // index of the correct option
//   category: "Node.js",
//   difficulty: "easy"       // easy, medium, hard
// }
//
// Requirements:
// 1. Create at least 15 quiz questions across 3 categories (e.g., Node.js, JavaScript, Express)
// 2. Include easy, medium, and hard questions
// 3. GET /quiz/questions should:
//    - Accept query params: ?category=Node.js&difficulty=easy&count=5
//    - Return questions WITHOUT the correctAnswer field (don't reveal answers!)
//    - Randomize the order of questions
// 4. POST /quiz/start should:
//    - Accept { "playerName": "Praveen", "category": "Node.js", "count": 5 }
//    - Create a session with a unique ID
//    - Return sessionId and the first question
// 5. POST /quiz/:sessionId/answer should:
//    - Accept { "questionId": 1, "answer": 0 }
//    - Check if the answer is correct
//    - Return { correct: true/false, correctAnswer: "Node Package Manager", nextQuestion: {...} }
// 6. GET /quiz/:sessionId/score should return the final score and breakdown
//
// Hints:
// - Use Math.random() to shuffle questions
// - Use an object to store quiz sessions
// - Destructure to remove correctAnswer: const { correctAnswer, ...safeQuestion } = question
//
// Bonus:
// - Add a timer: sessions expire after 5 minutes
// - Add streak tracking: consecutive correct answers
// - Point system: easy = 10pts, medium = 20pts, hard = 30pts

const express = require("express");

const app = express();
const PORT = 3000;
const SESSION_TTL = 5 * 60 * 1000;
const pointsByDifficulty = { easy: 10, medium: 20, hard: 30 };
const sessions = new Map();

const questions = [
  {
    id: 1,
    question: "What does npm stand for?",
    options: [
      "Node Package Manager",
      "New Project Manager",
      "Node Project Maker",
      "None of these",
    ],
    correctAnswer: 0,
    category: "Node.js",
    difficulty: "easy",
  },
  {
    id: 2,
    question: "Which object represents the current Node.js process?",
    options: ["global", "process", "runtime", "module"],
    correctAnswer: 1,
    category: "Node.js",
    difficulty: "easy",
  },
  {
    id: 3,
    question: "Which module provides file system APIs?",
    options: ["path", "http", "fs", "os"],
    correctAnswer: 2,
    category: "Node.js",
    difficulty: "easy",
  },
  {
    id: 4,
    question: "What does require() primarily do in CommonJS?",
    options: [
      "Starts a server",
      "Imports a module",
      "Parses JSON",
      "Creates a promise",
    ],
    correctAnswer: 1,
    category: "Node.js",
    difficulty: "medium",
  },
  {
    id: 5,
    question:
      "Which Node.js API schedules a callback after the current call stack?",
    options: ["setImmediate", "setTimeout", "queueMicrotask", "clearTimeout"],
    correctAnswer: 0,
    category: "Node.js",
    difficulty: "hard",
  },
];

app.use(express.json());

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function safeQuestion(question) {
  const { correctAnswer, ...publicQuestion } = question;
  return publicQuestion;
}

function getFilteredQuestions(category, difficulty) {
  return questions.filter(
    (question) =>
      (!category || question.category === category) &&
      (!difficulty || question.difficulty === difficulty),
  );
}

function validCount(value, defaultValue = 5) {
  const count = value === undefined ? defaultValue : Number(value);
  return Number.isInteger(count) && count > 0 ? count : null;
}

function getSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  if (Date.now() - session.createdAt >= SESSION_TTL) {
    sessions.delete(sessionId);
    return null;
  }
  return session;
}

function sessionScore(session) {
  return {
    sessionId: session.id,
    playerName: session.playerName,
    score: session.score,
    correctAnswers: session.correctAnswers,
    incorrectAnswers: session.answers.length - session.correctAnswers,
    totalQuestions: session.questionList.length,
    answeredQuestions: session.answers.length,
    completed: session.currentIndex >= session.questionList.length,
    streak: session.streak,
    maxStreak: session.maxStreak,
    breakdown: session.answers,
  };
}

app.get("/quiz/categories", (req, res) => {
  res.json([...new Set(questions.map((question) => question.category))]);
});

app.get("/quiz/questions", (req, res) => {
  const { category, difficulty } = req.query;
  if (category && !questions.some((question) => question.category === category))
    return res.status(400).json({ error: "invalid category" });
  if (difficulty && !pointsByDifficulty[difficulty])
    return res
      .status(400)
      .json({ error: "difficulty must be easy, medium, or hard" });
  const count = validCount(req.query.count);
  if (!count)
    return res.status(400).json({ error: "count must be a positive integer" });
  res.json(
    shuffle(getFilteredQuestions(category, difficulty))
      .slice(0, count)
      .map(safeQuestion),
  );
});

app.post("/quiz/start", (req, res) => {
  const playerName =
    typeof req.body.playerName === "string" ? req.body.playerName.trim() : "";
  const { category } = req.body;
  const count = validCount(req.body.count);
  if (!playerName)
    return res.status(400).json({ error: "playerName is required" });
  if (category && !questions.some((question) => question.category === category))
    return res.status(400).json({ error: "invalid category" });
  if (!count)
    return res.status(400).json({ error: "count must be a positive integer" });

  const questionList = shuffle(getFilteredQuestions(category));
  if (!questionList.length)
    return res.status(400).json({ error: "no questions available" });
  questionList.length = Math.min(count, questionList.length);
  let sessionId;
  do {
    sessionId = Math.random().toString(36).slice(2, 10);
  } while (sessions.has(sessionId));
  const session = {
    id: sessionId,
    playerName,
    questionList,
    currentIndex: 0,
    createdAt: Date.now(),
    score: 0,
    correctAnswers: 0,
    streak: 0,
    maxStreak: 0,
    answers: [],
  };
  sessions.set(sessionId, session);
  res.status(201).json({
    sessionId,
    playerName,
    totalQuestions: questionList.length,
    question: safeQuestion(questionList[0]),
  });
});

app.post("/quiz/:sessionId/answer", (req, res) => {
  const session = getSession(req.params.sessionId);
  if (!session)
    return res.status(404).json({ error: "quiz session not found or expired" });
  if (session.currentIndex >= session.questionList.length)
    return res.status(400).json({ error: "quiz is already complete" });
  const question = session.questionList[session.currentIndex];
  const answer = req.body.answer;
  if (
    req.body.questionId !== question.id ||
    !Number.isInteger(answer) ||
    answer < 0 ||
    answer >= question.options.length
  ) {
    return res.status(400).json({
      error: "questionId or answer is invalid for the current question",
    });
  }
  const correct = answer === question.correctAnswer;
  if (correct) {
    session.correctAnswers += 1;
    session.streak += 1;
    session.maxStreak = Math.max(session.maxStreak, session.streak);
    session.score += pointsByDifficulty[question.difficulty];
  } else {
    session.streak = 0;
  }
  session.answers.push({
    questionId: question.id,
    answer,
    correct,
    points: correct ? pointsByDifficulty[question.difficulty] : 0,
  });
  session.currentIndex += 1;
  const nextQuestion =
    session.currentIndex < session.questionList.length
      ? safeQuestion(session.questionList[session.currentIndex])
      : null;
  res.json({
    correct,
    correctAnswer: question.options[question.correctAnswer],
    points: correct ? pointsByDifficulty[question.difficulty] : 0,
    streak: session.streak,
    nextQuestion,
  });
});

app.get("/quiz/leaderboard", (req, res) => {
  const limit = validCount(req.query.limit, 10);
  if (!limit)
    return res.status(400).json({ error: "limit must be a positive integer" });
  const leaderboard = [...sessions.values()]
    .filter((session) => getSession(session.id))
    .sort((a, b) => b.score - a.score || b.correctAnswers - a.correctAnswers)
    .slice(0, limit)
    .map((session) => ({
      playerName: session.playerName,
      score: session.score,
      correctAnswers: session.correctAnswers,
      totalQuestions: session.questionList.length,
      completed: session.currentIndex >= session.questionList.length,
    }));
  res.json(leaderboard);
});

app.get("/quiz/:sessionId/score", (req, res) => {
  const session = getSession(req.params.sessionId);
  if (!session)
    return res.status(404).json({ error: "quiz session not found or expired" });
  res.json(sessionScore(session));
});

if (require.main === module) {
  app.listen(PORT, () =>
    console.log(`Quiz API running at http://localhost:${PORT}`),
  );
}

module.exports = app;
