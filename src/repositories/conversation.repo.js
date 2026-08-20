import UserConversation from "../models/conversation.schema.js";



//finding user's conversation using user id
export const findUserConversationRepo = async (userId) => {

    return await UserConversation.findOne({
        userId: userId
    });

};


//creating an empty conversation for a new user
export const createUserConversationRepo = async (userId) => {

    return await UserConversation.create({
        userId,
        conversationHistory: [],
        activeState: {
            moduleId: null,
            currentQuestionId: null
        },
        moduleStates: []
    });

};


//saving the updated user's conversation via dot save method
export const updateUserConversationRepo = async (userConversation) => {

    return await userConversation.save();

};