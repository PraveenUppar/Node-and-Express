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
