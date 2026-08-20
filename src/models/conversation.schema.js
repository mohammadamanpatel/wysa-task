import mongoose from "mongoose"
//history schema will be pushed inside an array named as conversationHistory mentioned in userConversationHistorySchema
const historySchema = new mongoose.Schema({
    moduleId: {
        type: String,
        required: true
    },
    questionId: {
        type: String,
        required: true
    },
    optionId: {
        type: String,
        required: true
    },
    contextVersion: {
        type: Number,
        required: true
    },
    answeredAt: {
        type: Date,
        default: Date.now()
    }
}, {
    _id: false
})
//mmodule state schema will be pushed inside module states mentioned in userConversationHistorySchema
const moduleStateSchema = new mongoose.Schema({
    moduleId: {
        type: String,
        required: true
    },
    currentQuestionId: {
        type: String,
        default: null
    },
    contextVersion: {
        type: Number,
        default: 0
    }
}, {
    _id: false
})
const userConversationHistorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    conversationHistory: {
        type: [historySchema],
        default: []
    },
    activeState: {
        moduleId: {
            type: String,
            default: null
        },
        currentQuestionId: {
            type: String,
            default: null
        }
    },
    moduleStates: {
        type: [moduleStateSchema],
        default: []
    }
}, {
    timestamps: true
})
const UserConversation = mongoose.model("UserConversation", userConversationHistorySchema);

export default UserConversation;