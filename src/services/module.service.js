import crypto from "crypto";
import { addQuestionToModuleRepo, createModuleRepo, findModuleRepo, updateQuestionInModuleRepo } from "../repositories/module.repo.js";


export const createModuleService = async (name) => {

    //generating a unique id for the module
    const moduleId = crypto.randomUUID();

    //creating module with name and empty questions array because
    //questions will be added via next controller which is addQuestions controller
    const newModule = await createModuleRepo({
        moduleId: moduleId,
        name: name.trim(),
        questions: []
    });

    return newModule;
};
export const addQuestionsService = async (
    moduleId,
    text,
    isCheckPoint,
    options
) => {

    //checking whether module exists or not
    const existingModule = await findModuleRepo(moduleId);

    if (!existingModule) {

        const error = new Error("module not found");

        error.statusCode = 404;

        throw error;
    }

    //generating question id via random uuid method from crypto package
    const questionId = crypto.randomUUID();

    //checking whether the question already exists or not
    const isQuestionAlreadyExists = existingModule.questions.some(
        (question) => question.questionId === questionId
    );

    if (isQuestionAlreadyExists) {

        const error = new Error(
            "question already exists in module"
        );

        error.statusCode = 409;

        throw error;
    }
    const updatedOptions = (options || []).map((option) => {

        return {
            optionId: crypto.randomUUID(),
            text: option.text,
            nextQuestionId: option.nextQuestionId || null,
            nextModuleId: option.nextModuleId || null
        };

    });
    //creating the question data
    const questionData = {
        questionId,
        text: text.trim(),
        isCheckPoint: isCheckPoint || false,
        options: updatedOptions || []
    };

    //adding the question to the existing module
    await addQuestionToModuleRepo(
        existingModule,
        questionData
    );

    return {
        questionId,
        moduleId,
        text: text.trim(),
        isCheckPoint: isCheckPoint || false,
        options: options || []
    };
};
export const updateQuestionService = async (
    moduleId,
    questionId,
    text,
    isCheckPoint,
    options
) => {

    //checking whether module exists or not
    const existingModule = await findModuleRepo(moduleId);

    if (!existingModule) {

        const error = new Error("module not found");

        error.statusCode = 404;

        throw error;
    }

    //finding the question inside the module
    const existingQuestion = existingModule.questions.find(
        (question) => question.questionId === questionId
    );

    if (!existingQuestion) {

        const error = new Error("question not found");

        error.statusCode = 404;

        throw error;
    }

    //generating option ids for the options received from the request
    const updatedOptions = (options || []).map((option) => {

        return {
            optionId: option.optionId || crypto.randomUUID(),
            text: option.text,
            nextModuleId: option.nextModuleId,
            nextQuestionId: option.nextQuestionId
        };

    });

    //updating the question data
    existingQuestion.text = text.trim();
    existingQuestion.isCheckPoint = isCheckPoint || false;
    existingQuestion.options = updatedOptions;

    //saving the updated question in the module
    await updateQuestionInModuleRepo(existingModule);

    return {
        questionId,
        moduleId,
        text: existingQuestion.text,
        isCheckPoint: existingQuestion.isCheckPoint,
        options: existingQuestion.options
    };
};