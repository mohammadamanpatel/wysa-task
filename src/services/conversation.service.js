import { createUserConversationRepo, findUserConversationRepo, updateUserConversationRepo } from "../repositories/conversation.repo.js";
import { findModuleRepo } from "../repositories/module.repo.js";


export const startModuleService = async (moduleId, userId) => {

    //checking whether module exists or not based on module id
    const existingModule = await findModuleRepo(moduleId);

    if (!existingModule) {

        const error = new Error("module does not exist");

        error.statusCode = 404;

        throw error;
    }

    //checking whether existing module has any questions or not
    //module should have at least one question
    if (existingModule.questions.length === 0) {

        const error = new Error(
            "module should have at least one question"
        );

        error.statusCode = 400;

        throw error;
    }

    //checking whether user conversation exists or not
    //if user conversation does not exist then this is user's first conversation
    let userConversation = await findUserConversationRepo(userId);

    if (!userConversation) {

        //if user's conversation does not exist,
        //create an empty conversation for the user
        userConversation = await createUserConversationRepo(userId);
    }

    //checking whether the user has already gone through this module or not
    //if module state exists, user will continue from where they left
    let moduleState = userConversation.moduleStates.find(
        (state) => state.moduleId === moduleId
    );

    let currentQuestion;

    if (moduleState) {

        //finding the question where user left the module
        currentQuestion = existingModule.questions.find(
            (question) =>
                question.questionId === moduleState.currentQuestionId
        );

        //checking whether the saved question still exists or not
        if (!currentQuestion) {

            const error = new Error(
                "Saved question for this module no longer exists"
            );

            error.statusCode = 400;

            throw error;
        }

    } else {

        //if module state does not exist,
        //this is user's first time entering this module
        currentQuestion = existingModule.questions[0];

        moduleState = {
            moduleId,
            currentQuestionId: currentQuestion.questionId,
            contextVersion: 1
        };

        //adding the module state to user's conversation
        userConversation.moduleStates.push(moduleState);
    }

    //updating the user's active state
    userConversation.activeState = {
        moduleId,
        currentQuestionId: currentQuestion.questionId
    };

    //saving the updated user conversation
    await updateUserConversationRepo(userConversation);

    return {
        moduleId,
        question: currentQuestion
    };
};
export const answerQuestionService = async (
    userId,
    questionId,
    optionId
) => {

    //checking whether user conversation exists or not
    const userConversation = await findUserConversationRepo(userId);

    if (!userConversation) {

        const error = new Error(
            "user conversation not found"
        );

        error.statusCode = 404;

        throw error;
    }

    //if user conversation exists then accessing the active state from it
    const userActiveState = userConversation.activeState;

    if (
        !userActiveState ||
        !userActiveState.moduleId ||
        !userActiveState.currentQuestionId
    ) {

        const error = new Error(
            "User does not have an active question"
        );

        error.statusCode = 400;

        throw error;
    }

    //checking whether user is answering the current question or not
    if (userActiveState.currentQuestionId !== questionId) {

        const error = new Error(
            "This is not the user's current question"
        );

        error.statusCode = 409;

        throw error;
    }

    //finding current module via user's active state module id
    const currentModule = await findModuleRepo(
        userActiveState.moduleId
    );

    if (!currentModule) {

        const error = new Error(
            "Current module not found"
        );

        error.statusCode = 404;

        throw error;
    }

    //checking whether current question is present in the current module questions or not
    const currentQuestion = currentModule.questions.find(
        (question) => question.questionId === questionId
    );

    if (!currentQuestion) {

        const error = new Error(
            "Current question not found"
        );

        error.statusCode = 404;

        throw error;
    }

    //checking whether the selected option is valid for the current question
    const selectedOption = currentQuestion.options.find(
        (option) => option.optionId === optionId
    );

    if (!selectedOption) {

        const error = new Error(
            "Invalid option for this question"
        );

        error.statusCode = 400;

        throw error;
    }

    //accessing the current module state to get the context version
    const currentModuleState = userConversation.moduleStates.find(
        (state) => state.moduleId === userActiveState.moduleId
    );

    if (!currentModuleState) {

        const error = new Error(
            "Current module state not found"
        );

        error.statusCode = 400;

        throw error;
    }

    //saving the answer in conversation history
    userConversation.conversationHistory.push({
        moduleId: userActiveState.moduleId,
        questionId: currentQuestion.questionId,
        optionId: selectedOption.optionId,
        contextVersion: currentModuleState.contextVersion
    });

    //accessing next question and module id from the selected option
    const nextModuleId =
        selectedOption.nextModuleId || userActiveState.moduleId;

    const nextQuestionId = selectedOption.nextQuestionId;

    if (!nextQuestionId) {

        const error = new Error(
            "This option does not have a next question"
        );

        error.statusCode = 400;

        throw error;
    }

    //finding the next module using the selected option's next module id
    const nextModule = await findModuleRepo(nextModuleId);

    if (!nextModule) {

        const error = new Error(
            "Next module does not exist"
        );

        error.statusCode = 400;

        throw error;
    }

    //if next module exists then checking whether next question exists or not
    const nextQuestion = nextModule.questions.find(
        (question) => question.questionId === nextQuestionId
    );

    if (!nextQuestion) {

        const error = new Error(
            "Next question does not exist"
        );

        error.statusCode = 400;

        throw error;
    }

    //if current question is a checkpoint,
    //incrementing the context version
    if (currentQuestion.isCheckPoint) {
        currentModuleState.contextVersion += 1;
    }

    //finding the next module state
    const nextModuleState = userConversation.moduleStates.find(
        (state) => state.moduleId === nextModuleId
    );

    if (!nextModuleState) {

        //if next module state does not exist,
        //creating a new module state
        userConversation.moduleStates.push({
            moduleId: nextModuleId,
            currentQuestionId: nextQuestionId,
            contextVersion: 1
        });

    } else {

        //if next module state already exists,
        //updating the current question id
        nextModuleState.currentQuestionId = nextQuestionId;
    }

    //finally updating the user's active state
    userConversation.activeState = {
        moduleId: nextModuleId,
        currentQuestionId: nextQuestionId
    };

    //saving the updated user conversation
    await updateUserConversationRepo(userConversation);

    return {
        moduleId: nextModuleId,
        question: nextQuestion
    };
};
export const getCurrentStateService = async (userId) => {

    //finding user conversation via user id
    const userConversation = await findUserConversationRepo(userId);

    if (!userConversation) {

        const error = new Error(
            "User conversation not found"
        );

        error.statusCode = 404;

        throw error;
    }

    //returning the final user state from user conversation
    return userConversation.activeState;
};
export const getHistoryService = async (userId) => {

    //getting user conversation via user id
    const userConversation = await findUserConversationRepo(userId);

    if (!userConversation) {

        const error = new Error(
            "User conversation not found"
        );

        error.statusCode = 404;

        throw error;
    }

    //returning the final response which is conversation history
    return userConversation.conversationHistory;
};
export const getQuestionFromDeepLinkService = async (
    userId,
    questionId
) => {

    //getting user conversation via user id
    const userConversation = await findUserConversationRepo(userId);

    if (!userConversation) {

        const error = new Error(
            "User conversation not found"
        );

        error.statusCode = 404;

        throw error;
    }

    //accessing the active state of the user
    const activeState = userConversation.activeState;

    //checking whether user has an active question or not
    if (
        !activeState ||
        !activeState.moduleId ||
        !activeState.currentQuestionId
    ) {

        const error = new Error(
            "User does not have an active question"
        );

        error.statusCode = 400;

        throw error;
    }

    //finding the user's current module
    const currentModule = await findModuleRepo(
        activeState.moduleId
    );

    if (!currentModule) {

        const error = new Error(
            "Current module not found"
        );

        error.statusCode = 404;

        throw error;
    }

    //checking whether the requested question is the user's current question
    if (activeState.currentQuestionId === questionId) {

        const currentQuestion = currentModule.questions.find(
            (question) => question.questionId === questionId
        );

        if (currentQuestion) {

            return {
                message: "Returning requested question",
                data: {
                    moduleId: activeState.moduleId,
                    question: currentQuestion
                }
            };
        }
    }

    //requested question is old or invalid
    //returning the user's current question instead
    const currentQuestion = currentModule.questions.find(
        (question) =>
            question.questionId === activeState.currentQuestionId
    );

    if (!currentQuestion) {

        const error = new Error(
            "Current question no longer exists"
        );

        error.statusCode = 400;

        throw error;
    }

    return {
        message:
            "Requested question is no longer active. Returning current question.",
        data: {
            moduleId: activeState.moduleId,
            question: currentQuestion
        }
    };
};