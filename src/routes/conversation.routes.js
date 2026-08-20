import express from "express";
import { answerQuestion, getCurrentState, getHistory, getQuestionFromDeepLink, startModule } from "../controllers/conversation.controller.js";

const router = express.Router();

// Start or resume a module
router.post("/start/:moduleId", startModule);

// Answer the current question
router.post("/answer", answerQuestion);

// Get user's current state
router.get("/current", getCurrentState);

// Get user's conversation history
router.get("/history", getHistory);

// Handle old/deep links
router.get("/question/:questionId", getQuestionFromDeepLink);

export default router;