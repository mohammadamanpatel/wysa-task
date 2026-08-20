import { answerQuestionService, getCurrentStateService, getHistoryService, getQuestionFromDeepLinkService, startModuleService } from "../services/conversation.service.js";

export const startModule = async (req, res) => {

    try {

        //destructuring module id from the request parameters or path variables
        const { moduleId } = req.params;

        //destructuring user id from the request body
        const { userId } = req.body;

        //checking whether user id is provided or not
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "user id is missing"
            });
        }

        //calling service layer to start or resume the module
        const moduleData = await startModuleService(
            moduleId,
            userId
        );

        return res.status(200).json({
            success: true,
            message: "Module started successfully",
            data: moduleData
        });

    }

    catch (error) {

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });

    }
};
export const answerQuestion = async (req, res) => {
    try {
        //destructuring inputs that are user id, option id and question id from request body
        const { userId, optionId, questionId } = req.body;

        //checking whether user id is provided or not
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "user id is required"
            });
        }

        //checking whether question id is provided or not
        if (!questionId) {
            return res.status(400).json({
                success: false,
                message: "question id is required"
            });
        }

        //checking whether option id is provided or not
        if (!optionId) {
            return res.status(400).json({
                success: false,
                message: "option id is required"
            });
        }

        //calling service layer to process the user's answer
        const answerData = await answerQuestionService(
            userId,
            questionId,
            optionId
        );

        return res.status(200).json({
            success: true,
            message: "Answer saved successfully",
            data: answerData
        });

    }

    catch (error) {

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });

    }
};
export const getCurrentState = async (req, res) => {

    try {

        //destructuring user id from request query
        const { userId } = req.query;

        //checking whether user id is provided or not
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        //calling service layer to get user's current state
        const currentState = await getCurrentStateService(
            userId
        );

        //returning the final user state
        return res.status(200).json({
            success: true,
            data: currentState
        });

    }

    catch (error) {

        console.error("Get current state error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });

    }
};
export const getHistory = async (req, res) => {

    try {

        //destructuring user id from request query
        const { userId } = req.query;

        //checking whether user id is provided or not
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        //calling service layer to get user's conversation history
        const conversationHistory = await getHistoryService(
            userId
        );

        //returning the final response which is conversation history
        return res.status(200).json({
            success: true,
            data: conversationHistory
        });

    }

    catch (error) {

        console.error("Get history error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });

    }
};
export const getQuestionFromDeepLink = async (req, res) => {
    try {
        //destructuring question id and user id from request parameters
        const { questionId, userId } = req.params;

        //checking whether user id is provided or not
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        //checking whether question id is provided or not
        if (!questionId) {
            return res.status(400).json({
                success: false,
                message: "questionId is required"
            });
        }

        //calling service layer to handle the deep link logic
        const questionData =
            await getQuestionFromDeepLinkService(
                userId,
                questionId
            );

        return res.status(200).json({
            success: true,
            message: questionData.message,
            data: questionData.data
        });

    }

    catch (error) {

        console.error("Deep link error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });

    }
};