import Module from "../models/module.schema.js";

//find module repo for finding repo through dot find one method
export const findModuleRepo = async (moduleId) => {
    return await Module.findOne({ moduleId });
};

//create module repo for creating module through dot create method 
export const createModuleRepo = async (moduleData) => {
    return await Module.create(moduleData);
};

//add questions repo for adding questions to a existing module
export const addQuestionToModuleRepo = async (
    existingModule,
    questionData
) => {

    //pushing the question in the existing module
    existingModule.questions.push(questionData);

    //saving the existing module updated value via dot save method
    return await existingModule.save();

};
export const updateQuestionInModuleRepo = async (existingModule) => {

    //saving the existing module with the updated question
    return await existingModule.save();

};