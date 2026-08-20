import express from "express";
import { addQuestions, createModule, updateQuestion } from "../controllers/module.controller.js";
const router = express.Router();

// Create a new module
router.post("/", createModule);

// Add a question to a module
router.post("/:moduleId/questions", addQuestions);

// Update question from a module
router.put(
    "/:moduleId/questions/:questionId",
    updateQuestion
);
export default router;
