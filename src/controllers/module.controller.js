import { addQuestionsService, createModuleService, updateQuestionService } from "../services/module.service.js";
export const createModule = async (req, res) => {
    try {
        //destructuring name from request body
        const { name } = req.body;
        //checking whether name is provided by the user or not
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "module name is required"
            });
        }
        //calling service layer to create the module
        const newModule = await createModuleService(name);
        return res.status(201).json({
            success: true,
            message: "module created successfully",
            newModule
        });
    }
    catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });

    }
};
export const addQuestions = async (req, res) => {

    try {

        //destructuring module id from params or path variables
        const { moduleId } = req.params;

        //destructuring text, isCheckPoint and options input from the request body
        const { text, isCheckPoint, options } = req.body;

        //checking whether question text is provided by the user or not
        if (!text || !text.trim()) {

            return res.status(400).json({
                success: false,
                message: "question text is required"
            });

        }

        //calling service layer to add the question to the module
        const questionData = await addQuestionsService(
            moduleId,
            text,
            isCheckPoint,
            options
        );

        //returning the final response
        return res.status(201).json({
            success: true,
            message: "question added successfully",
            questionData
        });

    }

    catch (error) {

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });

    }
};
export const updateQuestion = async (req, res) => {

    try {

        //destructuring module id and question id from params or path variables
        const { moduleId, questionId } = req.params;

        //destructuring text, isCheckpoint and options from request body
        const { text, isCheckPoint, options } = req.body;

        //checking whether module id is provided or not
        if (!moduleId) {
            return res.status(400).json({
                success: false,
                message: "module id is required"
            });
        }

        //checking whether question id is provided or not
        if (!questionId) {
            return res.status(400).json({
                success: false,
                message: "question id is required"
            });
        }

        //checking whether question text is provided or not
        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "question text is required"
            });
        }

        //calling service layer to update the question
        const updatedQuestion = await updateQuestionService(
            moduleId,
            questionId,
            text,
            isCheckPoint,
            options
        );

        //returning the final response
        return res.status(200).json({
            success: true,
            message: "question updated successfully",
            questionData: updatedQuestion
        });

    }

    catch (error) {

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });

    }
};